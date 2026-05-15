'use client'

import { useState, useEffect } from 'react'

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button 
      className={`fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 border-none rounded-full text-white text-xl opacity-0 invisible transition-all duration-300 z-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/30 ${show ? 'opacity-100 visible' : ''} hover:scale-105`} 
      onClick={scrollToTop}
      title="Back to top"
    >
      <span className="block transform rotate-90">↑</span>
    </button>
  )
}

export default BackToTop