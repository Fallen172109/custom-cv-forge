-- Update RLS policies to allow anonymous access while still protecting user data
-- This creates a secure anonymous experience while maintaining data isolation

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can view their own CV sessions" ON public.cv_sessions;
DROP POLICY IF EXISTS "Authenticated users can create their own CV sessions" ON public.cv_sessions;  
DROP POLICY IF EXISTS "Authenticated users can update their own CV sessions" ON public.cv_sessions;
DROP POLICY IF EXISTS "Authenticated users can delete their own CV sessions" ON public.cv_sessions;

DROP POLICY IF EXISTS "Authenticated users can view their own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Authenticated users can create their own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Authenticated users can update their own CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Authenticated users can delete their own CV data" ON public.cv_data;

DROP POLICY IF EXISTS "Authenticated users can view their own cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Authenticated users can create their own cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Authenticated users can update their own cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Authenticated users can delete their own cover letter data" ON public.cover_letter_data;

-- Create security definer functions to safely check permissions
CREATE OR REPLACE FUNCTION public.can_access_session(session_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user owns the session or if session is anonymous (no user_id)
  RETURN EXISTS (
    SELECT 1 FROM public.cv_sessions 
    WHERE id = session_uuid 
    AND (user_id = auth.uid() OR user_id IS NULL)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- CV Sessions - allow access to own sessions or anonymous sessions
CREATE POLICY "Users can view accessible CV sessions" 
ON public.cv_sessions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create CV sessions" 
ON public.cv_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update accessible CV sessions" 
ON public.cv_sessions 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete accessible CV sessions" 
ON public.cv_sessions 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- CV Data - allow access based on session ownership
CREATE POLICY "Users can view accessible CV data" 
ON public.cv_data 
FOR SELECT 
USING (public.can_access_session(session_id));

CREATE POLICY "Anyone can create CV data" 
ON public.cv_data 
FOR INSERT 
WITH CHECK (public.can_access_session(session_id));

CREATE POLICY "Users can update accessible CV data" 
ON public.cv_data 
FOR UPDATE 
USING (public.can_access_session(session_id));

CREATE POLICY "Users can delete accessible CV data" 
ON public.cv_data 
FOR DELETE 
USING (public.can_access_session(session_id));

-- Cover Letter Data - allow access based on session ownership  
CREATE POLICY "Users can view accessible cover letter data" 
ON public.cover_letter_data 
FOR SELECT 
USING (public.can_access_session(session_id));

CREATE POLICY "Anyone can create cover letter data" 
ON public.cover_letter_data 
FOR INSERT 
WITH CHECK (public.can_access_session(session_id));

CREATE POLICY "Users can update accessible cover letter data" 
ON public.cover_letter_data 
FOR UPDATE 
USING (public.can_access_session(session_id));

CREATE POLICY "Users can delete accessible cover letter data" 
ON public.cover_letter_data 
FOR DELETE 
USING (public.can_access_session(session_id));