'use client'

import * as React from 'react'
import { FiInfo } from 'react-icons/fi'

export function HoverCard({ 
  children, 
  content, 
  side = 'top',
  align = 'center',
  className,
  ...props 
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div 
      className={`relative ${className || ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
      {...props}
    >
      {children}
      
      {isOpen && (
        <div 
          className={`absolute z-50 w-64 p-4 bg-white border border-gray-200 rounded-xl shadow-xl animate-in fade-in-0 zoom-in-95 duration-200 ${
            side === 'top' ? 'bottom-full mb-2' : 
            side === 'bottom' ? 'top-full mt-2' : 
            side === 'left' ? 'right-full mr-2' : 'left-full ml-2'
          } ${
            align === 'start' ? 'left-0' : 
            align === 'end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
          }`}
        >
          <div className="text-sm text-gray-600 leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

export function HoverCardTrigger({ children, className, ...props }) {
  return (
    <button
      className={`inline-flex items-center gap-2 ${className || ''}`}
      {...props}
    >
      {children}
      <FiInfo className="w-4 h-4 text-gray-400" />
    </button>
  )
}

export function HoverCardContent({ children, className, ...props }) {
  return (
    <div className={`text-sm text-gray-600 leading-relaxed ${className || ''}`} {...props}>
      {children}
    </div>
  )
}
