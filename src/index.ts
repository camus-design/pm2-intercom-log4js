import requirePm2 from '@/libs/require-pm2';
import intercom from '@/libs/intercom';
import type { IntercomForLog4jsOptions, PM2 } from '@type/index';

export default async function initPm2Intercom(
  options: IntercomForLog4jsOptions = {},
): Promise<void> {
  try {
    const pm2: PM2 = await requirePm2(options.nodeModulesPath);
    await intercom(pm2);
  } catch (err) {
    console.error('PM2 intercom for log4js init failed!');
    console.error(err);
  }
}
