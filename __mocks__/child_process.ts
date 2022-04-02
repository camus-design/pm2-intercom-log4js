const actualChildProcess: any = jest.requireActual('child_process');

let customExecResult: string | Error | null = null;

module.exports = {
  hackExecResult(content: string | Error | null = null) {
    customExecResult = content;
  },
  exec(c: string, callback: (err: Error | null, content?: string) => void) {
    if (customExecResult !== null) {
      if (typeof customExecResult === 'string') {
        setTimeout(callback, 0, null, customExecResult);
      } else {
        setTimeout(callback, 0, customExecResult);
      }
      return;
    }
    // eslint-disable-next-line consistent-return
    return actualChildProcess.exec(c, callback);
  },
};
