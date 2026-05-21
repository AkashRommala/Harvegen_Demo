'use client'

import { useState, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { Button } from './ui/button'
import { HeroSliderSkeleton } from './ui/skeletons'

// Fallback static slides — used when DB has no slides yet (zero-regression safety)
const FALLBACK_SLIDES = [
  {
    _id: 'f1',
    imageURL: '/iot2.jpg',
    subtitle: 'Open Source Learning Platform',
    title: 'Embedded Systems',
    description: 'Master microcontrollers, IoT, and embedded C programming with hands-on projects.',
    ctaText: 'Explore Projects',
    ctaLink: '/projects',
  },
  {
    _id: 'f2',
    imageURL: '/iot3.jpg',
    subtitle: 'Practical IoT Solutions',
    title: 'IoT Development',
    description: 'Build smart connected devices with ESP8266, sensors, and cloud integration.',
    ctaText: 'View IoT Projects',
    ctaLink: '/projects',
  },
  {
    _id: 'f3',
    imageURL: '/vlsi 2.jpg',
    subtitle: 'VLSI Design & FPGA',
    title: 'Hardware Design',
    description: 'Learn digital circuit design, Verilog, FPGA programming, and hardware acceleration.',
    ctaText: 'Explore Hardware',
    ctaLink: '/projects',
  },
  {
    _id: 'f4',
    imageURL: '/iot.jpeg',
    subtitle: 'ARM Cortex-M Programming',
    title: 'Microcontrollers',
    description: 'Program STM32, LPC1768, and other ARM-based microcontrollers from scratch.',
    ctaText: 'Browse MCUs',
    ctaLink: '/microcontrollers',
  },
]

export default function HeroBanner() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, speed: 0.8 },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  )
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/hero-slider')
        const json = await res.json()
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSlides(json.data)
        } else {
          setSlides(FALLBACK_SLIDES)
        }
      } catch {
        setSlides(FALLBACK_SLIDES)
      } finally {
        setLoading(false)
      }
    }
    fetchSlides()
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi])

  if (loading) return <HeroSliderSkeleton />

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div ref={emblaRef} className="overflow-hidden h-full">
          <div className="flex h-full" style={{ WebkitUserSelect: 'none' }}>
            {slides.map((slide) => (
              <div key={slide._id} className="flex-[0_0_100%] min-w-0 h-screen relative">
                <img
                  src={slide.imageURL}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="max-w-[1400px] mx-auto px-5 sm:px-8 w-full pt-24 sm:pt-32 pb-16 sm:pb-20">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4 animate-fade-in">
                      <span className="w-8 sm:w-12 h-px bg-primary-400" />
                      <span className="text-primary-400 font-semibold tracking-wider uppercase text-xs sm:text-sm">
                        {slide.subtitle}
                      </span>
                    </div>
                    <h1 className="text-white font-display text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-slide-up">
                      {slide.title}
                    </h1>
                    <p className="text-gray-300 text-base sm:text-xl md:text-2xl max-w-[700px] mb-6 sm:mb-10 leading-relaxed animate-slide-up">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-up">
                      <Button
                        href={slide.ctaLink}
                        variant="default"
                        size="lg"
                        className="bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      >
                        {slide.ctaText}
                      </Button>
                      <Button
                        href="/tutorials"
                        variant="secondary"
                        size="lg"
                        className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 hover:border-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      >
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
          aria-label="Previous slide"
        >
          <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
          aria-label="Next slide"
        >
          <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
              index === selectedIndex ? 'bg-primary-500 w-10' : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator — hidden on small screens */}
      <div className="hidden sm:flex absolute bottom-8 right-8 z-20 flex-col items-center text-white/60">
        <span className="text-xs tracking-wider uppercase mb-2">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent animate-bounce" />
      </div>
    </section>
  )
}
