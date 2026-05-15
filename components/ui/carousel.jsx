"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

const Carousel = React.forwardRef(({ options, plugins, ...props }, ref) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

  React.useImperativeHandle(ref, () => emblaRef.current, [emblaRef])

  return (
    <div ref={emblaRef} className="overflow-hidden" {...props}>
      {props.children}
    </div>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className="flex transition-transform duration-500 ease-out"
      {...props}
    />
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`flex-[0_0_100%] min-w-0 ${className || ""}`}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef(({ className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      {...props}
    >
      <ChevronLeft className="w-6 h-6" />
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(({ className, onClick, ...props }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      {...props}
    >
      <ChevronRight className="w-6 h-6" />
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
