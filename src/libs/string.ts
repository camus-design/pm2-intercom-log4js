const codeA: number = 'a'.charCodeAt(0);

// eslint-disable-next-line import/prefer-default-export
export function getRandomStr(length: number) {
  if (
    Number.isNaN(length)
    || length <= 0
    || length > Number.MAX_SAFE_INTEGER
  ) {
    return '';
  }
  let result: string = '';
  for (let i = 0; i < length; i += 1) {
    result += String.fromCharCode(Math.floor(26 * Math.random()) + codeA);
  }
  return result;
}
