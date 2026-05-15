import React from 'react'
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react'

const Alert = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-50 border-gray-200 text-gray-900",
    success: "bg-green-50 border-green-200 text-green-900",
    info: "bg-blue-50 border-blue-200 text-blue-900",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
    destructive: "bg-red-50 border-red-200 text-red-900",
  }

  const icons = {
    default: Info,
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    destructive: XCircle,
  }

  const Icon = icons[variant] || icons.default

  return (
    <div
      ref={ref}
      className={`relative flex gap-3 rounded-lg border p-4 ${variants[variant]} ${className}`}
      {...props}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {props.children}
      </div>
    </div>
  )
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className = "", ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm opacity-90 ${className}`}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
