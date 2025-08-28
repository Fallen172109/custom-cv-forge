import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, Download, Mail, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);

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
      setResults({
        score: 85,
        cv_url: '#',
        cover_letter_url: '#',
        tips: [
          'Add more relevant keywords from the job description',
          'Quantify your achievements with specific numbers',
          'Include a professional summary at the top'
        ]
      });
      toast({
        description: "We also sent the files to your email."
      });
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
              <span data-i18n="hero_cta">Generate now</span>
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">EN</span>
              <Switch id="langToggle" className="data-[state=checked]:bg-primary" />
              <span className="text-sm font-medium">PL</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 fade-in" data-i18n="hero_h1">
            Tailor your CV to any job in 60 seconds
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto fade-in" data-i18n="hero_sub">
            Upload your CV + paste a LinkedIn job link. Get a matching PDF, a match score, and a ready cover letter.
          </p>
          <Button size="lg" onClick={() => scrollToSection('form')} className="mb-12 hover-scale">
            <span data-i18n="hero_cta">Generate now</span>
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
      <section id="templates" className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12" data-i18n="templates_title">
            Templates
          </h2>
          
          <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate} className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Label htmlFor="classic" className="template-card">
              <RadioGroupItem value="classic" id="classic" className="sr-only" />
              <div className={`template-card ${selectedTemplate === 'classic' ? 'selected' : ''}`}>
                <img 
                  src="https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic/preview.png"
                  alt="Classic Template"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-heading font-semibold text-lg" data-i18n="card_classic_title">Classic</h3>
              </div>
            </Label>

            <Label htmlFor="modern" className="template-card">
              <RadioGroupItem value="modern" id="modern" className="sr-only" />
              <div className={`template-card ${selectedTemplate === 'modern' ? 'selected' : ''}`}>
                <img 
                  src="https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/modern/preview.png"
                  alt="Modern Template"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-heading font-semibold text-lg" data-i18n="card_modern_title">Modern</h3>
              </div>
            </Label>

            <Label htmlFor="compact" className="template-card">
              <RadioGroupItem value="compact" id="compact" className="sr-only" />
              <div className={`template-card ${selectedTemplate === 'compact' ? 'selected' : ''}`}>
                <img 
                  src="https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/modern/preview.png"
                  alt="Compact Template"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-heading font-semibold text-lg" data-i18n="card_compact_title">Compact</h3>
              </div>
            </Label>
          </RadioGroup>
        </div>
      </section>

      {/* Form Section */}
      <section id="form" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <form onSubmit={handleSubmit} method="POST" encType="multipart/form-data" className="space-y-8">
            <input type="hidden" name="site_origin" value={typeof window !== 'undefined' ? window.location.href : ''} />
            <input type="hidden" name="template" value={selectedTemplate} />
            
            <div className="space-y-2">
              <Label htmlFor="cv_file" data-i18n="label_cvfile">Upload your CV (PDF/DOCX)</Label>
              <Input 
                id="cv_file"
                name="cv_file"
                type="file"
                accept=".pdf,.doc,.docx"
                required
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_url" data-i18n="label_joburl">LinkedIn job link (or paste job text)</Label>
              <Input 
                id="job_url"
                name="job_url"
                type="url"
                placeholder="Paste LinkedIn job link"
                data-i18n-placeholder="ph_joburl"
                className="h-12"
              />
            </div>

            <div className="space-y-6 p-6 bg-secondary/50 rounded-2xl">
              <div className="flex items-center justify-between">
                <Label htmlFor="make_cv" className="text-sm font-medium" data-i18n="opt_makecv">Generate CV</Label>
                <Switch id="make_cv" name="make_cv" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="score_cv" className="text-sm font-medium" data-i18n="opt_score">Score my CV</Label>
                <Switch id="score_cv" name="score_cv" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="cover_letter" className="text-sm font-medium" data-i18n="opt_cover">Cover letter</Label>
                <Switch id="cover_letter" name="cover_letter" defaultChecked />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" data-i18n="label_email">Email for the files</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                required
                className="h-12"
              />
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full hover-scale"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span data-i18n="loading">Generating… (20–60s)</span>
              ) : (
                <span data-i18n="btn_generate">Generate</span>
              )}
            </Button>
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
                    <span data-i18n="btn_download_cv">Download CV</span>
                  </a>
                </Button>
                
                <Button variant="outline" asChild className="hover-scale">
                  <a href={results.cover_letter_url} download>
                    <Download className="mr-2 h-4 w-4" />
                    <span data-i18n="btn_download_cl">Download Cover Letter</span>
                  </a>
                </Button>
              </div>

              <div>
                <h3 className="font-heading font-semibold text-lg mb-4" data-i18n="topfixes_title">
                  Top 3 fixes
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
        </div>
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
          <p className="text-sm text-muted-foreground mb-4" data-i18n="footer_powered">
            Powered by OpenAI · n8n · Supabase
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="mailto:contact@cvtailor.com" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Internationalization Script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          const i18n = {
            en: {
              hero_h1: "Tailor your CV to any job in 60 seconds",
              hero_sub: "Upload your CV + paste a LinkedIn job link. Get a matching PDF, a match score, and a ready cover letter.",
              hero_cta: "Generate now",
              templates_title: "Templates",
              card_classic_title: "Classic",
              card_modern_title: "Modern",
              card_compact_title: "Compact",
              label_cvfile: "Upload your CV (PDF/DOCX)",
              label_joburl: "LinkedIn job link (or paste job text)",
              ph_joburl: "Paste LinkedIn job link",
              opt_makecv: "Generate CV",
              opt_score: "Score my CV",
              opt_cover: "Cover letter",
              label_email: "Email for the files",
              btn_generate: "Generate",
              loading: "Generating… (20–60s)",
              btn_download_cv: "Download CV",
              btn_download_cl: "Download Cover Letter",
              topfixes_title: "Top 3 fixes",
              toast_sent: "We also sent the files to your email.",
              footer_powered: "Powered by OpenAI · n8n · Supabase"
            },
            pl: {
              hero_h1: "Dopasuj CV do każdej oferty w 60 sekund",
              hero_sub: "Prześlij CV + wklej link z LinkedIn. Otrzymasz dopasowany PDF, wynik dopasowania i gotowy list motywacyjny.",
              hero_cta: "Generuj teraz",
              templates_title: "Szablony",
              card_classic_title: "Klasyczny",
              card_modern_title: "Nowoczesny",
              card_compact_title: "Kompaktowy",
              label_cvfile: "Prześlij CV (PDF/DOCX)",
              label_joburl: "Link do oferty na LinkedIn (lub wklej treść ogłoszenia)",
              ph_joburl: "Wklej link do oferty",
              opt_makecv: "Generuj CV",
              opt_score: "Oceń moje CV",
              opt_cover: "List motywacyjny",
              label_email: "E-mail do wysyłki plików",
              btn_generate: "Generuj",
              loading: "Trwa generowanie… (20–60 s)",
              btn_download_cv: "Pobierz CV",
              btn_download_cl: "Pobierz list",
              topfixes_title: "Top 3 poprawki",
              toast_sent: "Wysłaliśmy też pliki na e-mail.",
              footer_powered: "Zasilane przez OpenAI · n8n · Supabase"
            }
          };
          
          function applyLang(lang) {
            document.querySelectorAll("[data-i18n]").forEach(el => {
              const key = el.getAttribute("data-i18n");
              const txt = i18n[lang][key];
              if (!txt) return;
              if (el.placeholder !== undefined && el.tagName === "INPUT") {
                el.placeholder = txt;
              } else {
                el.textContent = txt;
              }
            });
          }
          
          document.addEventListener("DOMContentLoaded", () => {
            const tgl = document.getElementById("langToggle");
            applyLang("en");
            if (tgl) {
              tgl.addEventListener("change", () => applyLang(tgl.checked ? "pl" : "en"));
            }
          });
        `
      }} />
    </div>
  );
};

export default Index;
