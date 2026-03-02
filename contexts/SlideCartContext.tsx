'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SlideCartContextType {
  isSlideCartOpen: boolean
  openSlideCart: () => void
  closeSlideCart: () => void
}

const SlideCartContext = createContext<SlideCartContextType | undefined>(undefined)

export const useSlideCart = () => {
  const context = useContext(SlideCartContext)
  if (context === undefined) {
    throw new Error('useSlideCart must be used within a SlideCartProvider')
  }
  return context
}

interface SlideCartProviderProps {
  children: ReactNode
}

export const SlideCartProvider: React.FC<SlideCartProviderProps> = ({ children }) => {
  const [isSlideCartOpen, setIsSlideCartOpen] = useState(false)

  const openSlideCart = () => setIsSlideCartOpen(true)
  const closeSlideCart = () => setIsSlideCartOpen(false)

  const value: SlideCartContextType = {
    isSlideCartOpen,
    openSlideCart,
    closeSlideCart
  }

  return (
    <SlideCartContext.Provider value={value}>
      {children}
    </SlideCartContext.Provider>
  )
}
