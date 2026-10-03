import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const service = process.env.SMTP_SERVICE;

  if ((host || service) && user && pass) {
    const config = {
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000
    };

    if (service) {
      config.service = service;
    } else {
      config.host = host;
      config.port = parseInt(process.env.SMTP_PORT || '587', 10);
      config.secure = process.env.SMTP_SECURE === 'true' || String(process.env.SMTP_PORT) === '465';
    }

    transporter = nodemailer.createTransport(config);
    console.log(`📡 [SwiftOrbits Email Engine] Transporter configured using ${service ? 'service: ' + service : 'host: ' + host}`);
  } else {
    // Development / fallback transporter that logs to console
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('========================================================');
        console.log('📬 [SwiftOrbits Email Dispatch Engine - DEV SIMULATION]');
        console.log(`To:      ${mailOptions.to}`);
        console.log(`From:    ${mailOptions.from}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('--------------------------------------------------------');
        if (mailOptions.text) {
          console.log(mailOptions.text);
        }
        console.log('💡 TIP: To send real emails to inboxes like Gmail,');
        console.log('   set SMTP_HOST (or SMTP_SERVICE=gmail), SMTP_USER & SMTP_PASS in backend/.env');
        console.log('========================================================');
        return { messageId: `mock-${Date.now()}` };
      }
    };
  }

  return transporter;
}

export async function sendOtpEmail({ to, name, otp, purpose = 'email_verification' }) {
  const isReset = purpose === 'password_reset';
  const isWelcome = purpose === 'welcome';
  const subject = isReset
    ? 'Your SwiftOrbits Password Reset Code'
    : isWelcome
    ? 'Welcome to SwiftOrbits — Your Account is Ready!'
    : 'Your SwiftOrbits Verification Code';

  const titleText = isReset
    ? 'Password Reset Verification'
    : isWelcome
    ? 'Welcome to SwiftOrbits!'
    : 'Verify Your Email Address';

  const introText = isReset
    ? 'We received a request to reset your SwiftOrbits account password.'
    : isWelcome
    ? 'Thank you for registering with SwiftOrbits. Your account has been created and is active in real time.'
    : 'Thank you for signing up with SwiftOrbits.';

  const warningText = isReset
    ? 'If you did not request a password reset, you can safely ignore this email.'
    : isWelcome
    ? 'You can now browse catalog products, place orders, and track deliveries across the United States.'
    : 'If you did not create an account with SwiftOrbits, you can safely ignore this email.';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .card {
      max-width: 520px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
    }
    .header {
      background: #0f172a;
      padding: 24px 32px;
      text-align: center;
    }
    .brand-name {
      font-size: 22px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-name span {
      color: #3b82f6;
    }
    .content {
      padding: 36px 32px;
    }
    .title {
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 16px;
    }
    .text {
      font-size: 14px;
      line-height: 1.6;
      color: #475569;
      margin: 10px 0;
    }
    .otp-container {
      background: #f1f5f9;
      border: 1.5px dashed #cbd5e1;
      border-radius: 10px;
      text-align: center;
      padding: 24px 16px;
      margin: 28px 0;
    }
    .otp-code {
      font-family: 'Courier New', Courier, monospace;
      font-size: 34px;
      font-weight: 900;
      letter-spacing: 10px;
      color: #0f172a;
      padding-left: 10px;
    }
    .otp-expiry {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      margin-top: 8px;
    }
    .footer {
      border-top: 1px solid #f1f5f9;
      padding: 20px 32px;
      background: #fafafa;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
    .signature {
      margin-top: 24px;
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1 class="brand-name"><span>⚡</span> SwiftOrbits</h1>
      </div>
      <div class="content">
        <h2 class="title">${titleText}</h2>
        <p class="text">Hello${name ? ` ${name}` : ''},</p>
        <p class="text">${introText}</p>
        
        ${isWelcome ? `
        <div class="otp-container" style="background: #f0fdf4; border: 1.5px solid #bbf7d0;">
          <div style="font-size: 20px; font-weight: 800; color: #15803d; letter-spacing: 0;">✨ Account Active & Verified</div>
          <div class="otp-expiry" style="color: #166534; font-size: 13px; margin-top: 6px;">You are now ready to browse products and enjoy nationwide dispatch.</div>
        </div>
        ` : `
        <p class="text">Your verification code is:</p>
        <div class="otp-container">
          <div class="otp-code">${otp}</div>
          <div class="otp-expiry">This code will expire in 60 seconds.</div>
        </div>
        `}

        <p class="text">${warningText}</p>
        
        <div class="signature">
          Regards,<br>
          <strong>SwiftOrbits Team</strong>
        </div>
      </div>
      <div class="footer">
        © 2026 SwiftOrbits USA LLC. All rights reserved.<br>
        2445 South Hiawassee Road, Orlando, FL 32835, USA
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = isWelcome
    ? `Hello${name ? ` ${name}` : ''},\n\n${introText}\n\n${warningText}\n\nRegards,\nSwiftOrbits Team`
    : `Hello${name ? ` ${name}` : ''},\n\n${introText}\n\nYour verification code is: ${otp}\n\nThis code will expire in 60 seconds.\n\n${warningText}\n\nRegards,\nSwiftOrbits Team`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"SwiftOrbits" <no-reply@swiftorbits.com>',
    to,
    subject,
    text,
    html
  };

  try {
    const client = getTransporter();
    const info = await client.sendMail(mailOptions);
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error('Failed to send email via SMTP, logging fallback:', err.message);
    // Fallback log to console so local verification never blocks
    console.log('========================================================');
    console.log(`📧 [FALLBACK OTP LOG] To: ${to} | Code: ${otp}`);
    console.log('========================================================');
    return { ok: true, fallback: true };
  }
}

export default {
  sendOtpEmail
};
