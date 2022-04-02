import { getPackageName } from '@/libs/environment';
import { name as packageName } from '../package.json';

describe('self package name', () => {
  test(packageName, () => {
    expect(getPackageName()).toBe(packageName);
  });
});
