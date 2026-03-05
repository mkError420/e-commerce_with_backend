import { NextRequest } from 'next/server'
import { getDb, writeDb, generateId } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(req: NextRequest) {
  const db = await getDb()
  const { pathname } = new URL(req.url)
  const pathSegments = pathname.split('/')
  const id = pathSegments[pathSegments.length - 1]
  
  if (id && id !== 'blog') {
    // Get single blog post by ID (path parameter)
    const post = db.blogPosts.find((p: any) => p.id === id)
    if (!post) {
      return apiError('Blog post not found', 404)
    }
    return apiSuccess(post)
  } else {
    // Get all blog posts
    return apiSuccess(db.blogPosts)
  }
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
      comments: comments ?? 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { pathname } = new URL(req.url)
    const pathSegments = pathname.split('/')
    const id = pathSegments[pathSegments.length - 1]
    
    if (!id || id === 'blog') {
      return apiError('Blog post ID is required', 400)
    }
    
    const db = await getDb()
    const postIndex = db.blogPosts.findIndex((p: any) => p.id === id)
    
    if (postIndex === -1) {
      return apiError('Blog post not found', 404)
    }
    
    const updatedPost = {
      ...db.blogPosts[postIndex],
      ...body,
      updatedAt: new Date().toISOString()
    }
    
    db.blogPosts[postIndex] = updatedPost
    await writeDb(db)
    
    return apiSuccess(updatedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
    return apiError('Failed to update blog post', 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { pathname } = new URL(req.url)
    const pathSegments = pathname.split('/')
    const id = pathSegments[pathSegments.length - 1]
    
    if (!id || id === 'blog') {
      return apiError('Blog post ID is required', 400)
    }
    
    const db = await getDb()
    const postIndex = db.blogPosts.findIndex((p: any) => p.id === id)
    
    if (postIndex === -1) {
      return apiError('Blog post not found', 404)
    }
    
    db.blogPosts.splice(postIndex, 1)
    await writeDb(db)
    
    return apiSuccess({ message: 'Blog post deleted successfully' })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return apiError('Failed to delete blog post', 500)
  }
}
