-- Fix RLS policies to remove public access vulnerability
-- Remove the security hole that allows access when user_id IS NULL

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own CV sessions" ON public.cv_sessions;
DROP POLICY IF EXISTS "Users can create their own CV sessions" ON public.cv_sessions;
DROP POLICY IF EXISTS "Users can update their own CV sessions" ON public.cv_sessions;
DROP POLICY IF EXISTS "Users can delete their own CV sessions" ON public.cv_sessions;

DROP POLICY IF EXISTS "Users can view their own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Users can create their own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Users can update their own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Users can delete their own CV data" ON public.cv_data;

DROP POLICY IF EXISTS "Users can view their own cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Users can create their own cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Users can update their own cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Users can delete their own cover letter data" ON public.cover_letter_data;

-- Create secure RLS policies that REQUIRE authentication
-- CV Sessions - only authenticated users can access their own data
CREATE POLICY "Authenticated users can view their own CV sessions" 
ON public.cv_sessions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own CV sessions" 
ON public.cv_sessions 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own CV sessions" 
ON public.cv_sessions 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own CV sessions" 
ON public.cv_sessions 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- CV Data - only authenticated users can access their own data
CREATE POLICY "Authenticated users can view their own CV data" 
ON public.cv_data 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own CV data" 
ON public.cv_data 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own CV data" 
ON public.cv_data 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own CV data" 
ON public.cv_data 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Cover Letter Data - only authenticated users can access their own data
CREATE POLICY "Authenticated users can view their own cover letter data" 
ON public.cover_letter_data 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can create their own cover letter data" 
ON public.cover_letter_data 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own cover letter data" 
ON public.cover_letter_data 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own cover letter data" 
ON public.cover_letter_data 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);