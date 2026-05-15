'use client'

import { useState } from 'react'
import {
  FiMail, FiX, FiShield, FiCheckCircle, FiUser,
  FiArrowLeft, FiLoader, FiLock, FiEye, FiEyeOff
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
 * LoginModal — two-mode OTP auth flow:
 *
 * SIGN-IN:  email + password → send OTP → verify OTP
 * SIGN-UP:  email + password + name + college + branch → send OTP → verify OTP → account created
 */
export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('signin')         // 'signin' | 'signup'
  const [step, setStep] = useState('form')           // 'form' | 'otp'

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

  // ── STEP 1: Validate form + Send OTP ─────────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.')
      return
    }

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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── STEP 2: Verify OTP ────────────────────────────────────────────────────
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
          mode, email: email.trim().toLowerCase(), password,
          name: name.trim(), college: college.trim(), branch,
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

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-sm bg-white'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-primary-600 px-6 pt-7 pb-8 text-center flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Welcome to Harvegen</h2>
          <p className="text-white/70 text-sm mt-1">
            {step === 'form' ? 'Sign in or create a free account' : `OTP sent to ${email}`}
          </p>
        </div>

        {/* Close */}
        <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-1">
          <FiX className="w-5 h-5" />
        </button>

        {/* Tab switcher (form step only) */}
        {step === 'form' && (
          <div className="flex border-b border-gray-100 flex-shrink-0">
            {['signin', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-3 text-sm font-semibold transition-all ${
                  mode === m
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>
        )}

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">

          {/* ── FORM STEP ──────────────────────────────────────────────────── */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="px-6 py-5 space-y-3.5">

              {/* Name (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className={`${inputCls} pl-9`}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoFocus={mode === 'signin'}
                    className={`${inputCls} pl-9`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Password * {mode === 'signup' && <span className="font-normal text-gray-400">(min 6 characters)</span>}
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder={mode === 'signin' ? 'Your password' : 'Create a password'}
                    required
                    minLength={6}
                    className={`${inputCls} pl-9 pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* College (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">College / Organization</label>
                  <input
                    type="text"
                    value={college}
                    onChange={e => setCollege(e.target.value)}
                    placeholder="e.g. IIT Hyderabad, BITS Pilani"
                    className={inputCls}
                  />
                </div>
              )}

              {/* Branch (signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Branch / Field of Interest</label>
                  <select
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className={`${inputCls} text-gray-700`}
                  >
                    {BRANCH_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2.5 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all text-sm mt-1"
              >
                {loading
                  ? <FiLoader className="w-4 h-4 animate-spin" />
                  : <><FiShield className="w-4 h-4" /> {mode === 'signin' ? 'Send OTP to Sign In' : 'Send OTP to Sign Up'}</>
                }
              </button>

              <p className="text-center text-xs text-gray-400 pb-1">
                By continuing, you agree to our Terms of Service.
              </p>
            </form>
          )}

          {/* ── OTP STEP ───────────────────────────────────────────────────── */}
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
                <p className="text-gray-400 text-xs mt-1">Expires in 5 minutes</p>
              </div>

              <form onSubmit={handleOtpSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Verification Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="· · · · · ·"
                    maxLength={6}
                    autoFocus
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all text-center text-2xl font-mono tracking-widest"
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
                    : <><FiCheckCircle className="w-4 h-4" /> Verify & {mode === 'signup' ? 'Create Account' : 'Sign In'}</>
                  }
                </button>

                <div className="text-center pb-2">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50 transition-colors"
                  >
                    Didn't receive it? Resend OTP
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
