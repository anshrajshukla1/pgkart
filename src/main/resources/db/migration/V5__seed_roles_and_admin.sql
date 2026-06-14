-- ================================================================
-- V5__seed_roles_and_admin.sql
-- PGKart - Insert Roles and Admin User
-- ================================================================

-- Create pgcrypto extension for secure password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Insert default roles if they don't exist
INSERT INTO roles (role_name) VALUES ('ROLE_USER') ON CONFLICT (role_name) DO NOTHING;
INSERT INTO roles (role_name) VALUES ('ROLE_ADMIN') ON CONFLICT (role_name) DO NOTHING;

-- 2. Insert the Admin user
-- Password will be 'Admin@123' encrypted with bcrypt
INSERT INTO users (username, email, password) 
VALUES ('admin', 'admin@pgkart.online', crypt('Admin@123', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

-- 3. Assign ROLE_ADMIN to the Admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.username = 'admin' AND r.role_name = 'ROLE_ADMIN'
ON CONFLICT (user_id, role_id) DO NOTHING;
