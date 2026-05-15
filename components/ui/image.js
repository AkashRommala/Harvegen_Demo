'use client'

import * as React from 'react'

export function Image({ 
  src, 
  alt, 
  className, 
  width, 
  height, 
  priority = false,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  return (
    <div className={`relative overflow-hidden ${className || ''}`}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover transition-all duration-300 ${
          isLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
        } ${hasError ? 'hidden' : ''}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Image not available
        </div>
      )}
    </div>
  )
}

export function ProjectImage({ src, alt, className, ...props }) {
  return (
    <div className="h-[140px] bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm flex items-center justify-center overflow-hidden">
      <Image 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        {...props}
      />
    </div>
  )
}

export function TutorialImage({ src, alt, className, ...props }) {
  return (
    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mb-4 overflow-hidden">
      <Image 
        src={src} 
        alt={alt} 
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        {...props}
      />
    </div>
  )
}