-- CODECADE Seed Data
-- Sample data for testing
-- Note: Passwords are bcrypt hashed 'password123'

INSERT INTO users (username, email, password_hash, level, xp, streak_days, college) VALUES
('pixelwizard', 'pixel@university.edu', '$2b$10$rKvVPZqGvVZqGvVZqGvVZeN5YqGvVZqGvVZqGvVZqGvVZqGvVZqG', 5, 1450, 12, 'MIT'),
('retroc0der', 'retro@college.edu', '$2b$10$rKvVPZqGvVZqGvVZqGvVZeN5YqGvVZqGvVZqGvVZqGvVZqGvVZqG', 4, 1380, 8, 'Stanford'),
('salvi', 'salvi@vit.edu', '$2b$10$rKvVPZqGvVZqGvVZqGvVZeN5YqGvVZqGvVZqGvVZqGvVZqGvVZqG', 3, 1200, 5, 'VIT');

INSERT INTO ratings (user_id, rating, rank_tier) VALUES
(1, 1450, 'Gold'),
(2, 1380, 'Silver'),
(3, 1200, 'Bronze');

INSERT INTO submissions (user_id, problem_id, title, topic, difficulty, status, time_taken_sec, attempts, code, language) VALUES
(1, 1, 'Two Sum', 'Arrays', 'Easy', 'Solved', 720, 2, 'def twoSum(nums, target): ...', 'python'),
(1, 2, 'Binary Search', 'Arrays', 'Easy', 'Solved', 480, 1, 'def binarySearch(arr, x): ...', 'python'),
(2, 1, 'Two Sum', 'Arrays', 'Easy', 'Solved', 900, 3, 'public int[] twoSum(...) {...}', 'java'),
(3, 3, 'Valid Parentheses', 'Stacks', 'Easy', 'Solved', 600, 1, 'def isValid(s): ...', 'python');
