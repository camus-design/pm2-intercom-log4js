import path from 'path';
import { getRandomStr } from '@/libs/string';
import { name as packageName } from '../../package.json';

function getInstanceVar(): string {
  return process.env.PM2_PROCESS_INSTANCE_VAR || process.env.instance_var || 'NODE_APP_INSTANCE';
}

export function isRunInPm2(): boolean {
  const nodeAppInstance: string | undefined = process.env[getInstanceVar()];
  return Boolean(nodeAppInstance);
}

export function getPm2Instance(): string {
  return process.env[getInstanceVar()]!;
}

export function getPackageName(): string {
  return packageName;
}

export function getHostProjectName(): string {
  let projectName: string | undefined;
  try {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const packageJson: { name: string | undefined } = require(path.resolve('package.json'));
    projectName = packageJson.name;
  } catch (err) {
    //
  }
  // Randomly generate project name when project name is not found.
  if (!projectName) {
    projectName = getRandomStr(8);
  }
  return projectName;
}
