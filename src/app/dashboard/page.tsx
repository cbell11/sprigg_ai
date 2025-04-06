'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/supabase'

export default function Dashboard() {
  const [crawledData, setCrawledData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/')
          return
        }

        const { data, error } = await db.getCrawledData(session.user.id)
        
        if (error) {
          throw error
        }

        setCrawledData(data || [])
      } catch (error) {
        console.error('Error fetching crawled data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center">
        <div className="text-violet-900 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-violet-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-violet-900 mb-8">Your Crawled Websites</h1>
        
        {crawledData.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-violet-700 mb-4">No websites crawled yet</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Crawl a Website
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {crawledData.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-violet-900 mb-2">
                  {item.website_url}
                </h2>
                <p className="text-violet-700 text-sm mb-4">
                  Crawled on: {new Date(item.created_at).toLocaleDateString()}
                </p>
                <div className="text-sm text-violet-600">
                  {item.page_content.substring(0, 150)}...
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 