-- Seed development data

-- Insert agency admin profile
INSERT INTO profiles (
  user_id,
  role,
  status,
  email,
  full_name,
  is_agency_admin
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'agency',
  'active',
  'agency@redmoon.com',
  'REDMOON Agency',
  true
) ON CONFLICT (user_id) DO NOTHING;

-- Insert brand profile
INSERT INTO profiles (
  user_id,
  role,
  status,
  email,
  full_name,
  company_name,
  industry,
  website
) VALUES (
  '00000000-0000-0000-0000-000000000002',
  'brand',
  'active',
  'brand@example.com',
  'Jane Smith',
  'Fashion Co',
  'Fashion',
  'https://fashionco.com'
) ON CONFLICT (user_id) DO NOTHING;

-- Insert influencer profile
INSERT INTO profiles (
  user_id,
  role,
  status,
  email,
  full_name,
  follower_count,
  engagement_rate,
  categories,
  social_handles
) VALUES (
  '00000000-0000-0000-0000-000000000003',
  'influencer',
  'active',
  'influencer@example.com',
  'John Doe',
  100000,
  5.5,
  ARRAY['fashion', 'lifestyle'],
  '{"instagram": "@johndoe", "tiktok": "@johndoe"}'::jsonb
) ON CONFLICT (user_id) DO NOTHING;

-- Insert sample product
INSERT INTO products (
  id,
  brand_id,
  title,
  description,
  budget_min,
  budget_max,
  categories,
  status
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM profiles WHERE email = 'brand@example.com'),
  'Instagram Campaign for Summer Collection',
  'We are looking for fashion influencers to promote our new summer collection. The campaign will run for 2 weeks and include 3 Instagram posts and 5 stories.',
  500.00,
  2000.00,
  ARRAY['fashion', 'lifestyle'],
  'open'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample proposal
INSERT INTO proposals (
  id,
  product_id,
  influencer_id,
  message,
  proposed_rate,
  status
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  (SELECT id FROM profiles WHERE email = 'influencer@example.com'),
  'I would love to work with Fashion Co on this campaign! I have experience promoting fashion brands and my audience aligns perfectly with your target demographic.',
  1200.00,
  'pending'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample conversation
INSERT INTO conversations (
  id,
  product_id,
  proposal_id,
  influencer_id,
  brand_id,
  agency_id,
  status
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  (SELECT id FROM profiles WHERE email = 'influencer@example.com'),
  (SELECT id FROM profiles WHERE email = 'brand@example.com'),
  (SELECT id FROM profiles WHERE email = 'agency@redmoon.com'),
  'active'
) ON CONFLICT (id) DO NOTHING;

-- Insert sample messages
INSERT INTO messages (
  conversation_id,
  sender_id,
  content
) VALUES
  (
    '33333333-3333-3333-3333-333333333333',
    (SELECT id FROM profiles WHERE email = 'brand@example.com'),
    'Hi John! Thank you for your proposal. We love your content and think you would be a great fit.'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    (SELECT id FROM profiles WHERE email = 'influencer@example.com'),
    'Thank you so much! I am excited to work with Fashion Co. When would you like to start?'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    (SELECT id FROM profiles WHERE email = 'agency@redmoon.com'),
    'Welcome to both of you! I will be overseeing this collaboration to ensure everything goes smoothly.'
  );

-- Insert sample notifications
INSERT INTO notifications (
  user_id,
  type,
  title,
  message,
  link
) VALUES
  (
    '00000000-0000-0000-0000-000000000002',
    'proposal_received',
    'New Proposal Received',
    'John Doe has submitted a proposal for your Instagram Campaign',
    '/dashboard/proposals'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'message_received',
    'New Message',
    'You have a new message in your conversation',
    '/dashboard/chat/33333333-3333-3333-3333-333333333333'
  );

-- Insert sample audit log
INSERT INTO audit_logs (
  user_id,
  action,
  resource_type,
  resource_id,
  changes
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'profile_status_changed',
  'profile',
  (SELECT id FROM profiles WHERE email = 'influencer@example.com')::text,
  '{"status": "active", "reason": "Profile approved"}'::jsonb
);

SELECT 'Seed data inserted successfully!' AS status;
