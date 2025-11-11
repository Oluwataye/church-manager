-- ============================================
-- PHASE 1.1: CRITICAL SECURITY - RLS HARDENING
-- ============================================

-- First, improve has_role() function with edge case handling
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Handle NULL user_id (unauthenticated users)
  IF _user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Handle NULL role parameter
  IF _role IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user has the specified role
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Log error and return FALSE for any unexpected errors
    RAISE WARNING 'has_role() error for user % with role %: %', _user_id, _role, SQLERRM;
    RETURN FALSE;
END;
$$;

-- ============================================
-- RESTRICTIVE DENIAL POLICIES FOR MEMBERS TABLE
-- ============================================

-- Explicit denial policy for non-admin access to members
CREATE POLICY "Deny non-admin access to members"
ON public.members
AS RESTRICTIVE
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) = true);

-- ============================================
-- RESTRICTIVE DENIAL POLICIES FOR TITHES TABLE
-- ============================================

-- Explicit denial policy for non-admin access to tithes
CREATE POLICY "Deny non-admin access to tithes"
ON public.tithes
AS RESTRICTIVE
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) = true);

-- ============================================
-- RESTRICTIVE DENIAL POLICIES FOR INCOMES TABLE
-- ============================================

-- Explicit denial policy for non-admin access to incomes
CREATE POLICY "Deny non-admin access to incomes"
ON public.incomes
AS RESTRICTIVE
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) = true);

-- ============================================
-- RESTRICTIVE DENIAL POLICIES FOR ATTENDANCE_RECORDS TABLE
-- ============================================

-- Explicit denial policy for non-admin access to attendance_records
CREATE POLICY "Deny non-admin access to attendance"
ON public.attendance_records
AS RESTRICTIVE
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) = true);

-- ============================================
-- RESTRICTIVE DENIAL POLICIES FOR GROUPS TABLE
-- ============================================

-- Explicit denial policy for non-admin access to groups
CREATE POLICY "Deny non-admin access to groups"
ON public.groups
AS RESTRICTIVE
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role) = true);

-- ============================================
-- CATCH-ALL RESTRICTIVE POLICY FOR USER_ROLES
-- ============================================

-- Prevent unauthorized role manipulation
CREATE POLICY "Deny unauthorized role modifications"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
USING (
  -- Allow users to view their own roles
  (auth.uid() = user_id AND current_setting('request.method', true) = 'GET')
  OR
  -- Only admins can modify any roles
  has_role(auth.uid(), 'admin'::app_role) = true
);

-- ============================================
-- AUDIT LOGGING TABLE FOR SECURITY
-- ============================================

-- Create audit_logs table for tracking sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- System can insert audit logs (via triggers)
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Create index for faster audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);