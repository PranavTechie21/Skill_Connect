CREATE TABLE IF NOT EXISTS "stories_new" (
  "id" serial PRIMARY KEY,
  "title" varchar(255) NOT NULL,
  "content" text NOT NULL,
  "author_name" varchar(255) NOT NULL,
  "author_email" varchar(255) NOT NULL,
  "tags" text[] NOT NULL DEFAULT '{}',
  "status" text NOT NULL DEFAULT 'pending',
  "views" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Copy existing data
INSERT INTO "stories_new" (
  "id", "title", "content", "tags", "status", 
  "views", "created_at", "updated_at", 
  "author_name", "author_email"
)
SELECT 
  "id", "title", "content", "tags", "status", 
  "views", "created_at", "updated_at",
  'Anonymous' as "author_name",
  'anonymous@example.com' as "author_email"
FROM "stories";

-- Drop the old table
DROP TABLE "stories";

-- Rename the new table to stories
ALTER TABLE "stories_new" RENAME TO "stories";