'use client'

import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }) {
  const { user, isLoggedIn, hydrated } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (hydrated) {
      if (!isLoggedIn) {
        router.replace('/')
      }
    }
  }, [hydrated, isLoggedIn, user, router])

  if (!hydrated || !isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm">Verifying access…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 pb-32">{children}</div>
      </main>
    </div>
  )
}
