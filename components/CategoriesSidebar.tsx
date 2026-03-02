'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Package } from 'lucide-react'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  subcategories?: Category[]
}

interface CategoriesSidebarProps {
  categories: Category[]
  selectedCategories: string[]
  onCategorySelect: (categoryId: string) => void
  products: any[]
}

const CategoriesSidebar: React.FC<CategoriesSidebarProps> = ({ 
  categories, 
  selectedCategories, 
  onCategorySelect,
  products 
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const countProducts = (category: Category): number => {
    // Count products for main category
    const mainCategoryProducts = products.filter(product => 
      product.category?.toLowerCase() === category.title.toLowerCase()
    ).length
    
    // Count products for subcategories
    const subCategoryProducts = category.subcategories?.reduce((sum, sub) => {
      return sum + products.filter(product => 
        product.category?.toLowerCase() === sub.title.toLowerCase()
      ).length
    }, 0) || 0
    
    return mainCategoryProducts + subCategoryProducts
  }

  const countSubProducts = (subcategory: Category): number => {
    return products.filter(product => 
      product.category?.toLowerCase() === subcategory.title.toLowerCase()
    ).length
  }

  const isCategorySelected = (categoryId: string) => {
    return selectedCategories.includes(categoryId)
  }

  const renderCategory = (category: Category, level: number = 0): React.ReactNode => {
    const productCount = countProducts(category)
    const isExpanded = expandedCategories.includes(category.id)
    const isSelected = isCategorySelected(category.id)

    return (
      <div key={category.id} className={`${level > 0 ? 'ml-4' : ''}`}>
        {/* Main Category */}
        <div 
          className={`
            flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
            ${isSelected 
              ? 'bg-shop_dark_green text-white shadow-md' 
              : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }
          `}
          onClick={() => onCategorySelect(category.slug)}
        >
          <div className="flex items-center gap-3 flex-1">
            {level === 0 && (
              <div className="w-8 h-8 bg-shop_light_green/20 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-shop_dark_green" />
              </div>
            )}
            <span className={`font-medium ${level > 0 ? 'text-sm' : ''}`}>
              {category.title}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isSelected 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {productCount}
            </span>
            
            {category.subcategories && category.subcategories.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleCategoryExpansion(category.id)
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
              >
                {isExpanded ? (
                  <ChevronDown className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                ) : (
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Subcategories */}
        {isExpanded && category.subcategories && category.subcategories.length > 0 && (
          <div className="mt-2 space-y-1">
            {category.subcategories.map(subcategory => {
              const subProductCount = countSubProducts(subcategory)
              const isSubSelected = isCategorySelected(subcategory.id)
              
              return (
                <div
                  key={subcategory.id}
                  className={`
                    flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ml-8
                    ${isSubSelected 
                      ? 'bg-shop_light_green text-white' 
                      : 'hover:bg-gray-50 text-gray-600'
                    }
                  `}
                  onClick={() => onCategorySelect(subcategory.slug)}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm">{subcategory.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isSubSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {subProductCount}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Categories</h3>
        <button
          onClick={() => onCategorySelect('all')}
          className={`text-sm px-3 py-1 rounded-lg transition-colors duration-200 ${
            selectedCategories.includes('all')
              ? 'bg-shop_dark_green text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {categories.map(category => renderCategory(category))}
      </div>

      {/* View All Categories Link */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href="/categories"
          className="flex items-center justify-center gap-2 text-shop_dark_green hover:text-shop_light_green font-medium text-sm transition-colors duration-200"
        >
          View All Categories
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}

export default CategoriesSidebar
