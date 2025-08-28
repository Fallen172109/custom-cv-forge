import HTMLPreview from './HTMLPreview';
import { CLData } from '../types';
import { renderCL } from '../renderers';

export default function CLEditor({
  data,
  onChange,
  template
}: {
  data: CLData;
  onChange: (v: CLData) => void;
  template: string;
}) {
  const update = (k: keyof CLData) => (e: any) => onChange({ ...data, [k]: e.target.value });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-xl p-3"
            placeholder="Your name"
            value={data.name || ''}
            onChange={update('name')}
          />
          <input
            className="border rounded-xl p-3"
            placeholder="Target role"
            value={data.target_role || ''}
            onChange={update('target_role')}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input
            className="border rounded-xl p-3"
            placeholder="Email"
            value={data.email || ''}
            onChange={update('email')}
          />
          <input
            className="border rounded-xl p-3"
            placeholder="Phone"
            value={data.phone || ''}
            onChange={update('phone')}
          />
          <input
            className="border rounded-xl p-3"
            placeholder="Website"
            value={data.website || ''}
            onChange={update('website')}
          />
        </div>
        <input
          className="border rounded-xl p-3"
          placeholder="Company"
          value={data.company || ''}
          onChange={update('company')}
        />
        <textarea
          className="border rounded-xl p-3"
          rows={4}
          placeholder="Intro"
          value={data.cover_intro || ''}
          onChange={update('cover_intro')}
        />
        <textarea
          className="border rounded-xl p-3"
          rows={6}
          placeholder="Body"
          value={data.cover_body || ''}
          onChange={update('cover_body')}
        />
        <textarea
          className="border rounded-xl p-3"
          rows={3}
          placeholder="Closing"
          value={data.cover_closing || ''}
          onChange={update('cover_closing')}
        />
      </div>
      <div>
        <HTMLPreview html={renderCL(data, template)} />
      </div>
    </div>
  );
}