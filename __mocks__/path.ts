const actualPath: any = jest.requireActual('path');

const origins: Map<string, any> = new Map();

function hack(name: string, value: any) {
  origins.set(name, value);
}

function unhack(name: string) {
  origins.delete(name);
}

const pathProxy = new Proxy({}, {
  get(target: any, p: string): any {
    if (p === 'hack') {
      return hack;
    }
    if (p === 'unhack') {
      return unhack;
    }
    let value: any;
    if (origins.has(p)) {
      value = origins.get(p);
    } else {
      value = actualPath[p];
    }
    if (typeof value === 'function') {
      value = value.bind(actualPath);
    }
    return value;
  },
});

module.exports = pathProxy;
