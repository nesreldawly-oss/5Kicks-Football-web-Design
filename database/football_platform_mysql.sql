-- MySQL bootstrap script for 5Kicks Football Platform
-- Run this once in your MySQL server before starting the backend.

-- 1. Create database
CREATE DATABASE IF NOT EXISTS football_platform
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

-- 2. Create application user (adjust password if you like)
CREATE USER IF NOT EXISTS 'football_user'@'localhost' IDENTIFIED BY 'football_password';

-- 3. Grant permissions
GRANT ALL PRIVILEGES ON football_platform.* TO 'football_user'@'localhost';
FLUSH PRIVILEGES;

-- NOTE:
-- Tables are created and kept in sync automatically by Spring Data JPA / Hibernate
-- based on the entity classes in the backend project.
-- Property used: spring.jpa.hibernate.ddl-auto=update


