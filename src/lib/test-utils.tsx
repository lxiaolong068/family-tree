import React, { ReactElement } from 'react';
import { render as rtlRender, RenderOptions, waitFor } from '@testing-library/react';
import { act } from 'react'; // 使用React.act，而不是react-dom/test-utils

// 全应用包装器
// 注意：我们使用模拟的AuthProvider，而不是实际的AuthProvider
// 因为实际的AuthProvider依赖于浏览器环境的某些功能
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-auth-provider">{children}</div>;
};

// 页面组件测试的顶层包装器
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockAuthProvider>
      {children}
    </MockAuthProvider>
  );
};

// 封装一个带act()的render函数来防止React警告
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  const result = rtlRender(ui, { wrapper: AllTheProviders, ...options });
  return {
    ...result,
    // 封装的等待函数，自动包含act()
    waitForChanges: async () => await act(async () => {
      await waitFor(() => Promise.resolve());
    })
  };
};

// 重导出所有testing-library/react内容
export * from '@testing-library/react';
export { customRender as render };
export { act }; // 显式导出act以便在测试文件中使用
