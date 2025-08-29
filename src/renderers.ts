import { DatabaseService } from '@/services/database';

const BASE = 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates';
const CACHE: Record<string, {CV?:string; CL?:string; CSS?:string; template?: any}> = {};

async function loadTemplate(templateSlug: string) {
  if (!CACHE[templateSlug]?.template) {
    try {
      const template = await DatabaseService.getTemplate(templateSlug);
      CACHE[templateSlug] = {...(CACHE[templateSlug]||{}), template};
      return template;
    } catch (error) {
      console.warn(`Template ${templateSlug} not found in database, falling back to file system`);
      return null;
    }
  }
  return CACHE[templateSlug].template;
}

async function loadParts(template: string){
  if (!CACHE[template]?.CSS){
    // Try to load from database first
    const dbTemplate = await loadTemplate(template);

    if (dbTemplate?.css_styles) {
      CACHE[template] = {...(CACHE[template]||{}), CSS: dbTemplate.css_styles};
    } else {
      // Fallback to file system
      try {
        const css = await fetch(`${BASE}/${template}/styles.css`).then(r=>r.text());
        CACHE[template] = {...(CACHE[template]||{}), CSS: css};
      } catch (error) {
        console.error(`Failed to load CSS for template ${template}:`, error);
        CACHE[template] = {...(CACHE[template]||{}), CSS: ''};
      }
    }
  }
}

async function loadHtml(template: string, type: 'CV'|'CL'){
  await loadParts(template);

  if (!CACHE[template]?.[type]){
    // Try to load from database first
    const dbTemplate = await loadTemplate(template);
    let html = '';

    if (type === 'CV' && dbTemplate?.cv_html_template) {
      html = dbTemplate.cv_html_template;
    } else if (type === 'CL' && dbTemplate?.cl_html_template) {
      html = dbTemplate.cl_html_template;
    } else {
      // Fallback to file system
      try {
        html = await fetch(`${BASE}/${template}/${type}.html`).then(r=>r.text());
      } catch (error) {
        console.error(`Failed to load ${type} template for ${template}:`, error);
        html = `<html><head><title>${type} Template</title></head><body><p>Template not found</p></body></html>`;
      }
    }

    // Strip any <link ...styles.css...> and inline CSS
    const withoutLink = html.replace(/<link[^>]*styles\.css[^>]*>/i, '');
    const inlined = withoutLink.replace('</head>', `<style>${CACHE[template]!.CSS}</style></head>`);
    CACHE[template] = {...(CACHE[template]||{}), [type]: inlined};
  }
  return CACHE[template]![type]!;
}

function replaceAll(html:string, data:Record<string, any>){
  return html.replace(/{{\s*([\w_]+)\s*}}/g, (_, k) => {
    const v = data?.[k];
    return v == null ? '' : String(v);
  });
}

export async function renderCV(data:any, template:string){
  const html = await loadHtml(template, 'CV');
  return replaceAll(html, data||{});
}

export async function renderCL(data:any, template:string){
  const html = await loadHtml(template, 'CL');
  return replaceAll(html, data||{});
}