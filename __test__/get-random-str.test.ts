import { getRandomStr } from '@/libs/string';

describe('invalid parameter', () => {
  test('NaN tobe ""', () => {
    expect(getRandomStr(NaN)).toBe('');
  });
  test('zero tobe ""', () => {
    expect(getRandomStr(0)).toBe('');
  });
  test('negative tobe ""', () => {
    expect(getRandomStr(-1)).toBe('');
  });
  test('infinity tobe ""', () => {
    expect(getRandomStr(Infinity)).toBe('');
  });
});

describe('random length', () => {
  const length: number = Math.floor(10 * Math.random()) + 1;
  test(`${length} length`, () => {
    expect(getRandomStr(length)).toMatch(new RegExp(`^[a-z]{${length}}$`));
  });
});
