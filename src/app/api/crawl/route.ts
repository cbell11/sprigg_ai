import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/supabase'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'

interface CrawlResult {
  title: string
  description: string
  contactInfo: string
  bookingInfo: string
  mainContent: string
}

async function crawlWebsite(url: string): Promise<CrawlResult> {
  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract title
    const title = $('title').text() || $('h1').first().text()

    // Extract meta description
    const description = $('meta[name="description"]').attr('content') || ''

    // Extract contact information
    const contactInfo = $('footer, .contact, #contact, [class*="contact"], [id*="contact"]')
      .text()
      .trim()
      .replace(/\s+/g, ' ')

    // Extract booking information
    const bookingInfo = $('.booking, #booking, [class*="booking"], [id*="booking"]')
      .text()
      .trim()
      .replace(/\s+/g, ' ')

    // Extract main content (excluding header, footer, and navigation)
    const mainContent = $('main, article, .content, #content, [class*="content"], [id*="content"]')
      .not('header, footer, nav')
      .text()
      .trim()
      .replace(/\s+/g, ' ')

    return {
      title,
      description,
      contactInfo,
      bookingInfo,
      mainContent,
    }
  } catch (error) {
    console.error('Error crawling website:', error)
    throw new Error('Failed to crawl website')
  }
}

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

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Crawl the website
    const crawlResult = await crawlWebsite(url)

    // Format the content for storage
    const formattedContent = JSON.stringify({
      title: crawlResult.title,
      description: crawlResult.description,
      contactInfo: crawlResult.contactInfo,
      bookingInfo: crawlResult.bookingInfo,
      mainContent: crawlResult.mainContent,
      url,
      crawledAt: new Date().toISOString(),
    })

    // Save to database
    const { data, error } = await db.saveCrawledData(
      session.user.id,
      url,
      formattedContent
    )

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        parsedContent: JSON.parse(formattedContent)
      }
    })
  } catch (error) {
    console.error('Error processing crawl request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 