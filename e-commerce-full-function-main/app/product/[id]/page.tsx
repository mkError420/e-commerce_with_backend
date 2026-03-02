'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  ArrowLeft, 
  Truck, 
  Shield, 
  RefreshCw,
  Minus,
  Plus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn
} from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useSlideCart } from '@/contexts/SlideCartContext'
import { productsData } from '@/constants/data'

const ProductDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { openSlideCart } = useSlideCart()
  
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      title: 'Excellent Product!',
      comment: 'This product exceeded my expectations. Great quality and fast delivery. Highly recommend!',
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      rating: 4,
      date: '2024-01-10',
      title: 'Good Value for Money',
      comment: 'Overall satisfied with the purchase. The quality is good and the price is reasonable. Minor issues with packaging but product itself is great.',
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      name: 'Emily Davis',
      rating: 5,
      date: '2024-01-05',
      title: 'Perfect Purchase',
      comment: 'Exactly what I was looking for. The product works perfectly and the customer service was excellent.',
      helpful: 15,
      verified: false
    }
  ])
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    title: '',
    comment: ''
  })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reportModal, setReportModal] = useState<{ open: boolean; reviewId: number | null }>({ open: false, reviewId: null })
  const [shareModal, setShareModal] = useState<{ open: boolean; reviewId: number | null }>({ open: false, reviewId: null })
  const [reportReason, setReportReason] = useState('')

  // Find product by ID
  const product = productsData.find(p => p.id === parseInt(params.id as string))

  // Load reviews from localStorage on component mount
  React.useEffect(() => {
    if (product) {
      const storedReviews = localStorage.getItem(`product_reviews_${product.id}`)
      if (storedReviews) {
        try {
          const parsedReviews = JSON.parse(storedReviews)
          setReviews(parsedReviews)
        } catch (error) {
          console.error('Error loading reviews from localStorage:', error)
        }
      }
    }
  }, [product?.id])

  // Save reviews to localStorage whenever they change
  React.useEffect(() => {
    if (product && reviews.length > 0) {
      localStorage.setItem(`product_reviews_${product.id}`, JSON.stringify(reviews))
    }
  }, [reviews, product?.id])

  // Check if product is already in wishlist on component mount
  React.useEffect(() => {
    if (product) {
      const currentWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]')
      const isInWishlist = currentWishlist.some((item: any) => item.id === product.id)
      setIsInWishlist(isInWishlist)
    }
  }, [product?.id])

  if (!product) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-4'>Product Not Found</h2>
          <p className='text-gray-600 mb-8'>The product you're looking for doesn't exist.</p>
          <Link 
            href='/shop'
            className='inline-flex items-center bg-shop_btn_dark_green text-white px-8 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300'
          >
            <ArrowLeft className='w-5 h-5 mr-2' />
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const discountPercentage = Math.round(((product.originalPrice || product.price) - product.price) / (product.originalPrice || product.price) * 100)

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      quantity: quantity
    }
    addToCart(productToAdd, 'product')
    openSlideCart()
    setIsAddedToCart(true)
    setTimeout(() => setIsAddedToCart(false), 2000)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist)
    
    // Get current wishlist from localStorage
    const currentWishlist = JSON.parse(localStorage.getItem('wishlist_items') || '[]')
    
    if (!isInWishlist) {
      // Add to wishlist
      const wishlistItem = {
        ...product,
        addedDate: new Date().toISOString()
      }
      const updatedWishlist = [...currentWishlist, wishlistItem]
      localStorage.setItem('wishlist_items', JSON.stringify(updatedWishlist))
      console.log('Added to wishlist:', product.name)
    } else {
      // Remove from wishlist
      const updatedWishlist = currentWishlist.filter((item: any) => item.id !== product.id)
      localStorage.setItem('wishlist_items', JSON.stringify(updatedWishlist))
      console.log('Removed from wishlist:', product.name)
    }
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newReview.name && newReview.title && newReview.comment) {
      const review = {
        id: reviews.length + 1,
        name: newReview.name,
        rating: newReview.rating,
        date: new Date().toISOString().split('T')[0],
        title: newReview.title,
        comment: newReview.comment,
        helpful: 0,
        verified: false
      }
      setReviews([review, ...reviews])
      setNewReview({ name: '', rating: 5, title: '', comment: '' })
      setShowReviewForm(false)
    }
  }

  const handleHelpfulClick = (reviewId: number) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ))
  }

  const handleReportClick = (reviewId: number) => {
    setReportModal({ open: true, reviewId })
    setReportReason('')
  }

  const handleReportSubmit = () => {
    if (reportReason && reportModal.reviewId) {
      console.log('Report submitted for review:', reportModal.reviewId, 'Reason:', reportReason)
      // Here you can add actual report logic (API call, etc.)
      setReportModal({ open: false, reviewId: null })
      setReportReason('')
      // You could show a success message here
    }
  }

  const handleShareClick = (reviewId: number) => {
    setShareModal({ open: true, reviewId })
  }

  const handleShareAction = (platform: string) => {
    const review = reviews.find(r => r.id === shareModal.reviewId)
    if (review) {
      const shareText = `Check out this review: "${review.title}" - ${review.comment.substring(0, 100)}...`
      const shareUrl = `${window.location.origin}/product/${product.id}#review-${shareModal.reviewId}`
      
      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`, '_blank')
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
          break
        case 'copy':
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
          // You could show a success message here
          break
      }
    }
    setShareModal({ open: false, reviewId: null })
  }

  const handleImageClick = (imageIndex: number) => {
    setModalImageIndex(imageIndex)
    setImageModalOpen(true)
  }

  const handleModalClose = () => {
    setImageModalOpen(false)
  }

  const handlePreviousImage = () => {
    setModalImageIndex((prev) => (prev === 0 ? 3 : prev - 1))
  }

  const handleNextImage = () => {
    setModalImageIndex((prev) => (prev === 3 ? 0 : prev + 1))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!imageModalOpen) return
    
    switch (e.key) {
      case 'Escape':
        handleModalClose()
        break
      case 'ArrowLeft':
        handlePreviousImage()
        break
      case 'ArrowRight':
        handleNextImage()
        break
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8' onKeyDown={handleKeyDown} tabIndex={0}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <nav className='flex items-center space-x-2 text-sm text-gray-500 mb-8'>
          <Link href='/' className='hover:text-gray-900'>Home</Link>
          <span>/</span>
          <Link href='/shop' className='hover:text-gray-900'>Shop</Link>
          <span>/</span>
          <span className='text-gray-900'>{product.name}</span>
        </nav>

        <div className='grid lg:grid-cols-2 gap-12'>
          {/* Product Images */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div 
              className='relative overflow-hidden rounded-xl bg-gray-100 aspect-square cursor-pointer group'
              onClick={() => handleImageClick(selectedImage)}
            >
              {product.badge && (
                <div className='absolute top-4 left-4 z-10'>
                  <span className='bg-shop_orange text-white px-3 py-1 rounded-full text-xs font-semibold'>
                    {product.badge}
                  </span>
                </div>
              )}
              
              {product.originalPrice && (
                <div className='absolute top-4 right-4 z-10'>
                  <span className='bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold'>
                    -{discountPercentage}%
                  </span>
                </div>
              )}

              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-10 flex items-center justify-center'>
                <ZoomIn className='w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
              </div>

              <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                <div className='text-gray-400 text-center'>
                  <div className='w-32 h-32 bg-gray-300 rounded-lg mx-auto mb-4'></div>
                  <p className='text-sm'>Product Image {selectedImage + 1}</p>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className='grid grid-cols-4 gap-2'>
              {[...Array(4)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg bg-gray-100 aspect-square border-2 transition-all duration-200 cursor-pointer ${
                    selectedImage === index ? 'border-shop_dark_green' : 'border-gray-200'
                  }`}
                >
                  <div className='w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
                    <div className='w-12 h-12 bg-gray-300 rounded'></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className='space-y-6'>
            {/* Header */}
            <div>
              <div className='text-sm text-shop_dark_green font-semibold mb-2 uppercase tracking-wide'>
                {product.category}
              </div>
              <h1 className='text-3xl font-bold text-gray-900 mb-4'>{product.name}</h1>
              
              {/* Rating */}
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        product.rating && i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className='text-sm text-gray-600'>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className='flex items-center gap-4'>
              <span className='text-3xl font-bold text-shop_dark_green'>
                ৳{product.price}
              </span>
              {product.originalPrice && (
                <span className='text-xl text-gray-400 line-through'>
                  ৳{product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>Short Description</h3>
              <p className='text-gray-600 leading-relaxed'>
                {product.description}
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className='space-y-4'>
              <div className='flex items-center gap-4'>
                <label className='text-sm font-medium text-gray-700'>Quantity:</label>
                <div className='flex items-center border border-gray-300 rounded-lg'>
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className='p-2 hover:bg-gray-100 transition-colors'
                  >
                    <Minus className='w-4 h-4' />
                  </button>
                  <span className='px-4 py-2 font-medium'>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className='p-2 hover:bg-gray-100 transition-colors'
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isAddedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-shop_btn_dark_green text-white hover:bg-shop_dark_green hover:shadow-lg'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <Check className='w-5 h-5' />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className='w-5 h-5' />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className='space-y-3 pt-6 border-t border-gray-200'>
              <div className='flex items-center gap-3'>
                <Truck className='w-5 h-5 text-shop_dark_green' />
                <span className='text-sm text-gray-600'>Free shipping on orders over ৳10000</span>
              </div>
              <div className='flex items-center gap-3'>
                <Shield className='w-5 h-5 text-shop_dark_green' />
                <span className='text-sm text-gray-600'>1 year warranty included</span>
              </div>
              <div className='flex items-center gap-3'>
                <RefreshCw className='w-5 h-5 text-shop_dark_green' />
                <span className='text-sm text-gray-600'>30-day return policy</span>
              </div>
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-6 border-t border-gray-200'>
              <button 
                onClick={handleWishlistToggle}
                className={`flex-1 py-3 rounded-xl font-semibold hover:shadow-lg hoverEffect flex items-center justify-center gap-2 transition-all duration-300 ${
                  isInWishlist 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Description Section */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>Description</h2>
          <div className='bg-white rounded-xl shadow-sm p-8'>
            <div className='prose prose-lg max-w-none'>
              <p className='text-gray-600 leading-relaxed mb-6'>
                {product.description}
              </p>
              <div className='grid md:grid-cols-2 gap-8 mt-8'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Key Features</h3>
                  <ul className='space-y-2 text-gray-600'>
                    <li className='flex items-start gap-2'>
                      <Check className='w-5 h-5 text-shop_dark_green mt-0.5 flex-shrink-0' />
                      <span>Premium quality materials and construction</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <Check className='w-5 h-5 text-shop_dark_green mt-0.5 flex-shrink-0' />
                      <span>Modern design with aesthetic appeal</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <Check className='w-5 h-5 text-shop_dark_green mt-0.5 flex-shrink-0' />
                      <span>Durable and long-lasting performance</span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <Check className='w-5 h-5 text-shop_dark_green mt-0.5 flex-shrink-0' />
                      <span>Easy to use and maintain</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Specifications</h3>
                  <dl className='space-y-3'>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <dt className='text-gray-600'>Category</dt>
                      <dd className='font-medium text-gray-900'>{product.category}</dd>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <dt className='text-gray-600'>Condition</dt>
                      <dd className='font-medium text-gray-900'>Brand New</dd>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <dt className='text-gray-600'>Availability</dt>
                      <dd className='font-medium text-green-600'>In Stock</dd>
                    </div>
                    <div className='flex justify-between py-2 border-b border-gray-100'>
                      <dt className='text-gray-600'>Shipping</dt>
                      <dd className='font-medium text-gray-900'>Free shipping over ৳10000</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className='mt-16'>
          <div className='flex items-center justify-between mb-8'>
            <h2 className='text-2xl font-bold text-gray-900'>Customer Reviews</h2>
            <button 
              onClick={() => setShowReviewForm(!showReviewForm)}
              className='bg-shop_btn_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300'
            >
              Write a Review
            </button>
          </div>

          {/* Review Summary */}
          <div className='bg-white rounded-xl shadow-sm p-6 mb-8'>
            <div className='grid md:grid-cols-2 gap-8'>
              {/* Rating Overview */}
              <div className='text-center'>
                <div className='text-5xl font-bold text-gray-900 mb-2'>
                  {product.rating || 4.5}
                </div>
                <div className='flex items-center justify-center gap-1 mb-2'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        (product.rating || 4.5) && i < Math.floor(product.rating || 4.5)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className='text-gray-600'>
                  Based on {product.reviews || reviews.length} reviews
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className='space-y-2'>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter(r => r.rating === rating).length
                  const percentage = (count / reviews.length) * 100
                  return (
                    <div key={rating} className='flex items-center gap-3'>
                      <span className='text-sm text-gray-600 w-8'>{rating}★</span>
                      <div className='flex-1 bg-gray-200 rounded-full h-2 overflow-hidden'>
                        <div 
                          className='bg-yellow-400 h-full rounded-full transition-all duration-500'
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className='text-sm text-gray-600 w-8 text-right'>{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className='bg-white rounded-xl shadow-sm p-6 mb-8'>
              <h3 className='text-xl font-semibold text-gray-900 mb-6'>Write Your Review</h3>
              <form onSubmit={handleReviewSubmit} className='space-y-6'>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
                    <input
                      type='text'
                      value={newReview.name}
                      onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                      className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                      placeholder='Enter your name'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Rating</label>
                    <div className='flex items-center gap-2'>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type='button'
                          onClick={() => setNewReview({...newReview, rating})}
                          className='p-1 transition-colors duration-200'
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= newReview.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Review Title</label>
                  <input
                    type='text'
                    value={newReview.title}
                    onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green'
                    placeholder='Summarize your experience'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-shop_dark_green h-32 resize-none'
                    placeholder='Tell us about your experience with this product'
                    required
                  ></textarea>
                </div>
                <div className='flex gap-4'>
                  <button
                    type='submit'
                    className='bg-shop_btn_dark_green text-white px-6 py-3 rounded-xl font-semibold hover:bg-shop_dark_green hover:shadow-lg transition-all duration-300'
                  >
                    Submit Review
                  </button>
                  <button
                    type='button'
                    onClick={() => setShowReviewForm(false)}
                    className='border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300'
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className='space-y-6'>
            {reviews.map((review) => (
              <div key={review.id} className='bg-white rounded-xl shadow-sm p-6'>
                <div className='flex items-start justify-between mb-4'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center'>
                      <span className='text-gray-600 font-semibold'>
                        {review.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-semibold text-gray-900'>{review.name}</h4>
                        {review.verified && (
                          <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium'>
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-500'>
                        <div className='flex items-center gap-1'>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                review.rating > i
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span>•</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className='mb-4'>
                  <h5 className='font-semibold text-gray-900 mb-2'>{review.title}</h5>
                  <p className='text-gray-600 leading-relaxed'>{review.comment}</p>
                </div>
                
                <div className='flex items-center justify-between pt-4 border-t border-gray-100'>
                  <button
                    onClick={() => handleHelpfulClick(review.id)}
                    className='flex items-center gap-2 text-sm text-gray-600 hover:text-shop_dark_green transition-colors duration-200'
                  >
                    <span>👍 Helpful</span>
                    <span>({review.helpful})</span>
                  </button>
                  <div className='flex items-center gap-4 text-sm text-gray-500'>
                    <button 
                      onClick={() => handleReportClick(review.id)}
                      className='hover:text-red-600 transition-colors duration-200'
                    >
                      Report
                    </button>
                    <button 
                      onClick={() => handleShareClick(review.id)}
                      className='hover:text-shop_dark_green transition-colors duration-200'
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Modal */}
        {reportModal.open && (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl max-w-md w-full p-6'>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>Report Review</h3>
              <p className='text-gray-600 mb-6'>
                Please let us know why you're reporting this review. We'll review it and take appropriate action.
              </p>
              
              <div className='space-y-4 mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Reason for reporting</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500'
                >
                  <option value=''>Select a reason</option>
                  <option value='spam'>Spam or fake content</option>
                  <option value='offensive'>Offensive language</option>
                  <option value='inappropriate'>Inappropriate content</option>
                  <option value='irrelevant'>Irrelevant to product</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              <div className='flex gap-4'>
                <button
                  onClick={handleReportSubmit}
                  disabled={!reportReason}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    reportReason
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setReportModal({ open: false, reviewId: null })}
                  className='flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300'
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {shareModal.open && (
          <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
            <div className='bg-white rounded-2xl max-w-md w-full p-6'>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>Share Review</h3>
              <p className='text-gray-600 mb-6'>
                Share this helpful review with others
              </p>
              
              <div className='space-y-3 mb-6'>
                <button
                  onClick={() => handleShareAction('facebook')}
                  className='w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200'
                >
                  <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm font-bold'>f</span>
                  </div>
                  <div className='text-left'>
                    <div className='font-medium text-gray-900'>Facebook</div>
                    <div className='text-sm text-gray-500'>Share on Facebook</div>
                  </div>
                </button>

                <button
                  onClick={() => handleShareAction('twitter')}
                  className='w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200'
                >
                  <div className='w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm font-bold'>𝕏</span>
                  </div>
                  <div className='text-left'>
                    <div className='font-medium text-gray-900'>Twitter</div>
                    <div className='text-sm text-gray-500'>Share on Twitter</div>
                  </div>
                </button>

                <button
                  onClick={() => handleShareAction('copy')}
                  className='w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200'
                >
                  <div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm'>🔗</span>
                  </div>
                  <div className='text-left'>
                    <div className='font-medium text-gray-900'>Copy Link</div>
                    <div className='text-sm text-gray-500'>Copy review link to clipboard</div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShareModal({ open: false, reviewId: null })}
                className='w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300'
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Image Gallery Modal */}
        {imageModalOpen && (
          <div className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'>
            <div className='relative max-w-5xl w-full h-full max-h-[90vh] flex items-center justify-center'>
              {/* Close Button */}
              <button
                onClick={handleModalClose}
                className='absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300'
              >
                <X className='w-6 h-6' />
              </button>

              {/* Previous Button */}
              <button
                onClick={handlePreviousImage}
                className='absolute left-4 z-10 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className='absolute right-4 z-10 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300'
              >
                <ChevronRight className='w-6 h-6' />
              </button>

              {/* Main Image */}
              <div className='relative w-full h-full flex items-center justify-center'>
                <div className='w-full h-full max-w-4xl max-h-[80vh] bg-white rounded-2xl shadow-2xl flex items-center justify-center'>
                  <div className='text-gray-400 text-center p-8'>
                    <div className='w-64 h-64 bg-gray-300 rounded-2xl mx-auto mb-6'></div>
                    <p className='text-xl font-medium'>Product Image {modalImageIndex + 1}</p>
                    <p className='text-sm mt-2 opacity-70'>Click outside or press ESC to close</p>
                  </div>
                </div>
              </div>

              {/* Image Indicators */}
              <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2'>
                {[...Array(4)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setModalImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      modalImageIndex === index 
                        ? 'bg-white w-8' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Related Products */}
        <div className='mt-16'>
          <h2 className='text-2xl font-bold text-gray-900 mb-8'>Related Products</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {productsData
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <div key={relatedProduct.id} className='bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6'>
                  <div className='w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center'>
                    <div className='w-16 h-16 bg-gray-300 rounded'></div>
                  </div>
                  <h3 className='font-semibold text-gray-900 mb-2 line-clamp-2'>{relatedProduct.name}</h3>
                  <div className='flex items-center justify-between'>
                    <span className='text-lg font-bold text-shop_dark_green'>৳{relatedProduct.price}</span>
                    <Link 
                      href={`/product/${relatedProduct.id}`}
                      className='text-shop_dark_green hover:underline text-sm font-medium'
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
