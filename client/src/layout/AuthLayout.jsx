import React from 'react'
import logo from '../assets/logo.png'

const AuthLayouts = ({children}) => {
  return (
   <>
        <header className='flex justify-center items-center py-3 h-20 shadow-md'>
           <img src={logo} alt="logo" className='w-52 ' />
        </header>
        {children}
   </>
  )
}

export default AuthLayouts;