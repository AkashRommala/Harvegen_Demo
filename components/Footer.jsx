import Link from 'next/link'
import { FiZap, FiMail, FiMapPin } from 'react-icons/fi'
import { FaGithub, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-[#1e3a8a] pt-16 pb-6">
      {/* Main Footer Content */}
      <div className="max-w-[1160px] mx-auto px-6">
        {/* Row 1: Logo & Description (full width on mobile) */}
        <div className="mb-10">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-[1rem] text-white no-underline mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-primary-700">
              <FiZap className="w-5 h-5" />
            </div>
            <span className="text-white">EPHub</span>
          </Link>
          <p className="text-white/80 text-sm leading-relaxed max-w-md">
            Open-source embedded systems learning platform for engineers, by engineers.
          </p>
        </div>

        {/* Row 2: Three columns - Projects, Learn, Contact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 mb-12">
          {/* Projects */}
          <div>
            <h5 className="font-semibold text-sm tracking-wider uppercase text-white mb-5">Projects</h5>
            <ul className="flex flex-col gap-3">
              <li><Link href="/projects" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">All Projects</Link></li>
              <li><Link href="/projects?level=beginner" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">Beginner</Link></li>
              <li><Link href="/projects?level=intermediate" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">Intermediate</Link></li>
              <li><Link href="/projects?level=advanced" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">Advanced</Link></li>
            </ul>
          </div>

          {/* Learn */}
          <div>
            <h5 className="font-semibold text-sm tracking-wider uppercase text-white mb-5">Learn</h5>
            <ul className="flex flex-col gap-3">
              <li><Link href="/tutorials" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">Embedded C</Link></li>
              <li><Link href="/tutorials" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">MCU Basics</Link></li>
              <li><Link href="/tutorials" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">Protocols</Link></li>
              <li><Link href="/tutorials" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">FreeRTOS</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h5 className="font-semibold text-sm tracking-wider uppercase text-white mb-5">Contact</h5>
            <ul className="flex flex-col gap-3 mb-4">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <FiMail className="w-4 h-4" />
                info@harvegen.com
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <FiMapPin className="w-4 h-4" />
                India
              </li>
              <li><Link href="/about" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">About Us</Link></li>
              <li><Link href="/about#contact" className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all">Get in Touch</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
            {/* Social Media Links */}
            <div className="flex gap-3 mb-4">
              <a href="#" className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-primary-700 transition-all">
                <FaGithub className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-primary-700 transition-all">
                <FaYoutube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-primary-700 transition-all">
                <FaTwitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white hover:text-primary-700 transition-all">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/20 gap-4 text-sm text-white/60">
          <span>© 2025 Embedded Projects Hub — MIT Licensed</span>
          <span className="flex items-center gap-1">
            Built with <span className="text-white">♥</span> by engineers, for engineers
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
