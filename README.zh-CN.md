# pm2-intercom-log4js

[![build](https://img.shields.io/github/workflow/status/BillionBottle/pm2-intercom-log4js/Build%20And%20Publish)](https://github.com/BillionBottle/pm2-intercom-log4js)
[![npm](https://img.shields.io/npm/v/@takin/pm2-intercom-log4js)](https://www.npmjs.com/package/@takin/pm2-intercom-log4js)
[![node](https://img.shields.io/node/v/@takin/pm2-intercom-log4js)](https://www.npmjs.com/package/@takin/pm2-intercom-log4js)
[![license](https://img.shields.io/github/license/BillionBottle/pm2-intercom-log4js)](https://github.com/BillionBottle/pm2-intercom-log4js)

一个解决 [PM2](https://github.com/Unitech/pm2) 多进程模式下 [log4js](https://github.com/log4js-node/log4js-node) 日志同步问题的工具。

[English](README.md) | 简体中文

## 目录

- [背景](#背景)
- [如何开始](#如何开始)
    - [安装](#安装)
    - [使用](#使用)
    - [API](#api)
- [示例](#示例)
- [如何贡献](#如何贡献)
- [使用许可](#使用许可)

## 背景

是否遇到了 `pm2 install pm2-intercom` 安装失败？如果你想在 PM2 的多进程模式下使用 log4js 进行稳定的日志输出，那使用 ***pm2-intercom-log4js*** 进行多进程间的日志同步会是一个不错的选择。它模仿了 pm2-intercom + log4js 的协作方式，将子进程的日志汇总至主进程进行统一输出，避免文件读写在多进程模式下出现不可预料的异常。

## 如何开始

pm2-intercom-log4js 仅仅导出了一个函数，使用非常方便。

### 安装

这个项目使用了 [node](http://nodejs.org) 和 [npm](https://npmjs.com)。请确保你本地安装了它们。

```sh
$ npm install @takin/pm2-intercom-log4js
```

### 使用

当我们通过 PM2 多进程模式运行程序时，pm2-intercom-log4js 会自动寻找并使用 PM2 处理好进程间的通信，这个过程是异步的，因此我们需要等待这个过程结束后再进行 log4js 的初始化。

```javascript
const pm2Intercom = require('@takin/pm2-intercom-log4js');

pm2Intercom().catch((err) => {
  // 进程通信处理失败，可以根据错误日志检查原因，如果还是不能解决可以提一个 issue。
}).finally(() => {
  // 一定要等待进程通信处理完毕之后再进行 log4js 的实例化。
  log4js.getLogger();
  log4js.configure({
    // 请确保 logs4js 开启了 PM2 模式。
    pm2: true,
  });
});
```

### API

上文的 `pm2Intercom` 函数支持传入非必填的参数对象（比如 `pm2Intercom({ nodeModulesPath: '/root/xxx' })`），对象中的参数如下：

| 属性            | 说明                                                         | 类型   | 默认值 |
| --------------- | ------------------------------------------------------------ | ------ | ------ |
| nodeModulesPath | 手动指定 PM2 所在 node_modules 文件夹的绝对路径（如果自动寻找 PM2 失败） | String | -      |

## 示例

我们使用 PM2 运行目录 `examples` 中的脚本并启动两个进程。

```sh
$ pm2 start ./examples/index.js -i 2
```

当我们不使用 `pm2Intercom` 函数时（即将脚本中的 `await pm2Intercom();` 注释），我们通过 `pm2 logs` 命令看到只有一个进程成功打印了日志。

```
xxx\.pm2\logs\index-error-0.log last 15 lines:
xxx\.pm2\logs\index-out-1.log last 15 lines:
xxx\.pm2\logs\index-error-1.log last 15 lines:
xxx\.pm2\logs\index-out-0.log last 15 lines:
0|index    | [2022-03-11T14:50:21.335] [INFO] default - Log from process 0
```

当我们使用 `pm2Intercom` 函数时，我们看到两个进程都成功打印了日志，并且都输出至主进程的日志文件中。

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

## 如何贡献

非常欢迎你的加入！[提一个 Issue](https://github.com/BillionBottle/pm2-intercom-log4js/issues/new) 或者提交一个 Pull Request。

## 使用许可

[MIT](LICENSE) © Billion Bottle
