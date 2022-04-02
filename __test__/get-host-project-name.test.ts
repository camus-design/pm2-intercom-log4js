import path from 'path';
import { getHostProjectName } from '@/libs/environment';
import { name as packageName } from '../package.json';

jest.mock('path');

describe('package.json is exist', () => {
  test(packageName, () => {
    expect(getHostProjectName()).toBe(packageName);
  });
});

describe('package.json is not exist', () => {
  beforeEach(() => {
    // @ts-ignore
    path.hack('resolve', () => this.resolve('notexist'));
  });
  afterEach(() => {
    // @ts-ignore
    path.unhack('resolve');
  });
  test('random project name', () => {
    expect(getHostProjectName()).toMatch(/^[a-z]{8}$/);
  });
});
