import React from 'react'
import Image from 'next/image'
import Logo from '../public/akade-logo.png';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-red-400 mt-10">
      <div className="container mx-auto px-4 py-8 gap-4 flex flex-col items-center">
      <div className=''>
            <Image src={Logo} alt="Akade Tools" width={200} height={100} />
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Akade Tools. All rights reserved.
        </p>
        <div className='flex gap-4'>
            <p className='text-sm text-muted-foreground'>Stworzone przez <a href="https://github.com/Gawc1uuu" target="_blank" rel="noopener noreferrer" className='text-red-400'>Gawc1uuu</a></p>
        </div>
      </div>
    </footer>
  )
}

export default Footer