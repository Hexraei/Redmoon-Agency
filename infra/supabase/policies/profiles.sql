-- Profiles RLS Policies

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow agency admins to view all profiles
CREATE POLICY "Agency can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'agency'
      AND p.is_agency_admin = true
    )
  );

-- Allow agency admins to update profile status
CREATE POLICY "Agency can update profile status"
  ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'agency'
      AND p.is_agency_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.user_id = auth.uid()
      AND p.role = 'agency'
      AND p.is_agency_admin = true
    )
  );

-- Allow influencers and brands to view each other's public profiles
CREATE POLICY "Users can view active public profiles"
  ON profiles
  FOR SELECT
  USING (
    status = 'active'
    AND (
      role IN ('influencer', 'brand')
      OR (
        -- Allow viewing agency profile
        role = 'agency'
      )
    )
  );
