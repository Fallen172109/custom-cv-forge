-- Enable Row Level Security on all tables and add user_id columns where needed

-- Add user_id column to cv_sessions table for proper user association
ALTER TABLE public.cv_sessions 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to cv_data table  
ALTER TABLE public.cv_data 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id column to cover_letter_data table
ALTER TABLE public.cover_letter_data 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable RLS on cv_sessions table
ALTER TABLE public.cv_sessions ENABLE ROW LEVEL SECURITY;

-- Enable RLS on cv_data table  
ALTER TABLE public.cv_data ENABLE ROW LEVEL SECURITY;

-- Enable RLS on cover_letter_data table
ALTER TABLE public.cover_letter_data ENABLE ROW LEVEL SECURITY;

-- Enable RLS on cv_templates table (allow public read access for templates)
ALTER TABLE public.cv_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for cv_sessions table
CREATE POLICY "Users can view their own CV sessions" 
ON public.cv_sessions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own CV sessions" 
ON public.cv_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own CV sessions" 
ON public.cv_sessions 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own CV sessions" 
ON public.cv_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for cv_data table
CREATE POLICY "Users can view their own CV data" 
ON public.cv_data 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own CV data" 
ON public.cv_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own CV data" 
ON public.cv_data 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own CV data" 
ON public.cv_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for cover_letter_data table
CREATE POLICY "Users can view their own cover letter data" 
ON public.cover_letter_data 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own cover letter data" 
ON public.cover_letter_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own cover letter data" 
ON public.cover_letter_data 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own cover letter data" 
ON public.cover_letter_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for cv_templates table (public read access)
CREATE POLICY "Everyone can view active templates" 
ON public.cv_templates 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only authenticated users can manage templates" 
ON public.cv_templates 
FOR ALL 
USING (false)
WITH CHECK (false);