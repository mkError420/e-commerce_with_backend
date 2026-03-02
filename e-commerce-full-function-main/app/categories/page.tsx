'use client'

import React, { useState, useMemo } from 'react'
import Container from '@/components/Container'
import { 
  Smartphone, 
  Laptop, 
  Shirt, 
  Home, 
  Book, 
  Heart, 
  Gamepad2, 
  Camera,
  Baby,
  Car,
  Dumbbell,
  Music,
  Plane,
  ShoppingBag,
  Watch,
  Utensils,
  Palette,
  Dog,
  Wrench,
  Coffee,
  Tv,
  Headphones,
  Smartphone as Phone,
  Package,
  Gift,
  Star
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: 'Electronics',
    icon: Smartphone,
    href: '/categories/electronics',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    cardStyle: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    iconBg: 'bg-blue-100 text-blue-600',
    description: 'Smartphones, tablets, accessories',
    productCount: 1250,
    subcategories: ['Mobile Phones', 'Tablets', 'Accessories', 'Smart Watches'],
    layout: 'featured'
  },
  {
    name: 'Computers',
    icon: Laptop,
    href: '/categories/computers',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
    cardStyle: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
    iconBg: 'bg-purple-100 text-purple-600',
    description: 'Laptops, desktops, components',
    productCount: 890,
    subcategories: ['Laptops', 'Desktops', 'Monitors', 'Components'],
    layout: 'standard'
  },
  {
    name: 'Fashion',
    icon: Shirt,
    href: '/categories/fashion',
    color: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white',
    cardStyle: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200',
    iconBg: 'bg-pink-100 text-pink-600',
    description: 'Clothing, shoes, accessories',
    productCount: 3420,
    subcategories: ["Men's Wear", "Women's Wear", "Kids Wear", "Shoes", "Accessories"],
    layout: 'trending'
  },
  {
    name: 'Home & Living',
    icon: Home,
    href: '/categories/home',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600 text-white',
    cardStyle: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    iconBg: 'bg-green-100 text-green-600',
    description: 'Furniture, decor, kitchen',
    productCount: 2100,
    subcategories: ['Furniture', 'Kitchen', 'Decor', 'Bedding', 'Storage'],
    layout: 'standard'
  },
  {
    name: 'Books',
    icon: Book,
    href: '/categories/books',
    color: 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white',
    cardStyle: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200',
    iconBg: 'bg-yellow-100 text-yellow-600',
    description: 'Fiction, non-fiction, educational',
    productCount: 5600,
    subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Comics', 'E-books'],
    layout: 'compact'
  },
  {
    name: 'Health & Beauty',
    icon: Heart,
    href: '/categories/health',
    color: 'bg-gradient-to-br from-red-500 to-pink-600 text-white',
    cardStyle: 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200',
    iconBg: 'bg-red-100 text-red-600',
    description: 'Skincare, makeup, wellness',
    productCount: 1890,
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Wellness', 'Supplements'],
    layout: 'featured'
  },
  {
    name: 'Gaming',
    icon: Gamepad2,
    href: '/categories/gaming',
    color: 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
    cardStyle: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
    iconBg: 'bg-indigo-100 text-indigo-600',
    description: 'Consoles, games, accessories',
    productCount: 750,
    subcategories: ['Consoles', 'Video Games', 'Accessories', 'Gaming Chairs'],
    layout: 'gaming'
  },
  {
    name: 'Photography',
    icon: Camera,
    href: '/categories/photography',
    color: 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white',
    cardStyle: 'bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200',
    iconBg: 'bg-teal-100 text-teal-600',
    description: 'Cameras, lenses, equipment',
    productCount: 420,
    subcategories: ['DSLR Cameras', 'Mirrorless', 'Lenses', 'Accessories'],
    layout: 'standard'
  },
  {
    name: 'Sports & Outdoors',
    icon: Dumbbell,
    href: '/categories/sports',
    color: 'bg-gradient-to-br from-orange-500 to-red-600 text-white',
    cardStyle: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200',
    iconBg: 'bg-orange-100 text-orange-600',
    description: 'Fitness equipment, outdoor gear',
    productCount: 1680,
    subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports'],
    layout: 'active'
  },
  {
    name: 'Toys & Games',
    icon: Gamepad2,
    href: '/categories/toys',
    color: 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white',
    cardStyle: 'bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200',
    iconBg: 'bg-cyan-100 text-cyan-600',
    description: 'Educational toys, board games',
    productCount: 2340,
    subcategories: ['Educational Toys', 'Board Games', 'Action Figures', 'Puzzles'],
    layout: 'playful'
  },
  {
    name: 'Baby & Kids',
    icon: Baby,
    href: '/categories/baby',
    color: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
    cardStyle: 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200',
    iconBg: 'bg-rose-100 text-rose-600',
    description: 'Baby care, kids products',
    productCount: 1560,
    subcategories: ['Baby Care', 'Kids Clothing', 'Toys', 'Furniture'],
    layout: 'cute'
  },
  {
    name: 'Automotive',
    icon: Car,
    href: '/categories/automotive',
    color: 'bg-gradient-to-br from-slate-600 to-gray-800 text-white',
    cardStyle: 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200',
    iconBg: 'bg-slate-100 text-slate-600',
    description: 'Car parts, accessories',
    productCount: 980,
    subcategories: ['Car Parts', 'Accessories', 'Tools', 'Electronics'],
    layout: 'technical'
  },
  {
    name: 'Music & Audio',
    icon: Music,
    href: '/categories/music',
    color: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
    cardStyle: 'bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200',
    iconBg: 'bg-violet-100 text-violet-600',
    description: 'Instruments, audio equipment',
    productCount: 670,
    subcategories: ['Musical Instruments', 'Audio Equipment', 'Records', 'Accessories'],
    layout: 'creative'
  },
  {
    name: 'Travel',
    icon: Plane,
    href: '/categories/travel',
    color: 'bg-gradient-to-br from-sky-500 to-blue-600 text-white',
    cardStyle: 'bg-gradient-to-br from-sky-50 to-blue-50 border-sky-200',
    iconBg: 'bg-sky-100 text-sky-600',
    description: 'Luggage, travel accessories',
    productCount: 540,
    subcategories: ['Luggage', 'Backpacks', 'Travel Accessories', 'Travel Gear'],
    layout: 'adventure'
  },
  {
    name: 'Jewelry & Watches',
    icon: Watch,
    href: '/categories/jewelry',
    color: 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white',
    cardStyle: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600',
    description: 'Fine jewelry, watches',
    productCount: 1890,
    subcategories: ['Fine Jewelry', 'Fashion Jewelry', 'Watches', 'Accessories'],
    layout: 'luxury'
  },
  {
    name: 'Food & Beverages',
    icon: Utensils,
    href: '/categories/food',
    color: 'bg-gradient-to-br from-lime-500 to-green-600 text-white',
    cardStyle: 'bg-gradient-to-br from-lime-50 to-green-50 border-lime-200',
    iconBg: 'bg-lime-100 text-lime-600',
    description: 'Groceries, snacks, beverages',
    productCount: 3200,
    subcategories: ['Groceries', 'Snacks', 'Beverages', 'Organic Food'],
    layout: 'fresh'
  },
  {
    name: 'Art & Crafts',
    icon: Palette,
    href: '/categories/art',
    color: 'bg-gradient-to-br from-fuchsia-500 to-pink-600 text-white',
    cardStyle: 'bg-gradient-to-br from-fuchsia-50 to-pink-50 border-fuchsia-200',
    iconBg: 'bg-fuchsia-100 text-fuchsia-600',
    description: 'Art supplies, craft materials',
    productCount: 890,
    subcategories: ['Art Supplies', 'Craft Materials', 'DIY Kits', 'Painting'],
    layout: 'artistic'
  },
  {
    name: 'Pet Supplies',
    icon: Dog,
    href: '/categories/pets',
    color: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    cardStyle: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600',
    description: 'Pet food, accessories, toys',
    productCount: 1230,
    subcategories: ['Dog Supplies', 'Cat Supplies', 'Bird Supplies', 'Pet Food'],
    layout: 'friendly'
  },
  {
    name: 'Tools & Hardware',
    icon: Wrench,
    href: '/categories/tools',
    color: 'bg-gradient-to-br from-stone-600 to-gray-700 text-white',
    cardStyle: 'bg-gradient-to-br from-stone-50 to-gray-50 border-stone-200',
    iconBg: 'bg-stone-100 text-stone-600',
    description: 'Power tools, hardware',
    productCount: 760,
    subcategories: ['Power Tools', 'Hand Tools', 'Hardware', 'Garden Tools'],
    layout: 'industrial'
  },
  {
    name: 'Kitchen & Dining',
    icon: Coffee,
    href: '/categories/kitchen',
    color: 'bg-gradient-to-br from-orange-500 to-red-600 text-white',
    cardStyle: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200',
    iconBg: 'bg-orange-100 text-orange-600',
    description: 'Cookware, appliances, dining',
    productCount: 1450,
    subcategories: ['Cookware', 'Small Appliances', 'Dining', 'Bakery'],
    layout: 'cozy'
  },
  {
    name: 'TV & Home Theater',
    icon: Tv,
    href: '/categories/tv',
    color: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white',
    cardStyle: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    iconBg: 'bg-blue-100 text-blue-600',
    description: 'TVs, sound systems, streaming',
    productCount: 680,
    subcategories: ['TVs', 'Sound Systems', 'Streaming Devices', 'Cables'],
    layout: 'entertainment'
  },
  {
    name: 'Audio & Headphones',
    icon: Headphones,
    href: '/categories/audio',
    color: 'bg-gradient-to-br from-purple-600 to-pink-700 text-white',
    cardStyle: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
    iconBg: 'bg-purple-100 text-purple-600',
    description: 'Headphones, speakers, audio',
    productCount: 920,
    subcategories: ['Headphones', 'Speakers', 'Audio Accessories', 'Pro Audio'],
    layout: 'sound'
  },
  {
    name: 'Office Supplies',
    icon: Package,
    href: '/categories/office',
    color: 'bg-gradient-to-br from-gray-600 to-slate-700 text-white',
    cardStyle: 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200',
    iconBg: 'bg-gray-100 text-gray-600',
    description: 'Stationery, office furniture',
    productCount: 1100,
    subcategories: ['Stationery', 'Office Furniture', 'Storage', 'Technology'],
    layout: 'professional'
  },
  {
    name: 'Gifts & Occasions',
    icon: Gift,
    href: '/categories/gifts',
    color: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white',
    cardStyle: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200',
    iconBg: 'bg-pink-100 text-pink-600',
    description: 'Gift ideas, party supplies',
    productCount: 2340,
    subcategories: ['Gift Ideas', 'Party Supplies', 'Gift Cards', 'Seasonal'],
    layout: 'celebration'
  }
]

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredCategories = useMemo(() => {
    return categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.subcategories.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'all' || category.name === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const categoryOptions = ['all', ...categories.map(cat => cat.name)]

  return (
    <div className='bg-shop-light-pink min-h-screen'>
      <Container className='bg-transparent py-8'>
        {/* Breadcrumb */}
        <nav className='mb-8'>
          <ol className='flex items-center space-x-2 text-sm text-gray-600'>
            <li>
              <Link href='/' className='hover:text-shop_dark_green transition-colors'>
                Home
              </Link>
            </li>
            <li className='flex items-center'>
              <svg className='w-4 h-4 mx-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
              <span className='text-shop_dark_green font-medium'>Categories</span>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
            All <span className='text-shop_dark_green'>Categories</span>
          </h1>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto mb-8'>
            Browse our complete collection of products across all categories. Find exactly what you're looking for with our organized catalog.
          </p>
          
          {/* Search Bar */}
          <div className='max-w-2xl mx-auto mb-8'>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search categories, products, or subcategories...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-6 py-4 pr-12 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-shop_dark_green focus:border-transparent bg-white shadow-sm'
              />
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                <svg className='w-6 h-6 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className='flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mb-8'>
            {categoryOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedCategory(option)}
                className={`group relative px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm md:text-base font-bold transition-all duration-500 transform hover:scale-105 sm:hover:scale-110 md:hover:scale-115 hover:-translate-y-0.5 sm:hover:-translate-y-1 md:hover:-translate-y-1.5 shadow-md sm:shadow-lg md:shadow-xl hover:shadow-lg sm:hover:shadow-xl md:hover:shadow-2xl backdrop-blur-sm ${
                  selectedCategory === option
                    ? 'bg-gradient-to-r from-shop_dark_green via-shop_light_green to-shop_dark_green text-white shadow-xl sm:shadow-2xl md:shadow-3xl ring-2 sm:ring-3 md:ring-4 ring-shop_dark_green/20 sm:ring-shop_dark_green/25 md:ring-shop_dark_green/30 scale-102 sm:scale-105 md:scale-108'
                    : 'bg-white/90 backdrop-blur-md text-gray-800 border border-gray-200/50 hover:border-shop_dark_green/30 sm:hover:border-shop_dark_green/35 md:hover:border-shop_dark_green/40 hover:bg-white hover:text-shop_dark_green sm:hover:shadow-xl md:hover:shadow-2xl'
                }`}
              >
                {/* Shimmer Effect for Selected */}
                {selectedCategory === option && (
                  <div className='absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden'>
                    <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/15 sm:via-white/20 md:via-white/25 to-transparent animate-pulse'></div>
                    <div className='absolute top-0 left-0 w-full h-0.5 sm:h-1 md:h-1.5 bg-gradient-to-r from-shop_light_green via-white to-shop_light_green animate-pulse'></div>
                  </div>
                )}
                
                {/* Content */}
                <span className='relative z-10 tracking-wide sm:tracking-normal md:tracking-wide'>
                  {option === 'all' ? (
                    <span className='block sm:hidden'>All</span>
                  ) : (
                    <span className='block sm:hidden'>{option.slice(0, 8)}{option.length > 8 ? '...' : ''}</span>
                  )}
                  <span className='hidden sm:block'>{option === 'all' ? 'All Categories' : option}</span>
                </span>
                
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                  selectedCategory === option ? 'hidden' : ''
                }`}>
                  <div className='absolute inset-0 bg-gradient-to-r from-shop_dark_green/10 to-shop_light_green/10 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl md:blur-2xl'></div>
                </div>
                
                {/* Selected Indicator */}
                {selectedCategory === option && (
                  <div className='absolute -top-1 sm:-top-1.5 md:-top-2 -right-1 sm:-right-1.5 md:-right-2 flex items-center justify-center'>
                    <div className='relative'>
                      <div className='w-2 h-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 bg-white rounded-full shadow-lg animate-ping'></div>
                      <div className='absolute inset-0 w-2 h-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 bg-white rounded-full'></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className='mb-8 text-center'>
          <p className='text-gray-600'>
            Found <span className='font-semibold text-shop_dark_green'>{filteredCategories.length}</span> categories
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Categories Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12'>
          {filteredCategories.map((category, index) => {
            const Icon = category.icon
            
            // Render different card layouts based on category type
            const renderCategoryCard = () => {
              switch (category.layout) {
                case 'featured':
                  return (
                    <div className={`${category.cardStyle} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-2 border h-full relative overflow-hidden`}>
                      {/* Featured Badge */}
                      <div className='absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs px-3 py-1 rounded-full font-bold z-10'>
                        ⭐ Featured
                      </div>
                      
                      {/* Large Icon Background */}
                      <div className='absolute -bottom-4 -right-4 opacity-10'>
                        <Icon className='w-32 h-32' />
                      </div>
                      
                      {/* Content */}
                      <div className='relative z-10'>
                        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${category.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className='w-10 h-10' />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-900 mb-2'>{category.name}</h3>
                        <p className='text-gray-600 text-sm mb-4'>{category.description}</p>
                        <div className='flex items-center justify-between'>
                          <span className='text-lg font-semibold text-gray-900'>{category.productCount.toLocaleString()} items</span>
                          <div className={`px-4 py-2 rounded-lg ${category.color} text-white font-medium text-sm hover:shadow-lg transition-all duration-300`}>
                            Shop Now →
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                
                case 'trending':
                  return (
                    <div className={`${category.cardStyle} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-2 border h-full relative overflow-hidden`}>
                      {/* Trending Badge */}
                      <div className='absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs px-3 py-1 rounded-full font-bold z-10 animate-pulse'>
                        🔥 Trending
                      </div>
                      
                      {/* Diagonal Stripe */}
                      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-500'></div>
                      
                      <div className='relative z-10'>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className='w-8 h-8' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-900 mb-2'>{category.name}</h3>
                        <p className='text-gray-600 text-sm mb-4'>{category.description}</p>
                        
                        {/* Popular Tags */}
                        <div className='flex flex-wrap gap-1 mb-4'>
                          {category.subcategories.slice(0, 2).map((sub, i) => (
                            <span key={i} className='text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full'>
                              {sub}
                            </span>
                          ))}
                        </div>
                        
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-700'>{category.productCount.toLocaleString()} items</span>
                          <div className={`px-3 py-1 rounded-lg ${category.color} text-white font-medium text-xs hover:shadow-lg transition-all duration-300`}>
                            Shop Now →
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                
                case 'gaming':
                  return (
                    <div className={`${category.cardStyle} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-2 border h-full relative overflow-hidden`}>
                      {/* Gaming Background Pattern */}
                      <div className='absolute inset-0 opacity-5'>
                        <div className='grid grid-cols-8 grid-rows-8 gap-1'>
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div key={i} className='bg-indigo-600 rounded-sm'></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className='relative z-10'>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className='w-8 h-8' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-900 mb-2 flex items-center gap-2'>
                          {category.name}
                          <span className='text-lg'>🎮</span>
                        </h3>
                        <p className='text-gray-600 text-sm mb-4'>{category.description}</p>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-700'>{category.productCount.toLocaleString()} items</span>
                          <div className={`px-3 py-1 rounded-lg ${category.color} text-white font-medium text-xs hover:shadow-lg transition-all duration-300`}>
                            Play Now →
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                
                case 'luxury':
                  return (
                    <div className={`${category.cardStyle} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-2 border h-full relative overflow-hidden`}>
                      {/* Luxury Border */}
                      <div className='absolute inset-0 border-2 border-amber-300 rounded-2xl opacity-30'></div>
                      
                      <div className='relative z-10'>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg border border-amber-200`}>
                          <Icon className='w-8 h-8' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-900 mb-2 flex items-center gap-2'>
                          {category.name}
                          <span className='text-lg'>💎</span>
                        </h3>
                        <p className='text-gray-600 text-sm mb-4'>{category.description}</p>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-700'>{category.productCount.toLocaleString()} items</span>
                          <div className={`px-3 py-1 rounded-lg ${category.color} text-white font-medium text-xs hover:shadow-lg transition-all duration-300`}>
                            Explore →
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                
                case 'compact':
                  return (
                    <div className={`${category.cardStyle} rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-1 border h-full`}>
                      <div className='flex items-center gap-4'>
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${category.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className='w-6 h-6' />
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-lg font-bold text-gray-900 mb-1'>{category.name}</h3>
                          <p className='text-xs text-gray-600 mb-2'>{category.description}</p>
                          <div className='flex items-center justify-between'>
                            <span className='text-xs font-medium text-gray-500'>{category.productCount.toLocaleString()} items</span>
                            <div className={`px-2 py-1 rounded ${category.color} text-white font-medium text-xs hover:shadow transition-all duration-300`}>
                              Shop →
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                
                case 'cute':
                  return (
                    <div className={`${category.cardStyle} rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-2 border h-full relative overflow-hidden`}>
                      {/* Cute Decorations */}
                      <div className='absolute top-2 left-2 text-2xl opacity-30'>🌸</div>
                      <div className='absolute top-2 right-2 text-2xl opacity-30'>🌈</div>
                      <div className='absolute bottom-2 left-2 text-2xl opacity-30'>⭐</div>
                      
                      <div className='relative z-10 text-center'>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                          <Icon className='w-8 h-8' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-900 mb-2'>{category.name}</h3>
                        <p className='text-gray-600 text-sm mb-4'>{category.description}</p>
                        <div className={`px-4 py-2 rounded-full ${category.color} text-white font-medium text-sm hover:shadow-lg transition-all duration-300 inline-block`}>
                          🎈 Shop Now →
                        </div>
                      </div>
                    </div>
                  )
                
                case 'technical':
                  return (
                    <div className={`${category.cardStyle} rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-2 border h-full relative overflow-hidden`}>
                      {/* Technical Grid Background */}
                      <div className='absolute inset-0 opacity-5'>
                        <div className='grid grid-cols-6 grid-rows-6 gap-0.5'>
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className='bg-slate-600'></div>
                          ))}
                        </div>
                      </div>
                      
                      <div className='relative z-10'>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${category.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className='w-8 h-8' />
                        </div>
                        <h3 className='text-xl font-bold text-gray-900 mb-2 font-mono'>{category.name}</h3>
                        <p className='text-gray-600 text-sm mb-4 font-mono text-xs'>{category.description}</p>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm font-medium text-gray-700 font-mono'>{category.productCount.toLocaleString()} items</span>
                          <div className={`px-3 py-1 rounded ${category.color} text-white font-medium text-xs hover:shadow-lg transition-all duration-300 font-mono`}>
                            [SHOP] →
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                
                default:
                  // Standard layout for all other categories
                  return (
                    <div className={`${category.cardStyle} rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hoverEffect transform hover:-translate-y-2 border h-full`}>
                      <div className='flex items-start justify-between mb-4'>
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${category.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className='w-8 h-8' />
                        </div>
                        <span className='bg-shop_light_green text-white text-xs px-2 py-1 rounded-full font-medium'>
                          {category.productCount.toLocaleString()} items
                        </span>
                      </div>

                      <h3 className='text-xl font-semibold text-gray-900 group-hover:text-shop_dark_green transition-colors duration-300 mb-2'>
                        {category.name}
                      </h3>
                      <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
                        {category.description}
                      </p>

                      <div className='mb-4'>
                        <p className='text-xs text-gray-500 mb-2 font-medium'>Popular in this category:</p>
                        <div className='flex flex-wrap gap-1'>
                          {category.subcategories.slice(0, 3).map((sub, subIndex) => (
                            <span
                              key={subIndex}
                              className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md'
                            >
                              {sub}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className='text-xs text-gray-500 px-2 py-1'>
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className='flex items-center justify-between'>
                        <span className='text-shop_dark_green font-medium text-sm group-hover:text-shop_dark_green transition-colors duration-300'>
                          Shop Now
                        </span>
                        <svg className='w-4 h-4 text-shop_dark_green group-hover:translate-x-1 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                        </svg>
                      </div>
                    </div>
                  )
              }
            }
            
            return (
              <Link
                key={index}
                href={category.href}
                className='group'
              >
                {renderCategoryCard()}
              </Link>
            )
          })}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className='text-center py-16'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4'>
              <svg className='w-10 h-10 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>No categories found</h3>
            <p className='text-gray-600 mb-4'>
              Try adjusting your search terms or browse all categories
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className='bg-shop_dark_green text-white px-6 py-2 rounded-lg hover:bg-shop_btn_dark_green transition-colors duration-300'
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Popular Categories Section */}
        {searchTerm === '' && selectedCategory === 'all' && (
          <section className='mt-16 pt-16 border-t border-gray-200'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 mb-4'>
                Most <span className='text-shop_dark_green'>Popular</span> Categories
              </h2>
              <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                Discover what's trending and explore our most sought-after product categories
              </p>
            </div>
            
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
              {categories.slice(0, 8).map((category, index) => {
                const Icon = category.icon
                return (
                  <Link
                    key={index}
                    href={category.href}
                    className='group flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-shop_dark_green hover:shadow-md transition-all duration-300'
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className='w-6 h-6' />
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-medium text-gray-900 group-hover:text-shop_dark_green transition-colors duration-300'>
                        {category.name}
                      </h4>
                      <p className='text-xs text-gray-500'>
                        {category.productCount.toLocaleString()} items
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </Container>
    </div>
  )
}

export default CategoriesPage
