import { useState, useEffect } from 'react'
import { api } from '@/lib/api-client'

interface Category {
  id: string
  title: string
  slug: string
  href: string
  parentId?: string
  icon?: string
  subcategories?: Category[]
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('useCategories: Starting to fetch categories...')
        setLoading(true)
        const data = await api.categories.list()
        console.log('useCategories: Raw API categories data:', data)
        console.log('useCategories: Data type:', typeof data)
        console.log('useCategories: Is array?', Array.isArray(data))
        
        // Build hierarchical structure
        const mainCategories = data.filter((cat: Category) => !cat.parentId)
        const subcategories = data.filter((cat: Category) => cat.parentId)
        
        console.log('useCategories: Main categories:', mainCategories)
        console.log('useCategories: Subcategories:', subcategories)
        
        const structuredCategories = mainCategories.map((main: Category) => ({
          ...main,
          subcategories: subcategories.filter((sub: Category) => sub.parentId === main.id)
        }))
        
        console.log('useCategories: Structured categories:', structuredCategories)
        setCategories(structuredCategories)
      } catch (err) {
        console.error('useCategories: Error fetching categories:', err)
        setError('Failed to fetch categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

export const useFlatCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const data = await api.categories.list()
        setCategories(data)
      } catch (err) {
        setError('Failed to fetch categories')
        console.error('Error fetching categories:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
