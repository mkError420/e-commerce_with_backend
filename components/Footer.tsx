'use client'

import React from 'react'
import Container from './Container'
import FooterTop from './FooterTop'
import Logo from './Logo'
import SocialMedia from './SocialMedia'
import { SubText, SubTitle } from './ui/text'
import { quickLinksData } from '@/constants/data'
import { useFlatCategories } from '@/hooks/useCategories'
import Link from 'next/link'
import { Input } from './ui/input'
import { Button } from './ui/button'

const Footer = () => {
  const { categories, loading, error } = useFlatCategories()

  // Fallback categories if API fails
  const fallbackCategories = [
    { id: '1', title: "Mobiles", slug: "mobiles", href: "/categories/mobiles" },
    { id: '2', title: "Electronics", slug: "electronics", href: "/categories/electronics" },
    { id: '3', title: "Fashion", slug: "fashion", href: "/categories/fashion" },
    { id: '4', title: "Home", slug: "home", href: "/categories/home" }
  ]

  const displayCategories = loading ? fallbackCategories : categories

  if (error) {
    console.error('Error loading categories in footer:', error)
  }

  return (
    <footer className='bg-white border-t'>
      <Container>
          <FooterTop/>
          <div className='py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='space-y-4'>
              <Logo/>
              <SubText>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus deserunt quis eum asperiores, voluptatibus nam!
              </SubText>

              <SocialMedia className='text-darkColor/60' iconClassName='border-darkColor/60 hover:border-shop_light_green hover:text-shop_light_green'
              tooltipClassName='bg-darkColor text-white'
              />
            </div>
            <div>
              <SubTitle className='font-bold'>Quick Links</SubTitle>
              <ul className='space-y-3 mt-4'>
                {quickLinksData?.map ((item)=>(
                  <li key={item?.title}>
                    <Link href={item?.href} className='hover:text-shop_light_green hoverEffect font-medium'>
                    {item?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <SubTitle className='font-bold'>Categories</SubTitle>
              <ul className='space-y-3 mt-4'>
                {displayCategories?.slice(0, 6).map ((item)=>(
                  <li key={item?.title || item?.id}>
                    <Link href={`/categories/${item?.slug || item?.href}`} 
                    className='hover:text-shop_light_green hoverEffect font-medium'>
                    {item?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className='space-y-4'>
              <SubTitle className='font-bold'>Newsletter</SubTitle>
              <SubText>
                Subscribe to our newsletter to get the latest updates and offers.
              </SubText>
              <form className='space-y-3'>
                <Input placeholder='Enter your email' type='email' required/>
                <Button className='w-full'>Subscribe</Button>
              </form>
            </div>
          </div>
          <div className='py-6 border-t text-center text-sm text-gray-600'>
            <div >
              © {new Date().getFullYear()}{" "}
                <Logo className='text-sm'/>
              . All right reserved
            </div>
          </div>
      </Container> 
    </footer>
  )
}

export default Footer
