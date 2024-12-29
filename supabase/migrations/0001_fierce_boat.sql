/*
  # Initial Schema Setup for Twitter Clone

  1. Tables
    - profiles
      - id (uuid, references auth.users)
      - username (text, unique)
      - full_name (text)
      - bio (text)
      - avatar_url (text)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - tweets
      - id (uuid)
      - user_id (uuid, references profiles)
      - content (text)
      - media_url (text[])
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - likes
      - id (uuid)
      - user_id (uuid, references profiles)
      - tweet_id (uuid, references tweets)
      - created_at (timestamp)
    
    - comments
      - id (uuid)
      - user_id (uuid, references profiles)
      - tweet_id (uuid, references tweets)
      - content (text)
      - created_at (timestamp)
    
    - follows
      - follower_id (uuid, references profiles)
      - following_id (uuid, references profiles)
      - created_at (timestamp)
    
    - hashtags
      - id (uuid)
      - name (text)
      - tweet_count (int)
      - created_at (timestamp)
    
    - tweet_hashtags
      - tweet_id (uuid, references tweets)
      - hashtag_id (uuid, references hashtags)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each table
*/

-- Create tables
CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  full_name text,
  bio text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE tweets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  content text NOT NULL CHECK (char_length(content) <= 280),
  media_url text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  tweet_id uuid REFERENCES tweets ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, tweet_id)
);

CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  tweet_id uuid REFERENCES tweets ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE follows (
  follower_id uuid REFERENCES profiles ON DELETE CASCADE,
  following_id uuid REFERENCES profiles ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

CREATE TABLE hashtags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  tweet_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE tweet_hashtags (
  tweet_id uuid REFERENCES tweets ON DELETE CASCADE,
  hashtag_id uuid REFERENCES hashtags ON DELETE CASCADE,
  PRIMARY KEY (tweet_id, hashtag_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweets ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tweet_hashtags ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Tweets policies
CREATE POLICY "Tweets are viewable by everyone"
  ON tweets FOR SELECT
  USING (true);

CREATE POLICY "Users can create tweets"
  ON tweets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tweets"
  ON tweets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own tweets"
  ON tweets FOR DELETE
  USING (auth.uid() = user_id);

-- Likes policies
CREATE POLICY "Likes are viewable by everyone"
  ON likes FOR SELECT
  USING (true);

CREATE POLICY "Users can create likes"
  ON likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON likes FOR DELETE
  USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can create follows"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete own follows"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Hashtags policies
CREATE POLICY "Hashtags are viewable by everyone"
  ON hashtags FOR SELECT
  USING (true);

-- Tweet hashtags policies
CREATE POLICY "Tweet hashtags are viewable by everyone"
  ON tweet_hashtags FOR SELECT
  USING (true);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_tweets_updated_at
  BEFORE UPDATE ON tweets
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();