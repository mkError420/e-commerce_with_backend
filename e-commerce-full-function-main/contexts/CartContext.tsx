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
  removeFromCart: (itemId: number, itemType: 'product' | 'deal') => void
  updateQuantity: (itemId: number, quantity: number, itemType: 'product' | 'deal') => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
  isInCart: (itemId: number, itemType: 'product' | 'deal') => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error)
        localStorage.removeItem('cart')
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: typeof productsData[0] | any, itemType: 'product' | 'deal') => {
    console.log(`addToCart called with ${itemType}:`, itemType === 'product' ? item.name : item.title) // Debug log
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

  const removeFromCart = (itemId: number, itemType: 'product' | 'deal') => {
    console.log('removeFromCart called:', { itemId, itemType })
    setCartItems(prev => {
      const newItems = prev.filter(item => {
        if (item.itemType === itemType) {
          const currentItemId = itemType === 'product' ? item.product?.id : item.deal?.id
          return currentItemId !== itemId
        }
        return true
      })
      console.log('New cart items after removal:', newItems)
      return newItems
    })
  }

  const updateQuantity = (itemId: number, quantity: number, itemType: 'product' | 'deal') => {
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

  const isInCart = (itemId: number, itemType: 'product' | 'deal') => {
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
