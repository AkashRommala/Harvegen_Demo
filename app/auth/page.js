'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUser } from '@/context/UserContext'
import {
  FiMail, FiShield, FiCheckCircle, FiUser,
  FiArrowLeft, FiLoader, FiZap, FiCpu,
  FiBookOpen, FiLayers, FiLock, FiEye, FiEyeOff
} from 'react-icons/fi'

const BRANCH_OPTIONS = [
  { value: '', label: 'Branch / Field of interest (optional)' },
  { value: 'embedded-systems', label: 'Embedded Systems' },
  { value: 'iot', label: 'Internet of Things (IoT)' },
  { value: 'vlsi', label: 'VLSI Design' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'fpga', label: 'FPGA / Digital Design' },
  { value: 'microcontrollers', label: 'Microcontrollers' },
  { value: 'electronics', label: 'Electronics & Communication' },
  { value: 'other', label: 'Other' },
]

const FEATURES = [
  { icon: FiCpu,      title: 'MCU Projects',    desc: 'Full source code for STM32, LPC1768, Arduino & more' },
  { icon: FiBookOpen, title: 'Deep Tutorials',  desc: 'Register-level to RTOS — all in one place' },
  { icon: FiLayers,   title: 'Track Progress',  desc: 'Bookmark tutorials, log completions, earn badges' },
]

export default function AuthPage() {
  const router = useRouter()
  const { login } = useUser()

  const [mode, setMode] = useState('signin')  // 'signin' | 'signup'
  const [step, setStep] = useState('form')    // 'form' | 'otp'

  // Shared fields
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)

  // Signup-only
  const [name, setName]       = useState('')
  const [college, setCollege] = useState('')
  const [branch, setBranch]   = useState('')

  const [otp, setOtp]         = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const resetForm = () => {
    setStep('form')
    setEmail(''); setPassword(''); setShowPw(false)
    setName(''); setCollege(''); setBranch('')
    setOtp(''); setError(''); setLoading(false)
  }

  const switchMode = (m) => { setMode(m); resetForm() }

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const sendOTP = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
          college: college.trim(),
          branch,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to send OTP.')
      setStep('otp')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name.'); return }
    await sendOTP()
  }

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) { setError('Please enter the complete 6-digit code.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Invalid OTP.')
      login(json.user)
      router.push('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all'
  const labelCls = 'block text-xs font-semibold text-gray-400 mb-1.5'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-[#0c1a3a] flex">

      {/* ── Left feature panel (desktop) ───────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[460px] xl:w-[500px] flex-col justify-between p-12 relative overflow-hidden flex-shrink-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

        <Link href="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <FiZap className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xl font-bold">Harvegen</span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Learn Embedded<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-emerald-400">
              Systems Faster
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-10">
            Join engineers mastering microcontrollers, IoT, and real-time systems — for free.
          </p>
          <div className="space-y-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{title}</div>
                  <div className="text-gray-400 text-sm">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-xs relative z-10">© 2025 Harvegen · All rights reserved</p>
      </div>

      {/* ── Right: auth form ────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-[440px] py-8">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FiZap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white text-lg font-bold">Harvegen</span>
          </Link>

          <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl overflow-hidden">

            {/* Tab bar */}
            {step === 'form' && (
              <div className="flex bg-white/5">
                {['signin', 'signup'].map(m => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-3.5 text-sm font-semibold transition-all ${
                      mode === m
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {m === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>
            )}

            <div className="p-8">
              {/* Back button on OTP step */}
              {step === 'otp' && (
                <button
                  onClick={() => { setStep('form'); setError('') }}
                  className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
                >
                  <FiArrowLeft className="w-4 h-4" /> Back
                </button>
              )}

              {/* Heading */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {step === 'form'
                    ? (mode === 'signin' ? 'Welcome back' : 'Create your account')
                    : 'Check your inbox'
                  }
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {step === 'form'
                    ? (mode === 'signin'
                      ? 'Enter your credentials to receive a sign-in code'
                      : 'Fill in your details to get started')
                    : `We sent a 6-digit code to ${email}`
                  }
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* ── FORM STEP ─────────────────────────────────────────────── */}
              {step === 'form' && (
                <form onSubmit={handleFormSubmit} className="space-y-4">

                  {/* Name (signup) */}
                  {mode === 'signup' && (
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <div className="relative">
                        <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                        <input
                          type="text" value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Your full name"
                          required autoFocus
                          className={`${inputCls} pl-10`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className={labelCls}>Email Address *</label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="email" value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required autoFocus={mode === 'signin'}
                        className={`${inputCls} pl-10`}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className={labelCls}>
                      Password *{' '}
                      {mode === 'signup' && <span className="font-normal text-gray-500">(min 6 characters)</span>}
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder={mode === 'signin' ? 'Your password' : 'Create a strong password'}
                        required minLength={6}
                        className={`${inputCls} pl-10 pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(s => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                        tabIndex={-1}
                      >
                        {showPw ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* College (signup) */}
                  {mode === 'signup' && (
                    <div>
                      <label className={labelCls}>College / Organization</label>
                      <input
                        type="text" value={college}
                        onChange={e => setCollege(e.target.value)}
                        placeholder="e.g. IIT Hyderabad, BITS Pilani"
                        className={inputCls}
                      />
                    </div>
                  )}

                  {/* Branch (signup) */}
                  {mode === 'signup' && (
                    <div>
                      <label className={labelCls}>Branch / Field of Interest</label>
                      <select
                        value={branch}
                        onChange={e => setBranch(e.target.value)}
                        className={`${inputCls} text-gray-400`}
                      >
                        {BRANCH_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-gray-900 text-white">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email.trim() || !password}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all text-sm mt-2"
                  >
                    {loading
                      ? <FiLoader className="w-5 h-5 animate-spin" />
                      : <><FiShield className="w-4 h-4" /> {mode === 'signin' ? 'Send OTP to Sign In' : 'Send OTP to Sign Up'}</>
                    }
                  </button>

                  <p className="text-center text-xs text-gray-600">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              )}

              {/* ── OTP STEP ──────────────────────────────────────────────── */}
              {step === 'otp' && (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="bg-primary-600/10 border border-primary-600/20 rounded-xl p-4 text-center">
                    <FiMail className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                    <p className="text-gray-300 text-sm">
                      Code sent to <span className="text-white font-mono">{email}</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">Expires in 5 minutes</p>
                  </div>

                  <div>
                    <label className={labelCls}>Verification Code</label>
                    <input
                      type="text" inputMode="numeric"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="· · · · · ·"
                      maxLength={6} autoFocus
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otp.length !== 6 || loading}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
                  >
                    {loading
                      ? <FiLoader className="w-5 h-5 animate-spin" />
                      : <><FiCheckCircle className="w-4 h-4" /> Verify & {mode === 'signup' ? 'Create Account' : 'Sign In'}</>
                    }
                  </button>

                  <button
                    type="button"
                    onClick={() => { setOtp(''); sendOTP() }}
                    disabled={loading}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
                  >
                    Didn't receive it? Resend OTP
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Switch mode link */}
          <p className="text-center text-gray-500 text-sm mt-6">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          <p className="text-center mt-3">
            <Link href="/" className="text-gray-600 hover:text-gray-400 text-sm transition-colors">
              ← Back to Harvegen
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
