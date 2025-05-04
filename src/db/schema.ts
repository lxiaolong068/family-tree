import { pgTable, serial, text, timestamp, boolean, json } from 'drizzle-orm/pg-core';

// 家谱表
export const familyTrees = pgTable('family_trees', {
  id: serial('id').primaryKey(),
  name: text('name'),
  rootId: text('root_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  userId: text('user_id'), // 用户ID，用于关联用户
});

// 家谱成员表
export const members = pgTable('members', {
  id: text('id').primaryKey(), // 使用与前端相同的ID格式
  name: text('name').notNull(),
  relation: text('relation').notNull(),
  parentId: text('parent_id'),
  birthDate: text('birth_date'),
  deathDate: text('death_date'),
  gender: text('gender'), // 'male', 'female', 'other'
  description: text('description'),
  relationships: json('relationships').$type<{ type: string; targetId: string; description?: string }[]>(), // 存储关系数组
  // 修改为integer类型，与familyTrees表的id字段类型保持一致
  // 这样可以避免类型转换问题和潜在的错误
  familyTreeId: serial('family_tree_id').notNull(), // 外键关联到家谱表
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 用户表
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  googleId: text('google_id').unique(), // Google 认证ID
  profileImage: text('profile_image'), // 用户头像链接
  createdAt: timestamp('created_at').defaultNow(),
});
