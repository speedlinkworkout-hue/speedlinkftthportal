import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory OTP storage (use Redis/DB in production)
const otpStore = new Map();

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, type = 'verification', name = '') => {
  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Store OTP
    otpStore.set(email, {
      otp,
      type,
      expiresAt,
      attempts: 0
    });
    
    // Email templates
    const templates = {
      verification: {
        subject: 'Verify Your Email - Fiber ISP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2>Welcome to Fiber ISP!</h2>
            <p>Hello ${name || 'there'},</p>
            <p>Your verification code is:</p>
            <div style="font-size: 32px; font-weight: bold; padding: 20px; background: #f4f4f4; text-align: center; letter-spacing: 5px;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `
      },
      password_reset: {
        subject: 'Password Reset Code - Fiber ISP',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>Hello ${name || 'there'},</p>
            <p>Your password reset code is:</p>
            <div style="font-size: 32px; font-weight: bold; padding: 20px; background: #f4f4f4; text-align: center; letter-spacing: 5px;">
              ${otp}
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `
      }
    };
    
    const template = templates[type] || templates.verification;
    
    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Fiber ISP <noreply@yourdomain.com>',
      to: [email],
      subject: template.subject,
      html: template.html,
    });
    
    if (error) {
      console.error('Resend error:', error);
      return { success: false, message: 'Failed to send OTP' };
    }
    
    // Return OTP only in development for testing
    return { 
      success: true, 
      message: 'OTP sent successfully',
      ...(process.env.NODE_ENV === 'development' && { otp })
    };
    
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, message: 'Error sending OTP' };
  }
};

// Verify OTP
const verifyOTP = async (email, otp, type = 'verification') => {
  const storedOTP = otpStore.get(email);
  
  if (!storedOTP) {
    return { success: false, message: 'No OTP found. Request a new one.' };
  }
  
  if (Date.now() > storedOTP.expiresAt) {
    otpStore.delete(email);
    return { success: false, message: 'OTP has expired. Request a new one.' };
  }
  
  if (storedOTP.type !== type) {
    return { success: false, message: 'Invalid OTP type' };
  }
  
  if (storedOTP.attempts >= 3) {
    otpStore.delete(email);
    return { success: false, message: 'Too many failed attempts. Request a new OTP.' };
  }
  
  if (storedOTP.otp !== otp) {
    storedOTP.attempts += 1;
    otpStore.set(email, storedOTP);
    return { success: false, message: `Invalid OTP. ${3 - storedOTP.attempts} attempts remaining.` };
  }
  
  // OTP is valid - delete it
  otpStore.delete(email);
  return { success: true, message: 'OTP verified successfully' };
};

export { sendOTPEmail, verifyOTP };