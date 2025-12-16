-- Migration: Change books.id from TEXT to UUID and switch to Open Library
-- Run this migration in Supabase SQL Editor

-- ============================================================
-- STEP 0: DROP OLD TABLES (reading_states & reading_progresses)
-- These tables are replaced by user_books
-- ============================================================

-- Drop old tables that reference books (they're replaced by user_books)
DROP TABLE IF EXISTS reading_progresses CASCADE;
DROP TABLE IF EXISTS reading_states CASCADE;

-- ============================================================
-- STEP 1: BOOKS TABLE - Convert ID to UUID
-- ============================================================

-- Add new UUID column to books
ALTER TABLE books ADD COLUMN IF NOT EXISTS new_id UUID DEFAULT gen_random_uuid();

-- ============================================================
-- STEP 2: USER_BOOKS TABLE - Update foreign key references
-- ============================================================

-- Add new UUID column to user_books for the migration
ALTER TABLE user_books ADD COLUMN IF NOT EXISTS new_book_id UUID;

-- Update user_books with the new UUID from books
UPDATE user_books ub
SET new_book_id = b.new_id
FROM books b
WHERE ub.book_id = b.id;

-- Drop foreign key constraint on user_books
ALTER TABLE user_books DROP CONSTRAINT IF EXISTS user_books_book_id_fkey;

-- ============================================================
-- STEP 3: SWITCH PRIMARY KEYS
-- ============================================================

-- Drop primary key constraint on books
ALTER TABLE books DROP CONSTRAINT IF EXISTS books_pkey;

-- Drop old id column and rename new_id to id on books
ALTER TABLE books DROP COLUMN id;
ALTER TABLE books RENAME COLUMN new_id TO id;

-- Add primary key constraint on books with the new UUID id
ALTER TABLE books ADD PRIMARY KEY (id);

-- Drop old book_id column and rename new_book_id to book_id on user_books
ALTER TABLE user_books DROP COLUMN book_id;
ALTER TABLE user_books RENAME COLUMN new_book_id TO book_id;

-- Add foreign key constraint back on user_books
ALTER TABLE user_books 
ADD CONSTRAINT user_books_book_id_fkey 
FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE;

-- Add NOT NULL constraint to book_id
ALTER TABLE user_books ALTER COLUMN book_id SET NOT NULL;

-- Update the unique constraint on user_books
ALTER TABLE user_books DROP CONSTRAINT IF EXISTS user_books_user_id_book_id_key;
ALTER TABLE user_books ADD CONSTRAINT user_books_user_id_book_id_key UNIQUE (user_id, book_id);

-- ============================================================
-- STEP 4: CLEANUP LITERAL.CLUB SPECIFIC COLUMNS
-- ============================================================

-- Remove profile_id from user_books (was literal.club specific)
ALTER TABLE user_books DROP COLUMN IF EXISTS profile_id;

-- Remove synced_at from user_books (rename to updated_at)
ALTER TABLE user_books DROP COLUMN IF EXISTS synced_at;
ALTER TABLE user_books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Remove gradient_colors from books (literal.club specific)
ALTER TABLE books DROP COLUMN IF EXISTS gradient_colors;

-- Rename synced_at to updated_at on books
ALTER TABLE books DROP COLUMN IF EXISTS synced_at;
ALTER TABLE books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE books ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Make slug optional (not all Open Library books have slugs)
ALTER TABLE books ALTER COLUMN slug DROP NOT NULL;

-- ============================================================
-- STEP 5: ADD SUBJECTS COLUMN AND ISBN13 UNIQUE CONSTRAINT
-- ============================================================

-- Add subjects column for book categories
ALTER TABLE books ADD COLUMN IF NOT EXISTS subjects JSONB;

-- Add unique constraint on isbn13 (allows NULL values, used for deduplication when available)
ALTER TABLE books ADD CONSTRAINT books_isbn13_key UNIQUE (isbn13);

-- ============================================================
-- STEP 6: RECREATE INDEXES
-- ============================================================

DROP INDEX IF EXISTS idx_books_title;
CREATE INDEX idx_books_title ON books(title);

DROP INDEX IF EXISTS idx_user_books_book_id;
CREATE INDEX idx_user_books_book_id ON user_books(book_id);

DROP INDEX IF EXISTS idx_books_isbn13;
CREATE INDEX idx_books_isbn13 ON books(isbn13);

-- ============================================================
-- VERIFICATION (uncomment to run manually)
-- ============================================================
-- SELECT id, title, isbn13 FROM books LIMIT 10;
-- SELECT id, book_id, user_id, status FROM user_books LIMIT 10;
