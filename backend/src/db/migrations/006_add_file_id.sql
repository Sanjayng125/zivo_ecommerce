ALTER TABLE profiles ADD COLUMN avatar_file_id TEXT;
ALTER TABLE products ADD COLUMN cover_image_file_id TEXT;
ALTER TABLE product_images ADD COLUMN file_id TEXT;
ALTER TABLE categories ADD COLUMN image_file_id TEXT;
ALTER TABLE banners ADD COLUMN image_file_id TEXT;
ALTER TABLE home_sections ADD COLUMN bg_image_file_id TEXT;