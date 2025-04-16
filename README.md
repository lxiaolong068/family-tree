# 家谱网站（Family Tree）

[English Version (README.en.md)](./README.en.md)


## 项目简介
本项目是基于 Next.js 14 + TypeScript + pnpm + Shadcn UI 构建的家谱可视化制作与展示平台，专为家谱初学者、家族历史爱好者等用户打造，支持家谱生成、模板展示、内容科普和 SEO 优化。

## 主要功能
- 首页：项目介绍与导航
- 家谱知识科普：家谱基础知识、常见问题
- 家谱模板展示：多种模板图片/表格，支持下载
- 家谱生成器：输入成员信息，生成树状结构
- 移动端适配与响应式设计
- 后续将支持拖拽式编辑、导出（PNG/PDF/JSON）、AI 辅助等高级功能

## 技术栈
- 包管理：pnpm
- 前端框架：Next.js 14
- UI 框架：Shadcn UI（基于 Tailwind CSS）
- 语言：TypeScript
- 可视化：Mermaid.js（计划中）
- 其他：html2canvas、jsPDF（导出功能，计划中）

## 如何启动与开发
1. 安装依赖：
   ```bash
   pnpm install
   ```
2. 启动开发服务器：
   ```bash
   pnpm dev
   ```
3. 访问 [http://localhost:3000](http://localhost:3000) 查看效果。

## 目录结构
```
family-tree/
├── app/                # Next.js 14 App Router 目录
├── components/         # 组件库（Shadcn UI）
├── public/             # 静态资源
├── src/lib/            # 工具库与通用方法
├── docs/               # 需求文档与开发计划
├── README.md           # 项目说明
├── package.json        # 项目依赖
├── tailwind.config.js  # Tailwind 配置
└── ...
```

## 未来计划
- 拖拽式家谱编辑器
- 家谱数据本地/云端存储与导入导出
- 家谱可视化渲染（Mermaid.js/SVG）
- AI 辅助家谱分析与自动补全
- 多用户协作编辑
- 多语言支持与后台内容管理

## 参考文档
- [family-tree-dev-plan.md](./docs/family-tree-dev-plan.md)
- [Next.js 官方文档](https://nextjs.org/)
- [Shadcn UI 官方文档](https://ui.shadcn.com/)

---

如有建议或需求，欢迎 issue 反馈！
