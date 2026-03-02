'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/Container'
import DealCard from '@/components/DealCard'

const fallbackDeals = [
  { id: '1', title: 'Lightning Deal: Smart Watch Pro', originalPrice: 349.99, dealPrice: 199.99, discount: 43, image: '/api/placeholder/400/300', category: 'Electronics', dealType: 'lightning', endTime: new Date(Date.now() + 7*24*60*60*1000).toISOString(), stock: 8, sold: 42, rating: 4.8, reviews: 89, description: 'Advanced smartwatch', features: ['GPS', 'Heart Rate'], freeShipping: true },
  { id: '2', title: 'Daily Deal: Organic Skincare', originalPrice: 119.99, dealPrice: 59.99, discount: 50, image: '/api/placeholder/400/300', category: 'Beauty', dealType: 'daily', endTime: new Date(Date.now() + 2*24*60*60*1000).toISOString(), stock: 25, sold: 75, rating: 4.9, reviews: 203, description: 'Organic skincare', features: ['Organic'], freeShipping: true }
]

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>(fallbackDeals)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetch('/api/deals').then(r => r.json()).then(d => d?.data?.length && setDeals(d.data)).catch(() => {})
  }, [])
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-shop_light_bg py-8">
      <Container>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hot Deals</h1>
        <p className="text-gray-600 mb-8">Limited-time offers. Don&apos;t miss out!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={{ ...deal, id: Number(deal.id) || deal.id }} currentTime={currentTime} />
          ))}
        </div>
        {deals.length === 0 && <p className="text-center py-16 text-gray-500">No deals available.</p>}
      </Container>
    </div>
  )
}
