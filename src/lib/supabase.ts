import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for common database operations
export const db = {
  // Crawled Data operations
  async saveCrawledData(userId: string, websiteUrl: string, pageContent: string) {
    return await supabase
      .from('crawled_data')
      .insert({
        user_id: userId,
        website_url: websiteUrl,
        page_content: pageContent,
      })
      .select()
  },

  async getCrawledData(userId: string) {
    return await supabase
      .from('crawled_data')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  },

  // Chat Logs operations
  async saveChatLog(
    userId: string,
    chatSessionId: string,
    userMessage: string,
    botResponse: string
  ) {
    return await supabase
      .from('chat_logs')
      .insert({
        user_id: userId,
        chat_session_id: chatSessionId,
        user_message: userMessage,
        bot_response: botResponse,
      })
      .select()
  },

  async getChatLogs(userId: string, chatSessionId: string) {
    return await supabase
      .from('chat_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('chat_session_id', chatSessionId)
      .order('created_at', { ascending: true })
  },

  // Subscription operations
  async getSubscription(userId: string) {
    return await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()
  },

  async updateSubscription(
    userId: string,
    status: 'active' | 'inactive' | 'cancelled',
    plan: 'free' | 'pro' | 'enterprise'
  ) {
    return await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        status,
        plan,
        updated_at: new Date().toISOString(),
      })
      .select()
  },
} 