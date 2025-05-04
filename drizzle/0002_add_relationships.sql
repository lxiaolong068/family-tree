-- Add relationships column to members table
ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "relationships" JSONB DEFAULT '[]';
