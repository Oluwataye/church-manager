-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'member');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing members table policies
DROP POLICY IF EXISTS "Authenticated users can view members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can insert members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can update members" ON public.members;
DROP POLICY IF EXISTS "Authenticated users can delete members" ON public.members;

-- Create new secure policies for members table
CREATE POLICY "Admins can view all members"
ON public.members
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert members"
ON public.members
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update members"
ON public.members
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete members"
ON public.members
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing tithes table policies
DROP POLICY IF EXISTS "Authenticated users can view tithes" ON public.tithes;
DROP POLICY IF EXISTS "Authenticated users can insert tithes" ON public.tithes;
DROP POLICY IF EXISTS "Authenticated users can update tithes" ON public.tithes;
DROP POLICY IF EXISTS "Authenticated users can delete tithes" ON public.tithes;

-- Create new secure policies for tithes table
CREATE POLICY "Admins can view all tithes"
ON public.tithes
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert tithes"
ON public.tithes
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update tithes"
ON public.tithes
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete tithes"
ON public.tithes
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Secure other sensitive tables - groups
DROP POLICY IF EXISTS "Authenticated users can view groups" ON public.groups;
DROP POLICY IF EXISTS "Authenticated users can insert groups" ON public.groups;
DROP POLICY IF EXISTS "Authenticated users can update groups" ON public.groups;
DROP POLICY IF EXISTS "Authenticated users can delete groups" ON public.groups;

CREATE POLICY "Admins can manage groups"
ON public.groups
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Secure attendance_records
DROP POLICY IF EXISTS "Authenticated users can view attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can insert attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can update attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Authenticated users can delete attendance" ON public.attendance_records;

CREATE POLICY "Admins can manage attendance"
ON public.attendance_records
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Secure incomes
DROP POLICY IF EXISTS "Authenticated users can view incomes" ON public.incomes;
DROP POLICY IF EXISTS "Authenticated users can insert incomes" ON public.incomes;
DROP POLICY IF EXISTS "Authenticated users can update incomes" ON public.incomes;
DROP POLICY IF EXISTS "Authenticated users can delete incomes" ON public.incomes;

CREATE POLICY "Admins can manage incomes"
ON public.incomes
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Keep events and announcements readable by all authenticated users, but only admins can modify
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can insert events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can update events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can delete events" ON public.events;

CREATE POLICY "All authenticated users can view events"
ON public.events
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage events"
ON public.events
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can view announcements" ON public.announcements;
DROP POLICY IF EXISTS "Authenticated users can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Authenticated users can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Authenticated users can delete announcements" ON public.announcements;

CREATE POLICY "All authenticated users can view announcements"
ON public.announcements
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage announcements"
ON public.announcements
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Secure church_settings
DROP POLICY IF EXISTS "Authenticated users can view church settings" ON public.church_settings;
DROP POLICY IF EXISTS "Authenticated users can insert church settings" ON public.church_settings;
DROP POLICY IF EXISTS "Authenticated users can update church settings" ON public.church_settings;

CREATE POLICY "All authenticated users can view church settings"
ON public.church_settings
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage church settings"
ON public.church_settings
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));