'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, Heart, MessageCircle, User, ArrowLeft, Share2 } from 'lucide-react'
import CommentSection from '@/components/CommentSection'
import Container from '@/components/Container'

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

// Sample blog data - in a real app, this would come from an API
const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: '10 Essential E-Commerce Tips for Online Success',
    excerpt: 'Discover the top strategies and tips to boost your online store\'s performance and increase sales in today\'s competitive digital marketplace.',
    content: `# 10 Essential E-Commerce Tips for Online Success

In today's competitive digital marketplace, running a successful e-commerce business requires more than just having a website. It demands strategic planning, customer-centric approaches, and continuous optimization. Here are ten essential tips that can help transform your online store into a thriving business.

## 1. Optimize Your Website for Mobile

With over 70% of online shopping happening on mobile devices, having a mobile-responsive website is no longer optional. Ensure your site loads quickly on smartphones, has easy navigation, and provides a seamless checkout experience.

## 2. Invest in High-Quality Product Images

Customers can't touch or try your products online, so your images need to do the heavy lifting. Invest in professional photography, multiple angles, and zoom functionality to give customers the best possible view of your products.

## 3. Streamline the Checkout Process

Cart abandonment is a major challenge in e-commerce. Reduce friction by:
- Offering guest checkout options
- Minimizing form fields
- Providing multiple payment methods
- Displaying security badges

## 4. Implement SEO Best Practices

Search engine optimization drives organic traffic to your store. Focus on:
- Keyword research for product descriptions
- Optimizing meta tags and descriptions
- Building quality backlinks
- Creating valuable content

## 5. Leverage Social Proof

Build trust through customer reviews, testimonials, and user-generated content. Display ratings prominently and encourage satisfied customers to share their experiences.

## 6. Personalize the Shopping Experience

Use data to provide personalized recommendations, targeted promotions, and customized content. Personalization can increase conversion rates by up to 30%.

## 7. Offer Excellent Customer Service

Provide multiple support channels (chat, email, phone), respond quickly to inquiries, and have a clear return policy. Excellent service builds loyalty and positive word-of-mouth.

## 8. Use Email Marketing Effectively

Build your email list and send targeted campaigns with:
- Welcome series for new subscribers
- Abandoned cart reminders
- Personalized product recommendations
- Special promotions for loyal customers

## 9. Analyze Your Data

Regularly review analytics to understand customer behavior, popular products, and conversion funnels. Use these insights to make data-driven decisions.

## 10. Stay Updated with Technology

E-commerce technology evolves rapidly. Keep up with new trends, tools, and platforms that can give you a competitive edge.

## Conclusion

Success in e-commerce requires continuous learning and adaptation. By implementing these ten essential tips, you'll be well-positioned to build a profitable online business that serves customers effectively and scales sustainably.

Remember, the key is to always put your customers first and create experiences that keep them coming back.`,
    image: '/api/placeholder/1200/600',
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
    content: `# The Future of Online Shopping: Trends to Watch in 2024

The e-commerce landscape is evolving at an unprecedented pace. As we move further into 2024, several key trends are emerging that will shape how consumers shop and how businesses operate online.

## Artificial Intelligence and Machine Learning

AI is revolutionizing e-commerce in multiple ways:

### Personalized Shopping Experiences
Machine learning algorithms analyze browsing behavior, purchase history, and preferences to provide highly personalized product recommendations. This level of personalization increases conversion rates and customer satisfaction.

### Chatbots and Virtual Assistants
AI-powered chatbots provide instant customer support, answer queries, and even help with product selection, available 24/7 without human intervention.

### Visual Search
Customers can now search for products using images instead of text. Simply upload a photo, and AI finds similar products in your inventory.

## Augmented Reality Shopping

AR technology bridges the gap between online and in-store shopping:

### Virtual Try-On
Customers can see how furniture looks in their home or how clothes fit on their body using their smartphone camera.

### Interactive Product Visualization
AR allows customers to explore products from all angles, zoom in on features, and see how they work in real-world scenarios.

## Sustainability and Ethical Shopping

Modern consumers are increasingly conscious of environmental impact:

### Eco-Friendly Products
Businesses are highlighting sustainable materials, ethical sourcing, and environmental certifications.

### Carbon Footprint Tracking
Some platforms now show the environmental impact of purchases, allowing consumers to make informed decisions.

### Circular Economy
Second-hand markets, rental services, and product-as-a-service models are gaining popularity.

## Social Commerce Integration

Social media platforms are becoming shopping destinations:

### In-App Purchases
Users can buy products directly without leaving their favorite social apps.

### Influencer Partnerships
Brands collaborate with influencers for authentic product recommendations and shoppable content.

### Live Shopping Events
Real-time streaming events combine entertainment with shopping, creating urgency and engagement.

## Voice Commerce

Voice assistants are changing how people shop:

### Voice Search Optimization
Businesses optimize for natural language queries and conversational search.

### Reordering Convenience
Customers can reorder frequently purchased items with simple voice commands.

## Conclusion

The future of e-commerce is exciting and full of possibilities. Businesses that embrace these trends and adapt to changing consumer preferences will thrive in the coming years.

Stay ahead by investing in technology, prioritizing customer experience, and maintaining flexibility in your business strategy.`,
    image: '/api/placeholder/1200/600',
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
  }
  // ... other posts would be here
]

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = parseInt(params.id as string)
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [postsWithComments, setPostsWithComments] = useState<Map<number, Comment[]>>(new Map())
  const [showShareMenu, setShowShareMenu] = useState(false)

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

  // Find the post
  useEffect(() => {
    const foundPost = blogPosts.find(p => p.id === postId)
    setPost(foundPost || null)
  }, [postId])

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

        {/* Blog Post Content */}
        <article className='max-w-4xl mx-auto'>
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
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className='text-sm font-medium text-gray-900'>
                    {post.author.name}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {post.author.bio}
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
              <div className='text-gray-400 text-center'>
                <div className='w-24 h-24 bg-gray-300 rounded-lg mx-auto mb-4'></div>
                <p className='text-lg'>Blog Featured Image</p>
              </div>
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
      </Container>
    </div>
  )
}
