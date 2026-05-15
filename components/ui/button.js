'use client'

import * as React from 'react'
import { FiDownload, FiArrowRight, FiGithub, FiFileText } from 'react-icons/fi'

export function Button({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className, 
  icon,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-105 active:scale-95 rounded-full'
  
  const variants = {
    default: 'bg-[#1e3a8a] text-white border border-[#1e3a8a] hover:bg-[#1e40af] hover:border-[#1e40af] focus:ring-[#1e3a8a] shadow-lg hover:shadow-xl hover:shadow-[#1e3a8a]/25 hover:ring-2 hover:ring-[#1e3a8a]/50',
    secondary: 'bg-white text-[#1e3a8a] border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-[#1e3a8a] shadow-md hover:shadow-lg hover:shadow-gray-500/15 hover:ring-2 hover:ring-gray-500/30',
    ghost: 'bg-transparent text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 focus:ring-gray-500 hover:shadow-sm hover:ring-2 hover:ring-gray-500/30',
    destructive: 'bg-red-600 text-white border border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl hover:shadow-red-500/25 hover:ring-2 hover:ring-red-500/50',
    outline: 'bg-transparent text-[#1e3a8a] border border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white focus:ring-[#1e3a8a] hover:shadow-md hover:ring-2 hover:ring-[#1e3a8a]/30',
  }
  
  const sizes = {
    default: 'px-6 py-3 text-sm',
    sm: 'px-4 py-2.5 text-sm',
    lg: 'px-8 py-4 text-base',
    icon: 'p-3',
  }

  const IconComponent = iconMap[icon]

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className || ''}`}
      {...props}
    >
      {IconComponent && <IconComponent className="w-4 h-4 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />}
      <span className="transition-all duration-300 group-hover:scale-105">{children}</span>
    </button>
  )
}

const iconMap = {
  download: FiDownload,
  arrowRight: FiArrowRight,
  github: FiGithub,
  fileText: FiFileText,
}

export function ButtonGroup({ children, className, ...props }) {
  return (
    <div className={`flex gap-3 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}
