-- CODECADE Database Schema
-- Currently using file-based storage (CSV/JSON)
-- This schema is for future PostgreSQL migration

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    college VARCHAR(200),
    avatar_url TEXT
);

-- Submissions table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    problem_id INTEGER NOT NULL,
    title VARCHAR(200),
    topic VARCHAR(50),
    difficulty VARCHAR(20),
    status VARCHAR(20),
    time_taken_sec INTEGER,
    attempts INTEGER DEFAULT 1,
    error_type VARCHAR(50),
    code TEXT,
    language VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study plans table
CREATE TABLE study_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    exam_name VARCHAR(200),
    total_days INTEGER,
    daily_hours INTEGER,
    topics JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE ratings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER DEFAULT 1200,
    rank_tier VARCHAR(20) DEFAULT 'Bronze',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Theory progress table
CREATE TABLE theory_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(100) NOT NULL,
    lesson_slug VARCHAR(100) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, module_id, lesson_slug)
);

-- Indexes for performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_submissions_topic ON submissions(topic);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_ratings_rating ON ratings(rating DESC);
CREATE INDEX idx_theory_progress_user_id ON theory_progress(user_id);

-- Trigger to auto-update ratings timestamp
CREATE OR REPLACE FUNCTION update_rating_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ratings_update_timestamp
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_rating_timestamp();
