'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiZap, FiSettings, FiBookOpen, FiCpu, FiGlobe, FiRadio, FiLayers, FiDownload } from 'react-icons/fi'
import { Button } from './ui/button'
import { ProjectCardSkeleton, TutorialCardSkeleton } from './ui/skeletons'
import HeroBanner from './HeroBanner'

const DIFFICULTY_COLORS = {
  beginner: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  intermediate: 'text-amber-700 border-amber-200 bg-amber-50',
  advanced: 'text-red-700 border-red-200 bg-red-50',
  Beginner: 'text-emerald-700 border-emerald-200 bg-emerald-50',
  Intermediate: 'text-amber-700 border-amber-200 bg-amber-50',
  Advanced: 'text-red-700 border-red-200 bg-red-50',
}

function Home() {
  const [projects, setProjects] = useState([])
  const [tutorials, setTutorials] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingTutorials, setLoadingTutorials] = useState(true)

  useEffect(() => {
    fetch('/api/projects?featured=true&limit=3')
      .then(r => r.json())
      .then(json => { if (json.success) setProjects(json.data.projects || []) })
      .catch(() => {})
      .finally(() => setLoadingProjects(false))

    fetch('/api/tutorials?featured=true&limit=3')
      .then(r => r.json())
      .then(json => { if (json.success) setTutorials(json.data.tutorials || []) })
      .catch(() => {})
      .finally(() => setLoadingTutorials(false))
  }, [])

  const MCU_PLATFORMS = [
    { name: 'LPC1768', desc: 'NXP ARM Cortex-M3 running at 100 MHz. The academic standard for learning bare-metal register-level programming with comprehensive peripheral support.', icon: FiCpu, image: '/vlsi 2.jpeg', tags: ['ARM', 'Cortex-M3', 'Academic'] },
    { name: 'STM32',   desc: 'ST Microelectronics ARM Cortex-M4 processor with DSP instructions and FPU. Running up to 168 MHz with industry-standard HAL/LL libraries.',              icon: FiCpu, image: '/iot3.jpg',    tags: ['ARM', 'Cortex-M4', 'Industry'] },
    { name: 'Arduino', desc: 'ATmega-based prototyping platform. Beginner-friendly with massive library ecosystem. Ideal for rapid prototyping and IoT projects.',                   icon: FiCpu, image: '/iot2.jpg',    tags: ['ATmega', 'Beginner', 'Popular'] },
  ]

  return (
    <>
      <HeroBanner />

      {/* ── Featured Projects ── */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-gray-50 to-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          {/* Section header — stacks on mobile */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-3 sm:mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600" />
                Featured Work
              </div>
              <h2 className="text-gray-900 mb-2 sm:mb-4 text-2xl sm:text-4xl font-bold">Featured Projects</h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">Curated projects that build real-world embedded systems skills from the ground up.</p>
            </div>
            <Link href="/projects" className="self-start sm:self-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold hover:border-gray-300 hover:text-gray-900 hover:shadow-lg transition-all shadow-md whitespace-nowrap">
              All Projects →
            </Link>
          </div>

          <div className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loadingProjects
              ? Array(3).fill(0).map((_, i) => <ProjectCardSkeleton key={i} />)
              : projects.length > 0
              ? projects.map((proj) => (
                <article key={proj._id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1 transition-all duration-300">
                  <div className="h-[160px] sm:h-[180px] bg-gradient-to-br from-primary-50 to-primary-100 shadow-sm flex items-center justify-center overflow-hidden relative">
                    {proj.imageURL ? (
                      <img src={proj.imageURL} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <FiZap className="w-16 h-16 text-primary-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4 sm:p-6 pb-0">
                    <div className="flex gap-2 flex-wrap mb-3">
                      {proj.tags.map((tag, j) => (
                        <span key={j} className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border ${DIFFICULTY_COLORS[tag] || 'text-blue-700 border-blue-200 bg-blue-50'}`}>{tag}</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">{proj.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">{proj.description}</p>
                  </div>
                  <div className="px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center border-t border-gray-100 bg-gray-50/50">
                    <span className="text-xs text-gray-500 font-medium">{proj.difficulty}</span>
                    <Link href={`/projects/${proj.slug}`}>
                      <Button variant="default" size="sm" className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">View Project</Button>
                    </Link>
                  </div>
                </article>
              ))
              : (
                [
                  { id: 1, title: 'Smart Irrigation System', desc: 'Automated soil-moisture irrigation using ADC sensors on STM32F407.', tags: ['Intermediate', 'STM32', 'IoT'], image: '/iot.jpeg', slug: 'smart-irrigation-system' },
                  { id: 2, title: 'Driver Drowsiness Detection', desc: 'IR sensor-based eye-blink pattern recognition on NXP LPC1768.', tags: ['Advanced', 'LPC1768'], image: '/vlsi1.jpeg', slug: 'driver-drowsiness-detection' },
                  { id: 3, title: 'IoT Weather Station', desc: 'DHT22 + BMP280 sensor fusion, data uploaded via ESP8266 to Blynk.', tags: ['Beginner', 'Arduino', 'IoT'], image: '/iot2.jpg', slug: 'iot-weather-station' },
                ].map((proj) => (
                  <article key={proj.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1 transition-all duration-300">
                    <div className="h-[160px] sm:h-[180px] overflow-hidden relative">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 sm:p-6 pb-0">
                      <div className="flex gap-2 flex-wrap mb-3">
                        {proj.tags.map((tag, j) => (
                          <span key={j} className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border ${DIFFICULTY_COLORS[tag] || 'text-blue-700 border-blue-200 bg-blue-50'}`}>{tag}</span>
                        ))}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">{proj.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-2">{proj.desc}</p>
                    </div>
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50/50">
                      <Link href="/projects">
                        <Button variant="default" size="sm" className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">View Project</Button>
                      </Link>
                    </div>
                  </article>
                ))
              )
            }
          </div>
        </div>
      </section>

      {/* ── Latest Modules ── */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8 sm:mb-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 mb-3 sm:mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600" />
                Learning Path
              </div>
              <h2 className="text-gray-900 mb-2 sm:mb-4 text-2xl sm:text-4xl font-bold">Latest Modules</h2>
              <p className="text-gray-600 text-base sm:text-lg leading-relaxed">Step-by-step guides from register-level basics to production RTOS patterns.</p>
            </div>
            <Link href="/tutorials" className="self-start sm:self-auto px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-semibold hover:border-gray-300 hover:text-gray-900 hover:shadow-lg transition-all shadow-md whitespace-nowrap">
              All Modules →
            </Link>
          </div>

          <div className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loadingTutorials
              ? Array(3).fill(0).map((_, i) => <TutorialCardSkeleton key={i} />)
              : tutorials.length > 0
              ? tutorials.map((tut) => (
                <Link href={`/tutorials/${tut.slug}`} key={tut._id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1 transition-all duration-300 no-underline flex flex-col">
                  {tut.imageURL && (
                    <div className="h-[150px] sm:h-[160px] overflow-hidden relative shrink-0">
                      <img src={tut.imageURL} alt={tut.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border mb-2 sm:mb-3 ${DIFFICULTY_COLORS[tut.difficulty] || ''}`}>{tut.difficulty}</span>
                    <h3 className="font-bold text-base text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{tut.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed flex-1">{tut.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <span className="text-primary-600 font-bold">⏱</span> {tut.time}
                      </span>
                      <Button variant="default" size="sm" className="shadow-md hover:shadow-lg">View Module</Button>
                    </div>
                  </div>
                </Link>
              ))
              : (
                [
                  { id: 1, title: 'GPIO: Input, Output & EXTI Interrupts', desc: 'Complete guide to configuring digital I/O on STM32 at register level.', time: '25 min', level: 'Beginner', image: '/iot3.jpg', slug: 'gpio-input-output-exti-interrupts' },
                  { id: 2, title: 'UART: From Config to Circular Buffers', desc: 'Master UART communication from basic configuration to interrupt-driven receiver.', time: '35 min', level: 'Intermediate', image: '/iot2.jpg', slug: 'uart-from-config-to-circular-buffers' },
                  { id: 3, title: 'FreeRTOS: Tasks, Queues & Semaphores', desc: 'Deep dive into real-time operating systems with tasks and synchronization.', time: '55 min', level: 'Advanced', image: '/vlsi 2.jpg', slug: 'freertos-tasks-scheduling' },
                ].map((tut) => (
                  <Link href={`/tutorials/${tut.slug}`} key={tut.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1 transition-all duration-300 no-underline flex flex-col">
                    <div className="h-[150px] sm:h-[160px] overflow-hidden relative shrink-0">
                      <img src={tut.image} alt={tut.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border mb-2 sm:mb-3 ${DIFFICULTY_COLORS[tut.level] || ''}`}>{tut.level}</span>
                      <h3 className="font-bold text-base text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">{tut.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed flex-1">{tut.desc}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">⏱ {tut.time}</span>
                        <Button variant="default" size="sm">View Module</Button>
                      </div>
                    </div>
                  </Link>
                ))
              )
            }
          </div>
        </div>
      </section>

      {/* ── MCU Platforms ── */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-3 mb-3 sm:mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600 justify-center">
              <span className="w-8 h-px bg-primary-600" />
              Platforms
            </div>
            <h2 className="text-gray-900 mb-2 sm:mb-4 text-2xl sm:text-4xl font-bold">Microcontroller Platforms</h2>
            <p className="mx-auto text-gray-600 text-base sm:text-lg max-w-[600px] leading-relaxed">Tutorials and projects organised by microcontroller family.</p>
          </div>
          <div className="grid gap-5 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {MCU_PLATFORMS.map((mcu, i) => (
              <div key={i} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary-500 hover:-translate-y-1 transition-all duration-300">
                <div className="h-[160px] sm:h-[180px] overflow-hidden relative">
                  <img src={mcu.image} alt={mcu.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex gap-2 flex-wrap mb-3">
                    {mcu.tags.map((tag, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-lg text-xs font-bold tracking-wider uppercase bg-[#1e3a8a]/10 text-[#1e3a8a] border border-[#1e3a8a]/20">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">{mcu.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3">{mcu.desc}</p>
                  <Link href="/microcontrollers" className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-[#1e3a8a] text-white rounded-xl text-sm font-bold hover:bg-[#1e40af] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Explore {mcu.name} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-3xl" />
            <div className="relative z-10">
              <h2 className="text-white mb-4 sm:mb-6 text-2xl sm:text-4xl font-bold">Ready to Build Something <span className="text-yellow-300">Real?</span></h2>
              <p className="text-white/90 mx-auto mb-6 sm:mb-8 max-w-[600px] text-base sm:text-lg leading-relaxed">All source code, schematics, and datasheets are free. No login required.</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button href="/projects" variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl">Start a Project</Button>
                <Button href="/resources" variant="ghost" size="lg" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">Download Resources</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home