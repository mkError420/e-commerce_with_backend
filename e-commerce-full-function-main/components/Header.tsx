import React from 'react'
import Container from './Container';
import Logo from './Logo';
import HeaderMenu from './HeaderMenu';
import SearchBar from './SearchBar';
import CartIcon from './CartIcon';
import FavoriteButton from './FavoriteButton';
import SignIn from './SignIn';
import MobileMenu from './MobileMenu';

const Header = () => {
  return (
    <header className='bg-white py-5 sticky top-0 z-40 w-full border-b border-gray-100' >
      <Container className='flex items-center justify-between text-lightColor'> 
        {/* Logo */}
        <div className='flex items-center gap-2.5 justify-start md:gap-0 md:w-1/3 lg:w-1/4 w-1/2'>
          <MobileMenu/>
          <Logo/>
        </div>
        {/* Navbutton */}
        <HeaderMenu/>
        {/* Right Section */}
        <div className='flex items-center justify-end gap-2 md:gap-3 lg:gap-5 md:w-1/3 lg:w-1/4 w-1/2'>
          <SearchBar/>
          <CartIcon/>
          <FavoriteButton/>
          <SignIn/>
        </div>
      </Container>
    </header>
  )
}

export default Header;
