import { supabase } from '@/integrations/supabase/client';
import { CVData, CLData } from '@/types';

export class DatabaseService {
  // Helper method to get current user
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Session Management with user authentication support
  // Session Management with optional authentication
  static async createSession(email?: string) {
    const user = await this.getCurrentUser();
    const insertData: any = { email };
    
    // Associate session with authenticated user if available
    if (user) {
      insertData.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('cv_sessions')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getSession(sessionId: string) {
    const { data, error } = await supabase
      .from('cv_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateSession(sessionId: string, updates: any) {
    const { data, error } = await supabase
      .from('cv_sessions')
      .update(updates)
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // CV Data Operations
  static async saveCVData(cvData: CVData, sessionId: string) {
    const user = await this.getCurrentUser();
    const insertData: any = {
      session_id: sessionId,
      name: cvData.name,
      target_role: cvData.target_role,
      email: cvData.email,
      phone: cvData.phone,
      website: cvData.website,
      summary: cvData.summary,
      skills_csv: cvData.skills_csv,
      tools_csv: cvData.tools_csv,
      exp1_company: cvData.exp1_company,
      exp1_title: cvData.exp1_title,
      exp1_dates: cvData.exp1_dates,
      exp1_bullets: cvData.exp1_bullets,
      exp2_company: cvData.exp2_company,
      exp2_title: cvData.exp2_title,
      exp2_dates: cvData.exp2_dates,
      exp2_bullets: cvData.exp2_bullets,
      edu1_school: cvData.edu1_school,
      edu1_degree: cvData.edu1_degree,
      edu1_dates: cvData.edu1_dates,
      edu1_details: cvData.edu1_details,
      edu2_school: cvData.edu2_school,
      edu2_degree: cvData.edu2_degree,
      edu2_dates: cvData.edu2_dates,
      edu2_details: cvData.edu2_details,
      headshot_url: cvData.headshot_url,
    };

    // Associate CV data with authenticated user if available
    if (user) {
      insertData.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('cv_data')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCVData(sessionId: string) {
    const { data, error } = await supabase
      .from('cv_data')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateCVData(cvDataId: string, updates: Partial<CVData>) {
    const { data, error } = await supabase
      .from('cv_data')
      .update(updates)
      .eq('id', cvDataId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Cover Letter Data Operations
  static async saveCLData(clData: CLData, sessionId: string) {
    const user = await this.getCurrentUser();
    const insertData: any = {
      session_id: sessionId,
      name: clData.name,
      email: clData.email,
      phone: clData.phone,
      company: clData.company,
      cover_intro: clData.cover_intro,
      cover_body: clData.cover_body,
      cover_closing: clData.cover_closing,
      target_role: clData.target_role,
      website: clData.website,
    };

    // Associate cover letter data with authenticated user if available
    if (user) {
      insertData.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('cover_letter_data')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getCLData(sessionId: string) {
    const { data, error } = await supabase
      .from('cover_letter_data')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // File Storage Operations
  static async uploadCVFile(file: File, sessionId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${sessionId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('cv-files')
      .upload(fileName, file);

    if (error) throw error;
    return data;
  }

  static async getCVFileUrl(filePath: string) {
    const { data } = supabase.storage
      .from('cv-files')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  static async uploadGeneratedFile(content: string, fileName: string, sessionId: string, type: 'html' | 'pdf' = 'html') {
    const fullFileName = `${sessionId}/${fileName}`;
    const blob = new Blob([content], {
      type: type === 'html' ? 'text/html' : 'application/pdf'
    });

    const { data, error } = await supabase.storage
      .from('generated-files')
      .upload(fullFileName, blob);

    if (error) throw error;
    return data;
  }

  // Template Operations
  static async getActiveTemplates() {
    const { data, error } = await supabase
      .from('cv_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  }

  static async getTemplate(slug: string) {
    const { data, error } = await supabase
      .from('cv_templates')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data;
  }

  // Utility function to convert database CV data to CVData type
  static convertDbCVDataToCVData(dbData: any): CVData {
    return {
      name: dbData.name || '',
      target_role: dbData.target_role || '',
      email: dbData.email || '',
      phone: dbData.phone || '',
      website: dbData.website || '',
      summary: dbData.summary || '',
      skills_csv: dbData.skills_csv || '',
      tools_csv: dbData.tools_csv || '',
      exp1_company: dbData.exp1_company || '',
      exp1_title: dbData.exp1_title || '',
      exp1_dates: dbData.exp1_dates || '',
      exp1_bullets: dbData.exp1_bullets || '',
      exp2_company: dbData.exp2_company || '',
      exp2_title: dbData.exp2_title || '',
      exp2_dates: dbData.exp2_dates || '',
      exp2_bullets: dbData.exp2_bullets || '',
      edu1_school: dbData.edu1_school || '',
      edu1_degree: dbData.edu1_degree || '',
      edu1_dates: dbData.edu1_dates || '',
      edu1_details: dbData.edu1_details || '',
      edu2_school: dbData.edu2_school || '',
      edu2_degree: dbData.edu2_degree || '',
      edu2_dates: dbData.edu2_dates || '',
      edu2_details: dbData.edu2_details || '',
      headshot_url: dbData.headshot_url || undefined,
    };
  }

  // Utility function to convert database CL data to CLData type
  static convertDbCLDataToCLData(dbData: any): CLData {
    return {
      name: dbData.name || '',
      email: dbData.email || '',
      phone: dbData.phone || '',
      company: dbData.company || '',
      cover_intro: dbData.cover_intro || '',
      cover_body: dbData.cover_body || '',
      cover_closing: dbData.cover_closing || '',
      target_role: dbData.target_role || '',
      website: dbData.website || undefined,
    };
  }
}
