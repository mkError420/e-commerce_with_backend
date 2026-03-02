'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, Clock, Heart, MessageCircle, User, ArrowLeft, Share2 } from 'lucide-react'
import CommentSection from '@/components/CommentSection'
import Container from '@/components/Container'
import BlogWidgets from '@/components/BlogWidgets'
import { api } from '@/lib/api-client'

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  authorName: string
  authorBio: string
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  featured: boolean
  likes: number
  comments: number
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [postsWithComments, setPostsWithComments] = useState<Map<string, Comment[]>>(new Map())

  // Load data from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('blogLikedPosts')
    const savedComments = localStorage.getItem('blogComments')
    
    if (savedLikes) {
      setLikedPosts(new Set(JSON.parse(savedLikes)))
    }
    
    if (savedComments) {
      setPostsWithComments(new Map(JSON.parse(savedComments)))
    }
  }, [])

  // Save liked posts to localStorage
  useEffect(() => {
    localStorage.setItem('blogLikedPosts', JSON.stringify(Array.from(likedPosts)))
  }, [likedPosts])

  // Save comments to localStorage
  useEffect(() => {
    localStorage.setItem('blogComments', JSON.stringify(Array.from(postsWithComments.entries())))
  }, [postsWithComments])

  // Fetch the post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const blogPost = await api.blog.get(postId)
        setPost(blogPost)
      } catch (error) {
        console.error('Failed to fetch blog post:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId])

  const handleLikePost = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleAddComment = (postId: string, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    setPostsWithComments(prev => {
      const newMap = new Map(prev)
      const existingComments = newMap.get(postId) || []
      const newComment: Comment = {
        ...comment,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      }
      newMap.set(postId, [...existingComments, newComment])
      return newMap
    })
  }

  const handleLikeComment = (postId: string, commentId: string) => {
    setPostsWithComments(prev => {
      const newMap = new Map(prev)
      const existingComments = newMap.get(postId) || []
      const updatedComments = existingComments.map(comment =>
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
      newMap.set(postId, updatedComments)
      return newMap
    })
  }

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const comments = postsWithComments.get(postId) || []

  if (loading) {
    return (
      <Container className='py-16'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/4 mb-8'></div>
          <div className='max-w-4xl mx-auto'>
            <div className='bg-white rounded-xl shadow-sm p-8 mb-8'>
              <div className='h-4 bg-gray-200 rounded w-1/3 mb-4'></div>
              <div className='h-12 bg-gray-200 rounded w-3/4 mb-6'></div>
              <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-5/6'></div>
            </div>
            <div className='bg-white rounded-xl shadow-sm h-96 mb-8'></div>
            <div className='bg-white rounded-xl shadow-sm p-8 h-64'></div>
          </div>
        </div>
      </Container>
    )
  }

  if (!post) {
    return (
      <Container className='py-16'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Blog Post Not Found</h1>
          <p className='text-gray-600 mb-8'>The blog post you're looking for doesn't exist.</p>
          <Link
            href='/blog'
            className='inline-flex items-center gap-2 bg-shop_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Blog
          </Link>
        </div>
      </Container>
    )
  }

  const isLiked = likedPosts.has(post.id)

  return (
    <div className='min-h-screen bg-gray-50'>
      <Container className='py-8'>
        {/* Back Navigation */}
        <div className='mb-8'>
          <Link
            href='/blog'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-shop_dark_green transition-colors duration-200'
          >
            <ArrowLeft className='w-4 h-4' />
            Back to Blog
          </Link>
        </div>

        {/* Main Content with Sidebar */}
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Blog Post Content */}
          <div className='flex-1'>
            <article className='max-w-4xl'>
              {/* Header */}
              <header className='bg-white rounded-xl shadow-sm p-8 mb-8'>
                <div className='flex flex-wrap items-center gap-4 mb-6'>
                  <span className='bg-shop_dark_green text-white px-3 py-1 rounded-full text-sm font-semibold'>
                    {post.category}
                  </span>
                  <div className='flex items-center gap-4 text-sm text-gray-500'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='w-4 h-4' />
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Clock className='w-4 h-4' />
                      {post.readTime}
                    </div>
                  </div>
                </div>

                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight'>
                  {post.title}
                </h1>

                <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
                  {post.excerpt}
                </p>

                {/* Author and Engagement */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100'>
                  <div className='flex items-center gap-3'>
                    <div className='w-12 h-12 bg-gradient-to-br from-shop_dark_green to-shop_light_green rounded-full flex items-center justify-center text-white font-semibold'>
                      {post.authorName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>
                        {post.authorName}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {post.authorBio}
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        isLiked 
                          ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{isLiked ? post.likes + 1 : post.likes}</span>
                    </button>

                    <div className='relative'>
                      <button
                        onClick={handleShare}
                        className='flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200'
                      >
                        <Share2 className='w-5 h-5' />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              <div className='bg-white rounded-xl shadow-sm overflow-hidden mb-8'>
                <div className='relative h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                  {post.image ? (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className='w-full h-full object-cover'
                    />
                  ) : (
                    <div className='text-gray-400 text-center'>
                      <div className='w-24 h-24 bg-gray-300 rounded-lg mx-auto mb-4'></div>
                      <p className='text-lg'>Blog Featured Image</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className='bg-white rounded-xl shadow-sm p-8 mb-8'>
                <div 
                  className='prose prose-lg max-w-none'
                  dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
                />
              </div>

              {/* Tags */}
              <div className='bg-white rounded-xl shadow-sm p-6 mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Tags</h3>
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className='px-3 py-1 bg-shop_light_pink text-shop_dark_green rounded-full text-sm font-medium'
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className='bg-white rounded-xl shadow-sm p-6'>
                <CommentSection
                  postId={post.id}
                  comments={comments}
                  onAddComment={handleAddComment}
                  onLikeComment={handleLikeComment}
                  isOpen={true}
                  onToggle={() => {}}
                />
              </div>
            </article>
          </div>

          {/* Sidebar Widgets */}
          <div className='lg:w-80 flex-shrink-0'>
            <BlogWidgets currentPostId={post.id} currentCategory={post.category} />
          </div>
        </div>
      </Container>
    </div>
  )
}
