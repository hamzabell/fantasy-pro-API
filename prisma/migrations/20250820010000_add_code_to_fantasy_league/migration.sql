-- Add code column to FantasyLeague table
ALTER TABLE "public"."FantasyLeague" ADD COLUMN "code" TEXT;

-- Create unique index on code column
CREATE UNIQUE INDEX "FantasyLeague_code_key" ON "public"."FantasyLeague"("code");

-- Update existing records to have a code
UPDATE "public"."FantasyLeague" 
SET "code" = UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6))
WHERE "code" IS NULL;

-- Make code column not nullable
ALTER TABLE "public"."FantasyLeague" ALTER COLUMN "code" SET NOT NULL;