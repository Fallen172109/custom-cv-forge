export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      cover_letter_data: {
        Row: {
          company: string | null
          cover_body: string | null
          cover_closing: string | null
          cover_intro: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          session_id: string | null
          target_role: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          company?: string | null
          cover_body?: string | null
          cover_closing?: string | null
          cover_intro?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          session_id?: string | null
          target_role?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          company?: string | null
          cover_body?: string | null
          cover_closing?: string | null
          cover_intro?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          session_id?: string | null
          target_role?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cover_letter_data_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "cv_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_data: {
        Row: {
          created_at: string | null
          edu1_dates: string | null
          edu1_degree: string | null
          edu1_details: string | null
          edu1_school: string | null
          edu2_dates: string | null
          edu2_degree: string | null
          edu2_details: string | null
          edu2_school: string | null
          email: string | null
          exp1_bullets: string | null
          exp1_company: string | null
          exp1_dates: string | null
          exp1_title: string | null
          exp2_bullets: string | null
          exp2_company: string | null
          exp2_dates: string | null
          exp2_title: string | null
          headshot_url: string | null
          id: string
          name: string | null
          phone: string | null
          session_id: string | null
          skills_csv: string | null
          summary: string | null
          target_role: string | null
          tools_csv: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          edu1_dates?: string | null
          edu1_degree?: string | null
          edu1_details?: string | null
          edu1_school?: string | null
          edu2_dates?: string | null
          edu2_degree?: string | null
          edu2_details?: string | null
          edu2_school?: string | null
          email?: string | null
          exp1_bullets?: string | null
          exp1_company?: string | null
          exp1_dates?: string | null
          exp1_title?: string | null
          exp2_bullets?: string | null
          exp2_company?: string | null
          exp2_dates?: string | null
          exp2_title?: string | null
          headshot_url?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          session_id?: string | null
          skills_csv?: string | null
          summary?: string | null
          target_role?: string | null
          tools_csv?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          edu1_dates?: string | null
          edu1_degree?: string | null
          edu1_details?: string | null
          edu1_school?: string | null
          edu2_dates?: string | null
          edu2_degree?: string | null
          edu2_details?: string | null
          edu2_school?: string | null
          email?: string | null
          exp1_bullets?: string | null
          exp1_company?: string | null
          exp1_dates?: string | null
          exp1_title?: string | null
          exp2_bullets?: string | null
          exp2_company?: string | null
          exp2_dates?: string | null
          exp2_title?: string | null
          headshot_url?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          session_id?: string | null
          skills_csv?: string | null
          summary?: string | null
          target_role?: string | null
          tools_csv?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_data_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "cv_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      cv_sessions: {
        Row: {
          ai_notes: string | null
          ai_score: number | null
          company_name: string | null
          cover_letter_pdf_url: string | null
          created_at: string | null
          cv_pdf_url: string | null
          email: string | null
          generated_cl_html: string | null
          generated_cv_html: string | null
          id: string
          job_description: string | null
          job_title: string | null
          job_url: string | null
          original_cv_file_path: string | null
          session_token: string | null
          template_used: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_notes?: string | null
          ai_score?: number | null
          company_name?: string | null
          cover_letter_pdf_url?: string | null
          created_at?: string | null
          cv_pdf_url?: string | null
          email?: string | null
          generated_cl_html?: string | null
          generated_cv_html?: string | null
          id?: string
          job_description?: string | null
          job_title?: string | null
          job_url?: string | null
          original_cv_file_path?: string | null
          session_token?: string | null
          template_used?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_notes?: string | null
          ai_score?: number | null
          company_name?: string | null
          cover_letter_pdf_url?: string | null
          created_at?: string | null
          cv_pdf_url?: string | null
          email?: string | null
          generated_cl_html?: string | null
          generated_cv_html?: string | null
          id?: string
          job_description?: string | null
          job_title?: string | null
          job_url?: string | null
          original_cv_file_path?: string | null
          session_token?: string | null
          template_used?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cv_templates: {
        Row: {
          cl_html_template: string | null
          created_at: string | null
          css_styles: string | null
          cv_html_template: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          preview_image_url: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          cl_html_template?: string | null
          created_at?: string | null
          css_styles?: string | null
          cv_html_template?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          preview_image_url?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          cl_html_template?: string | null
          created_at?: string | null
          css_styles?: string | null
          cv_html_template?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          preview_image_url?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs_history: {
        Row: {
          cover_letter_pdf_url: string | null
          created_at: string | null
          cv_pdf_url: string | null
          email: string | null
          id: string
          job_url: string | null
          score: number | null
          template: string | null
          user_id: string | null
        }
        Insert: {
          cover_letter_pdf_url?: string | null
          created_at?: string | null
          cv_pdf_url?: string | null
          email?: string | null
          id?: string
          job_url?: string | null
          score?: number | null
          template?: string | null
          user_id?: string | null
        }
        Update: {
          cover_letter_pdf_url?: string | null
          created_at?: string | null
          cv_pdf_url?: string | null
          email?: string | null
          id?: string
          job_url?: string | null
          score?: number | null
          template?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
