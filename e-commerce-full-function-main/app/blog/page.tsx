'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Container from '@/components/Container';
import BlogHeader from '@/components/BlogHeader';
import BlogCard from '@/components/BlogCard';
import BlogSidebar from '@/components/BlogSidebar';
import Pagination from '@/components/Pagination';

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
}

// Sample blog data - in a real app, this would come from an API
const blogPosts = [
  {
    id: 1,
    title: '10 Essential E-Commerce Tips for Online Success',
    excerpt: 'Discover the top strategies and tips to boost your online store\'s performance and increase sales in today\'s competitive digital marketplace.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      bio: 'E-commerce expert with 10+ years of experience'
    },
    category: 'E-Commerce',
    tags: ['e-commerce', 'tips', 'success', 'online business'],
    publishedAt: '2024-01-15',
    readTime: '5 min read',
    featured: true,
    likes: 245,
    comments: 32,
    commentsList: []
  },
  {
    id: 2,
    title: 'The Future of Online Shopping: Trends to Watch in 2024',
    excerpt: 'Explore the latest innovations and trends shaping the future of e-commerce, from AI-powered recommendations to sustainable shopping.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'Michael Chen',
      avatar: '/api/placeholder/40/40',
      bio: 'Tech enthusiast and digital marketing specialist'
    },
    category: 'Technology',
    tags: ['future', 'trends', 'AI', 'sustainability'],
    publishedAt: '2024-01-12',
    readTime: '8 min read',
    featured: true,
    likes: 189,
    comments: 28,
    commentsList: []
  },
  {
    id: 3,
    title: 'How to Build Customer Loyalty in Your Online Store',
    excerpt: 'Learn proven strategies to create lasting customer relationships and turn one-time buyers into loyal brand advocates.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'Emily Rodriguez',
      avatar: '/api/placeholder/40/40',
      bio: 'Customer experience specialist'
    },
    category: 'Marketing',
    tags: ['customer loyalty', 'retention', 'marketing', 'branding'],
    publishedAt: '2024-01-10',
    readTime: '6 min read',
    featured: false,
    likes: 156,
    comments: 19,
    commentsList: []
  },
  {
    id: 4,
    title: 'Mobile Commerce: Optimizing for the Smartphone Shopper',
    excerpt: 'Essential tips for creating a seamless mobile shopping experience that converts visitors into customers.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'David Kim',
      avatar: '/api/placeholder/40/40',
      bio: 'Mobile commerce and UX expert'
    },
    category: 'Mobile',
    tags: ['mobile commerce', 'UX', 'optimization', 'smartphone'],
    publishedAt: '2024-01-08',
    readTime: '7 min read',
    featured: false,
    likes: 203,
    comments: 41,
    commentsList: []
  },
  {
    id: 5,
    title: 'Sustainable E-Commerce: Green Shopping Practices',
    excerpt: 'Discover how eco-friendly practices can benefit both your business and the environment while attracting conscious consumers.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'Jessica Taylor',
      avatar: '/api/placeholder/40/40',
      bio: 'Sustainability consultant and green business advocate'
    },
    category: 'Sustainability',
    tags: ['sustainability', 'eco-friendly', 'green business', 'environment'],
    publishedAt: '2024-01-05',
    readTime: '9 min read',
    featured: true,
    likes: 178,
    comments: 25,
    commentsList: []
  },
  {
    id: 6,
    title: 'Social Media Marketing for E-Commerce Success',
    excerpt: 'Leverage the power of social platforms to drive traffic, engage customers, and boost your online sales.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'Robert Anderson',
      avatar: '/api/placeholder/40/40',
      bio: 'Social media marketing expert'
    },
    category: 'Marketing',
    tags: ['social media', 'marketing', 'engagement', 'sales'],
    publishedAt: '2024-01-03',
    readTime: '10 min read',
    featured: false,
    likes: 267,
    comments: 38,
    commentsList: []
  },
  {
    id: 7,
    title: 'Payment Gateway Integration: A Complete Guide',
    excerpt: 'Everything you need to know about integrating payment solutions into your e-commerce platform for seamless transactions.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'Alex Thompson',
      avatar: '/api/placeholder/40/40',
      bio: 'Payment systems and fintech specialist'
    },
    category: 'Technology',
    tags: ['payment gateway', 'integration', 'fintech', 'transactions'],
    publishedAt: '2024-01-01',
    readTime: '12 min read',
    featured: false,
    likes: 145,
    comments: 22,
    commentsList: []
  },
  {
    id: 8,
    title: 'Customer Service Excellence in Online Retail',
    excerpt: 'Build trust and loyalty through exceptional customer service that sets your e-commerce business apart from the competition.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'Maria Garcia',
      avatar: '/api/placeholder/40/40',
      bio: 'Customer service and support specialist'
    },
    category: 'Customer Service',
    tags: ['customer service', 'support', 'excellence', 'trust'],
    publishedAt: '2023-12-28',
    readTime: '6 min read',
    featured: false,
    likes: 198,
    comments: 31,
    commentsList: []
  },
  {
    id: 9,
    title: 'SEO Strategies for E-Commerce Websites',
    excerpt: 'Improve your search engine rankings and drive organic traffic with these proven SEO techniques for online stores.',
    content: 'Full blog content would go here...',
    image: '/api/placeholder/600/400',
    author: {
      name: 'Chris Wilson',
      avatar: '/api/placeholder/40/40',
      bio: 'SEO expert and digital strategist'
    },
    category: 'SEO',
    tags: ['SEO', 'search engine', 'traffic', 'optimization'],
    publishedAt: '2023-12-25',
    readTime: '8 min read',
    featured: true,
    likes: 312,
    comments: 45,
    commentsList: []
  }
]

const categories = [
  { name: 'All', slug: 'all', count: blogPosts.length },
  { name: 'E-Commerce', slug: 'e-commerce', count: 1 },
  { name: 'Technology', slug: 'technology', count: 2 },
  { name: 'Marketing', slug: 'marketing', count: 2 },
  { name: 'Mobile', slug: 'mobile', count: 1 },
  { name: 'Sustainability', slug: 'sustainability', count: 1 },
  { name: 'Customer Service', slug: 'customer-service', count: 1 },
  { name: 'SEO', slug: 'seo', count: 1 }
]

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [postsWithComments, setPostsWithComments] = useState<Map<number, Comment[]>>(new Map())
  const postsPerPage = 6

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

  const handleLikePost = (postId: number) => {
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

  const handleAddComment = (postId: number, comment: Omit<Comment, 'id' | 'timestamp'>) => {
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

  const handleLikeComment = (postId: number, commentId: string) => {
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

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase() === selectedCategory.toLowerCase()
      
      return matchesSearch && matchesCategory
    })

    return filtered
  }, [searchTerm, selectedCategory])

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Blog Header */}
      <BlogHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <Container className='py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Main Content */}
          <main className='flex-1'>
            {/* Featured Posts Section */}
            {currentPage === 1 && featuredPosts.length > 0 && (
              <section className='mb-12'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>Featured Posts</h2>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {featuredPosts.slice(0, 2).map((post) => (
                    <BlogCard 
                      key={post.id} 
                      post={{
                        ...post,
                        commentsList: postsWithComments.get(post.id) || []
                      }} 
                      featured={true}
                      onLikePost={handleLikePost}
                      onAddComment={handleAddComment}
                      onLikeComment={handleLikeComment}
                      likedPosts={likedPosts}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Posts Section */}
            <section>
              <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                {selectedCategory === 'all' ? 'All Posts' : categories.find(c => c.slug === selectedCategory)?.name}
              </h2>
              
              {currentPosts.length > 0 ? (
                <>
                  <div className='grid grid-cols-1 gap-6'>
                    {currentPosts.map((post) => (
                      <BlogCard 
                        key={post.id} 
                        post={{
                          ...post,
                          commentsList: postsWithComments.get(post.id) || []
                        }}
                        featured={false}
                        onLikePost={handleLikePost}
                        onAddComment={handleAddComment}
                        onLikeComment={handleLikeComment}
                        likedPosts={likedPosts}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                      totalItems={filteredPosts.length}
                      itemsPerPage={postsPerPage}
                    />
                  )}
                </>
              ) : (
                <div className='text-center py-16'>
                  <div className='text-gray-400 text-6xl mb-4'>📝</div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    No blog posts found
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    Try adjusting your search or category filter to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('all')
                      setCurrentPage(1)
                    }}
                    className='bg-shop_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg hoverEffect'
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>
          </main>

          {/* Sidebar */}
          <aside className='lg:w-80 flex-shrink-0'>
            <BlogSidebar 
              recentPosts={blogPosts.slice(0, 5)}
              categories={categories}
              allTags={Array.from(new Set(blogPosts.flatMap(post => post.tags)))}
            />
          </aside>
        </div>
      </Container>
    </div>
  )
}

export default BlogPage
