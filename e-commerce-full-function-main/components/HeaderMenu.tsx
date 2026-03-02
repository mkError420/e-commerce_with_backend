"use client"
import { headerData } from '@/constants/data'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

function HeaderMenu() {
  const pathname = usePathname()
  
  return (
    <div className='hidden md:flex md:w-1/3 lg:w-1/2 items-center justify-center gap-2 md:gap-3 lg:gap-6 text-sm capitalize font-semibold text-lightColor '>
      {headerData?.map((item)=>(
        <Link key={item?.title} href={item?.link} className=
        {`hover:text-shop_light_green hoverEffect relative group whitespace-nowrap ${pathname === item?.link && "text-shop_light_green" }`}>
          {item?.title}
          <span className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-shop_light_green group-hover:w-1/2 hoverEffect group-hover:left-0 ${
            pathname === item?.link && "w-1/2"
          }`}/>
          <span className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-shop_light_green group-hover:w-1/2 hoverEffect group-hover:right-0 ${
            pathname === item?.link && "w-1/2"
          }`}/>
        </Link>
      ))}
    </div>
  )
}

export default HeaderMenu
