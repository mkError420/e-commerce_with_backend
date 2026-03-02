'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Heart, MessageCircle, User, Search, Filter } from 'lucide-react'
import Container from '@/components/Container'
import BlogWidgets from '@/components/BlogWidgets'
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [postsWithComments, setPostsWithComments] = useState<Map<string, number>>(new Map())

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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const blogPosts = await api.blog.list()
        console.log('Blog posts fetched:', blogPosts)
        console.log('First post image data:', blogPosts[0]?.image)
        console.log('Second post image data:', blogPosts[1]?.image)
        setPosts(blogPosts || [])
      } catch (error) {
        console.error('Failed to fetch blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Save liked posts to localStorage
  useEffect(() => {
    localStorage.setItem('blogLikedPosts', JSON.stringify(Array.from(likedPosts)))
  }, [likedPosts])

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(posts.map(post => post.category)))]

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort posts: featured first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  })

  if (loading) {
    return (
      <Container className='py-16'>
        <div className='animate-pulse'>
          <div className='h-12 bg-gray-200 rounded w-1/3 mb-8'></div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='bg-white rounded-xl shadow-sm overflow-hidden'>
                <div className='h-48 bg-gray-200'></div>
                <div className='p-6'>
                  <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
                  <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
                  <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Container className='py-8'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            Our <span className='text-shop_dark_green'>Blog</span>
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            Discover the latest insights, tips, and trends in e-commerce and digital marketing
          </p>
        </div>

        {/* Search and Filter */}
        <div className='mb-8'>
          <div className='flex flex-col lg:flex-row gap-4 items-center justify-between'>
            {/* Search */}
            <div className='relative flex-1 max-w-md'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <input
                type='text'
                placeholder='Search blog posts...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-shop_dark_green focus:border-transparent'
              />
            </div>

            {/* Category Filter */}
            <div className='flex items-center gap-2'>
              <Filter className='w-5 h-5 text-gray-500' />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-shop_dark_green focus:border-transparent bg-white'
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Blog Posts Grid */}
          <div className='flex-1'>
            {sortedPosts.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                {sortedPosts.map((post) => (
                  <article key={post.id} className='bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group'>
                    {/* Featured Badge */}
                    {post.featured && (
                      <div className='absolute top-4 left-4 z-10'>
                        <span className='bg-shop_orange text-white px-3 py-1 rounded-full text-xs font-semibold'>
                          Featured
                        </span>
                      </div>
                    )}

                    {/* Image */}
                    <div className='relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden rounded-t-xl'>
                      {post.image ? (
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center text-gray-400'>
                          <div className='text-center'>
                            <div className='w-16 h-16 bg-gray-300 rounded-lg mx-auto mb-2'></div>
                            <p className='text-sm'>No Image</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className='p-6'>
                      {/* Category */}
                      <div className='mb-3'>
                        <span className='bg-shop_dark_green text-white px-3 py-1 rounded-full text-xs font-semibold'>
                          {post.category}
                        </span>
                      </div>

                      {/* Title */}
                      <Link href={`/blog/${post.id}`}>
                        <h3 className='text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-shop_dark_green transition-colors duration-200'>
                          {post.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className='text-gray-600 mb-4 line-clamp-3'>
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4'>
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-4 h-4' />
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className='flex items-center gap-1'>
                          <Clock className='w-4 h-4' />
                          {post.readTime}
                        </div>
                        <div className='flex items-center gap-1'>
                          <MessageCircle className='w-4 h-4' />
                          {post.comments}
                        </div>
                      </div>

                      {/* Author and Actions */}
                      <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 bg-gradient-to-br from-shop_dark_green to-shop_light_green rounded-full flex items-center justify-center text-white text-xs font-semibold'>
                            {post.authorName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className='text-sm text-gray-600'>{post.authorName}</span>
                        </div>

                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            likedPosts.has(post.id)
                              ? 'bg-red-50 text-red-500 hover:bg-red-100'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span>{likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className='text-center py-16'>
                <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <MessageCircle className='w-12 h-12 text-gray-400' />
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>No blog posts found</h3>
                <p className='text-gray-600 mb-8'>
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Check back soon for new blog posts'}
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                    }}
                    className='px-6 py-3 bg-shop_dark_green text-white rounded-xl font-semibold hover:bg-shop_light_green transition-colors duration-200'
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Widgets */}
          <div className='lg:w-80 flex-shrink-0'>
            <BlogWidgets currentCategory={selectedCategory === 'all' ? undefined : selectedCategory} />
          </div>
        </div>
      </Container>
    </div>
  )
}
