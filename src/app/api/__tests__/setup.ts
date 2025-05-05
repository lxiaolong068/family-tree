// 模拟全局 Response 对象
global.Response = class Response {
  status: number;
  body: any;

  constructor(body: any, options: { status?: number } = {}) {
    this.body = body;
    this.status = options.status || 200;
  }

  json() {
    return Promise.resolve(this.body);
  }

  static json(body: any, options: { status?: number } = {}) {
    return new Response(body, options);
  }
} as any;

// 模拟 NextResponse
jest.mock('next/server', () => {
  return {
    NextRequest: jest.requireActual('next/server').NextRequest,
    NextResponse: {
      json: (body: any, options: { status?: number } = {}) => {
        return Response.json(body, options);
      }
    }
  };
});
