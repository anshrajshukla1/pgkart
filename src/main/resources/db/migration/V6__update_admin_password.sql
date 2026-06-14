-- ================================================================
-- V6__update_admin_password.sql
-- Update Admin Password to new secure hash
-- ================================================================

UPDATE users 
SET password = '$2b$10$zIl3s1eXcQG4etEENIyvJ.m.SaX.Kr9Rexmxp3jjcCNBVXXJnYt9S' 
WHERE username = 'admin';
