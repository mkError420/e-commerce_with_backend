import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET() {
  const db = await getDb()
  return apiSuccess(db.blogPosts)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('POST request received for blog creation:', body)
    
    const { title, excerpt, content, image, authorName, authorBio, category, tags, publishedAt, readTime, featured, likes, comments } = body
    
    if (!title || !excerpt || !content) {
      console.log('Validation failed: missing required fields')
      return apiError('Title, excerpt and content required', 400)
    }
    
    const db = await getDb()
    const post = {
      id: generateId(),
      title: title.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      image: image || '/api/placeholder?width=1200&height=600',
      authorName: authorName || 'Admin',
      authorBio: authorBio || '',
      category: category || 'General',
      tags: tags || [],
      publishedAt: publishedAt || new Date().toISOString().split('T')[0],
      readTime: readTime || '5 min read',
      featured: featured ?? false,
      likes: likes ?? 0,
      comments: comments ?? 0
    }
    
    console.log('Created blog post object:', post)
    
    db.blogPosts.push(post)
    await writeDb(db)
    console.log('Blog post saved to database')
    
    return apiSuccess(post, 201)
  } catch (error) {
    console.error('Error in POST request:', error)
    return apiError('Failed to create blog post', 500)
  }
}
