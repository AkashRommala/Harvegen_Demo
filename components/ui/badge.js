'use client'

import * as React from 'react'

export function Badge({ 
  children, 
  variant = 'default', 
  className, 
  ...props 
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    secondary: 'bg-gray-50 text-gray-700 border border-gray-200',
    destructive: 'bg-red-100 text-red-800 border border-red-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    info: 'bg-blue-100 text-blue-800 border border-blue-200',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm font-mono text-[0.65rem] font-semibold tracking-wider uppercase border ${variants[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  )
}