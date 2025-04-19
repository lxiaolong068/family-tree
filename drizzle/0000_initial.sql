-- Create family tree table
CREATE TABLE IF NOT EXISTS "family_trees" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT,
  "root_id" TEXT,
  "user_id" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create family tree members table
CREATE TABLE IF NOT EXISTS "members" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "relation" TEXT NOT NULL,
  "parent_id" TEXT,
  "birth_date" TEXT,
  "death_date" TEXT,
  "gender" TEXT,
  "description" TEXT,
  "family_tree_id" INTEGER REFERENCES "family_trees"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户表
CREATE TABLE IF NOT EXISTS "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
