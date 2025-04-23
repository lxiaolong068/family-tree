/**
 * API客户端服务
 * 封装API请求逻辑，集中处理认证和错误处理
 */

import { logger } from './logger';

// 请求方法类型
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 响应格式接口
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
  requireAuth?: boolean;
}

/**
 * API客户端
 * 提供统一的请求方法和错误处理
 */
class ApiClient {
  /**
   * 发送GET请求
   */
  async get<T>(url: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    let finalUrl = url;
    
    // 处理查询参数
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      finalUrl = `${url}?${queryParams.toString()}`;
    }
    
    return this.request<T>(finalUrl, 'GET');
  }

  /**
   * 发送POST请求
   */
  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, 'POST', data);
  }

  /**
   * 发送PUT请求
   */
  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(url, 'PUT', data);
  }

  /**
   * 发送DELETE请求
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, 'DELETE');
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    url: string, 
    method: RequestMethod, 
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      // 获取认证令牌
      const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      // 准备请求配置
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {})
        },
        ...(data ? { body: JSON.stringify(data) } : {})
      };

      logger.debug(`API请求: ${method} ${url}`);
      
      // 发送请求
      const response = await fetch(url, config);
      let responseData: any = {};
      
      // 尝试解析响应体为JSON
      try {
        responseData = await response.json();
      } catch (error) {
        logger.warn('无法解析响应体为JSON', error);
      }
      
      // 构造统一的响应格式
      const apiResponse: ApiResponse<T> = {
        success: response.ok,
        data: response.ok ? responseData : undefined,
        error: !response.ok ? responseData.error || `请求失败: ${response.status}` : undefined,
        status: response.status,
        requireAuth: response.status === 401
      };
      
      // 处理认证错误
      if (response.status === 401 && responseData.requireAuth) {
        logger.warn('API请求需要认证');
        // 可以在这里添加重定向到登录页面的逻辑
      }
      
      if (!response.ok) {
        logger.error(`API请求失败: ${method} ${url}`, responseData);
      } else {
        logger.debug(`API请求成功: ${method} ${url}`);
      }
      
      return apiResponse;
    } catch (error) {
      logger.error(`API请求异常: ${method} ${url}`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : '发生未知错误',
        status: 0
      };
    }
  }
}

// 导出单例实例
export const apiClient = new ApiClient();
