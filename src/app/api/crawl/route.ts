import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the URL from the request body
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // TODO: Implement actual crawling logic here
    // For now, we'll just save a placeholder
    const { data, error } = await db.saveCrawledData(
      session.user.id,
      url,
      'Placeholder content - crawling implementation pending'
    )

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error processing crawl request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 