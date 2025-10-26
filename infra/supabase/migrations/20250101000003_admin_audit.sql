-- Audit log action enum
CREATE TYPE audit_action AS ENUM (
  'profile_created',
  'profile_updated',
  'profile_status_changed',
  'product_created',
  'product_updated',
  'product_deleted',
  'proposal_created',
  'proposal_status_changed',
  'conversation_created',
  'message_sent',
  'user_login',
  'user_logout'
);

-- Audit logs table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action audit_action NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  changes JSONB DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Function to create audit log
CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id UUID,
  p_action audit_action,
  p_resource_type TEXT,
  p_resource_id TEXT,
  p_changes JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_logs (user_id, action, resource_type, resource_id, changes)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_changes)
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
