import { isRunInPm2 } from '@/libs/environment';

const pm2InstanceVarKey: string = 'instance_var';
const pm2InstanceKey: string = 'NODE_APP_INSTANCE';

describe('not in pm2', () => {
  const originalEnv = process.env;
  let step: number = 0;
  beforeEach(() => {
    if (step < 1) {
      step = 1;
      process.env = {};
    } else {
      process.env = {
        [pm2InstanceVarKey]: pm2InstanceKey,
      };
    }
  });
  afterEach(() => {
    process.env = originalEnv;
  });
  test('instance var not exist', () => {
    expect(isRunInPm2()).toBe(false);
  });
  test('instance not exist', () => {
    expect(isRunInPm2()).toBe(false);
  });
});

describe('in pm2', () => {
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
  test('instance exist', () => {
    expect(isRunInPm2()).toBe(true);
  });
});
