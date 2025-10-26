-- Messages RLS Policies

-- Participants can view messages in their conversations
CREATE POLICY "Participants can view messages"
  ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
      AND (
        c.influencer_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
        OR c.brand_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
        OR c.agency_id IN (
          SELECT id FROM profiles WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Participants can insert messages
CREATE POLICY "Participants can insert messages"
  ON messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations c
      JOIN profiles p ON p.user_id = auth.uid()
      WHERE c.id = messages.conversation_id
      AND messages.sender_id = p.id
      AND (
        c.influencer_id = p.id
        OR c.brand_id = p.id
        OR c.agency_id = p.id
      )
    )
  );

-- Conversations RLS Policies
CREATE POLICY "Participants can view conversations"
  ON conversations
  FOR SELECT
  USING (
    influencer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR brand_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR agency_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can update conversations"
  ON conversations
  FOR UPDATE
  USING (
    influencer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR brand_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR agency_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  )
  WITH CHECK (
    influencer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR brand_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
    OR agency_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  );
