-- Products RLS Policies

-- Brands can create products
CREATE POLICY "Brands can create products"
  ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = brand_id
      AND profiles.user_id = auth.uid()
      AND profiles.role = 'brand'
    )
  );

-- Brands can view their own products
CREATE POLICY "Brands can view own products"
  ON products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = brand_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Brands can update their own products
CREATE POLICY "Brands can update own products"
  ON products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = brand_id
      AND profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = brand_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Influencers can view open products
CREATE POLICY "Influencers can view open products"
  ON products
  FOR SELECT
  USING (
    status = 'open'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'influencer'
      AND profiles.status = 'active'
    )
  );

-- Agency can view all products
CREATE POLICY "Agency can view all products"
  ON products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'agency'
    )
  );
