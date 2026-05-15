import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import OtpModel from '@/models/Otp'

/**
 * POST /api/verify-otp
 * Body: { email, otp }
 *
 * Flow:
 *  1. Find the OTP document in MongoDB for this email.
 *  2. If not found → expired or never sent.
 *  3. Compare OTP code.
 *  4. If mode === 'signup' → create User from data stored in OTP document.
 *  5. If mode === 'signin' → find existing User.
 *  6. Delete OTP document (one-time use).
 *  7. Return sanitized user object.
 */
export async function POST(request) {
  try {
    await connectDB()

    const { email, otp } = await request.json()

    // ── Validate input ──────────────────────────────────────────────────────
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 })
    }
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json({ error: 'OTP must be a 6-digit number.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // ── Look up OTP in MongoDB ──────────────────────────────────────────────
    const otpDoc = await OtpModel.findOne({ email: normalizedEmail })
    if (!otpDoc) {
      return NextResponse.json(
        { error: 'OTP expired or not found. Please request a new one.' },
        { status: 400 }
      )
    }

    // ── Verify code ─────────────────────────────────────────────────────────
    if (otp !== otpDoc.otp) {
      return NextResponse.json({ error: 'Incorrect OTP. Please try again.' }, { status: 400 })
    }

    // ── OTP is valid — delete it immediately (one-time use) ─────────────────
    await OtpModel.deleteOne({ _id: otpDoc._id })
    console.log(`[OTP] Verified and deleted for ${normalizedEmail}`)

    // ── Find existing user and verify ───────────────────────────────────────
    let user = await User.findOne({ email: normalizedEmail })
    
    if (!user) {
      // This should never happen if send-otp did its job correctly
      return NextResponse.json(
        { error: 'Account not found. Please try signing up again.' },
        { status: 404 }
      )
    }

    // Update isVerified flag
    if (!user.isVerified) {
      user.isVerified = true
      await user.save()
    }

    // ── Generate JWT and Set Cookie ─────────────────────────────────────────
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.college || '',
      branch: user.branch || '',
      avatar:
        user.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
      bio: user.bio || '',
    }

    const { SignJWT } = await import('jose')
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_development_only')
    const alg = 'HS256'
    const token = await new SignJWT({ id: userData.id, role: userData.role })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({
      success: true,
      message: otpDoc.mode === 'signup' ? 'Account created successfully!' : 'Signed in successfully!',
      user: userData,
    })

    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('[verify-otp] Error:', error)
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This email is already registered. Please sign in.' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    )
  }
}
