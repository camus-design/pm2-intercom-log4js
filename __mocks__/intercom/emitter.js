const pm2 = require('pm2');
const packageName = require('../../package.json').name;

const startTime = Date.now();
const id = setInterval(() => {
  if (Date.now() - startTime > 6000) {
    pm2.delete(`${packageName}__emitter-testing`, () => {});
    clearInterval(id);
    return;
  }
  process.send({ topic: `${packageName}:${packageName}:reply` });
}, 100);
