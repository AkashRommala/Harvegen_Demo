'use client'

import { useState } from 'react'
import {
  FiMail, FiX, FiShield, FiCheckCircle, FiUser,
  FiArrowLeft, FiLoader, FiLock, FiEye, FiEyeOff, FiLogIn
} from 'react-icons/fi'

const BRANCH_OPTIONS = [
  { value: '', label: 'Select your branch / field of interest' },
  { value: 'embedded-systems', label: 'Embedded Systems' },
  { value: 'iot', label: 'Internet of Things (IoT)' },
  { value: 'vlsi', label: 'VLSI Design' },
  { value: 'robotics', label: 'Robotics' },
  { value: 'fpga', label: 'FPGA / Digital Design' },
  { value: 'microcontrollers', label: 'Microcontrollers' },
  { value: 'electronics', label: 'Electronics & Communication' },
  { value: 'other', label: 'Other' },
]

/**
 * LoginModal — two-mode auth:
 *
 * SIGN-IN:  email + password → direct login via /api/auth/login (no OTP needed)
 * SIGN-UP:  name + email + password + college + branch → send OTP → verify OTP → account created
 */
export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('signin')   // 'signin' | 'signup'
  const [step, setStep] = useState('form')     // 'form' | 'otp'

  // Shared fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Signup-only fields
  const [name, setName] = useState('')
  const [college, setCollege] = useState('')
  const [branch, setBranch] = useState('')

  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const reset = () => {
    setStep('form')
    setEmail(''); setPassword(''); setShowPassword(false)
    setName(''); setCollege(''); setBranch('')
    setOtp(''); setLoading(false); setError('')
  }

  const switchMode = (m) => { setMode(m); reset() }
  const handleClose = () => { reset(); onClose() }

  // ── SIGN-IN: Direct login — no OTP ─────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Invalid email or password.')
      onLogin(json.data)
      reset()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── SIGN-UP STEP 1: Send OTP ────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) { setError('Please enter your full name.'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'signup',
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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── SIGN-UP STEP 2: Verify OTP ─────────────────────────────────────────────
  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) { setError('Please enter the 6-digit code.'); return }
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
      onLogin(json.user)
      reset()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setOtp(''); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'signup',
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
          college: college.trim(),
          branch,
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error || 'Failed to resend OTP.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm bg-white text-gray-900 placeholder-gray-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* Close */}
        <button onClick={handleClose} className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors p-1">
          <FiX className="w-5 h-5" />
        </button>

        {/* Header Banner */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-primary-600 px-6 pt-7 pb-8 text-center flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            {mode === 'signin'
              ? <FiLogIn className="w-5 h-5 text-white" />
              : <FiUser className="w-5 h-5 text-white" />
            }
          </div>
          <h2 className="text-xl font-bold text-white">
            {step === 'otp' ? 'Check your inbox' : mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {step === 'otp'
              ? `6-digit code sent to ${email}`
              : mode === 'signin'
              ? 'Sign in to continue to Harvegen'
              : 'Join the embedded systems community'
            }
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">

          {/* ═══════════════════════════════════════════
              SIGN-IN FORM (direct login — no OTP)
              ═══════════════════════════════════════════ */}
          {mode === 'signin' && step === 'form' && (
            <form onSubmit={handleSignIn} className="px-6 py-6 space-y-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required autoFocus
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Your password" required minLength={6}
                    className={`${inputCls} pl-9 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm"
              >
                {loading
                  ? <FiLoader className="w-4 h-4 animate-spin" />
                  : <><FiLogIn className="w-4 h-4" /> Sign In</>
                }
              </button>

              {/* Switch to Signup */}
              <p className="text-center text-sm text-gray-500 pb-2">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => switchMode('signup')}
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  Sign up here
                </button>
              </p>
            </form>
          )}

          {/* ═══════════════════════════════════════════
              SIGN-UP FORM (OTP flow)
              ═══════════════════════════════════════════ */}
          {mode === 'signup' && step === 'form' && (
            <form onSubmit={handleSendOtp} className="px-6 py-5 space-y-3.5">

              {/* Back to Sign In */}
              <button type="button" onClick={() => switchMode('signin')}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-1">
                <FiArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Full Name *</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name" required autoFocus
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address *</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                  Password * <span className="normal-case font-normal text-gray-400">(min 6 characters)</span>
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create a password" required minLength={6}
                    className={`${inputCls} pl-9 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">College / Organization</label>
                <input
                  type="text" value={college} onChange={e => setCollege(e.target.value)}
                  placeholder="e.g. IIT Hyderabad, BITS Pilani"
                  className={inputCls}
                />
              </div>

              {/* Branch */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Branch / Field of Interest</label>
                <select value={branch} onChange={e => setBranch(e.target.value)}
                  className={`${inputCls} text-gray-700`}>
                  {BRANCH_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || !password || !name.trim()}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm mt-1"
              >
                {loading
                  ? <FiLoader className="w-4 h-4 animate-spin" />
                  : <><FiShield className="w-4 h-4" /> Send Verification OTP</>
                }
              </button>

              <p className="text-center text-xs text-gray-400 pb-1">
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('signin')}
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* ═══════════════════════════════════════════
              OTP VERIFICATION (signup only)
              ═══════════════════════════════════════════ */}
          {step === 'otp' && (
            <div className="px-6 py-5 space-y-4">
              <button
                onClick={() => { setStep('form'); setError('') }}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 text-center">
                <FiMail className="w-7 h-7 text-primary-600 mx-auto mb-2" />
                <p className="text-gray-700 text-sm">
                  We sent a 6-digit code to <span className="font-semibold text-gray-900">{email}</span>
                </p>
                <p className="text-gray-400 text-xs mt-1">Expires in 5 minutes · Check your spam folder</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Verification Code</label>
                  <input
                    type="text" inputMode="numeric"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="· · · · · ·"
                    maxLength={6} autoFocus
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-center text-2xl font-mono tracking-widest text-gray-900"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={otp.length !== 6 || loading}
                  className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm"
                >
                  {loading
                    ? <FiLoader className="w-4 h-4 animate-spin" />
                    : <><FiCheckCircle className="w-4 h-4" /> Verify & Create Account</>
                  }
                </button>

                <div className="text-center pb-2">
                  <button
                    type="button" onClick={handleResend} disabled={loading}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    Didn&apos;t receive it? Resend OTP
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
