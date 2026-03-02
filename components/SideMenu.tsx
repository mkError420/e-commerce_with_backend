import React, { FC } from 'react'
import Logo from './Logo';
import { X } from 'lucide-react';
import Link from 'next/link';
import { headerData } from '@/constants/data';
import { usePathname } from 'next/navigation';
import SocialMedia from './SocialMedia';
import { useOutsideClick } from '@/hooks';
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

  const SideMenu:FC<SidebarProps> = ({isOpen, onClose}) => {
  const pathname = usePathname();


  const sidebarRef=useOutsideClick<HTMLDivElement>(onClose)
  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div 
        ref={sidebarRef} 
        className={`fixed top-0 left-0 h-full min-w-72 max-w-76 bg-black p-10 border-r border-r-shop_light_green flex flex-col gap-6 z-[1000] transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className='flex items-center justify-between gap-5'>
          <Logo className='text-white' spanDesign="group-hover:text-white" />
          <button onClick={onClose} className='hover:text-shop_light_green hoverEffect'>
            <X/>
          </button>
        </div>

        <div className='flex flex-col space-y-3.5 font-semibold tracking-wide'>
          {headerData?.map((item)=>(
           <Link href={item?.link} key={item?.title} className={`hover:text-shop_light_green hoverEffect ${pathname === item?.link && 'text-shop_light_green/70'}`}>
           {item.title}
           </Link>
          ))}
        </div>
        <SocialMedia/>
      </div>
    </>
  );
};

export default SideMenu;
