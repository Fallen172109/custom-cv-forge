-- Enhanced database schema for CV Tailor application
-- This migration adds comprehensive tables for user data, CV content, and job processing

-- Create users_profiles table for extended user information
CREATE TABLE IF NOT EXISTS public.users_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create cv_data table for storing user CV information
CREATE TABLE IF NOT EXISTS public.cv_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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
    original_cv_file_path TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cover_letter_data table for storing cover letter information
CREATE TABLE IF NOT EXISTS public.cover_letter_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Create job_applications table for comprehensive job application tracking
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_title TEXT,
    company_name TEXT,
    job_description TEXT,
    job_url TEXT,
    template_used TEXT,
    cv_data_id UUID REFERENCES public.cv_data(id) ON DELETE SET NULL,
    cover_letter_data_id UUID REFERENCES public.cover_letter_data(id) ON DELETE SET NULL,
    generated_cv_html TEXT,
    generated_cl_html TEXT,
    cv_pdf_url TEXT,
    cover_letter_pdf_url TEXT,
    ai_score INTEGER,
    ai_notes TEXT,
    status TEXT DEFAULT 'draft', -- draft, submitted, interview, rejected, accepted
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

-- Enable Row Level Security on all new tables
ALTER TABLE public.users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letter_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cv_templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users_profiles
CREATE POLICY "Users can view their own profile" ON public.users_profiles
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own profile" ON public.users_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.users_profiles
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own profile" ON public.users_profiles
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for cv_data
CREATE POLICY "Users can view their own CV data" ON public.cv_data
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own CV data" ON public.cv_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own CV data" ON public.cv_data
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own CV data" ON public.cv_data
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for cover_letter_data
CREATE POLICY "Users can view their own cover letter data" ON public.cover_letter_data
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own cover letter data" ON public.cover_letter_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cover letter data" ON public.cover_letter_data
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cover letter data" ON public.cover_letter_data
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for job_applications
CREATE POLICY "Users can view their own job applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own job applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own job applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own job applications" ON public.job_applications
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for cv_templates (public read access)
CREATE POLICY "Anyone can view active templates" ON public.cv_templates
    FOR SELECT USING (is_active = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_profiles_user_id ON public.users_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_cv_data_user_id ON public.cv_data(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letter_data_user_id ON public.cover_letter_data(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
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
CREATE TRIGGER handle_users_profiles_updated_at
    BEFORE UPDATE ON public.users_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cv_data_updated_at
    BEFORE UPDATE ON public.cv_data
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cover_letter_data_updated_at
    BEFORE UPDATE ON public.cover_letter_data
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_cv_templates_updated_at
    BEFORE UPDATE ON public.cv_templates
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('cv-files', 'cv-files', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('templates', 'templates', true, 5242880, ARRAY['text/html', 'text/css', 'image/png', 'image/jpeg'])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for cv-files bucket
CREATE POLICY "Users can upload their own CV files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own CV files" ON storage.objects
  FOR SELECT USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own CV files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CV files" ON storage.objects
  FOR DELETE USING (bucket_id = 'cv-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for templates bucket (public read access)
CREATE POLICY "Anyone can view templates" ON storage.objects
  FOR SELECT USING (bucket_id = 'templates');
