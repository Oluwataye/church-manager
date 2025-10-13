-- Create function to auto-assign roles to new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Assign 'member' role by default to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$;

-- Create trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add comment for documentation
COMMENT ON FUNCTION public.handle_new_user IS 'Automatically assigns member role to new users upon registration';

-- Add email validation constraint
ALTER TABLE public.members
ADD CONSTRAINT valid_email 
CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add phone validation constraint
ALTER TABLE public.members
ADD CONSTRAINT valid_phone
CHECK (phone IS NULL OR phone ~* '^[0-9+\-\(\)\s]{7,20}$');