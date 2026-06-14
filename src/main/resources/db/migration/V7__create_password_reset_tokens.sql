-- ================================================================
-- V7__create_password_reset_tokens.sql
-- PGKart - Password Reset Tokens Table
-- ================================================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    expiry_date TIMESTAMP NOT NULL
);
