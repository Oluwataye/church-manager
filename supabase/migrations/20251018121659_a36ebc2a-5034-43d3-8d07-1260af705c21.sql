-- Create storage bucket for church assets (logos, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'church-assets',
  'church-assets',
  true,
  5242880, -- 5MB
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
);

-- Policy: Anyone can view public church assets
CREATE POLICY "Public church assets are viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'church-assets');

-- Policy: Authenticated admins can upload church assets
CREATE POLICY "Admins can upload church assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'church-assets' 
  AND auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: Authenticated admins can update church assets
CREATE POLICY "Admins can update church assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'church-assets' 
  AND auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Policy: Authenticated admins can delete church assets
CREATE POLICY "Admins can delete church assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'church-assets' 
  AND auth.uid() IS NOT NULL
  AND has_role(auth.uid(), 'admin'::app_role)
);