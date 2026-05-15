'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiHome, FiBookOpen, FiZap, FiCpu, FiUser, FiMenu } from 'react-icons/fi'

const navItems = [
  { name: 'Home', path: '/', icon: FiHome },
  { name: 'Tutorials', path: '/tutorials', icon: FiBookOpen },
  { name: 'Projects', path: '/projects', icon: FiZap },
  { name: 'MCUs', path: '/microcontrollers', icon: FiCpu },
  { name: 'Profile', path: '/profile', icon: FiUser },
]

function BottomNav() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          // Scrolling down
          setIsVisible(false)
        } else {
          // Scrolling up or at top
          setIsVisible(true)
        }
        
        setLastScrollY(currentScrollY)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      } md:hidden`}
    >
      <div className="flex justify-around items-center h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'text-primary-600 scale-110'
                  : 'text-gray-600 hover:text-primary-600 hover:scale-105'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'text-primary-600' : 'text-gray-600'}`} />
              <span className="text-xs font-medium">{item.name}</span>
              {isActive && (
                <div className="w-1 h-1 bg-primary-600 rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav