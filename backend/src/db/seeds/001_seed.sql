-- SEED FAKE DATA

-- CATEGORIES

-- Top-level categories
INSERT INTO categories (id, name, slug, sort_order) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Men',         'men',         1),
    ('a0000000-0000-0000-0000-000000000002', 'Women',       'women',       2),
    ('a0000000-0000-0000-0000-000000000003', 'Kids',        'kids',        3),
    ('a0000000-0000-0000-0000-000000000004', 'Footwear',    'footwear',    4),
    ('a0000000-0000-0000-0000-000000000005', 'Accessories', 'accessories', 5),
    ('a0000000-0000-0000-0000-000000000006', 'Electronics', 'electronics', 6);

-- Subcategories — Men
INSERT INTO categories (id, name, slug, parent_id, sort_order) VALUES
    ('a0000000-0000-0000-0000-000000000011', 'Shirts',   'men-shirts',   'a0000000-0000-0000-0000-000000000001', 1),
    ('a0000000-0000-0000-0000-000000000012', 'T-Shirts', 'men-tshirts',  'a0000000-0000-0000-0000-000000000001', 2),
    ('a0000000-0000-0000-0000-000000000013', 'Jeans',    'men-jeans',    'a0000000-0000-0000-0000-000000000001', 3),
    ('a0000000-0000-0000-0000-000000000014', 'Jackets',  'men-jackets',  'a0000000-0000-0000-0000-000000000001', 4);

-- Subcategories — Women
INSERT INTO categories (id, name, slug, parent_id, sort_order) VALUES
    ('a0000000-0000-0000-0000-000000000021', 'Kurtas',   'women-kurtas',  'a0000000-0000-0000-0000-000000000002', 1),
    ('a0000000-0000-0000-0000-000000000022', 'Dresses',  'women-dresses', 'a0000000-0000-0000-0000-000000000002', 2),
    ('a0000000-0000-0000-0000-000000000023', 'Tops',     'women-tops',    'a0000000-0000-0000-0000-000000000002', 3),
    ('a0000000-0000-0000-0000-000000000024', 'Jeans',    'women-jeans',   'a0000000-0000-0000-0000-000000000002', 4);

-- Subcategories — Footwear
INSERT INTO categories (id, name, slug, parent_id, sort_order) VALUES
    ('a0000000-0000-0000-0000-000000000031', 'Sneakers', 'footwear-sneakers', 'a0000000-0000-0000-0000-000000000004', 1),
    ('a0000000-0000-0000-0000-000000000032', 'Sandals',  'footwear-sandals',  'a0000000-0000-0000-0000-000000000004', 2),
    ('a0000000-0000-0000-0000-000000000033', 'Formal',   'footwear-formal',   'a0000000-0000-0000-0000-000000000004', 3);

-- PRODUCTS

INSERT INTO products (id, category_id, title, slug, description, base_price, cover_image, rating_avg, rating_count) VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000012',
        'Classic White T-Shirt',
        'classic-white-tshirt',
        'A timeless white cotton t-shirt. Soft, breathable, and perfect for everyday wear.',
        49900,
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
        4.50,
        124
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000011',
        'Oxford Button-Down Shirt',
        'oxford-button-down-shirt',
        'A crisp oxford shirt perfect for both office and casual outings.',
        129900,
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
        4.30,
        89
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000013',
        'Slim Fit Stretch Jeans',
        'slim-fit-stretch-jeans',
        'Modern slim fit jeans with stretch fabric for all-day comfort.',
        199900,
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600',
        4.20,
        201
    ),
    (
        'b0000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000014',
        'Quilted Puffer Jacket',
        'quilted-puffer-jacket',
        'Lightweight quilted jacket that keeps you warm without the bulk.',
        349900,
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600',
        4.60,
        67
    ),
    (
        'b0000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000021',
        'Floral Anarkali Kurta',
        'floral-anarkali-kurta',
        'Beautiful floral print anarkali kurta, ideal for festive occasions.',
        159900,
        'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600',
        4.70,
        312
    ),
    (
        'b0000000-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000022',
        'Wrap Midi Dress',
        'wrap-midi-dress',
        'Elegant wrap midi dress suitable for both casual and semi-formal occasions.',
        229900,
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
        4.40,
        156
    ),
    (
        'b0000000-0000-0000-0000-000000000007',
        'a0000000-0000-0000-0000-000000000031',
        'Urban Runner Sneakers',
        'urban-runner-sneakers',
        'Lightweight and stylish sneakers built for city life.',
        299900,
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600',
        4.50,
        445
    ),
    (
        'b0000000-0000-0000-0000-000000000008',
        'a0000000-0000-0000-0000-000000000006',
        'Wireless Noise-Cancelling Headphones',
        'wireless-noise-cancelling-headphones',
        'Premium over-ear headphones with active noise cancellation and 30hr battery.',
        799900,
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600',
        4.80,
        789
    );

-- PRODUCT VARIANTS

-- Classic White T-Shirt
INSERT INTO product_variants (id, product_id, sku, size, color, price, stock) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'CWT-WHT-S',  'S',  'White', 49900, 50),
    ('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'CWT-WHT-M',  'M',  'White', 49900, 80),
    ('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'CWT-WHT-L',  'L',  'White', 49900, 60),
    ('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'CWT-WHT-XL', 'XL', 'White', 49900, 30),
    ('c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'CWT-BLK-S',  'S',  'Black', 49900, 45),
    ('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000001', 'CWT-BLK-M',  'M',  'Black', 49900, 70),
    ('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000001', 'CWT-BLK-L',  'L',  'Black', 49900, 55),
    ('c0000000-0000-0000-0000-000000000008', 'b0000000-0000-0000-0000-000000000001', 'CWT-BLK-XL', 'XL', 'Black', 49900, 25);

-- Oxford Button-Down Shirt
INSERT INTO product_variants (id, product_id, sku, size, color, price, stock) VALUES
    ('c0000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000002', 'OBS-BLU-S',  'S',  'Blue',  129900, 30),
    ('c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000002', 'OBS-BLU-M',  'M',  'Blue',  129900, 50),
    ('c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002', 'OBS-BLU-L',  'L',  'Blue',  129900, 40),
    ('c0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000002', 'OBS-WHT-M',  'M',  'White', 129900, 35),
    ('c0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000002', 'OBS-WHT-L',  'L',  'White', 129900, 28);

-- Slim Fit Stretch Jeans
INSERT INTO product_variants (id, product_id, sku, size, color, price, stock) VALUES
    ('c0000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000003', 'SFJ-IND-30', '30', 'Indigo', 199900, 40),
    ('c0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000003', 'SFJ-IND-32', '32', 'Indigo', 199900, 60),
    ('c0000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000003', 'SFJ-IND-34', '34', 'Indigo', 199900, 45),
    ('c0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000003', 'SFJ-BLK-32', '32', 'Black', 199900, 35),
    ('c0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000003', 'SFJ-BLK-34', '34', 'Black', 199900, 30);

-- Quilted Puffer Jacket
INSERT INTO product_variants (id, product_id, sku, size, color, price, stock) VALUES
    ('c0000000-0000-0000-0000-000000000031', 'b0000000-0000-0000-0000-000000000004', 'QPJ-NVY-S',  'S',  'Navy',  349900, 20),
    ('c0000000-0000-0000-0000-000000000032', 'b0000000-0000-0000-0000-000000000004', 'QPJ-NVY-M',  'M',  'Navy',  349900, 30),
    ('c0000000-0000-0000-0000-000000000033', 'b0000000-0000-0000-0000-000000000004', 'QPJ-NVY-L',  'L',  'Navy',  349900, 25),
    ('c0000000-0000-0000-0000-000000000034', 'b0000000-0000-0000-0000-000000000004', 'QPJ-BLK-M',  'M',  'Black', 359900, 18),
    ('c0000000-0000-0000-0000-000000000035', 'b0000000-0000-0000-0000-000000000004', 'QPJ-BLK-L',  'L',  'Black', 359900, 15);

-- Floral Anarkali Kurta
INSERT INTO product_variants (id, product_id, sku, size, color, price, stock) VALUES
    ('c0000000-0000-0000-0000-000000000041', 'b0000000-0000-0000-0000-000000000005', 'FAK-PNK-S',  'S',  'Pink',   159900, 35),
    ('c0000000-0000-0000-0000-000000000042', 'b0000000-0000-0000-0000-000000000005', 'FAK-PNK-M',  'M',  'Pink',   159900, 50),
    ('c0000000-0000-0000-0000-000000000043', 'b0000000-0000-0000-0000-000000000005', 'FAK-PNK-L',  'L',  'Pink',   159900, 40),
    ('c0000000-0000-0000-0000-000000000044', 'b0000000-0000-0000-0000-000000000005', 'FAK-YLW-M',  'M',  'Yellow', 159900, 30),
    ('c0000000-0000-0000-0000-000000000045', 'b0000000-0000-0000-0000-000000000005', 'FAK-YLW-L',  'L',  'Yellow', 159900, 25);

-- Wrap Midi Dress
INSERT INTO product_variants (id, product_id, sku, size, color, price, stock) VALUES
    ('c0000000-0000-0000-0000-000000000051', 'b0000000-0000-0000-0000-000000000006', 'WMD-RSE-S',  'S',  'Rose',  229900, 25),
    ('c0000000-0000-0000-0000-000000000052', 'b0000000-0000-0000-0000-000000000006', 'WMD-RSE-M',  'M',  'Rose',  229900, 35),
    ('c0000000-0000-0000-0000-000000000053', 'b0000000-0000-0000-0000-000000000006', 'WMD-RSE-L',  'L',  'Rose',  229900, 20),
    ('c0000000-0000-0000-0000-000000000054', 'b0000000-0000-0000-0000-000000000006', 'WMD-OLV-M',  'M',  'Olive', 229900, 18);

-- Urban Runner Sneakers
INSERT INTO product_variants (id, product_id, sku, size, color, price, stock) VALUES
    ('c0000000-0000-0000-0000-000000000061', 'b0000000-0000-0000-0000-000000000007', 'URS-WHT-7',  '7',  'White', 299900, 30),
    ('c0000000-0000-0000-0000-000000000062', 'b0000000-0000-0000-0000-000000000007', 'URS-WHT-8',  '8',  'White', 299900, 45),
    ('c0000000-0000-0000-0000-000000000063', 'b0000000-0000-0000-0000-000000000007', 'URS-WHT-9',  '9',  'White', 299900, 40),
    ('c0000000-0000-0000-0000-000000000064', 'b0000000-0000-0000-0000-000000000007', 'URS-WHT-10', '10', 'White', 299900, 20),
    ('c0000000-0000-0000-0000-000000000065', 'b0000000-0000-0000-0000-000000000007', 'URS-BLK-8',  '8',  'Black', 299900, 35),
    ('c0000000-0000-0000-0000-000000000066', 'b0000000-0000-0000-0000-000000000007', 'URS-BLK-9',  '9',  'Black', 299900, 30),
    ('c0000000-0000-0000-0000-000000000067', 'b0000000-0000-0000-0000-000000000007', 'URS-BLK-10', '10', 'Black', 299900, 15);

-- Wireless Headphones (no size/color variants — one default)
INSERT INTO product_variants (id, product_id, sku, price, stock) VALUES
    ('c0000000-0000-0000-0000-000000000071', 'b0000000-0000-0000-0000-000000000008', 'WNC-BLK-ONE', 799900, 60);

-- PRODUCT IMAGES

INSERT INTO product_images (product_id, url, sort_order) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 0),
    ('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600', 1),
    ('b0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600', 2),

    ('b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', 0),
    ('b0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600', 1),

    ('b0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', 0),
    ('b0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=600', 1),

    ('b0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600', 0),
    ('b0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600', 1),

    ('b0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', 0),
    ('b0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', 1),

    ('b0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600', 0),
    ('b0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1568251188392-ae4d4e0b5f4a?w=600', 1),

    ('b0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 0),
    ('b0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600', 1),
    ('b0000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600', 2),

    ('b0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 0),
    ('b0000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600', 1);

-- BANNERS

INSERT INTO banners (image_url, link, sort_order) VALUES
    ('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200', 'zivo://category/men', 0),
    ('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200', 'zivo://category/women', 1),
    ('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200',   'zivo://category/footwear', 2);

-- HOME SECTIONS

INSERT INTO home_sections (key, title, type, sort_order) VALUES
    ('banners',      'Banners',       'banner',       0),
    ('categories',   'Shop by Category', 'category_row', 1),
    ('new_arrivals', 'New Arrivals',  'product_row',  2),
    ('best_sellers', 'Best Sellers',  'product_row',  3);

