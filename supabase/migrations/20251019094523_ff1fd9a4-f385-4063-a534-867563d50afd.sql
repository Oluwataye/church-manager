-- Update church settings with correct church name
UPDATE church_settings 
SET church_name = 'GLORY COMMUNITY CHRISTIAN CENTRE Kubwa',
    updated_at = NOW()
WHERE id IN (SELECT id FROM church_settings LIMIT 1);