-- ================================================================
-- V1__initial_schema.sql
-- PGKart - Initial PostgreSQL Schema
-- ================================================================

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(20) UNIQUE NOT NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL
);

-- User-Role junction table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id BIGSERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    product_id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    product_description TEXT NOT NULL,
    quantity INT DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,
    special_price DECIMAL(10, 2),
    stock_quantity INT DEFAULT 0,
    low_stock_threshold INT DEFAULT 5,
    is_bundle BOOLEAN DEFAULT FALSE,
    average_rating DECIMAL(3, 1) DEFAULT 0.0,
    total_reviews INT DEFAULT 0,
    category_id BIGINT REFERENCES categories(category_id) ON DELETE SET NULL
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    address_id BIGSERIAL PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    user_id BIGINT REFERENCES users(user_id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGSERIAL PRIMARY KEY,
    payment_method VARCHAR(50) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(200),
    pg_status VARCHAR(50),
    pg_response_message VARCHAR(255)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    order_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'PENDING',
    tracking_id VARCHAR(100),
    courier_name VARCHAR(100),
    tracking_url VARCHAR(500),
    confirmation_email_sent BOOLEAN DEFAULT FALSE,
    shipped_email_sent BOOLEAN DEFAULT FALSE,
    delivered_email_sent BOOLEAN DEFAULT FALSE,
    payment_id BIGINT REFERENCES payments(payment_id),
    address_id BIGINT REFERENCES addresses(address_id)
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    order_item_id BIGSERIAL PRIMARY KEY,
    order_id BIGINT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(product_id),
    quantity INT NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,
    ordered_product_price DECIMAL(10, 2) NOT NULL
);

-- Carts table
CREATE TABLE IF NOT EXISTS carts (
    cart_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    total_price DECIMAL(10, 2) DEFAULT 0.0
);

-- Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT REFERENCES carts(cart_id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(product_id),
    quantity INT NOT NULL DEFAULT 1,
    discount DECIMAL(5, 2) DEFAULT 0,
    product_price DECIMAL(10, 2) NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    review_id BIGSERIAL PRIMARY KEY,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    product_id BIGINT NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    user_name VARCHAR(50),
    CONSTRAINT uq_review_product_user UNIQUE (product_id, user_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_bundle ON products(is_bundle);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
