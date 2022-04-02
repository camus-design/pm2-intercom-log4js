const packageName: string = require('../package.json').name;

const replyTopic: string = `${packageName}:${packageName}:reply`;

const bus = {
  on(e: string, callback: Function) {
    setTimeout(() => {
      callback({
        raw: {
          topic: replyTopic,
        },
        process: {
          name: '',
          pm_id: '',
        },
      });
    });
  },
  close() {},
};

module.exports = {
  launchBus(callback: Function) { callback(null, bus); },
  connect(callback: Function) { callback(); },
  sendDataToProcessId() {},
};
