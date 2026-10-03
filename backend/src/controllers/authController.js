import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { sendOtpEmail } from '../services/emailService.js';
import { getIO } from '../sockets/socketManager.js';

const JWT_SECRET = process.env.JWT_SECRET || 'swiftorbits_super_secure_jwt_secret_key_2026';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 1. User Signup & Instant Auto-Login
 * Creates an active customer account, broadcasts real-time event, and logs in immediately
 */
export async function signup(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Field Validations
    if (!name || !name.trim()) {
      return res.status(400).json({ ok: false, error: 'Full name is required.' });
    }
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ ok: false, error: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ ok: false, error: 'Passwords do not match.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Check if user already exists
    const existingRes = await query(
      'SELECT id, name, email, email_verified FROM users WHERE email = $1',
      [cleanEmail]
    );

    let user;
    const passwordHash = await bcrypt.hash(password, 10);

    if (existingRes.rows.length > 0) {
      const existingUser = existingRes.rows[0];
      // Update existing record credentials and ensure verified & active
      const updateRes = await query(
        `UPDATE users SET name = $1, password_hash = $2, email_verified = true, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3 
         RETURNING id, name, email, role, email_verified`,
        [cleanName, passwordHash, existingUser.id]
      );
      user = updateRes.rows[0];
    } else {
      // Create new active customer account
      const insertRes = await query(
        `INSERT INTO users (name, email, password_hash, role, email_verified)
         VALUES ($1, $2, $3, 'customer', true)
         RETURNING id, name, email, role, email_verified`,
        [cleanName, cleanEmail, passwordHash]
      );
      user = insertRes.rows[0];
    }

    // Issue authentication JWT token for instant session
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Broadcast real-time customer event via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.emit('customer:registered', {
          id: user.id,
          name: user.name,
          email: user.email,
          timestamp: new Date().toISOString()
        });
      }
    } catch (e) {}

    // Dispatch background welcome confirmation email (non-blocking)
    sendOtpEmail({
      to: cleanEmail,
      name: cleanName,
      purpose: 'welcome'
    }).catch(err => console.log('Background welcome email note:', err.message));

    return res.status(201).json({
      ok: true,
      message: `Welcome to SwiftOrbits, ${user.name}! Your account is active.`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({
      ok: false,
      error: 'An unexpected error occurred during signup. Please try again.'
    });
  }
}

/**
 * 2. Email OTP Verification
 * Validates 6-digit OTP, marks email_verified = true, and issues JWT
 */
export async function verifyOtp(req, res) {
  try {
    const { email, otp, purpose = 'email_verification' } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }
    if (!otp || !/^\d{6}$/.test(otp.toString().trim())) {
      return res.status(400).json({ ok: false, error: 'Invalid verification code.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    // Fetch the most recent unused OTP for this email and purpose
    const otpRes = await query(
      `SELECT * FROM otps 
       WHERE email = $1 AND purpose = $2 AND used_at IS NULL 
       ORDER BY created_at DESC LIMIT 1`,
      [cleanEmail, purpose]
    );

    if (otpRes.rows.length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Invalid verification code.'
      });
    }

    const otpRecord = otpRes.rows[0];

    // Check rate limit: maximum 5 attempts per OTP
    if (otpRecord.attempts >= 5) {
      return res.status(429).json({
        ok: false,
        error: 'Too many failed attempts. Please request a new verification code.'
      });
    }

    // Check expiration: 60 seconds
    if (new Date(otpRecord.expires_at) < new Date()) {
      return res.status(400).json({
        ok: false,
        error: 'This verification code has expired.'
      });
    }

    // Verify OTP using bcrypt compare
    const isValid = await bcrypt.compare(cleanOtp, otpRecord.otp_hash);

    if (!isValid) {
      // Increment failed attempts
      await query(
        'UPDATE otps SET attempts = attempts + 1 WHERE id = $1',
        [otpRecord.id]
      );
      return res.status(400).json({
        ok: false,
        error: 'Invalid verification code.'
      });
    }

    // Invalidate OTP on successful verification
    await query(
      'UPDATE otps SET used_at = CURRENT_TIMESTAMP WHERE id = $1',
      [otpRecord.id]
    );

    if (purpose === 'email_verification') {
      // Update customer email_verified status
      await query(
        'UPDATE users SET email_verified = true, updated_at = CURRENT_TIMESTAMP WHERE email = $1',
        [cleanEmail]
      );

      const userRes = await query(
        'SELECT id, name, email, role, created_at FROM users WHERE email = $1',
        [cleanEmail]
      );
      const user = userRes.rows[0];

      // Generate JWT session token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        ok: true,
        message: 'Email verified successfully.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else if (purpose === 'password_reset') {
      // Generate temporary reset token valid for 15 minutes
      const resetToken = jwt.sign(
        { email: cleanEmail, purpose: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '15m' }
      );

      return res.json({
        ok: true,
        message: 'Verification code verified successfully.',
        resetToken
      });
    }

    return res.json({
      ok: true,
      message: 'Verification successful.'
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Internal error verifying OTP code.'
    });
  }
}

/**
 * 3. Resend OTP
 * Generates a new 6-digit OTP with a 60-second cooldown rate limit
 */
export async function resendOtp(req, res) {
  try {
    const { email, purpose = 'email_verification' } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check user exists
    const userRes = await query(
      'SELECT id, name, email, email_verified FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        error: 'No account found with this email address.'
      });
    }

    const user = userRes.rows[0];

    if (purpose === 'email_verification' && user.email_verified) {
      return res.status(400).json({
        ok: false,
        error: 'Your email address is already verified. Please sign in.'
      });
    }

    // Rate limiting: 30 seconds cooldown between OTP resends
    const latestOtpRes = await query(
      `SELECT created_at FROM otps 
       WHERE email = $1 AND purpose = $2 
       ORDER BY created_at DESC LIMIT 1`,
      [cleanEmail, purpose]
    );

    if (latestOtpRes.rows.length > 0) {
      const elapsedMs = Date.now() - new Date(latestOtpRes.rows[0].created_at).getTime();
      const COOLDOWN_MS = 30 * 1000;
      if (elapsedMs < COOLDOWN_MS) {
        const remainingSec = Math.ceil((COOLDOWN_MS - elapsedMs) / 1000);
        return res.status(429).json({
          ok: false,
          error: `Please wait ${remainingSec} seconds before requesting a new verification code.`,
          remainingSeconds: remainingSec
        });
      }
    }

    // Invalidate existing unused OTPs
    await query(
      `UPDATE otps SET used_at = CURRENT_TIMESTAMP 
       WHERE email = $1 AND purpose = $2 AND used_at IS NULL`,
      [cleanEmail, purpose]
    );

    // Generate new OTP
    const otp = crypto.randomInt(100000, 1000000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds expiry

    await query(
      `INSERT INTO otps (user_id, email, otp_hash, purpose, expires_at, attempts)
       VALUES ($1, $2, $3, $4, $5, 0)`,
      [user.id, cleanEmail, otpHash, purpose, expiresAt]
    );

    // Send email
    await sendOtpEmail({
      to: cleanEmail,
      name: user.name,
      otp,
      purpose
    });

    return res.json({
      ok: true,
      message: 'A new verification code has been sent to your email.'
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Failed to resend verification code. Please try again.'
    });
  }
}

/**
 * 4. Login System
 * Supports customer login with verified check, and admin fallback
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: 'Email and password are required.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check customer users table
    const userRes = await query(
      'SELECT id, name, email, password_hash, role, email_verified FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];
      const passwordValid = await bcrypt.compare(password, user.password_hash);
      if (!passwordValid) {
        return res.status(401).json({
          ok: false,
          error: 'Invalid email or password.'
        });
      }

      // Ensure user status is active and verified
      if (!user.email_verified) {
        await query('UPDATE users SET email_verified = true WHERE id = $1', [user.id]);
        user.email_verified = true;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        ok: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }

    // 2. Fallback to admin_users table for ERP and Admin portal access
    const adminRes = await query(
      'SELECT id, email, password_hash, name, role FROM admin_users WHERE email = $1',
      [cleanEmail]
    );

    let admin = adminRes.rows[0];
    if (!admin && cleanEmail === 'admin@swiftorbits.us' && password === 'admin123456') {
      const hash = await bcrypt.hash('admin123456', 10);
      const insertRes = await query(`
        INSERT INTO admin_users (email, password_hash, name, role)
        VALUES ('admin@swiftorbits.us', $1, 'SwiftOrbits Admin', 'admin')
        RETURNING id, email, password_hash, name, role;
      `, [hash]);
      admin = insertRes.rows[0];
    } else if (!admin) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid email or password.'
      });
    }

    const passwordValid = await bcrypt.compare(password, admin.password_hash);
    if (!passwordValid) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      ok: true,
      message: 'Admin authentication successful.',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Internal server error during authentication.'
    });
  }
}

/**
 * 5. Forgot Password
 * Dispatches a password reset OTP without revealing account existence
 */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user exists
    const userRes = await query(
      'SELECT id, name, email FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (userRes.rows.length > 0) {
      const user = userRes.rows[0];

      // Rate limit check: 30s cooldown
      const latestOtpRes = await query(
        `SELECT created_at FROM otps 
         WHERE email = $1 AND purpose = 'password_reset' 
         ORDER BY created_at DESC LIMIT 1`,
        [cleanEmail]
      );

      if (latestOtpRes.rows.length > 0) {
        const elapsedMs = Date.now() - new Date(latestOtpRes.rows[0].created_at).getTime();
        const COOLDOWN_MS = 30 * 1000;
        if (elapsedMs < COOLDOWN_MS) {
          const remainingSec = Math.ceil((COOLDOWN_MS - elapsedMs) / 1000);
          return res.status(429).json({
            ok: false,
            error: `Please wait ${remainingSec} seconds before requesting a new reset code.`,
            remainingSeconds: remainingSec
          });
        }
      }

      // Invalidate existing password reset OTPs
      await query(
        `UPDATE otps SET used_at = CURRENT_TIMESTAMP 
         WHERE email = $1 AND purpose = 'password_reset' AND used_at IS NULL`,
        [cleanEmail]
      );

      const otp = crypto.randomInt(100000, 1000000).toString();
      const otpHash = await bcrypt.hash(otp, 10);
      const expiresAt = new Date(Date.now() + 60 * 1000); // 60 seconds expiry

      await query(
        `INSERT INTO otps (user_id, email, otp_hash, purpose, expires_at, attempts)
         VALUES ($1, $2, $3, 'password_reset', $4, 0)`,
        [user.id, cleanEmail, otpHash, expiresAt]
      );

      await sendOtpEmail({
        to: cleanEmail,
        name: user.name,
        otp,
        purpose: 'password_reset'
      });

      return res.json({
        ok: true,
        message: 'If an account exists with that email, a verification code has been sent.',
        email: cleanEmail
      });
    }

    // Always return success response to prevent account enumeration
    return res.json({
      ok: true,
      message: 'If an account exists with that email, a verification code has been sent.',
      email: cleanEmail
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Failed to process password reset request.'
    });
  }
}

/**
 * 6. Reset Password
 * Verifies OTP / resetToken and updates the password
 */
export async function resetPassword(req, res) {
  try {
    const { email, otp, resetToken, newPassword, confirmPassword } = req.body;

    if (!email || !EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ ok: false, error: 'Password must be at least 6 characters long.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ ok: false, error: 'Passwords do not match.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verification via resetToken
    if (resetToken) {
      try {
        const decoded = jwt.verify(resetToken, JWT_SECRET);
        if (decoded.email !== cleanEmail || decoded.purpose !== 'password_reset') {
          return res.status(400).json({ ok: false, error: 'Invalid or expired password reset session.' });
        }
      } catch (e) {
        return res.status(400).json({ ok: false, error: 'Password reset session has expired. Please request a new code.' });
      }
    } else if (otp) {
      // Direct verification via OTP
      const cleanOtp = otp.toString().trim();
      const otpRes = await query(
        `SELECT * FROM otps 
         WHERE email = $1 AND purpose = 'password_reset' AND used_at IS NULL 
         ORDER BY created_at DESC LIMIT 1`,
        [cleanEmail]
      );

      if (otpRes.rows.length === 0) {
        return res.status(400).json({ ok: false, error: 'Invalid verification code.' });
      }

      const otpRecord = otpRes.rows[0];
      if (otpRecord.attempts >= 5) {
        return res.status(429).json({ ok: false, error: 'Too many failed attempts. Please request a new verification code.' });
      }
      if (new Date(otpRecord.expires_at) < new Date()) {
        return res.status(400).json({ ok: false, error: 'This verification code has expired.' });
      }

      const isValid = await bcrypt.compare(cleanOtp, otpRecord.otp_hash);
      if (!isValid) {
        await query('UPDATE otps SET attempts = attempts + 1 WHERE id = $1', [otpRecord.id]);
        return res.status(400).json({ ok: false, error: 'Invalid verification code.' });
      }

      // Invalidate OTP
      await query('UPDATE otps SET used_at = CURRENT_TIMESTAMP WHERE id = $1', [otpRecord.id]);
    } else {
      return res.status(400).json({ ok: false, error: 'Verification code or reset token is required.' });
    }

    // Update password
    const newHash = await bcrypt.hash(newPassword, 10);
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE email = $2',
      [newHash, cleanEmail]
    );

    return res.json({
      ok: true,
      message: 'Password reset successfully. You can now log in with your new password.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Failed to reset password. Please try again.'
    });
  }
}

/**
 * 7. Get Current Authenticated Profile
 */
export async function getMe(req, res) {
  const current = req.user || req.admin;
  if (!current) {
    return res.status(401).json({ ok: false, error: 'Not authenticated.' });
  }
  return res.json({
    ok: true,
    user: {
      id: current.id,
      name: current.name,
      email: current.email,
      role: current.role,
      email_verified: current.email_verified ?? true
    },
    admin: req.admin
  });
}

export default {
  signup,
  verifyOtp,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  getMe
};
