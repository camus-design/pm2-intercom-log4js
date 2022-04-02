import { getPm2Instance } from '@/libs/environment';

const pm2InstanceVarKey: string = 'instance_var';
const pm2InstanceKey: string = 'NODE_APP_INSTANCE';

const instanceId: string = '0';

describe('in pm2', () => {
  const originalEnv = process.env;
  beforeEach(() => {
    process.env = {
      [pm2InstanceVarKey]: pm2InstanceKey,
      [pm2InstanceKey]: instanceId,
    };
  });
  afterEach(() => {
    process.env = originalEnv;
  });
  test(`instance ${instanceId}`, () => {
    expect(getPm2Instance()).toBe(instanceId);
  });
});
