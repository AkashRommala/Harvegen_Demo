// Dynamic require to avoid ESM issues
let nodemailer = null
try {
  nodemailer = require('nodemailer')
} catch (e) {
  console.error('Failed to load nodemailer:', e.message)
}

// Create transporter only if nodemailer loaded
let transporter = null
if (nodemailer && nodemailer.createTransport) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
}

export async function sendEmail(to, subject, html) {
  // Create transporter on-demand to ensure env vars are loaded
  let mailTransporter = null
  try {
    const nm = require('nodemailer')
    // Handle both ESM default export and CommonJS
    const createFn = nm.createTransport || nm.default?.createTransport
    if (!createFn) {
      throw new Error('createTransport not found in nodemailer')
    }
    mailTransporter = createFn({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  } catch (e) {
    throw new Error('Failed to create email transporter: ' + e.message)
  }
  
  if (!mailTransporter) {
    throw new Error('Email transporter not initialized')
  }
  
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html
    }

    const result = await mailTransporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export async function sendWelcomeEmail(userEmail, userName) {
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 24px; font-weight: bold;">H</span>
        </div>
        <h1 style="color: #1e293b; margin: 0; font-size: 28px;">Welcome to Harvegen, ${userName}!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; margin-top: 0; margin-bottom: 20px; font-size: 20px;">Your OTP Code</h2>
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e293b; font-family: monospace; background: white; padding: 15px; border-radius: 6px; display: inline-block; border: 2px solid #e2e8f0;">
            ${otpCode}
          </div>
          <p style="color: #64748b; margin-top: 10px; font-size: 14px;">Enter this 6-digit code in the app to complete your login</p>
        </div>
        
        <p style="color: #334155; line-height: 1.6; margin-bottom: 20px;">
          Thank you for joining our community. We're excited to have you on board.
        </p>
        
        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
          <h3 style="margin: 0 0 10px 0; color: #1e3a8a; font-size: 16px;">Next Steps:</h3>
          <ul style="color: #334155; margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>Enter the OTP code above in the Harvegen app</li>
            <li>Explore our tutorials and resources</li>
            <li>Check out our projects and microcontrollers section</li>
            <li>Update your profile and preferences</li>
          </ul>
        </div>
      </div>

      <div style="text-align: center; color: #64748b; font-size: 14px;">
        <p style="margin: 0;">If you didn't request this login, please ignore this email.</p>
        <p style="margin: 10px 0 0 0;">Best regards,<br><strong>The Harvegen Team</strong></p>
      </div>
      
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px;">
        <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
      </div>
    </div>
  `

  // Store OTP in sessionStorage only on client-side
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem('temp_otp', otpCode)
      sessionStorage.setItem('temp_email', userEmail)
      sessionStorage.setItem('temp_name', userName)
    } catch (e) {
      // Ignore sessionStorage errors (e.g., in incognito mode)
      console.warn('Could not store OTP in sessionStorage:', e.message)
    }
  }

  return sendEmail(userEmail, 'Your Harvegen OTP Code', html)
}

export async function sendContactEmail(formData) {
  const { name, email, subject: formSubject, message } = formData
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Contact Form Submission</h2>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Subject:</strong> ${formSubject || 'No subject'}</p>
        <p><strong>Message:</strong></p>
        <p style="background: white; padding: 15px; border-radius: 4px;">${message || 'No message'}</p>
      </div>
    </div>
  `

  // Send to admin
  await sendEmail(process.env.ADMIN_EMAIL || 'admin@example.com', `New Contact: ${formSubject || 'No subject'}`, html)
  
  // Send confirmation to user
  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Thank you for contacting us!</h2>
      <p>Hi ${name || 'there'},</p>
      <p>We've received your message and will get back to you soon.</p>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Subject:</strong> ${formSubject || 'No subject'}</p>
        <p><strong>Message:</strong></p>
        <p style="background: white; padding: 15px; border-radius: 4px;">${message || 'No message'}</p>
      </div>
      <p>Best regards,<br>The Harvegen Team</p>
    </div>
  `

  return sendEmail(email, 'We received your message!', userHtml)
}