import Container from '@/components/Container';
import HomeBanner from '@/components/HomeBanner';
import FeaturedCategories from '@/components/FeaturedCategories';
import FeaturedProducts from '@/components/FeaturedProducts';
import SpecialOffers from '@/components/SpecialOffers';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import BrandPartners from '@/components/BrandPartners';
import NewsTicker from '@/components/NewsTicker';
import TVScroller from '@/components/TVScroller';

import React from 'react'

const Home = () => {
  return (
    <div className='bg-shop-light-pink'>
      <Container className='bg-transparent py-4'>
        <NewsTicker />
      </Container>
      <Container className='bg-transparent py-8'>
        <HomeBanner/>
      </Container>
      
      <TVScroller />
      
      <FeaturedCategories />
      <FeaturedProducts />
      <SpecialOffers />
      <Testimonials />
      <Newsletter />
      <BrandPartners />
    </div>
  )
}

export default Home; 
