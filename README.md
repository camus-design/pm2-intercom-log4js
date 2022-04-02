# pm2-intercom-log4js

[![build](https://img.shields.io/github/workflow/status/BillionBottle/pm2-intercom-log4js/Build%20And%20Publish)](https://github.com/BillionBottle/pm2-intercom-log4js)
[![npm](https://img.shields.io/npm/v/@takin/pm2-intercom-log4js)](https://www.npmjs.com/package/@takin/pm2-intercom-log4js)
[![node](https://img.shields.io/node/v/@takin/pm2-intercom-log4js)](https://www.npmjs.com/package/@takin/pm2-intercom-log4js)
[![license](https://img.shields.io/github/license/BillionBottle/pm2-intercom-log4js)](https://github.com/BillionBottle/pm2-intercom-log4js)

A tool to solve [log4js](https://github.com/log4js-node/log4js-node) log synchronization in <a href="https://github.com/Unitech/pm2" title="PM2">PM2</a>'s multiprocess mode.

English | [简体中文](README.zh-CN.md)

## Table of Contents

- [Background](#background)
- [Get Started](#get-started)
  - [Install](#install)
  - [Usage](#usage)
  - [API](#api)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

## Background

Have you encountered a failure when you were executing `pm2 install pm2-intercom`? If you want to use log4js for stable log output in PM2's multiprocess mode, then using ***pm2-intercom-log4js*** for multiprocess log synchronization will be a good choice. It imitates the cooperation method of pm2-intercom + log4js, and aggregates the logs of the sub-processes to the main process for unified output, so as to avoid unpredictable exceptions in file reading or writing in multiprocess mode.

## Get Started

pm2-intercom-log4js only exports one function, which is very convenient to use.

### Install

This project uses [node](http://nodejs.org) and [npm](https://npmjs.com). Make sure that you have installed them locally.

```sh
$ npm install @takin/pm2-intercom-log4js
```

### Usage

When running the program in PM2 multiprocess mode, pm2-intercom-log4js will automatically find and use PM2 to handle the communication between the processes. This process is asynchronous, so you need to wait for this process to finish before initializing log4js.

```javascript
const pm2Intercom = require('@takin/pm2-intercom-log4js');

pm2Intercom().catch((err) => {
  // If the initialization fails, you can check the reason according to the error log. If it still cannot be solved, you can submit an issue.
}).finally(() => {
  // Be sure to wait for the process communication to be initialized before initializing log4js.
  log4js.getLogger();
  log4js.configure({
    // Make sure logs4js has PM2 mode enabled.
    pm2: true,
  });
});
```

### API

The `pm2Intercom` function above supports passing in an optional parameters object (like `pm2Intercom({ nodeModulesPath: '/root/xxx' })`), the parameters in the object are as follows:

| Attributes            | Descriptions                                                         | Type   | Default |
| --------------- | ------------------------------------------------------------ | ------ | ------ |
| nodeModulesPath | Manually specify the absolute path to the node_modules folder where PM2 is located (if auto finding PM2 fails) | String | -      |

## Example

We use PM2 to run the script in the `examples` directory and start two processes.

```sh
$ pm2 start ./examples/index.js -i 2
```

When we don't use the `pm2Intercom` function (ie, comment out the `await pm2Intercom();` in the script), we see only one process successfully printing the log through the `pm2 logs` command.

```
xxx\.pm2\logs\index-error-0.log last 15 lines:
xxx\.pm2\logs\index-out-1.log last 15 lines:
xxx\.pm2\logs\index-error-1.log last 15 lines:
xxx\.pm2\logs\index-out-0.log last 15 lines:
0|index    | [2022-03-11T14:50:21.335] [INFO] default - Log from process 0
```

When we use the `pm2Intercom` function, we see that both processes successfully print logs, and both output to the log file of the main process.

```
xxx\.pm2\logs\index-error-0.log last 15 lines:
xxx\.pm2\logs\index-error-1.log last 15 lines:
xxx\.pm2\logs\index-out-1.log last 15 lines:
1|index    | Process 1 is waiting main process ready...
1|index    | Process 1 is ready to log.

xxx\.pm2\logs\index-out-0.log last 15 lines:
0|index    | Start pm2 intercom for log4js...
0|index    | [2022-03-11T14:53:14.804] [INFO] default - Log from process 0
0|index    | Intercom's main process started. (0: index)
0|index    | [2022-03-11T14:53:14.883] [INFO] default - Log from process 1
```

## Contributing

You are very welcome to join us! [Submit an issue](https://github.com/BillionBottle/pm2-intercom-log4js/issues/new) or submit a pull request.

## License

[MIT](LICENSE) © Billion Bottle
