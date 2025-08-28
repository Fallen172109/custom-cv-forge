export type CVData = {
  name: string;
  target_role: string;
  email: string;
  phone: string;
  website: string;
  summary: string;
  skills_csv: string;
  tools_csv: string;
  exp1_company: string;
  exp1_title: string;
  exp1_dates: string;
  exp1_bullets: string;
  exp2_company: string;
  exp2_title: string;
  exp2_dates: string;
  exp2_bullets: string;
  edu1_school: string;
  edu1_degree: string;
  edu1_dates: string;
  edu1_details: string;
  edu2_school: string;
  edu2_degree: string;
  edu2_dates: string;
  edu2_details: string;
  headshot_url?: string;
};

export type CLData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  cover_intro: string;
  cover_body: string;
  cover_closing: string;
  target_role: string;
  website?: string;
};

export type AiResponse = {
  score?: number;
  tips?: string[];
  notes?: string;
  cv_html?: string;
  cv_url?: string;
  cl_html?: string;
  cover_letter_url?: string;
  cv_data?: Partial<CVData>;
  cl_data?: Partial<CLData>;
  email_sent?: boolean;
};