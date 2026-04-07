import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWelcomeEmail(to, firstName) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Welcome to MusaFX – Your Investment Journey Begins',
    html: `
      <div style="background:#0f0f0f;color:#fff;font-family:sans-serif;padding:40px;max-width:600px;margin:auto;border-radius:12px;">
        <h1 style="color:#3b82f6;font-size:28px;margin-bottom:8px;">Welcome to MusaFX</h1>
        <p style="color:#aaa;font-size:14px;margin-bottom:24px;">Your gateway to professional FX investment</p>
        <p>Hi <strong>${firstName}</strong>,</p>
        <p>Your account has been successfully created. You can now log in and start your investment journey.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://musafx.com'}/auth/login"
           style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:20px 0;">
          Log In Now
        </a>
        <p style="color:#888;font-size:12px;margin-top:32px;">© ${new Date().getFullYear()} MusaFX. All rights reserved.</p>
      </div>
    `,
  })
}

export async function sendPasswordResetEmail(to, firstName, resetUrl) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'Reset your MusaFX password',
    html: `
      <div style="background:#0f0f0f;color:#fff;font-family:sans-serif;padding:40px;max-width:600px;margin:auto;border-radius:12px;">
        <h1 style="color:#3b82f6;font-size:24px;margin-bottom:8px;">Password reset</h1>
        <p style="color:#aaa;font-size:14px;margin-bottom:24px;">MusaFX account security</p>
        <p>Hi <strong>${firstName || 'there'}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:20px 0;">
          Reset password
        </a>
        <p style="color:#888;font-size:13px;line-height:1.6;">If you didn’t ask for this, you can ignore this email. Your password will stay the same.</p>
        <p style="color:#555;font-size:12px;word-break:break-all;margin-top:16px;">${resetUrl}</p>
        <p style="color:#888;font-size:12px;margin-top:32px;">© ${new Date().getFullYear()} MusaFX. All rights reserved.</p>
      </div>
    `,
  })
}

export async function sendSupportEmail({ name, email, message }) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_USER,
    subject: `MusaFX Support Request from ${name}`,
    html: `
      <div style="background:#0f0f0f;color:#fff;font-family:sans-serif;padding:40px;max-width:600px;margin:auto;border-radius:12px;">
        <h2 style="color:#3b82f6;">New Support Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #3b82f6;padding-left:16px;color:#ccc;">${message}</blockquote>
      </div>
    `,
  })
}

export async function sendFundedEmail(to, firstName, localAmount, localSymbol, planName) {
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'MusaFX – Investment Successfully Initiated',
    html: `
      <div style="background:#0f0f0f;color:#fff;font-family:sans-serif;padding:40px;max-width:600px;margin:auto;border-radius:12px;">
        <h1 style="color:#00c896;font-size:24px;margin-bottom:8px;">Investment Funded</h1>
        <p style="color:#aaa;font-size:14px;margin-bottom:24px;">Your administrator has confirmed your deposit</p>
        <p>Hi <strong>${firstName}</strong>,</p>
        <p>Great news! An amount of <strong>${localSymbol}${localAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong> has been successfully credited to your investment account.</p>
        <p>Your <strong>${planName}</strong> has been actively initiated. You can securely track your daily returns directly from your user dashboard.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://musafx.com'}/dashboard"
           style="display:inline-block;background:linear-gradient(135deg,#00c896,#059669);color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;margin:20px 0;">
          View Your Dashboard
        </a>
        <p style="color:#888;font-size:12px;margin-top:32px;">© ${new Date().getFullYear()} MusaFX. All rights reserved.</p>
      </div>
    `,
  })
}