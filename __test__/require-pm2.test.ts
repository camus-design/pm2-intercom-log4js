import path from 'path';
import childProcess from 'child_process';
import requirePm2 from '@/libs/require-pm2';

jest.mock('child_process');

const pm2Instance = expect.objectContaining({
  launchBus: expect.anything(),
  connect: expect.anything(),
  sendDataToProcessId: expect.anything(),
});

describe('custom node_modules path', () => {
  test('not exist', () => expect(requirePm2('notexist')).rejects.toThrow());
  test('exist', () => expect(requirePm2(path.resolve('node_modules'))).resolves.toEqual(pm2Instance));
});

describe('import directly', () => {
  test('registered pm2', () => {
    expect(requirePm2()).resolves.toEqual(pm2Instance);
  });
});

describe('import failed', () => {
  beforeEach(() => {
    jest.mock('pm2', () => {
      throw new Error('clear pm2');
    });
    // @ts-ignore
    childProcess.hackExecResult(new Error());
  });
  afterEach(() => {
    jest.unmock('pm2');
    // @ts-ignore
    childProcess.hackExecResult();
  });
  test('pm2 notexist', () => expect(requirePm2()).rejects.toThrow());
});
