import { CVData, CLData } from './types';

// Global template cache
declare global {
  interface Window {
    TEMPLATE_CACHE?: {
      [template: string]: {
        cv_html?: string;
        cl_html?: string;
        styles?: string;
      };
    };
  }
}

// Initialize cache if not exists
if (typeof window !== 'undefined' && !window.TEMPLATE_CACHE) {
  window.TEMPLATE_CACHE = {};
}

async function loadTemplate(template: string) {
  if (typeof window === 'undefined') return;
  
  if (!window.TEMPLATE_CACHE![template]) {
    window.TEMPLATE_CACHE![template] = {};
  }

  const cache = window.TEMPLATE_CACHE![template];
  const baseUrl = `https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/${template}`;

  try {
    // Load CV template if not cached
    if (!cache.cv_html) {
      const cvResponse = await fetch(`${baseUrl}/CV.html`);
      if (cvResponse.ok) {
        cache.cv_html = await cvResponse.text();
      }
    }

    // Load CL template if not cached
    if (!cache.cl_html) {
      const clResponse = await fetch(`${baseUrl}/CL.html`);
      if (clResponse.ok) {
        cache.cl_html = await clResponse.text();
      }
    }

    // Load styles if not cached
    if (!cache.styles) {
      const stylesResponse = await fetch(`${baseUrl}/styles.css`);
      if (stylesResponse.ok) {
        cache.styles = await stylesResponse.text();
      }
    }
  } catch (error) {
    console.warn('Failed to load template:', template, error);
  }
}

function replacePlaceholders(html: string, data: any): string {
  return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] || '';
  });
}

export function renderCV(data: CVData, template: string): string {
  if (typeof window === 'undefined') return '<p>Loading...</p>';

  // Load template if not cached
  loadTemplate(template);

  const cache = window.TEMPLATE_CACHE?.[template];
  if (!cache?.cv_html) {
    return '<p>Loading template...</p>';
  }

  let html = replacePlaceholders(cache.cv_html, data);

  // Inject styles
  if (cache.styles) {
    html = html.replace(
      '</head>',
      `<style>${cache.styles}</style></head>`
    );
  }

  return html;
}

export function renderCL(data: CLData, template: string): string {
  if (typeof window === 'undefined') return '<p>Loading...</p>';

  // Load template if not cached
  loadTemplate(template);

  const cache = window.TEMPLATE_CACHE?.[template];
  if (!cache?.cl_html) {
    return '<p>Loading template...</p>';
  }

  let html = replacePlaceholders(cache.cl_html, data);

  // Inject styles
  if (cache.styles) {
    html = html.replace(
      '</head>',
      `<style>${cache.styles}</style></head>`
    );
  }

  return html;
}