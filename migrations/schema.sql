-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tutor_ai;
USE tutor_ai;

-- Create the waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the users table for credentials auth
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Supabase: problem_attempts table (PostgreSQL syntax)
-- Run this in the Supabase SQL editor:
--
-- CREATE TABLE IF NOT EXISTS problem_attempts (
--   id BIGSERIAL PRIMARY KEY,
--   user_id TEXT NOT NULL,
--   problem_id TEXT NOT NULL,
--   attempts INTEGER NOT NULL DEFAULT 1,
--   solved BOOLEAN NOT NULL DEFAULT FALSE,
--   solved_at TIMESTAMPTZ,
--   last_attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--   UNIQUE(user_id, problem_id)
-- );
-- CREATE INDEX ON problem_attempts(user_id);

-- Supabase: add onboarding_complete column to users table
-- Run this in the Supabase SQL editor:
--
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE;
-- UPDATE users SET onboarding_complete = TRUE WHERE created_at < NOW() - INTERVAL '1 day';
