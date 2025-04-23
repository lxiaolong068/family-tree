/**
 * 错误处理工具
 * 提供统一的错误处理方法，用于API路由和客户端代码
 */

/**
 * 为API响应处理错误
 * @param error 捕获的错误对象
 * @returns 格式化的错误响应对象，不包含敏感信息
 */
export function handleApiError(error: unknown) {
  // 记录详细错误用于调试，但不返回给客户端
  console.error('API错误:', error);
  
  // 对于认证相关错误，提供特殊标记
  if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
    return {
      error: '需要认证',
      requireAuth: true,
      message: '请先登录后再尝试此操作'
    };
  }
  
  // 返回通用错误消息，不包含堆栈信息等敏感数据
  return {
    error: '操作失败',
    message: error instanceof Error ? error.message : '发生未知错误'
  };
}

/**
 * 处理客户端错误并返回用户友好的消息
 * @param error 捕获的错误对象
 * @returns 用户友好的错误消息
 */
export function handleClientError(error: unknown): string {
  // 记录错误到控制台
  console.error('客户端错误:', error);
  
  // 返回友好错误消息
  if (error instanceof Error) {
    return error.message;
  }
  
  return '操作过程中发生错误，请稍后重试';
}

/**
 * 检查是否为客户端环境
 * @returns 是否为客户端环境
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * 安全地使用localStorage
 * @param operation 要执行的操作函数
 * @param fallback 操作失败时的回退值
 * @returns 操作结果或回退值
 */
export function safeLocalStorage<T>(
  operation: () => T,
  fallback: T
): T {
  if (!isClient()) {
    return fallback;
  }
  
  try {
    return operation();
  } catch (error) {
    console.error('localStorage操作失败:', error);
    return fallback;
  }
}
