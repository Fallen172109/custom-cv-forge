-- Update Classic template
UPDATE public.cv_templates 
SET 
  cv_html_template = '<!DOCTYPE html><html><head><title>{{name}} - CV</title></head><body><h1>{{name}}</h1><p>{{email}} | {{phone}}</p><h2>Summary</h2><p>{{summary}}</p><h2>Experience</h2><div><h3>{{exp1_title}} at {{exp1_company}}</h3><p>{{exp1_dates}}</p><p>{{exp1_bullets}}</p></div></body></html>',
  cl_html_template = '<!DOCTYPE html><html><head><title>Cover Letter</title></head><body><h1>{{name}}</h1><p>{{email}} | {{phone}}</p><p>Dear Hiring Manager,</p><p>{{cover_intro}}</p><p>{{cover_body}}</p><p>{{cover_closing}}</p><p>Sincerely,<br>{{name}}</p></body></html>',
  css_styles = 'body { font-family: Arial, sans-serif; margin: 40px; } h1 { color: #2c3e50; } h2 { color: #34495e; border-bottom: 1px solid #bdc3c7; }'
WHERE slug = 'classic';

-- Update Modern template  
UPDATE public.cv_templates 
SET 
  cv_html_template = '<!DOCTYPE html><html><head><title>{{name}} - CV</title></head><body class="modern"><div class="header"><h1>{{name}}</h1><p>{{email}} | {{phone}}</p></div><div class="summary"><h2>Summary</h2><p>{{summary}}</p></div></body></html>',
  cl_html_template = '<!DOCTYPE html><html><head><title>Cover Letter</title></head><body class="modern"><div class="header"><h1>{{name}}</h1></div><p>{{cover_intro}}</p></body></html>',
  css_styles = '.modern { font-family: "Helvetica Neue", sans-serif; } .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; }'
WHERE slug = 'modern';