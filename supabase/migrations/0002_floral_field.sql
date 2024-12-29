/*
  # Fix profile creation policies

  1. Changes
    - Add policy to allow users to insert their own profile
    - Ensure user can only create profile with matching auth.uid()
  
  2. Security
    - Maintains RLS protection
    - Only allows users to create their own profile
*/

CREATE POLICY "Users can create their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Update the existing update policy to be more specific
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);