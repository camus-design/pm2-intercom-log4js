interface PM2NormalCallback {
  (err: Error): void,
}

export interface PM2Packet {
  raw: {
    topic: string,
  },
  process: {
    name?: string;
    pid?: number;
    pm_id?: number;
  },
}

export interface PM2BusCallback {
  (packet: PM2Packet): void,
}

export interface PM2Bus {
  on: (e: 'process:msg', callback: PM2BusCallback) => void,
  close: () => void,
}

interface PM2LaunchBusCallback {
  (err: Error, bus: PM2Bus): void,
}

interface PM2SendDataCallback {
  (err: Error, result: any): void,
}

export interface PM2 {
  launchBus: (callback: PM2LaunchBusCallback) => void,
  connect: (callback: PM2NormalCallback) => void,
  sendDataToProcessId: (proc_id: number, packet: PM2Packet["raw"], callback: PM2SendDataCallback) => void,
}

export interface IntercomForLog4jsOptions {
  // The node_modules path which pm2 belongs to
  nodeModulesPath?: string,
}

export default function initPm2Intercom(options?: IntercomForLog4jsOptions): Promise<void>;
