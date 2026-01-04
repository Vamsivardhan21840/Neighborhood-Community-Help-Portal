-- Create Database
CREATE DATABASE IF NOT EXISTS neighborhood_community;
USE neighborhood_community;

-- =======================
-- Users Table 
-- =======================
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,

    -- Added directly (no ALTER needed)
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),

    contact_info VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    role ENUM('Resident', 'Helper') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================
-- HelpRequests Table
-- =======================
CREATE TABLE IF NOT EXISTS HelpRequests (
    id INT AUTO_INCREMENT PRIMARY KEY,

    resident_id INT NOT NULL,
    helper_id INT,

    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,

    status ENUM('Pending', 'Accepted', 'In-progress', 'Completed')
        DEFAULT 'Pending',

    attachments MEDIUMTEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (resident_id)
        REFERENCES Users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (helper_id)
        REFERENCES Users(id)
        ON DELETE SET NULL
);