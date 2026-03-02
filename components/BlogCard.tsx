import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Heart, MessageCircle, User, ArrowRight } from 'lucide-react'
import CommentSection from './CommentSection'

interface Author {
  name: string
  avatar: string
  bio: string
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
}

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  image: string
  author: Author
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  featured: boolean
  likes: number
  comments: number
  commentsList?: Comment[]
}

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
  onLikePost?: (postId: number) => void
  onAddComment?: (postId: number, comment: Omit<Comment, 'id' | 'timestamp'>) => void
  onLikeComment?: (postId: number, commentId: string) => void
  likedPosts?: Set<number>
}

const BlogCard = ({ 
  post, 
  featured = false,
  onLikePost,
  onAddComment,
  onLikeComment,
  likedPosts = new Set()
}: BlogCardProps) => {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [comments, setComments] = useState<Comment[]>(post.commentsList || [])
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    setIsLiked(likedPosts.has(post.id))
  }, [likedPosts, post.id])

  const handleLike = () => {
    if (onLikePost) {
      onLikePost(post.id)
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    }
  }

  const handleAddComment = (postId: number, comment: Omit<Comment, 'id' | 'timestamp'>) => {
    if (onAddComment) {
      onAddComment(postId, comment)
      const newComment: Comment = {
        ...comment,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      }
      setComments(prev => [...prev, newComment])
    }
  }

  const handleLikeComment = (postId: number, commentId: string) => {
    if (onLikeComment) {
      onLikeComment(postId, commentId)
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, likes: comment.likes + 1 }
            : comment
        )
      )
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

  if (featured) {
    return (
      <div className='group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100'>
        <div className='relative'>
          {/* Featured Badge */}
          <div className='absolute top-4 left-4 z-10'>
            <span className='bg-shop_orange text-white px-3 py-1 rounded-full text-xs font-semibold'>
              Featured
            </span>
          </div>

          {/* Image */}
          <div className='relative overflow-hidden h-48 bg-gray-100'>
            <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
              <div className='text-gray-400 text-center'>
                <div className='w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2'></div>
                <p className='text-sm'>Blog Image</p>
              </div>
            </div>
          </div>

          {/* Content Overlay */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <div className='absolute bottom-4 left-4 right-4'>
              <Link
                href={`/blog/${post.id}`}
                className='inline-flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-shop_dark_green hover:text-white transition-colors duration-300'
              >
                Read More
                <ArrowRight className='w-4 h-4' />
              </Link>
            </div>
          </div>
        </div>

        <div className='p-6'>
          {/* Category and Date */}
          <div className='flex items-center justify-between mb-3'>
            <span className='text-xs text-shop_dark_green font-semibold uppercase tracking-wide'>
              {post.category}
            </span>
            <div className='flex items-center gap-1 text-xs text-gray-500'>
              <Calendar className='w-3 h-3' />
              {formatDate(post.publishedAt)}
            </div>
          </div>

          {/* Title */}
          <h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-300'>
            <Link href={`/blog/${post.id}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className='text-gray-600 mb-4 line-clamp-2'>
            {post.excerpt}
          </p>

          {/* Author and Meta */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              {/* Author Avatar */}
              <div className='w-8 h-8 bg-gradient-to-br from-shop_dark_green to-shop_light_green rounded-full flex items-center justify-center text-white text-xs font-semibold'>
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className='text-sm font-medium text-gray-900'>
                  {post.author.name}
                </div>
                <div className='flex items-center gap-1 text-xs text-gray-500'>
                  <Clock className='w-3 h-3' />
                  {post.readTime}
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className='flex items-center gap-3 text-sm text-gray-500'>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className='flex items-center gap-1 text-gray-500 hover:text-shop_dark_green transition-colors duration-200'
              >
                <MessageCircle className='w-4 h-4' />
                <span>{comments.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection
          postId={post.id}
          comments={comments}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          isOpen={showComments}
          onToggle={() => setShowComments(!showComments)}
        />
      </div>
    )
  }

  // Regular Card
  return (
    <article className='group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden'>
      <div className='flex flex-col md:flex-row'>
        {/* Image */}
        <div className='relative md:w-1/3 lg:w-2/5'>
          <div className='relative overflow-hidden h-48 md:h-full bg-gray-100'>
            <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
              <div className='text-gray-400 text-center'>
                <div className='w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-2'></div>
                <p className='text-xs'>Blog Image</p>
              </div>
            </div>
            
            {/* Category Badge */}
            <div className='absolute top-4 left-4'>
              <span className='bg-shop_dark_green/90 text-white px-3 py-1 rounded-full text-xs font-semibold'>
                {post.category}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 p-6'>
          {/* Date and Read Time */}
          <div className='flex items-center gap-4 text-sm text-gray-500 mb-3'>
            <div className='flex items-center gap-1'>
              <Calendar className='w-4 h-4' />
              {formatDate(post.publishedAt)}
            </div>
            <div className='flex items-center gap-1'>
              <Clock className='w-4 h-4' />
              {post.readTime}
            </div>
          </div>

          {/* Title */}
          <h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-300'>
            <Link href={`/blog/${post.id}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className='text-gray-600 mb-4 line-clamp-3'>
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className='flex flex-wrap gap-2 mb-4'>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className='px-2 py-1 bg-shop_light_pink text-shop_dark_green rounded text-xs font-medium'
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author and Engagement */}
          <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
            <div className='flex items-center gap-3'>
              {/* Author Avatar */}
              <div className='w-10 h-10 bg-gradient-to-br from-shop_dark_green to-shop_light_green rounded-full flex items-center justify-center text-white text-sm font-semibold'>
                {post.author.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <div className='text-sm font-medium text-gray-900'>
                  {post.author.name}
                </div>
                <div className='text-xs text-gray-500'>
                  {post.author.bio.split(',')[0]}
                </div>
              </div>
            </div>

            {/* Engagement Stats */}
            <div className='flex items-center gap-3 text-sm text-gray-500'>
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 transition-colors duration-200 ${
                  isLiked 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </button>
              <button
                onClick={() => setShowComments(!showComments)}
                className='flex items-center gap-1 text-gray-500 hover:text-shop_dark_green transition-colors duration-200'
              >
                <MessageCircle className='w-4 h-4' />
                <span>{comments.length}</span>
              </button>
            </div>
          </div>

          {/* Read More Link */}
          <div className='mt-4'>
            <Link
              href={`/blog/${post.id}`}
              className='inline-flex items-center gap-2 text-shop_dark_green font-semibold hover:text-shop_dark_green/80 transition-colors duration-300'
            >
              Read Full Article
              <ArrowRight className='w-4 h-4' />
            </Link>
          </div>

          {/* Comment Section */}
          <CommentSection
            postId={post.id}
            comments={comments}
            onAddComment={handleAddComment}
            onLikeComment={handleLikeComment}
            isOpen={showComments}
            onToggle={() => setShowComments(!showComments)}
          />
        </div>
      </div>
    </article>
  )
}

export default BlogCard
