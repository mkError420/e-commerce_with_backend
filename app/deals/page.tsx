'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/Container'
import DealCard from '@/components/DealCard'
import { api } from '@/lib/api-client'

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  const fetchDeals = async () => {
    try {
      console.log('Fetching deals from API...')
      const response = await api.deals.list() as any
      console.log('API response:', response)
      
      // The fetchApi function returns json.data ?? json, so response is already the deals array
      const dealsData = Array.isArray(response) ? response : []
      console.log('Deals data:', dealsData)
      console.log('Number of deals:', dealsData.length)
      
      setDeals(dealsData)
    } catch (err) {
      console.error('Error fetching deals:', err)
      setError('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-shop_light_bg py-8">
        <Container>
          <div className="animate-pulse">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 bg-gray-200 rounded w-32 h-8"></h1>
            <p className="text-gray-600 mb-8 bg-gray-200 rounded w-64 h-4"></p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-shop_light_bg py-8">
        <Container>
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Deals</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-shop_dark_green text-white px-6 py-2 rounded-lg hover:bg-shop_light_green"
            >
              Try Again
            </button>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-shop_light_bg py-8">
      <Container>
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Hot Deals</h1>
              <p className="text-gray-600">Limited-time offers. Don&apos;t miss out!</p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-gray-600">Total Deals: </span>
              <span className="font-bold text-shop_dark_green">{deals.length}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-gray-600">Active: </span>
              <span className="font-bold text-green-600">
                {deals.filter(d => new Date(d.endTime) > new Date()).length}
              </span>
            </div>
            <div className="bg-white px-4 py-2 rounded-lg shadow">
              <span className="text-gray-600">Expired: </span>
              <span className="font-bold text-red-600">
                {deals.filter(d => new Date(d.endTime) <= new Date()).length}
              </span>
            </div>
          </div>
        </div>

        {/* Deals Grid */}
        {deals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <DealCard key={deal.id} deal={{ ...deal, id: Number(deal.id) || deal.id }} currentTime={currentTime} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Deals Available</h2>
            <p className="text-gray-600 mb-6">Check back later for amazing deals and offers!</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-shop_dark_green text-white px-6 py-3 rounded-lg hover:bg-shop_light_green transition-colors"
            >
              Continue Shopping
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </Container>
    </div>
  )
}
