# 家谱网站（Family Tree）

[English Version (README.en.md)](./README.en.md)


## 项目简介
本项目是基于 Next.js 14 + TypeScript + pnpm + Shadcn UI 构建的家谱可视化制作与展示平台，专为家谱初学者、家族历史爱好者等用户打造，支持家谱生成、模板展示、内容科普和 SEO 优化。

## 主要功能
- 首页：项目介绍与导航
- 家谱知识科普：家谱基础知识、常见问题
- 家谱模板展示：多种模板图片/表格，支持下载
- 家谱生成器：输入成员信息，生成树状结构
- 用户认证系统：支持 Google 账号登录，实现用户账户与家谱数据关联
- 数据存储：支持本地存储和 Neon 数据库云端存储
- 移动端适配与响应式设计
- 后续将支持拖拽式编辑、导出（PNG/PDF/JSON）、AI 辅助等高级功能

## 技术栈
- 包管理：pnpm
- 前端框架：Next.js 14
- UI 框架：Shadcn UI（基于 Tailwind CSS）
- 语言：TypeScript
- 可视化：Mermaid.js
- 认证：Firebase Authentication（Google 登录）
- 令牌验证：jsonwebtoken、jwks-rsa
- 数据库：Neon PostgreSQL
- 测试框架：Jest、React Testing Library
- 其他：html2canvas、jsPDF（用于导出家谱图为PNG/PDF）

## 如何启动与开发
1. 安装依赖：
   ```bash
   pnpm install
   ```

2. 配置环境变量：
   创建 `.env.local` 文件，添加以下配置：
   ```
   # Database
   NEON_DATABASE_URL=your_neon_database_url
   NEXT_PUBLIC_HAS_DATABASE=true

   # Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret

   # JWT Secret
   JWT_SECRET=your_jwt_secret_key

   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_FIREBASE_CLIENT_ID=your_firebase_client_id

   # Firebase Admin SDK（用于验证令牌）
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   FIREBASE_PRIVATE_KEY="your_firebase_private_key"
   ```

   > 注意：要获取Firebase Admin SDK的凭据，请在Firebase控制台中创建一个服务账号，并下载私钥JSON文件。

3. 启动开发服务器：
   ```bash
   pnpm dev
   ```

4. 访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 测试

项目使用 Jest 和 React Testing Library 进行单元测试和组件测试。

### 运行测试

```bash
# 运行所有测试
pnpm test

# 监视模式运行测试（开发时使用）
pnpm test:watch

# 生成测试覆盖率报告
pnpm test:coverage

# 运行端到端测试（Playwright）
pnpm test:e2e
```

### 测试结构

```
family-tree/
├── src/
│   ├── lib/__tests__/          # 工具函数单元测试
│   ├── components/__tests__/    # 组件测试
│   ├── app/**/__tests__/        # 页面测试
│   └── types/testing.d.ts       # 测试类型定义
├── jest.config.js               # Jest 配置
├── jest.setup.js                # Jest 设置
└── .github/workflows/test.yml   # CI 测试工作流
```

### 测试覆盖率

目标测试覆盖率为核心功能达到 75% 以上。当前测试主要集中在以下方面：

- 工具函数和逻辑测试
- 组件渲染和交互测试
- 页面路由和认证逻辑测试

## 目录结构
```
family-tree/
├── src/                # 源代码目录
│   ├── app/            # Next.js 14 App Router 目录
│   ├── components/     # 组件库（Shadcn UI）
│   ├── contexts/       # React Context（认证等）
│   ├── db/             # 数据库模式和连接
│   ├── lib/            # 工具库与通用方法
│   └── types/          # TypeScript 类型定义
├── public/             # 静态资源
├── docs/               # 需求文档与开发计划
├── tests/              # 测试文件
├── README.md           # 项目说明（中文）
├── README.en.md        # 项目说明（英文）
├── package.json        # 项目依赖
├── tailwind.config.js  # Tailwind 配置
└── ...
```

## 已实现功能
- 家谱生成器（添加、删除成员）
- 家谱可视化渲染（Mermaid.js）
- 家谱数据本地存储与云端存储
- 用户认证系统（Google 登录）
- 用户账户与家谱数据关联
- 安全的令牌验证机制
- 响应式设计，支持移动端和桌面端
- 用户个人资料页面
- 单元测试和组件测试框架
- 家谱图导出功能（支持PNG和PDF格式）

## 未来计划
- 用户个人资料页面
- 拖拽式家谱编辑器
- 完善家谱生成器的复杂关系设置功能（如配偶、兄弟姐妹等）
- AI 辅助家谱分析与自动补全
- 多用户协作编辑
- 多语言支持与后台内容管理

## 参考文档
- [family-tree-dev-plan.md](./docs/family-tree-dev-plan.md)
- [Next.js 官方文档](https://nextjs.org/)
- [Shadcn UI 官方文档](https://ui.shadcn.com/)
- [Firebase Authentication 文档](https://firebase.google.com/docs/auth)
- [JWT 文档](https://jwt.io/)
- [Vercel 部署文档](https://vercel.com/docs)

## Vercel 部署指南

本项目已配置为可直接部署到 Vercel 平台，以下是部署步骤：

1. **准备工作**
   - 确保项目已推送到 GitHub 仓库
   - 注册 [Vercel 账号](https://vercel.com/signup) (可使用 GitHub 账号登录)

2. **导入项目**
   - 在 Vercel 控制台点击 "New Project"
   - 选择您的 GitHub 仓库
   - 选择 "family-tree" 仓库

3. **配置项目**
   - Framework Preset: 选择 "Next.js"
   - 在 "Environment Variables" 部分添加以下环境变量：
     ```
     # 数据库配置
     NEON_DATABASE_URL=your_neon_database_url
     NEXT_PUBLIC_HAS_DATABASE=true

     # Google OAuth
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     
     # JWT Secret
     JWT_SECRET=your_jwt_secret_key
     
     # Firebase 配置
     NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
     NEXT_PUBLIC_FIREBASE_CLIENT_ID=your_firebase_client_id
     
     # Firebase Admin SDK
     FIREBASE_CLIENT_EMAIL=your_firebase_client_email
     FIREBASE_PRIVATE_KEY="your_firebase_private_key"
     ```

4. **部署项目**
   - 点击 "Deploy"
   - 等待部署完成
   - 部署完成后，您将获得一个 `.vercel.app` 的域名

5. **配置自定义域名（可选）**
   - 在 Vercel 项目仪表板中点击 "Domains"
   - 添加您自己的域名并按照指南进行 DNS 配置

6. **持续部署**
   - Vercel 会自动为每个 push 到主分支的提交触发构建
   - 可在 Vercel 仪表板中查看部署历史和详情

> 注意：Vercel 部署会使用项目根目录下的 `vercel.json` 配置文件进行优化，包括缓存策略和安全头设置。

---

如有建议或需求，欢迎 issue 反馈！
