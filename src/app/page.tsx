'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setError('Please sign in or create an account to continue')
        setIsLoading(false)
        return
      }

      // Call the API route
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        throw new Error('Failed to process URL')
      }

      // Handle successful response
      const data = await response.json()
      router.push('/dashboard') // Redirect to dashboard after successful crawl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-violet-900 mb-6">
            Get an AI Agent for your website instantly
          </h1>
          <p className="text-xl text-violet-700 mb-12">
            Transform your website into an intelligent assistant that can answer questions and help your visitors
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your website URL"
                className="flex-1 px-6 py-3 rounded-lg border-2 border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Get Started'}
              </button>
            </div>

            {error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                {error}
              </div>
            )}
          </form>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-violet-100">
              <h3 className="text-lg font-semibold text-violet-900 mb-2">Instant Setup</h3>
              <p className="text-violet-700">Get your AI agent up and running in minutes</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-violet-100">
              <h3 className="text-lg font-semibold text-violet-900 mb-2">24/7 Support</h3>
              <p className="text-violet-700">Your AI agent works around the clock</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm border border-violet-100">
              <h3 className="text-lg font-semibold text-violet-900 mb-2">Smart Learning</h3>
              <p className="text-violet-700">Improves with every interaction</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
