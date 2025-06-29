/*
  # Fix User Registration Database Error

  1. New Tables
    - Ensure `profiles` table exists with proper structure
    - Add proper foreign key constraints
    - Set up automatic profile creation

  2. Security
    - Enable RLS on profiles table
    - Add policies for user data access
    - Fix trigger function for automatic profile creation

  3. Changes
    - Updated trigger function to handle potential errors
    - Added proper error handling for profile creation
    - Ensured compatibility with Supabase auth system
*/

-- Drop existing objects if they exist to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- Create profiles table with proper structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profile access
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create improved trigger function with error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert into profiles table, ignore if already exists
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, now(), now())
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;