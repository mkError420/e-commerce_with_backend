import React from 'react'
import Link from 'next/link'

const SignIn = () => {
  return (
    <Link href="/login">
      <button className='text-sm font-semibold hover:text-darkColor text-lightColor hover:cursor-pointer hoverEffect'>
        Login
      </button>
    </Link>
  )
}

export default SignIn
