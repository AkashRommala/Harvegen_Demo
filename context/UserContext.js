'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('harvegen_user')
      console.log("Saved User:", savedUser);
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        console.log("Parsed User:", parsed);
        if (parsed && parsed.email) {
          setUser(parsed)
          setIsLoggedIn(true)
        }
      }
    } catch {
      localStorage.removeItem('harvegen_user')
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage whenever user changes
  useEffect(() => {
    if (!hydrated) return
    if (user) {
      localStorage.setItem('harvegen_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('harvegen_user')
    }
  }, [user, hydrated])

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const login = (userData) => {
    // Ensure we store the MongoDB id alongside all other fields
    const normalized = {
      id: userData.id || userData._id || '',
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'user',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.email)}`,
      bio: userData.bio || '',
    }
    setUser(normalized)
    setIsLoggedIn(true)
  }

  const logout = async () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('harvegen_user')
    // Clear the httpOnly cookie so middleware knows we're logged out
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (e) {
      console.error("Failed to clear cookie", e)
    }
  }

  return (
    <UserContext.Provider value={{ user, updateUser, login, logout, isLoggedIn, hydrated }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
