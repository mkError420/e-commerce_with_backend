'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { productsData } from '@/constants/data'

interface CartItem {
  product?: typeof productsData[0]
  deal?: any // Deal type from DealCard
  quantity: number
  itemType: 'product' | 'deal'
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: typeof productsData[0] | any, itemType: 'product' | 'deal') => void
  removeFromCart: (itemId: number | string, itemType: 'product' | 'deal') => void
  updateQuantity: (itemId: number | string, quantity: number, itemType: 'product' | 'deal') => void
  clearCart: () => void
  cleanCorruptedCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
  isInCart: (itemId: number | string, itemType: 'product' | 'deal') => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

// Export a cleanup function for emergency use
export const clearCorruptedCart = () => {
  console.log('Emergency: Clearing corrupted cart data...')
  localStorage.removeItem('cart')
  window.location.reload()
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Helper function to validate cart items
  const validateCartItem = (item: CartItem): boolean => {
    if (item.itemType === 'product') {
      return !!(item.product && typeof item.product.id !== 'undefined' && item.product.id !== null)
    } else if (item.itemType === 'deal') {
      return !!(item.deal && typeof item.deal.id !== 'undefined' && item.deal.id !== null)
    }
    return false
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        
        // Check if the parsed cart is an array
        if (!Array.isArray(parsedCart)) {
          console.error('Cart data is not an array, clearing corrupted data')
          localStorage.removeItem('cart')
          return
        }
        
        // Filter out invalid items before processing
        const validCartItems = parsedCart.filter((item: CartItem) => validateCartItem(item))
        console.log('Valid cart items after filtering:', validCartItems)
        
        // If all items are invalid, clear the cart
        if (validCartItems.length === 0 && parsedCart.length > 0) {
          console.log('All cart items are invalid, clearing cart')
          localStorage.removeItem('cart')
          return
        }
        
        // Refresh product data for items in cart
        const refreshCartItems = async () => {
          const uniqueItems = new Map()
          
          // First, ensure we have unique items by itemType and ID
          validCartItems.forEach((cartItem: CartItem) => {
            const itemId = cartItem.itemType === 'product' ? cartItem.product?.id : cartItem.deal?.id
            const key = `${cartItem.itemType}-${itemId}`
            if (!uniqueItems.has(key)) {
              uniqueItems.set(key, cartItem)
            }
          })
          
          const updatedCartItems = await Promise.all(
            Array.from(uniqueItems.values()).map(async (cartItem: CartItem) => {
              if (cartItem.itemType === 'product' && cartItem.product) {
                try {
                  // Fetch latest product data
                  const response = await fetch(`/api/products/${cartItem.product.id}`)
                  if (response.ok) {
                    const data = await response.json()
                    const latestProduct = data.data || data
                    if (latestProduct) {
                      return {
                        ...cartItem,
                        product: latestProduct
                      }
                  }
                }
              } catch (error) {
                console.error('Error refreshing product data:', error)
              }
              // Fallback: find in productsData
              const fallbackProduct = productsData.find(p => p.id === cartItem.product?.id)
              if (fallbackProduct) {
                return {
                  ...cartItem,
                  product: fallbackProduct
                }
              }
            }
            return cartItem
          })
        )
        setCartItems(updatedCartItems)
      }
      refreshCartItems()
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error)
      localStorage.removeItem('cart')
    }
  }
}, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Only save if we have valid items
    if (cartItems.length > 0) {
      const validItems = cartItems.filter(validateCartItem)
      localStorage.setItem('cart', JSON.stringify(validItems))
    } else {
      localStorage.setItem('cart', JSON.stringify([]))
    }
  }, [cartItems])

  const addToCart = (item: typeof productsData[0] | any, itemType: 'product' | 'deal') => {
    console.log(`addToCart called with ${itemType}:`, itemType === 'product' ? item.name : item.title) // Debug log
    
    // Validate the item before adding to cart
    if (!item || typeof item.id === 'undefined' || item.id === null) {
      console.error('Cannot add item to cart: invalid item or missing ID', { item, itemType })
      return
    }
    
    setCartItems(prev => {
      const itemId = itemType === 'product' ? item.id : item.id
      const existingItem = prev.find(cartItem => {
        if (cartItem.itemType === itemType) {
          return itemType === 'product' ? cartItem.product?.id === itemId : cartItem.deal?.id === itemId
        }
        return false
      })
      
      if (existingItem) {
        return prev.map(cartItem => {
          if (cartItem.itemType === itemType) {
            const currentItemId = itemType === 'product' ? cartItem.product?.id : cartItem.deal?.id
            if (currentItemId === itemId) {
              return { ...cartItem, quantity: cartItem.quantity + 1 }
            }
          }
          return cartItem
        })
      } else {
        if (itemType === 'product') {
          return [...prev, { product: item, quantity: 1, itemType }]
        } else {
          return [...prev, { deal: item, quantity: 1, itemType }]
        }
      }
    })
  }

  const removeFromCart = (itemId: number | string, itemType: 'product' | 'deal') => {
    console.log('removeFromCart called:', { itemId, itemType })
    setCartItems(prev => {
      const newItems = prev.filter(item => {
        if (item.itemType === itemType) {
          const currentItemId = itemType === 'product' ? item.product?.id : item.deal?.id
          console.log('Comparing:', { currentItemId, targetItemId: itemId, match: currentItemId === itemId })
          return currentItemId !== itemId
        }
        return true
      })
      console.log('New cart items after removal:', newItems)
      return newItems
    })
  }

  const updateQuantity = (itemId: number | string, quantity: number, itemType: 'product' | 'deal') => {
    if (quantity < 1) return
    setCartItems(prev => 
      prev.map(item => {
        if (item.itemType === itemType) {
          const currentItemId = itemType === 'product' ? item.product?.id : item.deal?.id
          if (currentItemId === itemId) {
            return { ...item, quantity }
          }
        }
        return item
      })
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  // Utility function to clean corrupted cart data
  const cleanCorruptedCart = () => {
    console.log('Cleaning corrupted cart data...')
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => {
      if (item.itemType === 'product' && item.product) {
        return sum + (item.product.price * item.quantity)
      } else if (item.itemType === 'deal' && item.deal) {
        return sum + (item.deal.dealPrice * item.quantity)
      }
      return sum
    }, 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const isInCart = (itemId: number | string, itemType: 'product' | 'deal') => {
    return cartItems.some(item => {
      if (item.itemType === itemType) {
        const currentItemId = itemType === 'product' ? item.product?.id : item.deal?.id
        return currentItemId === itemId
      }
      return false
    })
  }

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cleanCorruptedCart,
    getCartTotal,
    getCartItemsCount,
    isInCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
