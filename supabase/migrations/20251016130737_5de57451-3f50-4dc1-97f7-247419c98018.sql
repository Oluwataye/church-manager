-- Add wofbi_type column to members table
ALTER TABLE public.members 
ADD COLUMN wofbi_type text;

-- Add comment to describe the column
COMMENT ON COLUMN public.members.wofbi_type IS 'Type of WOFBI course: BCC, LCC, LDC, or none';