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
  familyTreeId: text('family_tree_id').notNull(), // 外键关联到家谱表
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 用户表（可选，如果需要用户认证）
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});
