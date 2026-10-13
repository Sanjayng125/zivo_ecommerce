ALTER TABLE home_sections
ADD COLUMN config JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE banners
ADD COLUMN group_name VARCHAR(255) NOT NULL DEFAULT 'main';

ALTER TABLE home_sections
ALTER COLUMN key DROP NOT NULL;

SELECT conname
FROM pg_constraint
WHERE conrelid = 'home_sections'::regclass
AND contype = 'u';

ALTER TABLE home_sections
DROP CONSTRAINT home_sections_key_key;
