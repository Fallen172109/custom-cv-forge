const BASE = 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates';
const CACHE: Record<string, {CV?:string; CL?:string; CSS?:string}> = {};

async function loadParts(template: string){
  if (!CACHE[template]?.CSS){
    const [css] = await Promise.all([
      fetch(`${BASE}/${template}/styles.css`).then(r=>r.text()),
    ]);
    CACHE[template] = {...(CACHE[template]||{}), CSS: css};
  }
}

async function loadHtml(template: string, type: 'CV'|'CL'){
  await loadParts(template);
  if (!CACHE[template]?.[type]){
    const html = await fetch(`${BASE}/${template}/${type}.html`).then(r=>r.text());
    // strip any <link ...styles.css...> and inline CSS
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