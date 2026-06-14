-- ================================================================
-- V2__seed_categories.sql
-- PGKart - Seed default categories for hostel essentials
-- ================================================================

INSERT INTO categories (category_name) VALUES
    ('Bath & Toiletries'),
    ('Study Essentials'),
    ('Kitchen Basics'),
    ('Bedding & Comfort'),
    ('Storage & Organization'),
    ('Starter Kits'),
    ('Snacks & Beverages'),
    ('Electronics & Accessories')
ON CONFLICT (category_name) DO NOTHING;
