'use client'

import React, { useState } from 'react'
import { MessageCircle, Heart, Send, User } from 'lucide-react'

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
}

interface CommentSectionProps {
  postId: number
  comments: Comment[]
  onAddComment: (postId: number, comment: Omit<Comment, 'id' | 'timestamp'>) => void
  onLikeComment: (postId: number, commentId: string) => void
  isOpen: boolean
  onToggle: () => void
}

const CommentSection = ({ 
  postId, 
  comments, 
  onAddComment, 
  onLikeComment,
  isOpen,
  onToggle 
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim() && authorName.trim()) {
      onAddComment(postId, {
        author: authorName.trim(),
        content: newComment.trim(),
        likes: 0
      })
      setNewComment('')
      setAuthorName('')
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className='border-t border-gray-100 pt-4'>
      {/* Comment Toggle Button */}
      <button
        onClick={onToggle}
        className='flex items-center gap-2 text-sm text-gray-500 hover:text-shop_dark_green transition-colors duration-200'
      >
        <MessageCircle className='w-4 h-4' />
        <span>{comments.length} Comments</span>
        <span className='text-xs'>{isOpen ? '▼' : '▶'}</span>
      </button>

      {/* Comments Section */}
      {isOpen && (
        <div className='mt-4 space-y-4'>
          {/* Add Comment Form */}
          <form onSubmit={handleSubmit} className='space-y-3'>
            <div className='flex gap-2'>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Your name'
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-shop_dark_green/20 focus:border-shop_dark_green'
                  required
                />
              </div>
            </div>
            <div className='flex gap-2'>
              <input
                type='text'
                placeholder='Add a comment...'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className='flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-shop_dark_green/20 focus:border-shop_dark_green'
                required
              />
              <button
                type='submit'
                className='px-4 py-2 bg-shop_dark_green text-white rounded-lg hover:bg-shop_dark_green/90 transition-colors duration-200 flex items-center gap-2'
              >
                <Send className='w-4 h-4' />
                <span className='hidden sm:inline'>Post</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className='space-y-3 max-h-60 overflow-y-auto'>
            {comments.length === 0 ? (
              <div className='text-center py-8 text-gray-400'>
                <MessageCircle className='w-8 h-8 mx-auto mb-2' />
                <p className='text-sm'>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className='bg-gray-50 rounded-lg p-3'>
                  <div className='flex items-start justify-between mb-2'>
                    <div className='flex items-center gap-2'>
                      <div className='w-8 h-8 bg-gradient-to-br from-shop_dark_green to-shop_light_green rounded-full flex items-center justify-center text-white text-xs font-semibold'>
                        {comment.author.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>
                          {comment.author}
                        </div>
                        <div className='text-xs text-gray-500'>
                          {formatDate(comment.timestamp)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onLikeComment(postId, comment.id)}
                      className='flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors duration-200'
                    >
                      <Heart className='w-3 h-3' />
                      <span>{comment.likes}</span>
                    </button>
                  </div>
                  <p className='text-sm text-gray-700 leading-relaxed'>
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentSection
