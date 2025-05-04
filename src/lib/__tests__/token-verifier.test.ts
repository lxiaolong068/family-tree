import { verifyFirebaseToken } from '../token-verifier';
import jwt from 'jsonwebtoken';

// 模拟jwt
jest.mock('jsonwebtoken');

// 手动模拟jwks-rsa，避免ESM模块问题
jest.mock('jwks-rsa', () => {
  return jest.fn().mockImplementation(() => ({
    getSigningKey: jest.fn()
  }));
});

// 模拟console.error
const originalConsoleError = console.error;

describe('token-verifier测试', () => {
  beforeEach(() => {
    // 清除所有模拟的调用记录
    jest.clearAllMocks();

    // 模拟console.error以避免测试输出中的噪音
    console.error = jest.fn();

    // 设置环境变量
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = 'test-project-id';

    // 模拟jwksClient已经在jest.mock中设置
  });

  afterEach(() => {
    // 恢复原始console.error
    console.error = originalConsoleError;
  });

  it('应该在验证成功时解析令牌', async () => {
    // 模拟jwt.verify成功调用回调函数
    (jwt.verify as jest.Mock).mockImplementation((token, getKey, options, callback) => {
      // 直接调用回调函数，模拟成功
      callback(null, { sub: 'user123', email: 'test@example.com' });
    });

    const result = await verifyFirebaseToken('valid-token');

    // 验证结果
    expect(result).toEqual({ sub: 'user123', email: 'test@example.com' });

    // 验证jwt.verify被调用
    expect(jwt.verify).toHaveBeenCalledWith(
      'valid-token',
      expect.any(Function),
      {
        algorithms: ['RS256'],
        audience: 'test-project-id',
        issuer: 'https://securetoken.google.com/test-project-id',
      },
      expect.any(Function)
    );
  });

  it('应该在验证失败时拒绝Promise', async () => {
    // 模拟jwt.verify失败调用回调函数
    (jwt.verify as jest.Mock).mockImplementation((token, getKey, options, callback) => {
      // 直接调用回调函数，模拟失败
      callback(new Error('Invalid token'), null);
    });

    // 验证Promise被拒绝
    await expect(verifyFirebaseToken('invalid-token')).rejects.toThrow('Invalid token');

    // 验证console.error被调用
    expect(console.error).toHaveBeenCalledWith('Token verification error:', expect.any(Error));
  });

  it('应该正确处理getKey函数', () => {
    // 直接测试token-verifier.ts中的getKey函数
    // 由于getKey是模块内部函数，我们需要通过模拟jwt.verify来测试它

    // 模拟jwt.verify以捕获getKey函数
    let capturedGetKey: Function | undefined;
    (jwt.verify as jest.Mock).mockImplementation((token, getKey, options, callback) => {
      capturedGetKey = getKey;
      // 直接调用回调，模拟成功
      if (callback) callback(null, { sub: 'user123' });
    });

    // 调用verifyFirebaseToken以触发jwt.verify
    verifyFirebaseToken('test-token');

    // 确保capturedGetKey被设置
    expect(capturedGetKey).toBeDefined();

    // 测试getKey函数 - 我们不能直接测试内部实现
    // 但我们可以验证jwt.verify被正确调用
    expect(jwt.verify).toHaveBeenCalledWith(
      'test-token',
      expect.any(Function),
      {
        algorithms: ['RS256'],
        audience: 'test-project-id',
        issuer: 'https://securetoken.google.com/test-project-id',
      },
      expect.any(Function)
    );
  });

  it('应该处理验证错误', async () => {
    // 模拟jwt.verify调用回调函数，传递错误
    (jwt.verify as jest.Mock).mockImplementation((token, getKey, options, callback) => {
      // 直接调用回调函数，模拟失败
      callback(new Error('Token expired'), null);
    });

    // 验证Promise被拒绝
    await expect(verifyFirebaseToken('expired-token')).rejects.toThrow('Token expired');
  });
});
