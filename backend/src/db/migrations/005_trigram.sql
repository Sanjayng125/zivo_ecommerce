CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX products_title_trgm_idx ON products USING GIN(title gin_trgm_ops);
