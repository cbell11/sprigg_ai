import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for common database operations
export const db = {
  // Crawled Data operations
  async saveCrawledData(userId: string, url: string, content: string) {
    return await supabase
      .from('crawled_data')
      .insert({
        user_id: userId,
        website_url: url,
        page_content: content,
        status: 'completed'
      })
      .select()
      .single()
  },

  async getCrawledData(userId: string) {
    return await supabase
      .from('crawled_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  // Chat Logs operations
  async saveChatLog(userId: string, message: string, response: string) {
    return await supabase
      .from('chat_logs')
      .insert({
        user_id: userId,
        message,
        response
      })
      .select()
      .single()
  },

  async getChatLogs(userId: string) {
    return await supabase
      .from('chat_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  // Subscription operations
  async getSubscription(userId: string) {
    return await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()
  },

  async updateSubscription(userId: string, plan: string) {
    return await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        plan,
        status: 'active'
      })
      .select()
      .single()
  },

  // Chatbot customization methods
  async getChatbotCustomization() {
    return await supabase
      .from('chatbot_customization')
      .select('*')
      .single()
  },

  async updateChatbotCustomization(customization: {
    primary_color: string
    sec