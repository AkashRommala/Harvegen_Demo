'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiZap, FiSettings, FiBookOpen, FiMail, FiGithub, FiTwitter, FiLinkedin, FiSend } from 'react-icons/fi'
import { FaYoutube } from 'react-icons/fa'
import { Button } from './ui/button'

function About() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Send contact form via API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      
      if (result.success) {
        // Toast helper
        const toast = (msg, type = 'info') => {
          let el = document.getElementById('toast')
          if (!el) {
            el = document.createElement('div')
            el.id = 'toast'
            document.body.appendChild(el)
          }
          const icons = { info: '', success: '', warn: '', error: '' }
          el.innerHTML = `${icons[type] || icons.info} <span>${msg}</span>`
          el.classList.add('show')
          clearTimeout(el._t)
          el._t = setTimeout(() => el.classList.remove('show'), 3200)
        }
        
        toast("Message sent! We'll reply soon.", 'success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error(result.error || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your message. Please try again.')
    }
  }

  return (
    <>
      {/* Page Hero */}
      <header className="pt-[120px] pb-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/3 via-primary-500/8 to-transparent rounded-full blur-3xl animate-gradient"></div>
        <div className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary-500/15 to-primary-500/8 top-1/2 left-1/2 -translate-x-3/5 -translate-y-2/5 pointer-events-none animate-float"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 top-1/4 right-1/4 pointer-events-none animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="max-w-[1400px] mx-auto px-8 w-full relative z-10">
          <div className="text-sm text-gray-500 mb-6 font-mono animate-fade-in">
            <Link href="/" className="text-gray-400 hover:text-primary-600 transition-colors">Home</Link> <span className="text-gray-400">/</span> <span className="text-primary-600">About</span>
          </div>
          
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
              <span className="w-8 h-px bg-primary-600"></span>
              Our Story
            </div>
            
            <h1 className="text-gray-900 font-display text-5xl md:text-6xl font-bold leading-tight">
              Built for Engineers,<br/><span className="text-primary-600">By Engineers</span>
            </h1>
            
            <p className="text-gray-600 text-xl max-w-[600px] leading-relaxed">
              Embedded Projects Hub started as a personal notebook of MCU code — and grew into an open-source learning platform used by students and developers worldwide.
            </p>
          </div>
        </div>
      </header>

      <main className="bg-gradient-to-br from-white to-slate-50">
        {/* Mission */}
        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="mb-16">
              <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600"></span>
                Mission
              </div>
              <h2 className="text-gray-900 text-3xl font-bold mb-3">Why We Built This</h2>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-12 mb-8 shadow-lg">
              <blockquote className="font-mono text-xl leading-relaxed border-l-4 border-primary-600 pl-6 text-gray-700">
                "There were plenty of Hello World tutorials for microcontrollers,
                but almost no <em className="text-primary-600 not-italic">practical, project-based resources</em> that bridge
                the gap between coursework and real-world firmware development."
              </blockquote>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  We believe the best way to learn embedded systems is to <strong className="text-gray-900">build real things</strong>.
                  Every tutorial on this hub is tied to a working project.
                  Every line of code has a purpose. Every schematic can be soldered.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Our goal is to create the most <strong className="text-gray-900">technically rigorous</strong>,
                  accessible, and practical open-source embedded systems learning resource
                  on the internet — completely free, forever.
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Button href="/projects" variant="default" size="lg" className="shadow-lg hover:shadow-xl">Browse Projects</Button>
                  <Button href="/tutorials" variant="outline" size="lg" className="shadow-md hover:shadow-lg">Start Learning</Button>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl h-96 flex items-center justify-center text-7xl relative overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(gray 1px, transparent 1px), linear-gradient(90deg, gray 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                <span className="relative z-10"><FiZap className="w-20 h-20 text-primary-600" /></span>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24 bg-gradient-to-br from-slate-50 to-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="mb-16">
              <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600"></span>
                Team
              </div>
              <h2 className="text-gray-900 text-3xl font-bold mb-3">The People Behind EPHub</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Meet the engineers and educators building the future of embedded systems learning.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[{ name: 'Arjun Reddy', role: 'Founder & Lead Developer', bio: '5+ years firmware development. Former automotive ECU developer passionate about bare-metal programming and RTOS.', initials: 'AR', image: '/vlsi1.jpeg' },
                { name: 'Sneha Nair', role: 'IoT Specialist & Technical Writer', bio: 'IoT architect specialising in MQTT, cloud integration, and sensor networks.', initials: 'SN', image: '/iot2.jpg' },
                { name: 'Karthik Patel', role: 'Hardware & PCB Designer', bio: 'PCB design expert. Creates all circuit schematics and hardware reference designs.', initials: 'KP', image: '/vlsi 2.jpeg' },
              ].map((member, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 text-center hover:border-primary-300 hover:shadow-xl transition-all group">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-full mx-auto mb-6 overflow-hidden relative">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h4 className="font-mono text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">{member.name}</h4>
                  <div className="text-primary-600 text-sm font-medium mb-4">{member.role}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="mb-16">
              <div className="inline-flex items-center gap-3 mb-4 font-semibold text-sm tracking-widest uppercase text-primary-600">
                <span className="w-8 h-px bg-primary-600"></span>
                Contact
              </div>
              <h2 className="text-gray-900 text-3xl font-bold mb-3">Get in Touch</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Have a project to contribute? Found an error in a tutorial? Want to collaborate or sponsor the hub? We'd love to hear from you.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="mb-8">
                  {[{ icon: FiMail, label: 'Email', val: 'hello@ephub.dev' },
                    { icon: FiGithub, label: 'GitHub', val: 'github.com/embedded-projects-hub' },
                    { icon: FiTwitter, label: 'Twitter / X', val: '@ephubdev' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-200">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl flex items-center justify-center shrink-0">
                        <item.icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <div className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</div>
                        <div className="font-mono text-sm text-primary-600 font-semibold">{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <a href="#" className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-lg hover:border-primary-300 hover:bg-primary-50 hover:shadow-lg transition-all">
                    <FiGithub className="w-5 h-5 text-gray-700" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-lg hover:border-primary-300 hover:bg-primary-50 hover:shadow-lg transition-all">
                    <FaYoutube className="w-5 h-5 text-gray-700" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-lg hover:border-primary-300 hover:bg-primary-50 hover:shadow-lg transition-all">
                    <FiTwitter className="w-5 h-5 text-gray-700" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-lg hover:border-primary-300 hover:bg-primary-50 hover:shadow-lg transition-all">
                    <FiLinkedin className="w-5 h-5 text-gray-700" />
                  </a>
                </div>
              </div>

              <form className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block font-mono text-sm text-gray-600 mb-2">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name" 
                      required 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-sm text-gray-600 mb-2">Email</label>
                    <input 
                      type="email" 
                      placeholder="you@example.com" 
                      required 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" 
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block font-mono text-sm text-gray-600 mb-2">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Project contribution / Bug report / Collaboration" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-primary-500 focus:bg-white transition-colors" 
                  />
                </div>
                <div className="mb-6">
                  <label className="block font-mono text-sm text-gray-600 mb-2">Message</label>
                  <textarea 
                    rows="5" 
                    placeholder="Tell us what's on your mind…" 
                    required 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:border-primary-500 focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>
                <Button type="submit" variant="default" size="lg" className="shadow-lg hover:shadow-xl">Send Message</Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default About