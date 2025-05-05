// 模拟 Next.js 的 Response 对象
export class Response {
  status: number;
  body: any;
  headers: Headers;

  constructor(body: any, options: { status?: number; headers?: Headers } = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = options.headers || new Headers();
  }

  json() {
    return Promise.resolve(this.body);
  }
}

// 模拟 NextResponse
export const NextResponse = {
  json: (body: any, options: { status?: number; headers?: Headers } = {}) => {
    return new Response(body, options);
  }
};

// 模拟 Headers
export class Headers {
  private headers: Record<string, string> = {};

  constructor(init?: Record<string, string>) {
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }

  get(name: string): string | null {
    return this.headers[name.toLowerCase()] || null;
  }

  set(name: string, value: string): void {
    this.headers[name.toLowerCase()] = value;
  }

  has(name: string): boolean {
    return name.toLowerCase() in this.headers;
  }

  delete(name: string): void {
    delete this.headers[name.toLowerCase()];
  }

  append(name: string, value: string): void {
    const key = name.toLowerCase();
    this.headers[key] = this.has(key) ? `${this.get(key)}, ${value}` : value;
  }
}
