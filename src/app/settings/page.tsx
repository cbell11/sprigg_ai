'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface ChatbotCustomization {
  primaryColor: string
  secondaryColor: string
  logo: string
  name: string
}

export default function SettingsPage() {
  const [customization, setCustomization] = useState<ChatbotCustomization>({
    primaryColor: '#7c3aed',
    secondaryColor: '#f3f4f6',
    logo: '🤖',
    name: 'Sprigg AI'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load current settings
    const loadSettings = async () => {
      const { data, error } = await supabase
        .from('chatbot_customization')
        .select('*')
        .single()

      if (data && !error) {
        setCustomization(data)
      }
    }

    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('chatbot_customization')
        .upsert(customization)

      if (error) throw error

      setMessage('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      setMessage('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Chatbot Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Chatbot Name
            </label>
            <input
              type="text"
              id="name"
              value={customization.name}
              onChange={(e) => setCustomization(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <div>
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
              Logo (emoji)
            </label>
            <input
              type="text"
              id="logo"
              value={customization.logo}
              onChange={(e) => setCustomization(prev => ({ ...prev, logo: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <div>
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              id="primaryColor"
              value={customization.primaryColor}
              onChange={(e) => setCustomization(prev => ({ ...prev, primaryColor: e.target.value }))}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          <div>
            <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <input
              type="color"
              id="secondaryColor"
              value={customization.secondaryColor}
              onChange={(e) => setCustomization(prev => ({ ...prev, secondaryColor: e.target.value }))}
              className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-md ${
              message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="w-full px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: customization.primaryColor }}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>

        {/* Preview */}
        <div className="mt-8 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div 
              className="p-4 border-b"
              style={{ backgroundColor: customization.primaryColor }}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{customization.logo}</span>
                <h3 className="text-xl font-semibold text-white">
                  {customization.name}
                </h3>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div 
                    className="max-w-[80%] rounded-lg p-3 text-white"
                    style={{ backgroundColor: customization.primaryColor }}
                  >
                    Hello!
                  </div>
                </div>
                <div className="flex justify-start">
                  <div 
                    className="max-w-[80%] rounded-lg p-3"
                    style={{ backgroundColor: customization.secondaryColor }}
                  >
                    Hi there! How can I help you today?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 