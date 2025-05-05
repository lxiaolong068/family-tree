const nextJest = require('next/jest');

// Next.js专用的Jest配置
const createJestConfig = nextJest({
  dir: './',
});

// 自定义Jest配置
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // 处理模块别名
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/e2e/',
    '<rootDir>/tests/', // 排除Playwright测试
    '<rootDir>/src/app/api/__tests__/setup.ts', // 排除API测试设置文件
    '<rootDir>/src/app/api/family-trees/__tests__/', // 排除API路由测试
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/types/**/*',
    '!**/node_modules/**',
    '!src/app/api/**/*', // 排除API路由测试
  ],
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 43,
      lines: 50,
      statements: 50,
    },
  },
  // 为单个测试设置超时时间
  testTimeout: 10000,
};

// 通过next/jest创建函数导出配置
// 这将确保样式导入、图片导入和JSX语法被正确处理
module.exports = createJestConfig(customJestConfig);
