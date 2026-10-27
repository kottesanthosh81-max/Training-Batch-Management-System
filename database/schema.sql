-- ============================================================
-- Training Batch Management System
-- Database Schema: training_batch_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS training_batch_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE training_batch_db;

-- Drop tables if they already exist (students first due to FK)
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS batches;

-- Table: batches
CREATE TABLE batches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    batch_name VARCHAR(150) NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: students
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(150) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    batch_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_batch FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE RESTRICT,
    CONSTRAINT uk_batch_roll UNIQUE (batch_id, roll_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Initial Seed Data
INSERT INTO batches (id, batch_name, course_name, start_date) VALUES
(1, 'Java Full Stack Batch A', 'Java Full Stack Development', '2026-11-01'),
(2, 'Python Data Science Batch 1', 'Data Science & Machine Learning', '2026-11-15'),
(3, 'Cloud DevOps Batch Nov', 'Cloud Computing & DevOps', '2026-12-01');

INSERT INTO students (student_name, roll_number, batch_id) VALUES
('Rahul Kumar', '23CS001', 1),
('Priya Sharma', '23CS002', 1),
('Amit Patel', '23CS003', 1),
('Sneha Reddy', '23CS001', 2), -- Same roll number in a different batch (Allowed)
('Vikram Singh', '23CS002', 2),
('Ananya Gupta', '23DS001', 2),
('Rohan Verma', '23DO001', 3);
