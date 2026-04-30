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
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          role: Database["public"]["Enums"]["app_role"]
          mfa_required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          mfa_required?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string | null
          full_name?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          mfa_required?: boolean
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
          user_id?: string
          role_id?: string
          assigned_at?: string
          assigned_by?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: string
          label: string
        }
        Insert: {
          id: string
          label: string
        }
        Update: {
          id?: string
          label?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      app_role: "nurse" | "admin" | "super_admin"
    }
    CompositeTypes: Record<string, never>
  }
}
