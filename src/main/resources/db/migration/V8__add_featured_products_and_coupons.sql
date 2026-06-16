ALTER TABLE products ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE coupons (
    coupon_id BIGSERIAL PRIMARY KEY,
    code VARCHAR(255) NOT NULL UNIQUE,
    discount_type VARCHAR(255),
    discount_value NUMERIC(38, 2),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE orders ADD COLUMN applied_coupon_code VARCHAR(255);
ALTER TABLE orders ADD COLUMN discount_amount NUMERIC(38, 2);
