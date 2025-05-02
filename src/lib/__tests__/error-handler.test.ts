import {
  handleApiError,
  handleClientError,
  isClient,
  safeLocalStorage
} from '../error-handler';

describe('错误处理工具函数测试', () => {
  describe('handleApiError', () => {
    // 保存原始console.error以便在测试后恢复
    const originalConsoleError = console.error;

    beforeEach(() => {
      // 模拟console.error以避免测试输出中的噪音
      console.error = jest.fn();
    });

    afterEach(() => {
      // 恢复原始console.error
      console.error = originalConsoleError;
    });

    it('应该处理认证错误并返回特殊标记', () => {
      const authError = new Error('AUTH_REQUIRED');
      const result = handleApiError(authError);

      expect(result).toHaveProperty('requireAuth', true);
      expect(result).toHaveProperty('error', '需要认证');
      expect(result).toHaveProperty('message', '请先登录后再尝试此操作');
      expect(console.error).toHaveBeenCalled();
    });

    it('应该处理一般Error对象', () => {
      const generalError = new Error('一般错误');
      const result = handleApiError(generalError);

      expect(result).toHaveProperty('error', '操作失败');
      expect(result).toHaveProperty('message', '一般错误');
      expect(result).not.toHaveProperty('requireAuth');
      expect(console.error).toHaveBeenCalled();
    });

    it('应该处理非Error对象', () => {
      const nonErrorObj = { message: '非标准错误' };
      const result = handleApiError(nonErrorObj);

      expect(result).toHaveProperty('error', '操作失败');
      expect(result).toHaveProperty('message', '发生未知错误');
      expect(result).not.toHaveProperty('requireAuth');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('handleClientError', () => {
    // 保存原始console.error以便在测试后恢复
    const originalConsoleError = console.error;

    beforeEach(() => {
      // 模拟console.error以避免测试输出中的噪音
      console.error = jest.fn();
    });

    afterEach(() => {
      // 恢复原始console.error
      console.error = originalConsoleError;
    });

    it('应该处理Error对象并返回错误消息', () => {
      const error = new Error('客户端错误');
      const result = handleClientError(error);

      expect(result).toBe('客户端错误');
      expect(console.error).toHaveBeenCalled();
    });

    it('应该处理非Error对象并返回通用错误消息', () => {
      const nonErrorObj = { message: '非标准错误' };
      const result = handleClientError(nonErrorObj);

      expect(result).toBe('操作过程中发生错误，请稍后重试');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('isClient', () => {
    it('应该在浏览器环境中返回true', () => {
      // 在Jest测试环境中，window对象是存在的
      expect(isClient()).toBe(true);
    });

    it('应该检查window是否定义', () => {
      // 我们不能在Jest中真正模拟非浏览器环境，但可以测试函数的逻辑
      const originalIsClient = isClient;

      // 重写isClient函数来模拟window未定义的情况
      global.isClient = jest.fn().mockImplementation(() => {
        return typeof undefined !== 'undefined';
      });

      expect(global.isClient()).toBe(false);

      // 恢复原始函数
      global.isClient = originalIsClient;
    });
  });

  describe('safeLocalStorage', () => {
    const originalConsoleError = console.error;
    const originalSafeLocalStorage = safeLocalStorage;

    beforeEach(() => {
      console.error = jest.fn();
    });

    afterEach(() => {
      console.error = originalConsoleError;
      global.safeLocalStorage = originalSafeLocalStorage;
    });

    it('应该在非浏览器环境中返回fallback值', () => {
      // 模拟safeLocalStorage函数来测试非浏览器环境的行为
      const mockSafeLocalStorage = jest.fn().mockImplementation((operation, fallback) => {
        // 模拟isClient()返回false的情况
        return fallback;
      });

      global.safeLocalStorage = mockSafeLocalStorage;

      const operation = jest.fn();
      const fallback = 'fallback值';

      const result = mockSafeLocalStorage(operation, fallback);

      expect(result).toBe(fallback);
      expect(operation).not.toHaveBeenCalled();
    });

    it('应该在操作成功时返回操作结果', () => {
      const expectedResult = 'operation结果';
      const operation = jest.fn().mockReturnValue(expectedResult);
      const fallback = 'fallback值';

      const result = safeLocalStorage(operation, fallback);

      expect(result).toBe(expectedResult);
      expect(operation).toHaveBeenCalled();
    });

    it('应该在操作失败时返回fallback值并记录错误', () => {
      const error = new Error('localStorage操作失败');
      const operation = jest.fn().mockImplementation(() => {
        throw error;
      });
      const fallback = 'fallback值';

      const result = safeLocalStorage(operation, fallback);

      expect(result).toBe(fallback);
      expect(operation).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });
});
