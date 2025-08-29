import { DatabaseService } from '@/services/database';

export interface TemplateInfo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  preview_image_url: string | null;
  is_active: boolean;
}

export class TemplateManager {
  private static templateCache: TemplateInfo[] | null = null;

  /**
   * Get all active templates from the database
   */
  static async getActiveTemplates(): Promise<TemplateInfo[]> {
    if (!this.templateCache) {
      try {
        const templates = await DatabaseService.getActiveTemplates();
        this.templateCache = templates;
      } catch (error) {
        console.error('Error loading templates from database:', error);
        // Fallback to hardcoded templates
        this.templateCache = [
          {
            id: 'classic',
            name: 'Classic',
            slug: 'classic',
            description: 'Traditional professional CV template',
            preview_image_url: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic/preview.png',
            is_active: true,
          },
          {
            id: 'modern',
            name: 'Modern',
            slug: 'modern',
            description: 'Contemporary CV template with modern design',
            preview_image_url: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/modern/preview.png',
            is_active: true,
          },
          {
            id: 'classic_alternative',
            name: 'Classic Alternative',
            slug: 'classic_alternative',
            description: 'Alternative classic design with enhanced layout',
            preview_image_url: 'https://thipxofcylqownijfybq.supabase.co/storage/v1/object/public/templates/classic_alternative/preview.png',
            is_active: true,
          },
        ];
      }
    }
    return this.templateCache;
  }

  /**
   * Get a specific template by slug
   */
  static async getTemplate(slug: string): Promise<TemplateInfo | null> {
    const templates = await this.getActiveTemplates();
    return templates.find(t => t.slug === slug) || null;
  }

  /**
   * Clear the template cache (useful for refreshing templates)
   */
  static clearCache(): void {
    this.templateCache = null;
  }

  /**
   * Validate template data structure for AI processing
   */
  static validateTemplateForAI(templateData: any): boolean {
    const requiredFields = [
      'name', 'target_role', 'email', 'phone', 'website', 'summary',
      'skills_csv', 'tools_csv', 'exp1_company', 'exp1_title', 'exp1_dates', 'exp1_bullets',
      'exp2_company', 'exp2_title', 'exp2_dates', 'exp2_bullets',
      'edu1_school', 'edu1_degree', 'edu1_dates', 'edu1_details',
      'edu2_school', 'edu2_degree', 'edu2_dates', 'edu2_details'
    ];

    // Check if template contains placeholders for all required fields
    const templateString = JSON.stringify(templateData).toLowerCase();
    
    return requiredFields.every(field => {
      const placeholder = `{{${field}}}`;
      return templateString.includes(placeholder.toLowerCase());
    });
  }

  /**
   * Get template preview URL with fallback
   */
  static getPreviewUrl(template: TemplateInfo): string {
    return template.preview_image_url || '/placeholder-template.png';
  }

  /**
   * Map template slug to backend-compatible format
   */
  static mapTemplateSlugForBackend(slug: string): string {
    const mapping: Record<string, string> = {
      'classic': 'classic',
      'modern': 'modern',
      'classic_alternative': 'classic-alt',
    };
    return mapping[slug] || slug;
  }

  /**
   * Get template display name with fallback
   */
  static getDisplayName(template: TemplateInfo): string {
    return template.name || template.slug.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Check if template supports cover letters
   */
  static supportsCoverLetter(slug: string): boolean {
    // All current templates support cover letters
    return ['classic', 'modern', 'classic_alternative'].includes(slug);
  }

  /**
   * Get template-specific configuration for AI processing
   */
  static getTemplateConfig(slug: string): Record<string, any> {
    const configs: Record<string, Record<string, any>> = {
      classic: {
        style: 'traditional',
        emphasis: 'experience',
        layout: 'single-column',
        colors: 'conservative',
      },
      modern: {
        style: 'contemporary',
        emphasis: 'skills',
        layout: 'multi-column',
        colors: 'accent',
      },
      classic_alternative: {
        style: 'professional',
        emphasis: 'balanced',
        layout: 'hybrid',
        colors: 'subtle',
      },
    };

    return configs[slug] || configs.classic;
  }
}
