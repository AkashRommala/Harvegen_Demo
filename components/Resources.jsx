'use client'

import Link from 'next/link'
import { FiDownload, FiBookOpen, FiArrowRight, FiGithub, FiFileText, FiTool, FiCode, FiDatabase } from 'react-icons/fi'
import { Card, CardContent, CardTitle, CardDescription } from './ui/card'
import { Button, ButtonGroup } from './ui/button'
import { Badge } from './ui/badge'
import { ProjectImage } from './ui/image'

function Resources() {
  return (
    <>
      {/* Page Hero */}
      <header className="pt-[120px] pb-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/3 via-primary-500/8 to-transparent rounded-full blur-3xl animate-gradient"></div>
        <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary-500/15 to-primary-500/8 top-1/2 left-1/2 -translate-x-3/5 -translate-y-2/5 pointer-events-none animate-float"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 top-1/4 right-1/4 pointer-events-none animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-[1400px] mx-auto px-8 w-full relative z-10">
          <div className="text-sm text-gray-500 mb-6 font-mono animate-fade-in">
            <Link href="/" className="text-gray-400 hover:text-primary-600 transition-colors">Home</Link> <span className="text-gray-400">/</span> <span className="text-primary-600">Resources</span>
          </div>
          
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
              <span className="w-8 h-px bg-primary-600"></span>
              Downloads
            </div>
            
            <h1 className="text-gray-900 font-display text-5xl md:text-6xl font-bold leading-tight">
              Free Resources<br/><span className="text-primary-600">& Downloads</span>
            </h1>
            
            <p className="text-gray-600 text-xl max-w-[600px] leading-relaxed">
              Source code, datasheets, circuit schematics, and development tools. Everything you need — no sign-up required.
            </p>
          </div>
        </div>
      </header>

      <main className="py-24 bg-gradient-to-br from-white to-slate-50">
        <div className="max-w-[1400px] mx-auto px-8">
          {/* GitHub Banner */}
          <div className="flex items-center gap-8 bg-white border border-gray-200 rounded-2xl p-8 mb-16 shadow-lg flex-wrap">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-2xl flex items-center justify-center text-2xl">
              <FiGithub className="w-10 h-10 text-gray-700" />
            </div>
            <div className="flex-1">
              <h3 className="font-mono text-lg font-semibold text-gray-900 mb-2">All Source Code is on GitHub</h3>
              <p className="text-gray-600 text-base leading-relaxed">Every project and tutorial has a companion GitHub repo. Fork, clone, and contribute — MIT Licensed.</p>
              <div className="flex gap-4 mt-4">
                <Button variant="default" size="lg" href="https://github.com" target="blank" className="shadow-lg hover:shadow-xl">View on GitHub</Button>
                <Button variant="outline" size="lg" className="shadow-md hover:shadow-lg">Download All</Button>
              </div>
            </div>
          </div>

          {/* Source Code Section */}
          <section className="py-16 border-b border-gray-200">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600"></span>
                Source Code
              </div>
              <h2 className="text-gray-900 text-3xl font-bold mb-3">Project Source Code</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Complete, well-documented source code for all projects with build instructions and dependencies.</p>
            </div>
            <div className="grid gap-6">
              {[
                { 
                  name: 'Smart Irrigation System — STM32F407', 
                  meta: 'Keil µVision Project · 2.3 MB · C / HAL',
                  description: 'Complete source code with sensor integration, relay control, and cloud connectivity.',
                  tags: ['STM32', 'C', 'HAL', 'IoT'],
                  image: '/iot.jpeg'
                },
                { 
                  name: 'Driver Drowsiness Detection — LPC1768', 
                  meta: 'Keil µVision Project · 1.8 MB · Bare-Metal C',
                  description: 'IR sensor array processing with pattern recognition algorithms and alert system.',
                  tags: ['LPC1768', 'C', 'Bare-Metal', 'Safety'],
                  image: '/vlsi1.jpeg'
                },
                { 
                  name: 'IoT Weather Station — Arduino + ESP8266', 
                  meta: 'Arduino IDE Sketch · 890 KB · C++',
                  description: 'Sensor fusion implementation with Blynk dashboard integration.',
                  tags: ['Arduino', 'C++', 'ESP8266', 'Blynk'],
                  image: '/iot2.jpg'
                },
                {
                  name: 'Autonomous Rover — STM32F411 + FreeRTOS',
                  meta: 'STM32CubeIDE Project · 3.1 MB · C',
                  description: 'Multi-task obstacle avoidance with path planning and sensor fusion.',
                  tags: ['STM32', 'FreeRTOS', 'C', 'Robotics'],
                  image: '/vlsi 2.jpg'
                }
              ].map((res, i) => (
                <div key={i} className="flex items-center gap-6 bg-white border border-gray-200 rounded-2xl p-8 shadow-md hover:shadow-2xl hover:border-primary-500 transition-all group">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{res.name}</h4>
                      <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">{res.meta}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{res.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {res.tags.map((tag, j) => (
                        <span key={j} className="px-3 py-1 bg-primary-50 border border-primary-200 rounded-lg text-sm text-primary-700 font-mono">{tag}</span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md">Download</Button>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-50">View Code</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Datasheets Section */}
          <section className="py-16 border-b border-gray-200">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600"></span>
                Documentation
              </div>
              <h2 className="text-gray-900 text-3xl font-bold mb-3">MCU & Component Datasheets</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Official documentation for all microcontrollers and components used in our projects.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  name: 'LPC1768 User Manual — NXP UM10360', 
                  meta: 'PDF · 840 pages · NXP Semiconductors',
                  description: 'Complete reference for LPC1768 ARM Cortex-M3 microcontroller.',
                  size: '840 pages',
                  image: '/vlsi 2.jpeg'
                },
                { 
                  name: 'STM32F407 Reference Manual — ST RM0090', 
                  meta: 'PDF · 1747 pages · STMicroelectronics',
                  description: 'Comprehensive guide for STM32F407 series microcontrollers.',
                  size: '1747 pages',
                  image: '/vlsi1.jpeg'
                },
                { 
                  name: 'ATmega328P Datasheet — Microchip DS40002061', 
                  meta: 'PDF · 660 pages · Microchip Technology',
                  description: 'Official datasheet for Arduino Uno\'s main microcontroller.',
                  size: '660 pages',
                  image: '/vlsi 2.jpg'
                },
                {
                  name: 'ESP8266 WiFi Module Datasheet',
                  meta: 'PDF · 156 pages · Espressif Systems',
                  description: 'Complete specifications for ESP8266 WiFi connectivity module.',
                  size: '156 pages',
                  image: '/iot3.jpg'
                }
              ].map((res, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:border-primary-500 transition-all group">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl overflow-hidden">
                      <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{res.name}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{res.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">{res.meta}</span>
                    <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md">Download PDF</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tools Section */}
          <section className="py-16 border-b border-gray-200">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600"></span>
                Toolchain
              </div>
              <h2 className="text-gray-900 text-3xl font-bold mb-3">Recommended Development Tools</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Professional-grade tools and IDEs for embedded systems development.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  name: 'STM32CubeIDE', 
                  desc: 'Free Eclipse-based IDE from ST with code generation, HAL libraries, and integrated GDB debugger.',
                  badge: 'Free · st.com',
                  features: ['Code Generation', 'HAL Libraries', 'GDB Debugger', 'FreeRTOS Support'],
                  icon: FiTool
                },
                { 
                  name: 'Keil µVision 5', 
                  desc: 'Industry-standard ARM IDE. Free with 32 KB code limit.',
                  badge: 'Free (limited) · keil.com',
                  features: ['Professional Debugging', 'RTOS Support', 'Extensive Libraries', 'Industry Standard'],
                  icon: FiTool
                },
                { 
                  name: 'Arduino IDE 2.x', 
                  desc: 'Modern IDE with integrated debugger, board manager, library manager.',
                  badge: 'Free · arduino.cc',
                  features: ['Beginner Friendly', 'Integrated Debugger', 'Library Manager', 'Cross Platform'],
                  icon: FiTool
                },
                { 
                  name: 'PlatformIO', 
                  desc: 'VS Code extension with 1000+ boards, unified build system.',
                  badge: 'Free · platformio.org',
                  features: ['VS Code Integration', '1000+ Boards', 'Unified Build System', 'Modern Toolchain'],
                  icon: FiTool
                },
                {
                  name: 'STM32CubeMX',
                  desc: 'Graphical tool for configuring STM32 microcontrollers and generating initialization code.',
                  badge: 'Free · st.com',
                  features: ['Pin Configuration', 'Clock Tree', 'Middleware Integration', 'Code Generation'],
                  icon: FiTool
                },
                {
                  name: 'Oscilloscope Software',
                  desc: 'PC-based oscilloscope and logic analyzer tools for debugging and analysis.',
                  badge: 'Various Options',
                  features: ['Signal Analysis', 'Protocol Decoding', 'Data Logging', 'Real-time Monitoring'],
                  icon: FiTool
                }
              ].map((tool, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-2xl hover:border-primary-500 transition-all group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <tool.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{tool.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{tool.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.features.map((feature, j) => (
                      <span key={j} className="px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">{feature}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary-600 font-medium">{tool.badge}</span>
                    <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md">Get Started</Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Links Section */}
          <section className="py-16">
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600"></span>
                Quick Links
              </div>
              <h2 className="text-gray-900 text-3xl font-bold mb-3">Additional Resources</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Quick access to commonly needed resources and documentation.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-primary-300 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl flex items-center justify-center">
                    <FiCode className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-mono text-lg font-semibold text-gray-900">Code Examples</h4>
                    <p className="text-gray-600 text-sm">Ready-to-use code snippets</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">GPIO Examples</Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">UART Examples</Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">Timer Examples</Button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-primary-300 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl flex items-center justify-center">
                    <FiDatabase className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-mono text-lg font-semibold text-gray-900">Component Libraries</h4>
                    <p className="text-gray-600 text-sm">Libraries and drivers</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">Sensor Libraries</Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">Display Drivers</Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">Communication Protocols</Button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-primary-300 hover:shadow-xl transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl flex items-center justify-center">
                    <FiTool className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-mono text-lg font-semibold text-gray-900">Development Tools</h4>
                    <p className="text-gray-600 text-sm">Utilities and helpers</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">Pinout Tools</Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">Clock Calculators</Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-gray-50">Memory Maps</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default Resources
