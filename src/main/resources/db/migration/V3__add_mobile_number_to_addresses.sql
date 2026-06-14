-- ================================================================
-- V3__add_mobile_number_to_addresses.sql
-- Add mobile_number column to addresses
-- ================================================================

ALTER TABLE addresses ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(15);
