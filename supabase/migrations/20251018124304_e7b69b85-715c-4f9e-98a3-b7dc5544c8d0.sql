-- Insert or update church settings with new church name
INSERT INTO church_settings (church_name, created_at, updated_at)
VALUES ('Glory Cummunity Christian Centre Kubwa', NOW(), NOW())
ON CONFLICT (id) 
DO UPDATE SET 
  church_name = EXCLUDED.church_name,
  updated_at = NOW();