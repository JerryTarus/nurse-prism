export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      payments: {
        Row: {
          id: string
          booking_id: string | null
          package_key: string | null
          amount_kes: number
          currency: string
          status: string
          provider: string
          provider_order_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          package_key?: string | null
          amount_kes: number
          currency?: string
          status?: string
          provider?: string
          provider_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_id?: string | null
          package_key?: string | null
          amount_kes?: number
          currency?: string
          status?: string
          provider?: string
          provider_order_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          id: string
          slug: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          question?: string
          answer?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      version_logs: {
        Row: {
          id: string
          entity_type: string
          entity_id: string
          version_number: number
          data: Json
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          entity_type: string
          entity_id: string
          version_number?: number
          data: Json
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          entity_type?: string
          entity_id?: string
          version_number?: number
          data?: Json
          created_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          target_country: string | null
          intent: string
          status: string
          source: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          target_country?: string | null
          intent: string
          status?: string
          source?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          target_country?: string | null
          intent?: string
          status?: string
          source?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: string
          mfa_required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: string
          mfa_required?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          role?: string
          mfa_required?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          content: string
          category: string
          category_id: string | null
          tags: string[]
          status: string
          cover_image_url: string | null
          read_time_minutes: number
          published_at: string | null
          author_name: string | null
          author_role: string | null
          created_by: string | null
          updated_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt: string
          content: string
          category: string
          category_id?: string | null
          tags: string[]
          status?: string
          cover_image_url?: string | null
          read_time_minutes?: number
          published_at?: string | null
          author_name?: string | null
          author_role?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          excerpt?: string
          content?: string
          category?: string
          category_id?: string | null
          tags?: string[]
          status?: string
          cover_image_url?: string | null
          read_time_minutes?: number
          published_at?: string | null
          author_name?: string | null
          author_role?: string | null
          created_by?: string | null
          updated_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          id: string
          slug: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          created_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          slug: string
          title: string
          summary: string
          details: string[]
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          summary: string
          details: string[]
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          summary?: string
          details?: string[]
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          intent: string
          status: string
          scheduled_for: string | null
          assigned_coach: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone?: string | null
          intent: string
          status?: string
          scheduled_for?: string | null
          assigned_coach?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          intent?: string
          status?: string
          scheduled_for?: string | null
          assigned_coach?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          id: string
          page_key: string
          section_key: string
          title: string
          content: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          page_key: string
          section_key: string
          title: string
          content: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          page_key?: string
          section_key?: string
          title?: string
          content?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          id: string
          bucket: string
          path: string
          title: string
          alt_text: string | null
          mime_type: string | null
          size_bytes: number | null
          public_url: string | null
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          bucket: string
          path: string
          title: string
          alt_text?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          public_url?: string | null
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          bucket?: string
          path?: string
          title?: string
          alt_text?: string | null
          mime_type?: string | null
          size_bytes?: number | null
          public_url?: string | null
          created_at?: string
          created_by?: string | null
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string | null
          quote: string
          rating: number | null
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role?: string | null
          quote: string
          rating?: number | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string | null
          quote?: string
          rating?: number | null
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      role_mappings: {
        Row: {
          id: string
          user_id: string
          role_id: string
          assigned_at: string
          assigned_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          assigned_at?: string
          assigned_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: string
          assigned_at?: string
          assigned_by?: string | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          id: string
          package_key: string
          name: string
          category: string
          base_price_kes: number
          is_active: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id?: string
          package_key: string
          name: string
          category: string
          base_price_kes: number
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          package_key?: string
          name?: string
          category?: string
          base_price_kes?: number
          is_active?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          value: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          key: string
          value: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          key?: string
          value?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          id: string
          payment_id: string
          event_type: string
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          payment_id: string
          event_type: string
          payload: Json
          created_at?: string
        }
        Update: {
          id?: string
          payment_id?: string
          event_type?: string
          payload?: Json
          created_at?: string
        }
        Relationships: []
      }
      outbound_email_logs: {
        Row: {
          id: string
          sent_by_user_id: string | null
          provider: string
          provider_message_id: string | null
          recipient_email: string
          subject: string
          status: string
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sent_by_user_id?: string | null
          provider: string
          provider_message_id?: string | null
          recipient_email: string
          subject: string
          status?: string
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sent_by_user_id?: string | null
          provider?: string
          provider_message_id?: string | null
          recipient_email?: string
          subject?: string
          status?: string
          error_message?: string | null
          created_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          label: string
        }
        Insert: {
          id?: string
          label: string
        }
        Update: {
          id?: string
          label?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          id: string
          actor_user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          actor_user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          metadata: Json
          created_at?: string
        }
        Update: {
          id?: string
          actor_user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      app_role: "nurse" | "admin" | "super_admin"
      blog_status: "draft" | "scheduled" | "published" | "archived"
      lead_status: "new" | "qualified" | "follow_up" | "won" | "lost"
      lead_source: "website" | "contact_form" | "pricing_page" | "program_page" | "referral" | "manual"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
      contact_status: "new" | "in_progress" | "replied" | "closed"
      pricing_category: "consultation" | "relocation" | "program"
    }
    CompositeTypes: Record<string, never>
  }
}
