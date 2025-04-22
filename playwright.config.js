// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests',
  /* 每个测试的最大超时时间 */
  timeout: 30 * 1000,
  /* 测试运行器的超时时间 */
  expect: {
    timeout: 5000
  },
  /* 运行测试的并发数 */
  fullyParallel: true,
  /* 失败时重试次数 */
  retries: 0,
  /* 测试报告器 */
  reporter: 'html',
  /* 共享设置 */
  use: {
    /* 最大超时时间 */
    actionTimeout: 0,
    /* 基础URL */
    baseURL: 'http://localhost:3000',
    /* 自动截图 */
    screenshot: 'only-on-failure',
    /* 收集跟踪信息 */
    trace: 'on-first-retry',
  },

  /* 配置项目 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* 本地开发服务器 */
  webServer: {
    command: 'pnpm dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
