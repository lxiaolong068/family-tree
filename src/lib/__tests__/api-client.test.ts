import { apiClient } from '../api-client';
import { logger } from '../logger';

// 模拟logger
jest.mock('../logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// 模拟fetch
global.fetch = jest.fn();

// 模拟localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn()
};

describe('ApiClient测试', () => {
  beforeEach(() => {
    // 清除所有模拟的调用记录
    jest.clearAllMocks();

    // 设置模拟的localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true
    });

    // 默认模拟localStorage.getItem返回null
    mockLocalStorage.getItem.mockReturnValue(null);

    // 默认模拟fetch返回成功
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ data: 'test' })
    });
  });

  describe('get方法', () => {
    it('应该发送GET请求', async () => {
      await apiClient.get('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    });

    it('应该处理查询参数', async () => {
      await apiClient.get('/api/test', { param1: 'value1', param2: 'value2' });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test?param1=value1&param2=value2',
        expect.any(Object)
      );
    });

    it('应该忽略undefined和null查询参数', async () => {
      await apiClient.get('/api/test', { param1: 'value1', param2: undefined, param3: null as any });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test?param1=value1',
        expect.any(Object)
      );
    });

    it('应该添加认证头', async () => {
      // 模拟localStorage.getItem返回令牌
      mockLocalStorage.getItem.mockReturnValue('test-token');

      await apiClient.get('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      }));
    });

    it('应该返回成功响应', async () => {
      const mockData = { name: 'Test' };

      // 模拟fetch返回成功
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockData)
      });

      const response = await apiClient.get('/api/test');

      expect(response).toEqual({
        success: true,
        data: mockData,
        status: 200,
        error: undefined,
        requireAuth: false
      });

      // 验证logger.debug被调用
      expect(logger.debug).toHaveBeenCalledWith('API请求: GET /api/test');
      expect(logger.debug).toHaveBeenCalledWith('API请求成功: GET /api/test');
    });

    it('应该处理错误响应', async () => {
      const errorData = { error: 'Test error' };

      // 模拟fetch返回错误
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(errorData)
      });

      const response = await apiClient.get('/api/test');

      expect(response).toEqual({
        success: false,
        error: 'Test error',
        status: 400,
        data: undefined,
        requireAuth: false
      });

      // 验证logger.error被调用
      expect(logger.error).toHaveBeenCalledWith('API请求失败: GET /api/test', errorData);
    });

    it('应该处理认证错误', async () => {
      // 模拟fetch返回401
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        json: jest.fn().mockResolvedValue({ requireAuth: true })
      });

      const response = await apiClient.get('/api/test');

      expect(response).toEqual({
        success: false,
        error: '请求失败: 401',
        status: 401,
        data: undefined,
        requireAuth: true
      });

      // 验证logger.warn被调用
      expect(logger.warn).toHaveBeenCalledWith('API请求需要认证');
    });

    it('应该处理JSON解析错误', async () => {
      // 模拟fetch.json抛出错误
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      });

      const response = await apiClient.get('/api/test');

      expect(response).toEqual({
        success: true,
        data: {},
        status: 200,
        error: undefined,
        requireAuth: false
      });

      // 验证logger.warn被调用
      expect(logger.warn).toHaveBeenCalledWith('无法解析响应体为JSON', expect.any(Error));
    });

    it('应该处理网络错误', async () => {
      // 模拟fetch抛出错误
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const response = await apiClient.get('/api/test');

      expect(response).toEqual({
        success: false,
        error: 'Network error',
        status: 0
      });

      // 验证logger.error被调用
      expect(logger.error).toHaveBeenCalledWith('API请求异常: GET /api/test', expect.any(Error));
    });
  });

  describe('post方法', () => {
    it('应该发送POST请求', async () => {
      const data = { name: 'Test' };

      await apiClient.post('/api/test', data);

      expect(global.fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }));
    });

    it('应该返回成功响应', async () => {
      const mockData = { id: 1 };

      // 模拟fetch返回成功
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 201,
        json: jest.fn().mockResolvedValue(mockData)
      });

      const response = await apiClient.post('/api/test', { name: 'Test' });

      expect(response).toEqual({
        success: true,
        data: mockData,
        status: 201,
        error: undefined,
        requireAuth: false
      });
    });
  });

  describe('put方法', () => {
    it('应该发送PUT请求', async () => {
      const data = { name: 'Updated' };

      await apiClient.put('/api/test/1', data);

      expect(global.fetch).toHaveBeenCalledWith('/api/test/1', expect.objectContaining({
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }));
    });
  });

  describe('delete方法', () => {
    it('应该发送DELETE请求', async () => {
      await apiClient.delete('/api/test/1');

      expect(global.fetch).toHaveBeenCalledWith('/api/test/1', expect.objectContaining({
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    });
  });
});
