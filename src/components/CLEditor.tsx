import { useEffect, useState } from 'react';
import HTMLPreview from './HTMLPreview';
import { renderCL } from '../renderers';
import { CLData } from '../types';

export default function CLEditor({data,onChange,template}:{data:CLData;onChange:(v:CLData)=>void;template:string}){
  const update = (k:keyof CLData)=> (e:any)=> onChange({...data,[k]:e.target.value});
  const [html,setHtml] = useState('<div class="p-6 text-gray-500">Loading template...</div>');

  useEffect(()=>{
    let ok = true;
    renderCL(data, template).then(h=> ok && setHtml(h));
    return ()=>{ ok = false; };
  }, [data, template]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="field"><label className="label">Your name</label><input className="input" value={data.name||''} onChange={update('name')} /></div>
          <div className="field"><label className="label">Target role</label><input className="input" value={data.target_role||''} onChange={update('target_role')} /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="field"><label className="label">Email</label><input className="input" value={data.email||''} onChange={update('email')} /></div>
          <div className="field"><label className="label">Phone</label><input className="input" value={data.phone||''} onChange={update('phone')} /></div>
          <div className="field"><label className="label">Website</label><input className="input" value={data.website||''} onChange={update('website')} /></div>
        </div>
        <div className="field"><label className="label">Company</label><input className="input" value={data.company||''} onChange={update('company')} /></div>
        <div className="field"><label className="label">Intro</label><textarea rows={4} className="textarea" value={data.cover_intro||''} onChange={update('cover_intro')} /></div>
        <div className="field"><label className="label">Body</label><textarea rows={6} className="textarea" value={data.cover_body||''} onChange={update('cover_body')} /></div>
        <div className="field"><label className="label">Closing</label><textarea rows={3} className="textarea" value={data.cover_closing||''} onChange={update('cover_closing')} /></div>
      </div>
      <div><HTMLPreview html={html} /></div>
    </div>
  );
}