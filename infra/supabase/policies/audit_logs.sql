-- Audit Logs RLS Policies

-- Only agency admins can view audit logs
CREATE POLICY "Agency admins can view audit logs"
  ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'agency'
      AND profiles.is_agency_admin = true
    )
  );

-- System can insert audit logs (via function)
CREATE POLICY "System can insert audit logs"
  ON audit_logs
  FOR INSERT
  WITH CHECK (true);
