import React from 'react'
import Container from '@/components/Container'
import HomeBanner from '@/components/HomeBanner'
import FeaturedCategories from '@/components/FeaturedCategories'
import FeaturedProducts from '@/components/FeaturedProducts'
import SpecialOffers from '@/components/SpecialOffers'
import Testimonials from '@/components/Testimonials'
import BrandPartners from '@/components/BrandPartners'

export default function HomePage() {
  return (
    <div className='min-h-screen'>
      <Container className='py-8 sm:py-12'>
        <HomeBanner />
      </Container>
      <FeaturedCategories />
      <FeaturedProducts />
      <SpecialOffers />
      <Testimonials />
      <BrandPartners />
    </div>
  )
}
