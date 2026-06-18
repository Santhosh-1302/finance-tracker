-- ============================================================
-- Personal Finance Tracker - MySQL Database Schema
-- Step 4: CREATE TABLE Scripts
-- ============================================================

-- Create and use the database
CREATE DATABASE IF NOT EXISTS finance_tracker;
USE finance_tracker;

-- ============================================================
-- Table 1: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id    INT AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- ============================================================
-- Table 2: income
-- ============================================================
CREATE TABLE IF NOT EXISTS income (
    id      INT AUTO_INCREMENT PRIMARY KEY,
    source  VARCHAR(100)   NOT NULL,
    amount  DECIMAL(10, 2) NOT NULL,
    date    DATE           NOT NULL,
    user_id INT            NOT NULL,
    CONSTRAINT fk_income_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
);

-- ============================================================
-- Table 3: expense
-- ============================================================
CREATE TABLE IF NOT EXISTS expense (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100)   NOT NULL,
    amount   DECIMAL(10, 2) NOT NULL,
    date     DATE           NOT NULL,
    user_id  INT            NOT NULL,
    CONSTRAINT fk_expense_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
);

-- ============================================================
-- Sample Data (optional for testing)
-- ============================================================
INSERT INTO users (name, email) VALUES
    ('Santhosh', 'santhosh@example.com'),
    ('Priya', 'priya@example.com');

INSERT INTO income (source, amount, date, user_id) VALUES
    ('Salary', 25000.00, '2025-06-01', 1),
    ('Freelance', 5000.00, '2025-06-05', 1),
    ('Part-time', 8000.00, '2025-06-03', 2);

INSERT INTO expense (category, amount, date, user_id) VALUES
    ('Food', 3000.00, '2025-06-02', 1),
    ('Transport', 1500.00, '2025-06-04', 1),
    ('Utilities', 2000.00, '2025-06-06', 2);
