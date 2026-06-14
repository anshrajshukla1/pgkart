ALTER TABLE orders ADD COLUMN return_status VARCHAR(255);

ALTER TABLE products DROP COLUMN IF EXISTS is_bundle;
ALTER TABLE products DROP COLUMN IF EXISTS average_rating;
ALTER TABLE products DROP COLUMN IF EXISTS total_reviews;

DROP TABLE IF EXISTS reviews;
