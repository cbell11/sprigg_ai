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
          page_content: Json
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          website_url: string
          page_content: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          website_url?: string
          page_content?: Json
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_logs: {
        Row: {
          id: string
          user_id: string
          message: string
          response: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          response: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          response?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      chatbot_customization: {
        Row: {
          id: string
          primary_color: string
          secondary_color: string
          logo: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?