// eslint-disable-next-line import/no-extraneous-dependencies
import pm2 from 'pm2';
import intercom from '@/libs/intercom';

jest.mock('pm2');

const pm2InstanceVarKey: string = 'instance_var';
const pm2InstanceKey: string = 'NODE_APP_INSTANCE';

describe('not in pm2', () => {
  test('nothing', () => expect(intercom(pm2)).resolves.toBeUndefined());
});

describe('main process', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = {
      [pm2InstanceVarKey]: pm2InstanceKey,
      [pm2InstanceKey]: '0',
    };
  });
  afterEach(() => {
    process.env = originalEnv;
  });
  test('load', () => expect(intercom(pm2)).resolves.toBeUndefined());
});

describe('child process', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = {
      [pm2InstanceVarKey]: pm2InstanceKey,
      [pm2InstanceKey]: '1',
    };
  });
  afterEach(() => {
    process.env = originalEnv;
  });
  test('finish waiting', () => expect(intercom(pm2)).resolves.toBeUndefined());
});
