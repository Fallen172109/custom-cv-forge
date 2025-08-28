import HTMLPreview from './HTMLPreview';
import { CVData } from '../types';
import { renderCV } from '../renderers';

export default function CVEditor({
  data,
  onChange,
  template
}: {
  data: CVData;
  onChange: (v: CVData) => void;
  template: string;
}) {
  const update = (k: keyof CVData) => (e: any) => onChange({ ...data, [k]: e.target.value });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-xl p-3"
            placeholder="Name"
            value={data.name || ''}
            onChange={update('name')}
          />
          <input
            className="border rounded-xl p-3"
            placeholder="Role"
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
        <textarea
          className="border rounded-xl p-3"
          rows={4}
          placeholder="Summary"
          value={data.summary || ''}
          onChange={update('summary')}
        />
        <input
          className="border rounded-xl p-3"
          placeholder="Skills (comma separated)"
          value={data.skills_csv || ''}
          onChange={update('skills_csv')}
        />
        <input
          className="border rounded-xl p-3"
          placeholder="Tools (comma separated)"
          value={data.tools_csv || ''}
          onChange={update('tools_csv')}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-xl p-3"
            placeholder="Exp1 Company"
            value={data.exp1_company || ''}
            onChange={update('exp1_company')}
          />
          <input
            className="border rounded-xl p-3"
            placeholder="Exp1 Title"
            value={data.exp1_title || ''}
            onChange={update('exp1_title')}
          />
        </div>
        <input
          className="border rounded-xl p-3"
          placeholder="Exp1 Dates"
          value={data.exp1_dates || ''}
          onChange={update('exp1_dates')}
        />
        <textarea
          className="border rounded-xl p-3"
          rows={3}
          placeholder="Exp1 Bullets"
          value={data.exp1_bullets || ''}
          onChange={update('exp1_bullets')}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-xl p-3"
            placeholder="Exp2 Company"
            value={data.exp2_company || ''}
            onChange={update('exp2_company')}
          />
          <input
            className="border rounded-xl p-3"
            placeholder="Exp2 Title"
            value={data.exp2_title || ''}
            onChange={update('exp2_title')}
          />
        </div>
        <input
          className="border rounded-xl p-3"
          placeholder="Exp2 Dates"
          value={data.exp2_dates || ''}
          onChange={update('exp2_dates')}
        />
        <textarea
          className="border rounded-xl p-3"
          rows={3}
          placeholder="Exp2 Bullets"
          value={data.exp2_bullets || ''}
          onChange={update('exp2_bullets')}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            className="border rounded-xl p-3"
            placeholder="Edu1 School"
            value={data.edu1_school || ''}
            onChange={update('edu1_school')}
          />
          <input
            className="border rounded-xl p-3"
            placeholder="Edu1 Degree"
            value={data.edu1_degree || ''}
            onChange={update('edu1_degree')}
          />
        </div>
        <input
          className="border rounded-xl p-3"
          placeholder="Edu1 Dates"
          value={data.edu1_dates || ''}
          onChange={update('edu1_dates')}
        />
        <textarea
          className="border rounded-xl p-3"
          rows={2}
          placeholder="Edu1 Details"
          value={data.edu1_details || ''}
          onChange={update('edu1_details')}
        />
      </div>

      <div>
        <HTMLPreview html={renderCV(data, template)} />
      </div>
    </div>
  );
}