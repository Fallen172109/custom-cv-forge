-- Fix the security warning by setting search_path for the function
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;