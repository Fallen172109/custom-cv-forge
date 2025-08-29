import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/useSession';
import { DatabaseService } from '@/services/database';
import { TemplateManager } from '@/utils/templateManager';
import { PDFGenerator } from '@/services/pdfGenerator';
import I18N, { Lang } from '../i18n';
import { CVData, CLData, AiResponse } from '../types';
import CVEditor from '../components/CVEditor';
import CLEditor from '../components/CLEditor';
import { renderCV, renderCL } from '../renderers';
import { downloadHTML } from '../utils/download';
import DebugPanel from '../components/DebugPanel';

const Index = () => {
  const { sessionId, loading: sessionLoading } = useSession();
  const [lang, setLang] = useState<Lang>('en');
  const [selectedTemplate, setSelectedTemplate] = useState<'classic'|'modern'|'classic_alternative'>('modern');
  const [templates, setTemplates] = useState<any[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const [wantCV, setWantCV] = useState(true);
  const [wantScore, setWantScore] = useState(false);
  const [wantCL, setWantCL] = useState(false);
  const [ai, setAi] = useState<AiResponse | undefined>();
  const [cvEdit, setCvEdit] = useState<CVData | undefined>();
  const [clEdit, setClEdit] = useState<CLData | undefined>();
  const [activeEditor, setActiveEditor] = useState<'cv'|'cl'|null>(null);
  const [sendEmail, setSendEmail] = useState('');
  
  // Debug mode detection
  const isDebugMode = typeof window !== 'undefined' && window.location.search.includes('debug=1');

  // Set up analytics blockers for debug mode
  useEffect(() => {
    if (isDebugMode) {
      // Disable analytics and tracking to prevent errors
      if (typeof window !== 'undefined') {
        (window as any).rudderanalytics = (window as any).rudderanalytics || { 
          load(){}, page(){}, track(){}, identify(){}, reset(){}, ready(cb){ cb && cb(); } 
        };
        (window as any).fbq = (window as any).fbq || function(){};
        (window as any).ttq = (window as any).ttq || { track(){}, page(){}, init(){} };
        (window as any).Sentry = (window as any).Sentry || { init(){}, captureException(){}, captureMessage(){} };
      }
    }
  }, [isDebugMode]);

  // Load templates on component mount
  useEffect(() => {
    loadTemplates();
  }, []);

  // Load existing session data if available
  useEffect(() => {
    if (sessionId) {
      loadSessionData();
    }
  }, [sessionId]);

  const loadTemplates = async () => {
    try {
      const activeTemplates = await TemplateManager.getActiveTemplates();
      setTemplates(activeTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      // Fallback to hardcoded templates
      setTemplates([
        { slug: 'classic', name: 'Classic', preview_image_url: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic/preview.png' },
        { slug: 'modern', name: 'Modern', preview_image_url: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/modern/preview.png' },
        { slug: 'classic_alternative', name: 'Classic Alternative', preview_image_url: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic_alternative/preview.png' }
      ]);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const loadSessionData = async () => {
    if (!sessionId) return;

    try {
      // Load existing CV and CL data for this session
      const [cvData, clData] = await Promise.all([
        DatabaseService.getCVData(sessionId).catch(() => null),
        DatabaseService.getCLData(sessionId).catch(() => null),
      ]);

      if (cvData) {
        setCvEdit(DatabaseService.convertDbCVDataToCVData(cvData));
      }

      if (clData) {
        setClEdit(DatabaseService.convertDbCLDataToCLData(clData));
      }
    } catch (error) {
      console.error('Error loading session data:', error);
    }
  };

  const handleDownloadHTML = async () => {
    if (!activeEditor) return;
    
    let html = '';
    let filename = '';
    
    if (activeEditor === 'cv' && cvEdit) {
      html = await renderCV(cvEdit, selectedTemplate);
      filename = 'cv.html';
    } else if (activeEditor === 'cl' && clEdit) {
      html = await renderCL(clEdit, selectedTemplate);
      filename = 'cover-letter.html';
    }
    
    if (html) {
      downloadHTML(html, filename);
    }
  };

  const downloadHtml = (html: string, filename: string) => {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async (html: string, filename: string) => {
    try {
      const pdfFilename = filename.replace('.html', '.pdf');
      const optimizedHtml = PDFGenerator.optimizeHTMLForPDF(html);

      const success = await PDFGenerator.downloadPDFFromHTML(optimizedHtml, pdfFilename);

      if (!success) {
        // Fallback to print dialog
        PDFGenerator.printToPDF(optimizedHtml, pdfFilename.replace('.pdf', ''));
        toast({
          description: "PDF generation failed. Please use the print dialog to save as PDF."
        });
      } else {
        toast({
          description: "PDF downloaded successfully!"
        });
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        description: "PDF generation failed. Please try the HTML download instead.",
        variant: "destructive"
      });
    }
  };

  const doSend = async (email: string, cv_html: string, cl_html: string) => {
    try {
      // Generate PDFs in the frontend
      console.log('🔄 Generating PDFs...');

      const cvPdfBlob = await PDFGenerator.generatePDFFromHTML(cv_html, 'CV.pdf');
      const clPdfBlob = await PDFGenerator.generatePDFFromHTML(cl_html, 'Cover_Letter.pdf');

      if (!cvPdfBlob || !clPdfBlob) {
        throw new Error('Failed to generate PDFs');
      }

      console.log('✅ PDFs generated successfully');

      // Create FormData to send PDFs as files
      const formData = new FormData();
      formData.append('to', email);
      formData.append('subject', 'Your tailored CV package');
      formData.append('message', 'Hi! Please find your tailored CV and Cover Letter attached as PDF files.');
      formData.append('cv_pdf', cvPdfBlob, 'CV.pdf');
      formData.append('cl_pdf', clPdfBlob, 'Cover_Letter.pdf');

      console.log('📤 Sending PDFs to n8n...');

      const res = await fetch("https://kamil1721.app.n8n.cloud/webhook/44d0c9f1-520d-44c6-a119-94c4affa9663", {
        method: "POST",
        body: formData // No Content-Type header - let browser set it for FormData
      });

      console.log('📡 n8n Response Status:', res.status);
      return res.ok;

    } catch (error) {
      console.error('❌ Error in doSend:', error);
      return false;
    }
  };
  
  const t = useMemo(() => I18N[lang], [lang]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!sessionId) {
      toast({ description: "Session not initialized. Please refresh the page." });
      return;
    }

    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Get form field values
      const rawDesc = (formData.get('job_description') as string)?.trim() || "";
      const rawLink = (formData.get('job_url') as string)?.trim() || "";
      const userEmail = (formData.get('email') as string) || "";

      // Only send link if it's a URL; otherwise send as description
      const isUrl = /^https?:\/\//i.test(rawLink);
      const job_description = isUrl ? (rawDesc || "") : (rawDesc || rawLink || "");
      const jd_link = isUrl ? rawLink : "";

      // Debug logging
      console.log('🔍 URL Detection:', { rawLink, rawDesc, isUrl, job_description, jd_link });

      // Template mapping to match backend
      const template_id = TemplateManager.mapTemplateSlugForBackend(selectedTemplate);

      // What to generate
      const tasks: string[] = [];
      if (wantCV) tasks.push("cv");
      if (wantCL) tasks.push("cover_letter");
      if (wantScore) tasks.push("score");

      if (tasks.length === 0) {
        setIsSubmitting(false);
        toast({ description: "Please select at least one option (CV, Cover Letter, or Score)." });
        return;
      }

      const mode = tasks.length ? tasks.join("_") : "cv_cover_letter_score";

      // Handle file upload to Supabase
      const cvFile = formData.get('cv_file') as File;
      let originalFilePath = "";

      if (cvFile) {
        try {
          const uploadResult = await DatabaseService.uploadCVFile(cvFile, sessionId);
          originalFilePath = uploadResult.path;
        } catch (error) {
          console.error('Error uploading CV file:', error);
          toast({ description: "Failed to upload CV file. Please try again." });
          setIsSubmitting(false);
          return;
        }
      }

      // Update session with job details
      await DatabaseService.updateSession(sessionId, {
        email: userEmail,
        job_description,
        job_url: jd_link,
        template_used: template_id,
        original_cv_file_path: originalFilePath,
      });

      const payload = {
        cv_text: "",
        job_description,
        jd_link,
        template_id,
        user_email: userEmail,
        mode
      };

      // Since we have a file, we'll use FormData but structure it properly
      const finalFormData = new FormData();
      finalFormData.append('cv_file', cvFile);
      Object.entries(payload).forEach(([key, value]) => {
        finalFormData.append(key, value);
      });

      // Debug: Log what we're sending
      console.log('🚀 Sending to n8n webhook:');
      console.log('📄 File:', cvFile?.name, cvFile?.size, 'bytes');
      console.log('📋 Payload:', payload);

      // Log FormData contents
      for (let [key, value] of finalFormData.entries()) {
        console.log(`📝 FormData[${key}]:`, value instanceof File ? `File: ${value.name}` : value);
      }

      // Call the n8n generate webhook
      const generateRes = await fetch("https://kamil1721.app.n8n.cloud/webhook/c258248a-a495-4f61-88fd-f703fd357923", {
        method: "POST",
        body: finalFormData
      });

      console.log('📡 n8n Response Status:', generateRes.status);

      if (!generateRes.ok) {
        let errorText;
        try {
          // Try to parse as JSON first for structured error
          const errorJson = await generateRes.json();
          errorText = JSON.stringify(errorJson, null, 2);
          console.error('❌ n8n Error Response (JSON):', errorJson);
        } catch {
          // Fallback to text if not JSON
          errorText = await generateRes.text();
          console.error('❌ n8n Error Response (Text):', errorText);
        }

        // Log request details for debugging
        console.error('❌ Request Details:', {
          url: generateRes.url,
          status: generateRes.status,
          statusText: generateRes.statusText,
          headers: Object.fromEntries(generateRes.headers.entries())
        });

        throw new Error(`Generation request failed: ${generateRes.status} - ${errorText}`);
      }
    const data: AiResponse = await generateRes.json();

    console.log('📨 n8n Response Data:', data);
    console.log('📨 Response Type:', typeof data);
    console.log('📨 Response Keys:', Object.keys(data || {}));
    console.log('📨 cv_html present:', !!data?.cv_html);

    // Check if AI returned empty results (likely scraping failure)
    if (!data.cv_html && !data.cl_html && !data.score) {
      console.warn('⚠️ AI returned empty results - possible job posting scraping failure');
      toast({
        description: "Job posting could not be processed. The URL might be blocked or require manual copy-paste.",
        variant: "destructive"
      });
    }
    console.log('📨 cl_html present:', !!data?.cl_html);
    console.log('📨 cv_data present:', !!data?.cv_data);
    console.log('📨 cl_data present:', !!data?.cl_data);

    // Normalize the response data
    const normalized = {
      score: Number(data?.score ?? 0),
      notes: String(data?.notes ?? ""),
      cv_html: String(data?.cv_html ?? ""),
      cl_html: String(data?.cl_html ?? ""),
      cv_data: data?.cv_data,
      cl_data: data?.cl_data
    };
    setResults(normalized);
    setAi(normalized);

    // Save generated data to Supabase
    try {
      // Update session with AI results
      await DatabaseService.updateSession(sessionId, {
        generated_cv_html: normalized.cv_html,
        generated_cl_html: normalized.cl_html,
        ai_score: normalized.score,
        ai_notes: normalized.notes,
      });

      // Save CV data if generated
      if (wantCV && data.cv_data) {
        const cvData = { ...(cvEdit || {} as any), ...data.cv_data } as CVData;
        setCvEdit(cvData);
        await DatabaseService.saveCVData(cvData, sessionId);
      }

      // Save CL data if generated
      if (wantCL && data.cl_data) {
        const clData = { ...(clEdit || {} as any), ...data.cl_data } as CLData;
        setClEdit(clData);
        await DatabaseService.saveCLData(clData, sessionId);
      }

      // Store generated HTML files in Supabase storage
      if (normalized.cv_html) {
        await DatabaseService.uploadGeneratedFile(
          normalized.cv_html,
          `cv_${Date.now()}.html`,
          sessionId
        );
      }

      if (normalized.cl_html) {
        await DatabaseService.uploadGeneratedFile(
          normalized.cl_html,
          `cover_letter_${Date.now()}.html`,
          sessionId
        );
      }
    } catch (error) {
      console.error('Error saving data to Supabase:', error);
      // Don't fail the whole process if saving fails
      toast({ description: "Data generated successfully, but failed to save to database." });
    }

    setActiveEditor(wantCV ? 'cv' : (wantCL ? 'cl' : null));

    // Pre-fill the sendEmail state with the user's email for convenience
    const emailValue = data?.cv_data?.email || form.querySelector<HTMLInputElement>("input[name='email']")?.value || "";
    setSendEmail(emailValue);

    // Render HTML preview
    const preview = document.getElementById("cv_preview_html");
    if (preview && normalized.cv_html) {
      preview.innerHTML = normalized.cv_html;
    }

    // Automatically send the files via email using the second webhook
    if (emailValue) {
      const success = await doSend(emailValue, normalized.cv_html, normalized.cl_html).catch(() => false);
      if (success) {
        toast({ description: "We also sent the files to your email." });
      }
    }
      // Scroll down to the editor section to show results
      setTimeout(() => {
        document.querySelector('#editor')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      toast({ description: "Error generating CV. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while session is initializing
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing CV Tailor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="font-heading font-semibold text-xl">CV Tailor</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm hover:text-primary transition-colors">
              How it works
            </button>
            <button onClick={() => scrollToSection('templates')} className="text-sm hover:text-primary transition-colors">
              Templates
            </button>
            <a href="mailto:contact@cvtailor.com" className="text-sm hover:text-primary transition-colors">
              Contact
            </a>
            <Button onClick={() => scrollToSection('form')} size="sm" className="hover-scale">
              {t.hero_cta}
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">EN</span>
              <Switch 
                id="langToggle" 
                className="data-[state=checked]:bg-primary" 
                onCheckedChange={(checked) => setLang(checked ? 'pl' : 'en')}
              />
              <span className="text-sm font-medium">PL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 fade-in">
            {t.hero_h1}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto fade-in">
            {t.hero_sub}
          </p>
          <Button size="lg" onClick={() => scrollToSection('form')} className="mb-12 hover-scale">
            {t.hero_cta}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>ATS-ready</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-primary" />
              <span>PDF output</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-center mb-8">{t.templates_title}</h2>
        {templatesLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-muted-foreground">Loading templates...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {templates.map(template => {
              const displayName = TemplateManager.getDisplayName(template);
              const previewUrl = TemplateManager.getPreviewUrl(template);

              return (
                <label key={template.slug} className="group cursor-pointer">
                  <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
                    <div className="relative w-full h-72 rounded-xl overflow-hidden bg-white mb-4">
                      <img
                        src={previewUrl}
                        alt={displayName}
                        className="absolute inset-0 w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          (e.target as HTMLImageElement).src = '/placeholder-template.png';
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">{displayName}</div>
                      <input
                        type="radio"
                        name="template"
                        value={template.slug}
                        defaultChecked={template.slug === 'modern'}
                        onChange={() => setSelectedTemplate(template.slug as 'classic'|'modern'|'classic_alternative')}
                        className="h-5 w-5 accent-[#FF6B00]"
                      />
                    </div>
                    {template.description && (
                      <p className="text-sm text-muted-foreground mt-2">{template.description}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setPreview(previewUrl)}
                      className="mt-3 text-sm font-medium text-[#FF6B00] hover:underline"
                    >
                      Preview
                    </button>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </section>

      {/* Form Section */}
      <section id="form" className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="mx-auto w-full max-w-2xl space-y-6">
          <div>
            <label className="block mb-2 font-medium">{t.label_cvfile}</label>
            <input type="file" name="cv_file" required accept=".pdf,.doc,.docx"
                   className="block w-full text-sm
                              file:mr-4 file:py-2.5 file:px-4
                              file:rounded-xl file:border-0
                              file:bg-[#FF6B00] file:text-white file:font-medium
                              file:hover:brightness-95 file:cursor-pointer
                              border rounded-xl p-2.5 bg-white" />
          </div>

          <div>
            <label className="block mb-2 font-medium">{t.label_joburl}</label>
            <input type="text" name="job_url" placeholder={t.ph_joburl}
                   className="w-full rounded-xl border p-3 bg-white" />
          </div>

          <div className="grid gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <label className="flex items-center justify-between">
              <span>{t.opt_makecv}</span>
              <input type="checkbox" name="make_cv" defaultChecked={wantCV} onChange={e => setWantCV(e.target.checked)} className="switch" />
            </label>
            <label className="flex items-center justify-between">
              <span>{t.opt_score}</span>
              <input type="checkbox" name="score_cv" checked={wantScore} onChange={e => setWantScore(e.target.checked)} className="switch" />
            </label>
            <label className="flex items-center justify-between">
              <span>{t.opt_cover}</span>
              <input type="checkbox" name="cover_letter" checked={wantCL} onChange={e => setWantCL(e.target.checked)} className="switch" />
            </label>
          </div>

          <div>
            <label className="block mb-2 font-medium">{t.label_email}</label>
            <input type="email" name="email" required className="w-full rounded-xl border p-3 bg-white" />
          </div>

          <input type="hidden" name="site_origin" value={typeof window !== 'undefined' ? window.location.href : ''} />
          <button type="submit" className="w-full rounded-2xl bg-[#FF6B00] text-white py-3 font-semibold"> 
            {isSubmitting ? 'Generating… (20–60s)' : t.btn_generate} 
          </button>
        </form>

        {/* Results Section */}
        {results && (
          <div className="mt-12 p-8 bg-card border rounded-2xl card-shadow fade-in">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-lg font-semibold mb-4">
                <span>Match Score:</span>
                <span>{results?.score ?? 0}%</span>
              </div>
              <Progress value={results?.score ?? 0} className="w-full h-3" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {!!results?.cv_html && (
                <div className="space-y-2">
                  <Button className="hover-scale w-full" onClick={() => downloadPdf(results.cv_html, "cv.pdf")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CV (PDF)
                  </Button>
                  <Button variant="outline" className="hover-scale w-full" onClick={() => downloadHtml(results.cv_html, "cv.html")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download CV (HTML)
                  </Button>
                </div>
              )}
              {!!results?.cl_html && (
                <div className="space-y-2">
                  <Button className="hover-scale w-full" onClick={() => downloadPdf(results.cl_html, "cover-letter.pdf")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Cover Letter (PDF)
                  </Button>
                  <Button variant="outline" className="hover-scale w-full" onClick={() => downloadHtml(results.cl_html, "cover-letter.html")}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Cover Letter (HTML)
                  </Button>
                </div>
              )}
            </div>

            {(() => {
              const tipsList = Array.isArray(results?.tips) 
                ? results.tips 
                : (results?.notes ? String(results.notes).split(/\n+/).filter(Boolean) : []);
              
              return tipsList.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-4">
                    Top fixes
                  </h3>
                  <ul className="space-y-2">
                    {tipsList.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}

            {/* HTML Preview */}
            {results?.cv_html && (
              <div className="mt-8">
                <h3 className="font-heading font-semibold text-lg mb-4">CV Preview</h3>
                <div 
                  id="cv_preview_html"
                  className="border rounded-lg p-4 bg-white max-h-96 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: results.cv_html }}
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* Editor Section */}
      <section id="editor" className="container mx-auto px-4 py-12">
        {!activeEditor && (
          <p className="text-gray-500 text-center">Run generation to edit the result.</p>
        )}

        {activeEditor && (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-8">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-xl border ${
                  activeEditor === 'cv'
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                    : 'bg-white'
                }`}
                onClick={() => setActiveEditor('cv')}
                disabled={!cvEdit}
              >
                CV Editor
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-xl border ${
                  activeEditor === 'cl'
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00]'
                    : 'bg-white'
                }`}
                onClick={() => setActiveEditor('cl')}
                disabled={!clEdit}
              >
                Cover Letter Editor
              </button>
            </div>

            {/* Editors */}
            {activeEditor === 'cv' && cvEdit && (
              <CVEditor data={cvEdit} onChange={setCvEdit} template={selectedTemplate} />
            )}
            {activeEditor === 'cl' && clEdit && (
              <CLEditor data={clEdit} onChange={setClEdit} template={selectedTemplate} />
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              {ai?.cv_html && (
                <>
                  <button
                    className="rounded-xl bg-[#FF6B00] text-white px-4 py-2"
                    onClick={() => downloadPdf(ai.cv_html, "cv.pdf")}
                  >
                    Download CV (PDF)
                  </button>
                  <button
                    className="rounded-xl border border-[#FF6B00] text-[#FF6B00] px-4 py-2"
                    onClick={() => downloadHtml(ai.cv_html, "cv.html")}
                  >
                    Download CV (HTML)
                  </button>
                </>
              )}
              {ai?.cl_html && (
                <>
                  <button
                    className="rounded-xl bg-[#FF6B00] text-white px-4 py-2"
                    onClick={() => downloadPdf(ai.cl_html, "cover-letter.pdf")}
                  >
                    Download Cover Letter (PDF)
                  </button>
                  <button
                    className="rounded-xl border border-[#FF6B00] text-[#FF6B00] px-4 py-2"
                    onClick={() => downloadHtml(ai.cl_html, "cover-letter.html")}
                  >
                    Download Cover Letter (HTML)
                  </button>
                </>
              )}
              <input
                type="email"
                placeholder="Email to send files"
                value={sendEmail}
                onChange={(e) => setSendEmail(e.target.value)}
                className="input w-72"
              />
              <button
                type="button"
                className="rounded-xl bg-[#FF6B00] text-white px-4 py-2"
                onClick={async () => {
                  if (!results?.cv_html && !results?.cl_html) {
                    toast({ description: "Generate first." });
                    return;
                  }
                  if (!sendEmail) {
                    toast({ description: "Enter an email." });
                    return;
                  }
                  const ok = await doSend(sendEmail, results.cv_html || "", results.cl_html || "");
                  toast({ description: ok ? "Email sent!" : "Failed to send email." });
                }}
              >
                Email me the files
              </button>
              <button
                type="button"
                className="rounded-xl border px-4 py-2"
                onClick={handleDownloadHTML}
              >
                Download HTML (fallback)
              </button>
            </div>
          </div>
        )}
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Upload</h3>
              <p className="text-sm text-muted-foreground">Upload your CV and job link</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">AI Tailor</h3>
              <p className="text-sm text-muted-foreground">AI matches your CV to the job</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Download</h3>
              <p className="text-sm text-muted-foreground">Get your tailored CV and cover letter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Powered by OpenAI · n8n · Supabase
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="mailto:contact@cvtailor.com" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Simple lightbox modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
             onClick={() => setPreview(undefined)}>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={preview}
              alt="Template preview"
              className="block max-w-[min(92vw,1100px)] max-h-[85vh] w-auto h-auto rounded-2xl shadow-2xl bg-white"
              loading="eager"
            />
            <button
              type="button"
              className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white text-[#FF6B00] shadow-md"
              onClick={() => setPreview(undefined)}
              aria-label="Close"
            >✕</button>
          </div>
        </div>
      )}
      
      {/* Debug Panel - only shows when ?debug=1 is in URL */}
      {isDebugMode && <DebugPanel />}
    </div>
  );
};

export default Index;
