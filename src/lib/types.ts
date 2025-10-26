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
          user_id: string
          role: 'influencer' | 'brand' | 'agency'
          status: 'pending' | 'active' | 'suspended'
          email: string
          full_name: string
          avatar_url: string | null
          bio: string | null
          social_handles: Json
          follower_count: number | null
          engagement_rate: number | null
          categories: string[] | null
          company_name: string | null
          industry: string | null
          website: string | null
          is_agency_admin: boolean
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'influencer' | 'brand' | 'agency'
          status?: 'pending' | 'active' | 'suspended'
          email: string
          full_name: string
          avatar_url?: string | null
          bio?: string | null
          social_handles?: Json
          follower_count?: number | null
          engagement_rate?: number | null
          categories?: string[] | null
          company_name?: string | null
          industry?: string | null
          website?: string | null
          is_agency_admin?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'influencer' | 'brand' | 'agency'
          status?: 'pending' | 'active' | 'suspended'
          email?: string
          full_name?: string
          avatar_url?: string | null
          bio?: string | null
          social_handles?: Json
          follower_count?: number | null
          engagement_rate?: number | null
          categories?: string[] | null
          company_name?: string | null
          industry?: string | null
          website?: string | null
          is_agency_admin?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          brand_id: string
          title: string
          description: string
          budget_min: number
          budget_max: number
          categories: string[]
          requirements: Json
          attachments: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          title: string
          description: string
          budget_min: number
          budget_max: number
          categories?: string[]
          requirements?: Json
          attachments?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          title?: string
          description?: string
          budget_min?: number
          budget_max?: number
          categories?: string[]
          requirements?: Json
          attachments?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          product_id: string
          influencer_id: string
          message: string
          proposed_rate: number
          deliverables: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          influencer_id: string
          message: string
          proposed_rate: number
          deliverables?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          influencer_id?: string
          message?: string
          proposed_rate?: number
          deliverables?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          product_id: string
          proposal_id: string | null
          influencer_id: string
          brand_id: string
          agency_id: string
          status: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          proposal_id?: string | null
          influencer_id: string
          brand_id: string
          agency_id: string
          status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          proposal_id?: string | null
          influencer_id?: string
          brand_id?: string
          agency_id?: string
          status?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          attachments: string[]
          read_by: string[]
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          attachments?: string[]
          read_by?: string[]
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          attachments?: string[]
          read_by?: string[]
          metadata?: Json
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          link: string | null
          read: boolean
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          link?: string | null
          read?: boolean
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          link?: string | null
          read?: boolean
          metadata?: Json
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          changes: Json
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          changes?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          resource_type?: string
          resource_id?: string
          changes?: Json
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'influencer' | 'brand' | 'agency'
      profile_status: 'pending' | 'active' | 'suspended'
    }
  }
}
