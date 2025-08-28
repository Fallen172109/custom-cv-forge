export type Lang = 'en' | 'pl';

const I18N: Record<Lang, Record<string,string>> = {
  en:{
    hero_h1:"Tailor your CV to any job in 60 seconds",
    hero_sub:"Upload your CV + paste a LinkedIn job link. Get a matching PDF, a match score, and a ready cover letter.",
    hero_cta:"Generate now",
    templates_title:"Templates",
    classic:"Classic",
    modern:"Modern",
    classic_alt:"Classic Alt",
    label_cvfile:"Upload your CV (PDF/DOCX)",
    label_joburl:"LinkedIn job link (or paste job text)",
    ph_joburl:"Paste LinkedIn job link",
    opt_makecv:"Generate CV",
    opt_score:"Score my CV",
    opt_cover:"Cover letter",
    label_email:"Email for the files",
    btn_generate:"Generate",
    topfixes_title:"Top 3 fixes"
  },
  pl:{
    hero_h1:"Dopasuj CV do każdej oferty w 60 sekund",
    hero_sub:"Prześlij CV + wklej link z LinkedIn. Otrzymasz dopasowany PDF, wynik dopasowania i gotowy list motywacyjny.",
    hero_cta:"Generuj teraz",
    templates_title:"Szablony",
    classic:"Klasyczny",
    modern:"Nowoczesny",
    classic_alt:"Klasyczny (alternatywa)",
    label_cvfile:"Prześlij CV (PDF/DOCX)",
    label_joburl:"Link do oferty na LinkedIn (lub wklej treść ogłoszenia)",
    ph_joburl:"Wklej link do oferty",
    opt_makecv:"Generuj CV",
    opt_score:"Oceń moje CV",
    opt_cover:"List motywacyjny",
    label_email:"E-mail do wysyłki plików",
    btn_generate:"Generuj",
    topfixes_title:"3 najważniejsze poprawki"
  }
};

export default I18N;