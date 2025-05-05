// 导入测试库扩展
import '@testing-library/jest-dom';

// 模拟next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    pathname: '/',
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// 模拟next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}));

// 模拟localStorage全局对象
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

// 设置全局的localStorage模拟
global.localStorage = new LocalStorageMock();

// 全局模拟fetch
global.fetch = jest.fn();

// 模拟TextDecoder和TextEncoder，解决@neondatabase/serverless的依赖问题
global.TextDecoder = require('util').TextDecoder;
global.TextEncoder = require('util').TextEncoder;
