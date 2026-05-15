import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import OtpModel from '@/models/Otp'

let nodemailerModule = null
try {
  const nm = require('nodemailer')
  nodemailerModule = nm.createTransport ? nm : (nm.default ? nm.default : nm)
} catch (e) {
  console.error('nodemailer load error:', e.message)
}

function createTransporter() {
  const fn = nodemailerModule?.createTransport || nodemailerModule?.default?.createTransport
  if (!fn) return null
  return fn({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  })
}

/**
 * POST /api/send-otp
 *
 * Sign-in body:  { mode: 'signin', email, password }
 * Sign-up body:  { mode: 'signup', email, password, name, college, branch }
 *
 * What this does:
 *  1. Validate the request body.
 *  2. For SIGN-IN  → check email exists + password matches, then send OTP.
 *  3. For SIGN-UP  → check email is NOT taken, hash password, store all profile
 *                    data in the OTP document (so verify-otp can create the user).
 *  4. Save OTP to MongoDB (TTL: 5 min) — replaces file-based otpstore.js.
 *  5. Send OTP email.
 */
export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()
    const { mode, email, password, name, college, branch } = body

    // ── Basic validation ────────────────────────────────────────────────────
    if (!['signin', 'signup'].includes(mode)) {
      return NextResponse.json({ error: 'Invalid mode. Use "signin" or "signup".' }, { status: 400 })
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // ── SIGN-IN: verify existing user + password ────────────────────────────
    if (mode === 'signin') {
      const user = await User.findOne({ email: normalizedEmail }).select('+password')
      if (!user) {
        return NextResponse.json(
          { error: 'No account found with this email. Please sign up first.' },
          { status: 404 }
        )
      }
      if (!user.password) {
        return NextResponse.json(
          { error: 'This account was created with OTP only. Please reset your password.' },
          { status: 400 }
        )
      }
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Incorrect password. Please try again.' }, { status: 401 })
      }
    }

    // ── SIGN-UP: create unverified user immediately ──────────────────────────
    if (mode === 'signup') {
      if (!name || !name.trim()) {
        return NextResponse.json({ error: 'Name is required for sign-up.' }, { status: 400 })
      }
      const existing = await User.findOne({ email: normalizedEmail })
      if (existing) {
        if (existing.isVerified) {
          return NextResponse.json(
            { error: 'This email is already registered. Please sign in instead.' },
            { status: 409 }
          )
        } else {
          // If they exist but aren't verified, we can just update their info or send a new OTP.
          // Let's update their info in case they changed their name/password before verifying.
          existing.name = name.trim()
          existing.password = password // pre('save') will hash it because it's modified
          existing.college = college?.trim() || ''
          existing.branch = branch?.trim() || ''
          await existing.save()
        }
      } else {
        // Create the new unverified user. The pre('save') hook will hash the password.
        const newUser = new User({
          email: normalizedEmail,
          password: password,
          name: name.trim(),
          college: college?.trim() || '',
          branch: branch?.trim() || '',
          isVerified: false,
        })
        await newUser.save()
      }
    }

    // ── Generate OTP ────────────────────────────────────────────────────────
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()

    // ── Store OTP in MongoDB (upsert: replace any existing OTP for this email)
    await OtpModel.findOneAndDelete({ email: normalizedEmail }) // clear old OTP first
    await OtpModel.create({
      email: normalizedEmail,
      otp: otpCode,
      mode,
    })

    console.log(`[OTP] Stored in MongoDB for ${normalizedEmail} (mode: ${mode})`)

    // ── Send email ──────────────────────────────────────────────────────────
    const displayName = mode === 'signin'
      ? (await User.findOne({ email: normalizedEmail }))?.name || email.split('@')[0]
      : name?.trim() || email.split('@')[0]

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f8fafc;padding:40px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:28px;">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,#1e3a8a,#3b82f6);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
            <span style="color:white;font-size:28px;font-weight:bold;">H</span>
          </div>
          <h1 style="color:#1e293b;margin:0;font-size:24px;">
            ${mode === 'signup' ? `Welcome to Harvegen, ${displayName}!` : `Sign in to Harvegen, ${displayName}`}
          </h1>
          <p style="color:#64748b;margin-top:8px;font-size:14px;">
            ${mode === 'signup' ? 'Verify your email to complete registration' : 'Use this code to sign in securely'}
          </p>
        </div>

        <div style="background:white;padding:28px;border-radius:10px;border:1px solid #e2e8f0;text-align:center;">
          <p style="color:#64748b;font-size:14px;margin-bottom:16px;">Your one-time verification code</p>
          <div style="font-size:38px;font-weight:bold;letter-spacing:14px;color:#1e3a8a;font-family:monospace;background:#f1f5f9;padding:18px 24px;border-radius:8px;display:inline-block;border:2px solid #e2e8f0;">
            ${otpCode}
          </div>
          <p style="color:#94a3b8;margin-top:14px;font-size:13px;">This code expires in <strong>5 minutes</strong>.</p>
        </div>

        <div style="text-align:center;margin-top:24px;color:#94a3b8;font-size:12px;">
          <p>If you didn't request this, please ignore this email.</p>
          <p style="margin-top:6px;">— The Harvegen Team</p>
        </div>
      </div>
    `

    const transporter = createTransporter()
    if (!transporter) {
      return NextResponse.json(
        { error: 'Email service unavailable. Check SMTP configuration.' },
        { status: 503 }
      )
    }

    await transporter.sendMail({
      from: `"Harvegen" <${process.env.SMTP_USER}>`,
      to: normalizedEmail,
      subject: mode === 'signup' ? 'Verify your Harvegen account' : 'Your Harvegen sign-in code',
      html,
    })

    return NextResponse.json({ success: true, message: 'OTP sent successfully.' })
  } catch (error) {
    console.error('[send-otp] Error:', error.message)
    return NextResponse.json(
      { error: error.message || 'Failed to send OTP. Please try again.' },
      { status: 500 }
    )
  }
}
