# Neon数据库设置指南

本文档介绍如何为家谱项目设置Neon数据库。

## 什么是Neon数据库？

Neon是一个serverless PostgreSQL数据库，专为云环境设计，具有以下特点：

- **Serverless架构**：按需自动扩展，无需管理服务器
- **分支功能**：可以创建数据库的即时副本，用于开发和测试
- **兼容PostgreSQL**：完全兼容PostgreSQL，支持所有PostgreSQL功能
- **高性能**：针对云环境优化，提供高性能的数据库服务

## 设置步骤

### 1. 创建Neon账户

1. 访问[Neon官网](https://neon.tech)
2. 注册一个新账户或使用GitHub、Google账户登录

### 2. 创建项目

1. 登录Neon控制台
2. 点击"New Project"按钮
3. 输入项目名称（例如"family-tree"）
4. 选择合适的区域
5. 点击"Create Project"按钮

### 3. 获取连接信息

1. 在项目页面，点击"Connection Details"
2. 复制数据库连接URL，格式如下：
   ```
   postgres://username:password@hostname:port/database
   ```

### 4. 配置项目

1. 在项目根目录创建`.env.local`文件（如果不存在）
2. 添加以下内容：
   ```
   NEON_DATABASE_URL=你的数据库连接URL
   ```

### 5. 运行数据库迁移

运行以下命令创建必要的数据库表：

```bash
pnpm db:push
```

## 数据库结构

家谱项目使用以下表结构：

### family_trees表

存储家谱基本信息。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | SERIAL | 主键 |
| name | TEXT | 家谱名称 |
| root_id | TEXT | 根节点ID |
| user_id | TEXT | 用户ID |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### members表

存储家谱成员信息。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | TEXT | 主键 |
| name | TEXT | 成员姓名 |
| relation | TEXT | 成员关系 |
| parent_id | TEXT | 父节点ID |
| birth_date | TEXT | 出生日期 |
| death_date | TEXT | 死亡日期 |
| gender | TEXT | 性别 |
| description | TEXT | 描述 |
| family_tree_id | INTEGER | 外键，关联family_trees表 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### users表

存储用户信息（可选，用于用户认证）。

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | TEXT | 主键 |
| email | TEXT | 邮箱，唯一 |
| name | TEXT | 用户名 |
| created_at | TIMESTAMP | 创建时间 |

## 使用数据库

项目中已经集成了Neon数据库的支持，您可以使用以下功能：

1. **保存家谱到云端**：在家谱生成器页面点击"保存到云端"按钮
2. **加载云端家谱**：通过URL参数`id`加载特定的家谱，例如：`/generator?id=1`
3. **获取用户家谱列表**：通过API `/api/family-trees?userId=xxx`获取用户的家谱列表

## 故障排除

如果遇到数据库连接问题，请检查：

1. `.env.local`文件中的连接URL是否正确
2. Neon项目是否处于活动状态
3. 网络连接是否正常

如需更多帮助，请参考[Neon官方文档](https://neon.tech/docs)。
