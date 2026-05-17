'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import {
  FiHome, FiLayers, FiBookOpen, FiPackage, FiImage,
  FiMail, FiLogOut, FiCpu, FiSettings, FiBarChart2
} from 'react-icons/fi'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FiBarChart2 },
  { href: '/admin/projects', label: 'Projects', icon: FiLayers },
  { href: '/admin/courses', label: 'Courses', icon: FiBookOpen },
  { href: '/admin/tutorials', label: 'Tutorials (Modules)', icon: FiLayers },
  { href: '/admin/articles', label: 'Articles', icon: FiBookOpen },
  { href: '/admin/resources', label: 'Resources', icon: FiPackage },
  { href: '/admin/hero-slider', label: 'Hero Slider', icon: FiImage },
  { href: '/admin/users', label: 'Users', icon: FiMail },
  { href: '/admin/leads', label: 'Leads / CRM', icon: FiMail },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useUser()

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
            <FiCpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base">Harvegen</div>
            <div className="text-primary-400 text-xs font-medium">Admin CMS</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary-600/20 text-primary-400 border border-primary-600/30'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{user?.name}</div>
            <div className="text-gray-500 text-xs truncate">{user?.email}</div>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl text-sm transition-all">
          <FiHome className="w-4 h-4" />
          Back to Site
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-xl text-sm transition-all mt-1"
        >
          <FiLogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
