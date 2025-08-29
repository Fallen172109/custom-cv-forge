-- First, check and drop ALL existing policies
DROP POLICY IF EXISTS "Users can view accessible CV sessions" ON public.cv_sessions;
DROP POLICY IF EXISTS "Anyone can create CV sessions" ON public.cv_sessions;
DROP POLICY IF EXISTS "Users can update accessible CV sessions" ON public.cv_sessions;
DROP POLICY IF EXISTS "Users can delete accessible CV sessions" ON public.cv_sessions;

DROP POLICY IF EXISTS "Users can view accessible CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Anyone can create CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Users can update accessible CV data" ON public.cv_data;
DROP POLICY IF EXISTS "Users can delete accessible CV data" ON public.cv_data;

DROP POLICY IF EXISTS "Users can view accessible cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Anyone can create cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Users can update accessible cover letter data" ON public.cover_letter_data;
DROP POLICY IF EXISTS "Users can delete accessible cover letter data" ON public.cover_letter_data;

-- Create security definer function to safely check permissions
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

-- CV Sessions - secure anonymous access policies
CREATE POLICY "Allow access to own or anonymous sessions" 
ON public.cv_sessions 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow session creation" 
ON public.cv_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow updating accessible sessions" 
ON public.cv_sessions 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Allow deleting accessible sessions" 
ON public.cv_sessions 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- CV Data - session-based access control
CREATE POLICY "Allow viewing data for accessible sessions" 
ON public.cv_data 
FOR SELECT 
USING (public.can_access_session(session_id));

CREATE POLICY "Allow creating data for accessible sessions" 
ON public.cv_data 
FOR INSERT 
WITH CHECK (public.can_access_session(session_id));

CREATE POLICY "Allow updating data for accessible sessions" 
ON public.cv_data 
FOR UPDATE 
USING (public.can_access_session(session_id));

CREATE POLICY "Allow deleting data for accessible sessions" 
ON public.cv_data 
FOR DELETE 
USING (public.can_access_session(session_id));

-- Cover Letter Data - session-based access control  
CREATE POLICY "Allow viewing CL data for accessible sessions" 
ON public.cover_letter_data 
FOR SELECT 
USING (public.can_access_session(session_id));

CREATE POLICY "Allow creating CL data for accessible sessions" 
ON public.cover_letter_data 
FOR INSERT 
WITH CHECK (public.can_access_session(session_id));

CREATE POLICY "Allow updating CL data for accessible sessions" 
ON public.cover_letter_data 
FOR UPDATE 
USING (public.can_access_session(session_id));

CREATE POLICY "Allow deleting CL data for accessible sessions" 
ON public.cover_letter_data 
FOR DELETE 
USING (public.can_access_session(session_id));