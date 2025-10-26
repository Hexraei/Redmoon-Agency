-- Proposals RLS Policies

-- Influencers can create proposals
CREATE POLICY "Influencers can create proposals"
  ON proposals
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = influencer_id
      AND profiles.user_id = auth.uid()
      AND profiles.role = 'influencer'
    )
  );

-- Influencers can view their own proposals
CREATE POLICY "Influencers can view own proposals"
  ON proposals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = influencer_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Brands can view proposals for their products
CREATE POLICY "Brands can view proposals for own products"
  ON proposals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN profiles ON products.brand_id = profiles.id
      WHERE products.id = proposals.product_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Brands can update proposal status for their products
CREATE POLICY "Brands can update proposals for own products"
  ON proposals
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM products
      JOIN profiles ON products.brand_id = profiles.id
      WHERE products.id = proposals.product_id
      AND profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM products
      JOIN profiles ON products.brand_id = profiles.id
      WHERE products.id = proposals.product_id
      AND profiles.user_id = auth.uid()
    )
  );

-- Agency can view all proposals
CREATE POLICY "Agency can view all proposals"
  ON proposals
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'agency'
    )
  );
