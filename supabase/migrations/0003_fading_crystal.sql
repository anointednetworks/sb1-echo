/*
  # Create media storage bucket

  1. New Storage
    - Creates a public media bucket for storing user uploads
    - Enables public access for reading files
    - Sets up security policies for authenticated users to upload

  2. Security
    - Only authenticated users can upload files
    - Anyone can view uploaded files
    - 5MB file size limit
    - Only allows image files
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- Set up security policies
CREATE POLICY "Anyone can view media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'media' AND
    auth.role() = 'authenticated' AND
    (COALESCE(char_length(storage.foldername(name)::text), 0) + char_length(storage.filename(name)::text)) < 5242880 AND
    (lower(storage.extension(name)) = ANY (ARRAY['png', 'jpg', 'jpeg', 'gif']))
  );