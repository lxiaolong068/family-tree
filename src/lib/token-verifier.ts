import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// 创建JWKS客户端
const client = jwksClient({
  jwksUri: 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

// 获取签名密钥
const getKey = (header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    
    // 添加空值检查，确保key不为undefined
    if (!key) {
      callback(new Error('无法获取签名密钥'));
      return;
    }
    
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

// 验证Firebase ID令牌
export async function verifyFirebaseToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        algorithms: ['RS256'],
        audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
      },
      (err, decoded) => {
        if (err) {
          console.error('Token verification error:', err);
          reject(err);
          return;
        }
        
        resolve(decoded);
      }
    );
  });
}
