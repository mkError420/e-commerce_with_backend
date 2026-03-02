'use client'

import React, { useState } from 'react'
import { Calendar, Clock, User, Tag, TrendingUp, Mail, Rss } from 'lucide-react'
import Link from 'next/link'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  author: {
    name: string
    avatar: string
    bio: string
  }
  category: string
  tags: string[]
  publishedAt: string
  readTime: string
  likes: number
  comments: number
}

interface Category {
  name: string
  slug: string
  count: number
}

interface BlogSidebarProps {
  recentPosts: BlogPost[]
  categories: Category[]
  allTags: string[]
}

const BlogSidebar = ({ recentPosts, categories, allTags }: BlogSidebarProps) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail('')
      }, 3000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    })
  }

  const popularTags = allTags.slice(0, 10)

  return (
    <div className='space-y-8'>
      {/* Newsletter Signup */}
      <div className='bg-gradient-to-br from-shop_dark_green to-shop_light_green rounded-xl p-6 text-white'>
        <div className='flex items-center gap-3 mb-4'>
          <Mail className='w-6 h-6' />
          <h3 className='text-lg font-bold'>Newsletter</h3>
        </div>
        <p className='text-white/90 text-sm mb-4'>
          Get the latest blog posts delivered straight to your inbox
        </p>
        <form onSubmit={handleSubscribe} className='space-y-3'>
          <input
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50'
            required
          />
          <button
            type='submit'
            className='w-full bg-white text-shop_dark_green px-4 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300'
          >
            {isSubscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
        </div>

      {/* Recent Posts */}
      <div className='bg-white rounded-xl p-6 border border-gray-100'>
        <div className='flex items-center gap-3 mb-4'>
          <TrendingUp className='w-5 h-5 text-shop_dark_green' />
          <h3 className='text-lg font-bold text-gray-900'>Recent Posts</h3>
        </div>
        <div className='space-y-4'>
          {recentPosts.map((post) => (
            <article key={post.id} className='group'>
              <Link href={`/blog/${post.id}`} className='block'>
                <div className='flex gap-3'>
                  {/* Thumbnail */}
                  <div className='w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center'>
                    <div className='w-8 h-8 bg-gray-300 rounded'></div>
                  </div>
                  
                  {/* Content */}
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-300'>
                      {post.title}
                    </h4>
                    <div className='flex items-center gap-3 text-xs text-gray-500'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='w-3 h-3' />
                        {formatDate(post.publishedAt)}
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='w-3 h-3' />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className='bg-white rounded-xl p-6 border border-gray-100'>
        <div className='flex items-center gap-3 mb-4'>
          <Tag className='w-5 h-5 text-shop_dark_green' />
          <h3 className='text-lg font-bold text-gray-900'>Categories</h3>
        </div>
        <div className='space-y-2'>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/blog?category=${category.slug}`}
              className='flex items-center justify-between py-2 px-3 rounded-lg text-gray-700 hover:bg-shop_light_pink hover:text-shop_dark_green transition-colors duration-300'
            >
              <span className='text-sm font-medium'>{category.name}</span>
              <span className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full'>
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Tags */}
      <div className='bg-white rounded-xl p-6 border border-gray-100'>
        <div className='flex items-center gap-3 mb-4'>
          <Tag className='w-5 h-5 text-shop_dark_green' />
          <h3 className='text-lg font-bold text-gray-900'>Popular Tags</h3>
        </div>
        <div className='flex flex-wrap gap-2'>
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className='px-3 py-1 bg-shop_light_pink text-shop_dark_green rounded-full text-xs font-medium hover:bg-shop_dark_green hover:text-white transition-colors duration-300'
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      {/* RSS Feed */}
      <div className='bg-white rounded-xl p-6 border border-gray-100'>
        <div className='flex items-center gap-3 mb-4'>
          <Rss className='w-5 h-5 text-shop_dark_green' />
          <h3 className='text-lg font-bold text-gray-900'>RSS Feed</h3>
        </div>
        <p className='text-gray-600 text-sm mb-4'>
          Subscribe to our RSS feed to never miss an update
        </p>
        <Link
          href='/rss.xml'
          className='inline-flex items-center gap-2 text-shop_dark_green font-semibold hover:text-shop_dark_green/80 transition-colors duration-300'
        >
          <Rss className='w-4 h-4' />
          Subscribe to RSS
        </Link>
      </div>
    </div>
  )
}

export default BlogSidebar
