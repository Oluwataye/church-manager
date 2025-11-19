-- Fix critical RLS policy issues - only remove problematic policies

-- 1. Fix audit_logs - remove policy that allows any user to insert
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
-- Keep "Admins can view audit logs" policy

-- 2. Fix rate_limits - remove policy that allows any user full access  
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;
-- Keep "Admins can view rate limits" policy

-- 3. Fix security_alerts - remove policy that allows any user to insert
DROP POLICY IF EXISTS "System can insert security alerts" ON public.security_alerts;
-- Keep "Admins can view security alerts" policy

-- 4. Fix user_roles - remove complex problematic policy
DROP POLICY IF EXISTS "Deny unauthorized role modifications" ON public.user_roles;
-- Keep "Users can view their own roles" and "Admins can manage all roles" policies