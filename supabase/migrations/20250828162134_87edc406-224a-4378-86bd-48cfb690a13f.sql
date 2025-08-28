-- Add user_id column to jobs_history table for user ownership
ALTER TABLE public.jobs_history 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing records to have a null user_id (they'll need to be re-created by authenticated users)
-- In production, you might want to migrate existing data to specific users

-- Enable Row Level Security on jobs_history table
ALTER TABLE public.jobs_history ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view only their own job history records
CREATE POLICY "Users can view their own job history" 
ON public.jobs_history 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for users to insert their own job history records
CREATE POLICY "Users can create their own job history" 
ON public.jobs_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own job history records
CREATE POLICY "Users can update their own job history" 
ON public.jobs_history 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy for users to delete their own job history records
CREATE POLICY "Users can delete their own job history" 
ON public.jobs_history 
FOR DELETE 
USING (auth.uid() = user_id);