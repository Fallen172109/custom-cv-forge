-- Simplified database schema for CV Tailor application (no user authentication)
-- This migration creates tables for storing CV data, job applications, and templates

-- Create cv_sessions table for storing CV generation sessions
CREATE TABLE IF NOT EXISTS public.cv_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token TEXT UNIQUE DEFAULT gen_random_uuid()::text,
    email TEXT,
    job_title TEXT,
    company_name TEXT,
    job_description TEXT,
    job_url TEXT,
    template_used TEXT,
    original_cv_file_path TEXT,
    generated_cv_html TEXT,
    generated_cl_html TEXT,
    cv_pdf_url TEXT,
    cover_letter_pdf_url TEXT,
    ai_score INTEGER,
    ai_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_data table for storing extracted/generated CV information
CREATE TABLE IF NOT EXISTS public.cv_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.cv_sessions(id) ON DELETE CASCADE,
    name TEXT,
    target_role TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    summary TEXT,
    skills_csv TEXT,
    tools_csv TEXT,
    exp1_company TEXT,
    exp1_title TEXT,
    exp1_dates TEXT,
    exp1_bullets TEXT,
    exp2_company TEXT,
    exp2_title TEXT,
    exp2_dates TEXT,
    exp2_bullets TEXT,
    edu1_school TEXT,
    edu1_degree TEXT,
    edu1_dates TEXT,
    edu1_details TEXT,
    edu2_school TEXT,
    edu2_degree TEXT,
    edu2_dates TEXT,
    edu2_details TEXT,
    headshot_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cover_letter_data table for storing cover letter information
CREATE TABLE IF NOT EXISTS public.cover_letter_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.cv_sessions(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    phone TEXT,
    company TEXT,
    cover_intro TEXT,
    cover_body TEXT,
    cover_closing TEXT,
    target_role TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cv_templates table for template management
CREATE TABLE IF NOT EXISTS public.cv_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    preview_image_url TEXT,
    cv_html_template TEXT,
    cl_html_template TEXT,
    css_styles TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default templates
INSERT INTO public.cv_templates (name, slug, description, preview_image_url, is_active) VALUES
('Classic', 'classic', 'Traditional professional CV template', 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic/preview.png', true),
('Modern', 'modern', 'Contemporary CV template with modern design', 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/modern/preview.png', true),
('Classic Alternative', 'classic_alternative', 'Alternative classic design with enhanced layout', 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic_alternative/preview.png', true)
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cv_sessions_session_token ON public.cv_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_cv_sessions_email ON public.cv_sessions(email);
CREATE INDEX IF NOT EXISTS idx_cv_data_session_id ON public.cv_data(session_id);
CREATE INDEX IF NOT EXISTS idx_cover_letter_data_session_id ON public.cover_letter_data(session_id);
CREATE INDEX IF NOT EXISTS idx_cv_templates_slug ON public.cv_templates(slug);
CREATE INDEX IF NOT EXISTS idx_cv_templates_active ON public.cv_templates(is_active);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER handle_cv_sessions_updated_at
    BEFORE UPDATE ON public.cv_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cv_data_updated_at
    BEFORE UPDATE ON public.cv_data
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cover_letter_data_updated_at
    BEFORE UPDATE ON public.cover_letter_data
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cv_templates_updated_at
    BEFORE UPDATE ON public.cv_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create storage buckets for file uploads (public access for simplicity)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('cv-files', 'cv-files', true, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('templates', 'templates', true, 5242880, ARRAY['text/html', 'text/css', 'image/png', 'image/jpeg']),
  ('generated-files', 'generated-files', true, 10485760, ARRAY['application/pdf', 'text/html'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public access (no authentication required)
CREATE POLICY "Public access to cv-files" ON storage.objects
  FOR ALL USING (bucket_id = 'cv-files');

CREATE POLICY "Public access to templates" ON storage.objects
  FOR ALL USING (bucket_id = 'templates');

CREATE POLICY "Public access to generated-files" ON storage.objects
  FOR ALL USING (bucket_id = 'generated-files');
