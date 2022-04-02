import { promisify } from 'util';
import {
  isRunInPm2,
  getPm2Instance,
  getHostProjectName,
  getPackageName,
} from '@/libs/environment';
import type { PM2, PM2Bus, PM2Packet } from '@type/index';

const hostProjectName: string = getHostProjectName();
const packageName: string = getPackageName();
const mainTopic: string = `${packageName}:${hostProjectName}:main`;
const pingTopic: string = `${packageName}:${hostProjectName}:ping`;
const replyTopic: string = `${packageName}:${hostProjectName}:reply`;
const mainInstanceId: string = '0';

/**
 * @description Initialize log4js process communication
 * @param {PM2} pm2
 */
export default async function intercom(pm2: PM2): Promise<void> {
  // Do not process if not currently running in the pm2 environment.
  if (!isRunInPm2()) return;

  const connect: () => Promise<void> = promisify(pm2.connect.bind(pm2));
  const launchBus: () => Promise<PM2Bus> = promisify(pm2.launchBus.bind(pm2));

  // To connect pm2.
  await connect();

  // Initialize the message listener.
  const bus: PM2Bus = await launchBus();

  // Get id of the current process.
  const pm2InstanceId: string = getPm2Instance();
  // If it is the main process, listen for messages sent by other processes.
  if (pm2InstanceId === mainInstanceId) {
    console.log('Start pm2 intercom for log4js...');

    let mainProcessName: string; // The pm2 name of the current project's main process
    let mainProcessId: number; // The pm2 id of the current project's main process
    bus.on('process:msg', (packet: PM2Packet): void => {
      const {
        raw,
        process: { name: processName, pm_id: processId },
      } = packet;
      if (!raw || typeof raw !== 'object') {
        return;
      }
      const { topic } = raw;
      // When the child process pings the main process or when the main process is loaded,
      // send the loading completion event to child processes.
      if (topic === mainTopic || topic === pingTopic) {
        process.send!({ topic: replyTopic });
      }
      // Cache self identifier when the main thread starts.
      if (topic === mainTopic) {
        mainProcessName = processName!;
        mainProcessId = processId!;
        console.log(`Intercom's main process started. (${processId}: ${processName})`);
        return;
      }
      // Messages will not be processed if they are not belongs to log4js.
      if (topic !== 'log4js:message') {
        return;
      }
      // Messages will not be processed if they are not belongs to current project.
      if (processName !== mainProcessName) {
        return;
      }
      // Send the message to log4js
      pm2.sendDataToProcessId(mainProcessId, raw, (err): void => {
        if (err) {
          console.error('Send message to log4js failed!');
          console.error(err);
        }
      });
    });
    // Notifies child processes that main process has started.
    process.send!({ topic: mainTopic });
  } else {
    // The child process monitors whether the main process is ready.
    console.log(`Process ${pm2InstanceId} is waiting main process ready...`);
    await new Promise((resolve) => {
      bus.on('process:msg', (packet: PM2Packet): void => {
        const { raw } = packet;
        if (!raw || typeof raw !== 'object') {
          return;
        }
        // Close the monitor after the main process starts.
        if (raw.topic === replyTopic) {
          console.log(`Process ${pm2InstanceId} is ready to log.`);
          bus.close();
          setTimeout(resolve);
        }
      });
      // Notifies main process that it has started itself.
      process.send!({ topic: pingTopic });
    });
  }
}
