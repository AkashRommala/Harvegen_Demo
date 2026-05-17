'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiZap, FiSearch, FiMail, FiUser, FiLogOut, FiUserPlus, FiShield } from 'react-icons/fi'
import { useUser } from '../context/UserContext'
import LoginModal from './LoginModal'
import { Alert, AlertTitle, AlertDescription } from './ui/alert'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Tutorials', path: '/tutorials' },
  { name: 'Projects', path: '/projects' },
  { name: 'MCUs', path: '/microcontrollers' },
  { name: 'Resources', path: '/resources' },
  { name: 'About', path: '/about' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [alert, setAlert] = useState(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, login, logout, isLoggedIn } = useUser()
  const isHomePage = pathname === '/'

  // Handle login
  const handleLogin = (userData) => {
    login(userData)
    setAlert({ type: 'success', title: 'Welcome!', message: `Welcome back, ${userData.name}!` })
    setTimeout(() => setAlert(null), 3000)
    
    // Automatic redirection for admins
    if (userData.role === 'admin') {
      router.push('/admin')
    }
  }

  // Handle logout
  const handleLogout = async () => {
    await logout()
    setAlert({ type: 'info', title: 'Logged out', message: 'You have been logged out successfully.' })
    setTimeout(() => setAlert(null), 3000)
    router.push('/')
  }

  // Handle profile click
  const handleProfileClick = (e) => {
    if (!isLoggedIn || !user) {
      e.preventDefault()
      setShowLoginModal(true)
    }
  }

  // Handle search submit
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/tutorials?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Handle Enter key in search input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isHomePage && !scrolled
            ? 'bg-transparent border-none'
            : scrolled
            ? 'bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-card'
            : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
        }`}
      >
        <div className="flex items-center h-[72px] w-full px-4 sm:px-6 lg:px-12 gap-2 lg:gap-6 overflow-hidden">

          {/* LOGO (Left) */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className={`flex items-center gap-2 font-bold flex-shrink-0 ${
              isHomePage && !scrolled ? 'text-white' : 'text-gray-900'
            }`}>
              <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold flex-shrink-0 ${
                isHomePage && !scrolled ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary-600'
              }`}>
                <FiZap className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold whitespace-nowrap">
                Harvegen
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU (Center) - grows to fill space */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-4 xl:gap-8 min-w-0">
            {navLinks.map((link) => {
              const active = pathname === link.path
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-2 xl:px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? isHomePage && !scrolled ? 'text-primary-400' : 'text-primary-600'
                      : isHomePage && !scrolled ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}

                  {/* Underline animation */}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 transition-all duration-300 ${
                      active 
                        ? isHomePage && !scrolled ? 'bg-primary-400 w-full' : 'bg-primary-600 w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              )
            })}
          </div>

          {/* RIGHT SIDE (Search, Theme, Profile) — flex-shrink-0 keeps it intact */}
          <div className="flex flex-shrink-0 items-center gap-2 xl:gap-3">
            {/* SEARCH BAR */}
            <div className="hidden xl:flex items-center">
              <form onSubmit={handleSearch} className={`relative flex items-center rounded-full border transition-all duration-300 ${
              isHomePage && !scrolled 
                ? 'bg-white/10 border-white/20 hover:bg-white/20' 
                : 'bg-gray-100 border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-36 xl:w-52 px-4 py-2 pl-10 text-sm rounded-full outline-none bg-transparent transition-all duration-300 ${
                  isHomePage && !scrolled 
                    ? 'text-white placeholder-white/60 focus:ring-2 focus:ring-white/30' 
                    : 'text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-500/30'
                }`}
              />
              <FiSearch 
                type="submit"
                className={`absolute left-3 w-4 h-4 cursor-pointer ${
                  isHomePage && !scrolled ? 'text-white/70' : 'text-gray-400'
                }`} 
              />
            </form>
            </div>

            {/* PROFILE BUTTON & THEME */}
            <ThemeToggle />
            
            {isLoggedIn && user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                      isHomePage && !scrolled 
                        ? 'bg-primary-500/20 text-white border border-primary-400/50 hover:bg-primary-500/40' 
                        : 'bg-primary-50 text-primary-600 border border-primary-200 hover:bg-primary-100'
                    }`}
                  >
                    <FiShield className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden xl:inline">Admin Dashboard</span>
                    <span className="xl:hidden">Admin</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full transition-all duration-300 flex-shrink-0 ${
                    isHomePage && !scrolled 
                      ? 'bg-white/20 hover:bg-white/30 text-white' 
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <img 
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-full bg-white object-cover flex-shrink-0"
                  />
                  <div className="hidden md:flex flex-col min-w-0 max-w-[100px] xl:max-w-[130px]">
                    <span className="text-xs font-medium truncate leading-tight">{user?.name || 'User'}</span>
                    <span className={`text-[10px] truncate leading-tight ${
                      isHomePage && !scrolled ? 'text-white/70' : 'text-gray-500'
                    }`}>{user?.email || ''}</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                    isHomePage && !scrolled 
                      ? 'bg-white/20 hover:bg-white/30 text-white' 
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                  title="Logout"
                >
                  <FiLogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2" suppressHydrationWarning>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 whitespace-nowrap ${
                    isHomePage && !scrolled 
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' 
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  <FiUser className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden flex items-center ml-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isHomePage && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-[72px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-300 lg:hidden ${
          mobileOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="flex flex-col p-5 gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileOpen(false)}
              className="px-4 py-2 rounded-full text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105"
            >
              {link.name}
            </Link>
          ))}

          {/* Mobile Profile */}
          {isLoggedIn && user ? (
            <Link
              href="/profile"
              onClick={() => setMobileOpen(false)}
              className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300"
            >
              <img 
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
                alt={user?.name || 'User'}
                className="w-10 h-10 rounded-full bg-white object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">{user?.name || 'User'}</span>
                <span className="text-xs text-gray-500">{user?.email || ''}</span>
              </div>
            </Link>
          ) : (
            <button
              onClick={() => { setMobileOpen(false); setShowLoginModal(true); }}
              className="mt-3 flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-all duration-300"
            >
              <FiUser className="w-5 h-5" />
              <span className="font-medium">Sign In</span>
            </button>
          )}

          <Link
            href="/projects"
            onClick={() => setMobileOpen(false)}
            className="mt-2 text-center px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
          >
            <FiZap className="inline mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" /> Explore Projects
          </Link>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={handleLogin}
      />

      {/* Alert Notifications */}
      {alert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
          <Alert variant={alert.type} className="shadow-lg">
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}

export default Navbar
