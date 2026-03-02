import { Facebook, Github, Link, Linkedin, Twitter, Youtube } from 'lucide-react';
import React from 'react'

import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';

import { cn } from '@/lib/utils';

interface Props{
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}


const socialLink =[
  {
    title:"Youtube",
    href:"https://www.youtube.com/@GamingzonebdYT",
    icon:<Youtube className='w-5 h-5'/>,
  },
  {
    title:"Github",
    href:"https://github.com/mkError420",
    icon:<Github className='w-5 h-5'/>,
  },
  {
    title:"Linkedin",
    href:"https://www.linkedin.com/in/mk-rabbani-81343024b/",
    icon:<Linkedin className='w-5 h-5'/>,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/mk.Rabbani4",
    icon: <Facebook className='w-5 h-5'/>,
  },
  {
    title: "Twitter",
    href: "https://twitter.com/mkError420",
    icon: <Twitter className='w-5 h-5'/>,
  }
];


const SocialMedia=({className, iconClassName, tooltipClassName}:Props) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center gap-3.5", className)}>
        {socialLink?.map((item) => (
          <Tooltip key={item.title}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                target='_blank'
                rel='noopener noreferrer'
                className={cn("p-2 border rounded-full hover:text-white hover:border-shop_light_green hoverEffect", iconClassName
                
                )}
              >
                {item.icon}
              </a> 
            </TooltipTrigger>
             <TooltipContent className={cn("bg-white text-darkColor font-semibold border border-shop_light_green",tooltipClassName)}>{item.title}
            </TooltipContent> 
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
  
}

export default SocialMedia;
