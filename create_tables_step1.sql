-- Step 1: Create basic tables first
-- Run this in Supabase SQL Editor

-- Create cv_sessions table
CREATE TABLE public.cv_sessions (
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

-- Create cv_templates table
CREATE TABLE public.cv_templates (
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
INSERT INTO public.cv_templates (name, slug, description, is_active) VALUES
('Classic', 'classic', 'Traditional professional CV template', true),
('Modern', 'modern', 'Contemporary CV template with modern design', true),
('Classic Alternative', 'classic_alternative', 'Alternative classic design with enhanced layout', true);
