const log4js = require('log4js');

(async () => {
  let pm2Intercom;
  try {
    pm2Intercom = require('../dist/index.min.js');
  } catch (error) {
    console.error(error);
    console.warn('Please execute "npm run build" before example running.');
    return;
  }
  const { PM2_PROCESS_INSTANCE_VAR, instance_var } = process.env;
  if (!process.env[PM2_PROCESS_INSTANCE_VAR || instance_var || 'NODE_APP_INSTANCE']) {
    console.warn('Please run example in pm2 by execute "pm2 start -i 2 examples/index.js".');
    return;
  }
  try {
    await pm2Intercom();

    const logger = log4js.getLogger();
    log4js.configure({
      appenders: {
        default: {
          type: 'console',
        },
      },
      categories: {
        default: {
          appenders: ['default'],
          level: 'all',
        },
      },
      pm2: true,
    });
    logger.info(`Log from process ${process.env.NODE_APP_INSTANCE}`);
  } catch (err) {
    console.error('Example failed to run!');
    console.error(err);
  }
})();
