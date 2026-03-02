'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MessageCircle, Heart, TrendingUp, Tag, Folder, Search, User } from 'lucide-react'
import { api } from '@/lib/api-client'

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

interface BlogWidgetsProps {
  currentPostId?: string
  currentCategory?: string
}

const BlogWidgets: React.FC<BlogWidgetsProps> = ({ currentPostId, currentCategory }) => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPosts = await api.blog.list()
        setPosts(blogPosts || [])
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Get recent posts (excluding current post if provided)
  const recentPosts = posts
    .filter(post => post.id !== currentPostId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5)

  // Get popular posts (by likes)
  const popularPosts = posts
    .filter(post => post.id !== currentPostId)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)

  // Get categories with counts
  const categoriesWithCounts = posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Get all tags with counts
  const tagsWithCounts = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // Filter posts for search widget
  const searchResults = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Recent Posts Widget */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Categories Widget */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Widget */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-shop_dark_green" />
          Search Blog
        </h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shop_dark_green focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        
        {searchTerm && searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatDate(post.publishedAt)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Posts Widget */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-shop_dark_green" />
          Recent Posts
        </h3>
        <div className="space-y-4">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block"
              >
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-200 mb-2">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.comments}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent posts available</p>
          )}
        </div>
      </div>

      {/* Popular Posts Widget */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-shop_orange" />
          Popular Posts
        </h3>
        <div className="space-y-4">
          {popularPosts.length > 0 ? (
            popularPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group flex gap-3"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-shop_orange to-shop_dark_green rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-200 mb-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-gray-500">No popular posts available</p>
          )}
        </div>
      </div>

      {/* Categories Widget */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Folder className="w-5 h-5 text-shop_dark_green" />
          Categories
        </h3>
        <div className="space-y-2">
          {Object.entries(categoriesWithCounts).length > 0 ? (
            Object.entries(categoriesWithCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <Link
                  key={category}
                  href={`/blog?category=${encodeURIComponent(category)}`}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors duration-200 ${
                    currentCategory === category
                      ? 'bg-shop_light_green text-shop_dark_green'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="text-sm font-medium">{category}</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {count}
                  </span>
                </Link>
              ))
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>
      </div>

      {/* Tags Widget */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-shop_dark_green" />
          Popular Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(tagsWithCounts).length > 0 ? (
            Object.entries(tagsWithCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 15)
              .map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 bg-shop_light_pink text-shop_dark_green rounded-full text-sm font-medium hover:bg-shop_dark_green hover:text-white transition-colors duration-200"
                >
                  {tag}
                  <span className="ml-1 text-xs opacity-75">({count})</span>
                </Link>
              ))
          ) : (
            <p className="text-sm text-gray-500">No tags available</p>
          )}
        </div>
      </div>

      {/* Author Widget */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-shop_dark_green" />
          About Author
        </h3>
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-shop_dark_green to-shop_light_green rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            MK
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">MK Shop BD</h4>
          <p className="text-sm text-gray-600 mb-4">
            Passionate about e-commerce, digital marketing, and helping businesses succeed online. Sharing insights and tips to grow your online presence.
          </p>
          <div className="flex justify-center gap-2 text-xs text-gray-500">
            <span>{posts.length} Articles</span>
            <span>•</span>
            <span>{posts.reduce((sum, post) => sum + post.likes, 0)} Likes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogWidgets
