import { NextRequest } from 'next/server'
import { getDb, writeDb } from '@/lib/db'
import { apiSuccess, apiError } from '@/lib/api-response'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const post = db.blogPosts.find(p => p.id === id)
  if (!post) return apiError('Blog post not found', 404)
  return apiSuccess(post)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    console.log('PUT request received for blog post:', id)
    console.log('Request body:', body)
    
    const db = await getDb()
    const idx = db.blogPosts.findIndex(p => p.id === id)
    
    if (idx === -1) {
      console.log('Blog post not found:', id)
      return apiError('Blog post not found', 404)
    }
    
    // Update the post
    db.blogPosts[idx] = { ...db.blogPosts[idx], ...body, id }
    console.log('Updated blog post:', db.blogPosts[idx])
    
    await writeDb(db)
    console.log('Database saved successfully')
    
    return apiSuccess(db.blogPosts[idx])
  } catch (error) {
    console.error('Error in PUT request:', error)
    return apiError('Failed to update blog post', 500)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const db = await getDb()
  const idx = db.blogPosts.findIndex(p => p.id === id)
  if (idx === -1) return apiError('Blog post not found', 404)
  db.blogPosts.splice(idx, 1)
  await writeDb(db)
  return apiSuccess({ deleted: true })
}
