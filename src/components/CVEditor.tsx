import { useEffect, useState } from 'react';
import HTMLPreview from './HTMLPreview';
import { renderCV } from '../renderers';
import { CVData } from '../types';

export default function CVEditor({data,onChange,template}:{data:CVData;onChange:(v:CVData)=>void;template:string}){
  const update = (k:keyof CVData)=> (e:any)=> onChange({...data,[k]:e.target.value});
  const [html,setHtml] = useState('<div class="p-6 text-gray-500">Loading template...</div>');

  useEffect(()=>{
    let ok = true;
    renderCV(data, template).then(h=> ok && setHtml(h));
    return ()=>{ ok = false; };
  }, [data, template]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Name</label><input className="input" value={data.name||''} onChange={update('name')} /></div>
          <div className="field"><label className="label">Role</label><input className="input" value={data.target_role||''} onChange={update('target_role')} /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="field"><label className="label">Email</label><input className="input" value={data.email||''} onChange={update('email')} /></div>
          <div className="field"><label className="label">Phone</label><input className="input" value={data.phone||''} onChange={update('phone')} /></div>
          <div className="field"><label className="label">Website</label><input className="input" value={data.website||''} onChange={update('website')} /></div>
        </div>
        <div className="field"><label className="label">Summary</label><textarea rows={4} className="textarea" value={data.summary||''} onChange={update('summary')} /></div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Skills (CSV)</label><input className="input" value={data.skills_csv||''} onChange={update('skills_csv')} /></div>
          <div className="field"><label className="label">Tools (CSV)</label><input className="input" value={data.tools_csv||''} onChange={update('tools_csv')} /></div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Exp1 Company</label><input className="input" value={data.exp1_company||''} onChange={update('exp1_company')} /></div>
          <div className="field"><label className="label">Exp1 Title</label><input className="input" value={data.exp1_title||''} onChange={update('exp1_title')} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Exp1 Dates</label><input className="input" value={data.exp1_dates||''} onChange={update('exp1_dates')} /></div>
          <div className="field"><label className="label">Exp1 Bullets</label><textarea rows={3} className="textarea" value={data.exp1_bullets||''} onChange={update('exp1_bullets')} /></div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Exp2 Company</label><input className="input" value={data.exp2_company||''} onChange={update('exp2_company')} /></div>
          <div className="field"><label className="label">Exp2 Title</label><input className="input" value={data.exp2_title||''} onChange={update('exp2_title')} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Exp2 Dates</label><input className="input" value={data.exp2_dates||''} onChange={update('exp2_dates')} /></div>
          <div className="field"><label className="label">Exp2 Bullets</label><textarea rows={3} className="textarea" value={data.exp2_bullets||''} onChange={update('exp2_bullets')} /></div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Edu1 School</label><input className="input" value={data.edu1_school||''} onChange={update('edu1_school')} /></div>
          <div className="field"><label className="label">Edu1 Degree</label><input className="input" value={data.edu1_degree||''} onChange={update('edu1_degree')} /></div>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Edu1 Dates</label><input className="input" value={data.edu1_dates||''} onChange={update('edu1_dates')} /></div>
          <div className="field"><label className="label">Edu1 Details</label><textarea rows={2} className="textarea" value={data.edu1_details||''} onChange={update('edu1_details')} /></div>
        </div>
      </div>

      <div><HTMLPreview html={html} /></div>
    </div>
  );
}