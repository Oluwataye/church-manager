-- Create church_settings table for storing church configuration
CREATE TABLE public.church_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  church_name TEXT NOT NULL DEFAULT 'My Church',
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create members table
CREATE TABLE public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  date_of_birth DATE,
  gender TEXT,
  marital_status TEXT,
  member_type TEXT NOT NULL DEFAULT 'member',
  church_group UUID,
  baptism_date DATE,
  baptism_location TEXT,
  join_date DATE,
  wofbi_graduate BOOLEAN DEFAULT false,
  wofbi_graduation_year INTEGER,
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create groups table
CREATE TABLE public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key for church_group
ALTER TABLE public.members
ADD CONSTRAINT fk_members_church_group
FOREIGN KEY (church_group) REFERENCES public.groups(id) ON DELETE SET NULL;

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create announcements table
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  service_type TEXT NOT NULL,
  adult_men INTEGER NOT NULL DEFAULT 0,
  adult_women INTEGER NOT NULL DEFAULT 0,
  boys INTEGER NOT NULL DEFAULT 0,
  girls INTEGER NOT NULL DEFAULT 0,
  total INTEGER GENERATED ALWAYS AS (adult_men + adult_women + boys + girls) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create incomes table
CREATE TABLE public.incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  service_type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create tithes table
CREATE TABLE public.tithes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  month TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.church_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tithes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (church staff can access all data)
CREATE POLICY "Authenticated users can view church settings" ON public.church_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update church settings" ON public.church_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert church settings" ON public.church_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view members" ON public.members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert members" ON public.members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update members" ON public.members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete members" ON public.members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view groups" ON public.groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert groups" ON public.groups FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update groups" ON public.groups FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete groups" ON public.groups FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update events" ON public.events FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete events" ON public.events FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view announcements" ON public.announcements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert announcements" ON public.announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update announcements" ON public.announcements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete announcements" ON public.announcements FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view attendance" ON public.attendance_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert attendance" ON public.attendance_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update attendance" ON public.attendance_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete attendance" ON public.attendance_records FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view incomes" ON public.incomes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert incomes" ON public.incomes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update incomes" ON public.incomes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete incomes" ON public.incomes FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can view tithes" ON public.tithes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert tithes" ON public.tithes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update tithes" ON public.tithes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete tithes" ON public.tithes FOR DELETE TO authenticated USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_church_settings_updated_at BEFORE UPDATE ON public.church_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_records_updated_at BEFORE UPDATE ON public.attendance_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_incomes_updated_at BEFORE UPDATE ON public.incomes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tithes_updated_at BEFORE UPDATE ON public.tithes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial church settings row
INSERT INTO public.church_settings (church_name) VALUES ('My Church');