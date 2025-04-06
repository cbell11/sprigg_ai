export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      crawled_data: {
        Row: {
          id: string
          user_id: string
          website_url: string
          page_content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          website_url: string
          page_content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          website_url?: string
          page_content?: string
          created_at?: string
        }
      }
      chat_logs: {
        Row: {
          id: string
          user_id: string
          chat_session_id: string
          user_message: string
          bot_response: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chat_session_id: string
          user_message: string
          bot_response: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chat_session_id?: string
          user_message?: string
          bot_response?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: 'active' | 'inactive' | 'cancelled'
          plan: 'free' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'active' | 'inactive' | 'cancelled'
          plan?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'active' | 'inactive' | 'cancelled'
          plan?: 'free' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
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
      [_ in never]: never
    }
  }
} 