-- CODECADE Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active DATE DEFAULT CURRENT_DATE,
    college VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    topic VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    description TEXT,
    xp_reward INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User solved problems
CREATE TABLE IF NOT EXISTS user_solved_problems (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attempts INTEGER DEFAULT 1,
    time_taken_sec INTEGER,
    UNIQUE(user_id, problem_id)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    topic VARCHAR(50) NOT NULL,
    content TEXT,
    xp_reward INTEGER DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User completed lessons
CREATE TABLE IF NOT EXISTS user_completed_lessons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Battles table
CREATE TABLE IF NOT EXISTS battles (
    id SERIAL PRIMARY KEY,
    player1_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    player2_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    winner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    result VARCHAR(20) NOT NULL,
    xp_gained INTEGER DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User battles (for tracking individual participation)
CREATE TABLE IF NOT EXISTS user_battles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    battle_id INTEGER REFERENCES battles(id) ON DELETE CASCADE,
    result VARCHAR(20) NOT NULL,
    xp_gained INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- XP log (optional tracking)
CREATE TABLE IF NOT EXISTS xp_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    xp_gained INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER DEFAULT 1000,
    rank_tier VARCHAR(20) DEFAULT 'Bronze',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    problem_id INTEGER,
    title VARCHAR(200),
    topic VARCHAR(50),
    difficulty VARCHAR(20),
    status VARCHAR(20) NOT NULL,
    time_taken_sec INTEGER,
    attempts INTEGER DEFAULT 1,
    code TEXT,
    language VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_solved ON user_solved_problems(user_id);
CREATE INDEX IF NOT EXISTS idx_user_lessons ON user_completed_lessons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_battles ON user_battles(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log ON xp_log(user_id);
