import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import I18N, { Lang } from '../i18n';
import { CVData, CLData, AiResponse } from '../types';
import CVEditor from '../components/CVEditor';
import CLEditor from '../components/CLEditor';
import { renderCV, renderCL } from '../renderers';
import { downloadHTML } from '../utils/download';

const Index = () => {
  const [lang, setLang] = useState<Lang>('en');
  const [selectedTemplate, setSelectedTemplate] = useState<'classic'|'modern'|'classic_alternative'>('modern');
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
  
  const t = useMemo(() => I18N[lang], [lang]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate processing - in real implementation this would submit to n8n webhook
    setTimeout(() => {
      setIsSubmitting(false);
      // Mock results for demonstration
      const mockResponse: AiResponse = {
        score: 85,
        cv_url: '#',
        cover_letter_url: '#',
        tips: [
          'Add more relevant keywords from the job description',
          'Quantify your achievements with specific numbers',
          'Include a professional summary at the top'
        ],
        cv_data: wantCV ? {
          name: 'John Doe',
          target_role: 'Software Developer',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          website: 'johndoe.dev',
          summary: 'Experienced software developer with 5+ years in full-stack development.',
          skills_csv: 'JavaScript, React, Node.js, TypeScript',
          tools_csv: 'VS Code, Git, Docker, AWS',
          exp1_company: 'Tech Corp',
          exp1_title: 'Senior Developer',
          exp1_dates: '2020 - Present',
          exp1_bullets: '• Built scalable web applications\n• Led team of 4 developers\n• Increased performance by 40%',
          exp2_company: 'StartupXYZ',
          exp2_title: 'Full Stack Developer',
          exp2_dates: '2018 - 2020',
          exp2_bullets: '• Developed MVP from scratch\n• Implemented CI/CD pipelines',
          edu1_school: 'University of Technology',
          edu1_degree: 'B.S. Computer Science',
          edu1_dates: '2014 - 2018',
          edu1_details: 'Magna Cum Laude, 3.8 GPA',
          edu2_school: '',
          edu2_degree: '',
          edu2_dates: '',
          edu2_details: ''
        } : undefined,
        cl_data: wantCL ? {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1 234 567 8900',
          company: 'Target Company',
          cover_intro: 'I am writing to express my strong interest in the Software Developer position.',
          cover_body: 'With over 5 years of experience in full-stack development, I have successfully built and deployed scalable web applications. My expertise in React, Node.js, and cloud technologies makes me an ideal candidate for this role.',
          cover_closing: 'I look forward to discussing how my skills can contribute to your team.',
          target_role: 'Software Developer',
          website: 'johndoe.dev'
        } : undefined
      };
      
      setResults(mockResponse);
      setAi(mockResponse);
      
      if (wantCV && mockResponse.cv_data) {
        setCvEdit(prev => ({ ...(prev || {} as any), ...mockResponse.cv_data } as CVData));
      }
      if (wantCL && mockResponse.cl_data) {
        setClEdit(prev => ({ ...(prev || {} as any), ...mockResponse.cl_data } as CLData));
      }
      setActiveEditor(wantCV ? 'cv' : (wantCL ? 'cl' : null));
      
      toast({
        description: "We also sent the files to your email."
      });
      
      setTimeout(() => {
        document.querySelector('#editor')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 3000);
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { key: 'classic', title: t.classic, img: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic/preview.png' },
            { key: 'modern', title: t.modern, img: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/modern/preview.png' },
            { key: 'classic_alternative', title: t.classic_alt, img: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic_alternative/preview.png' }
          ].map(tp => (
            <label key={tp.key} className="group cursor-pointer">
              <div className="rounded-2xl border border-gray-200 shadow-sm p-5 bg-white">
                <div className="relative w-full h-72 rounded-xl overflow-hidden bg-white mb-4">
                  <img src={tp.img} alt={tp.title}
                       className="absolute inset-0 w-full h-full object-contain" />
                </div>
                 <div className="flex items-center justify-between">
                   <div className="text-lg font-semibold">{tp.title}</div>
                   <input type="radio" name="template" value={tp.key}
                          defaultChecked={tp.key === 'modern'}
                          onChange={() => setSelectedTemplate(tp.key as 'classic'|'modern'|'classic_alternative')}
                          className="h-5 w-5 accent-[#FF6B00]" />
                 </div>
                <button type="button"
                        onClick={() => setPreview(tp.img)}
                        className="mt-3 text-sm font-medium text-[#FF6B00] hover:underline">
                  Preview
                </button>
              </div>
            </label>
          ))}
        </div>
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
                <span>{results.score}%</span>
              </div>
              <Progress value={results.score} className="w-full h-3" />
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Button asChild className="hover-scale">
                <a href={results.cv_url} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </a>
              </Button>
              
              <Button variant="outline" asChild className="hover-scale">
                <a href={results.cover_letter_url} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download Cover Letter
                </a>
              </Button>
            </div>

            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">
                {t.topfixes_title}
              </h3>
              <ul className="space-y-2">
                {results.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
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
              {ai?.cv_url && (
                <a
                  className="rounded-xl bg-[#FF6B00] text-white px-4 py-2"
                  href={ai.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download CV
                </a>
              )}
              {ai?.cover_letter_url && (
                <a
                  className="rounded-xl bg-[#FF6B00] text-white px-4 py-2"
                  href={ai.cover_letter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Cover Letter
                </a>
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
                onClick={() => console.log('TODO: send via backend', sendEmail)}
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
    </div>
  );
};

export default Index;
