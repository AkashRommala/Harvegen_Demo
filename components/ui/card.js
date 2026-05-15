'use client'

import * as React from 'react'

export function Card({ children, className, ...props }) {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1 transition-all duration-300 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={`p-6 pb-0 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={`p-6 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={`p-6 pt-0 border-t border-gray-100 ${className || ''}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={`font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors ${className || ''}`} {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={`text-gray-600 text-sm leading-relaxed ${className || ''}`} {...props}>
      {children}
    </p>
  )
}
