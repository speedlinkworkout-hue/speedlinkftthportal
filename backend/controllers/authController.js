import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { sendOTPEmail, verifyOTP } from "../services/otpEmail.js";

// @desc    Register user with OTP verification
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, password, otp } = req.body;
  
  // Check if user exists
  const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email or phone number");
  }
  
  // If OTP provided, verify it
  if (otp) {
    const otpValid = await verifyOTP(email, otp, 'verification');
    if (!otpValid.success) {
      res.status(400);
      throw new Error(otpValid.message);
    }
  } else {
    // First step - just send OTP
    const otpSent = await sendOTPEmail(email, 'verification', fullName);
    if (!otpSent.success) {
      res.status(500);
      throw new Error("Failed to send verification code");
    }
    
    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      requiresOTP: true,
      ...(process.env.NODE_ENV === 'development' && { devOTP: otpSent.otp })
    });
  }
  
  // Create user
  const user = await User.create({
    fullName,
    email,
    phoneNumber,
    password
  });
  
  // Generate token
  generateToken(res, user._id);
  
  res.status(201).json({
    success: true,
    message: "Registration successful",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    }
  });
});

// @desc    Login user with OTP option
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, phoneNumber, password, otp, sendOTPOnly } = req.body;
  
  // Find user by email or phone
  const query = email ? { email } : { phoneNumber };
  const user = await User.findOne(query).select("+password");
  
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  
  // If just requesting OTP for 2FA
  if (sendOTPOnly) {
    const otpSent = await sendOTPEmail(user.email, 'login', user.fullName);
    if (!otpSent.success) {
      res.status(500);
      throw new Error("Failed to send login code");
    }
    
    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
      requiresOTP: true,
      email: user.email
    });
  }
  
  // If OTP provided, verify it (2FA login)
  if (otp) {
    const otpValid = await verifyOTP(user.email, otp, 'login');
    if (!otpValid.success) {
      res.status(401);
      throw new Error(otpValid.message);
    }
    
    generateToken(res, user._id);
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  }
  
  // Regular password login
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  
  // Optional: Enable 2FA by checking a flag on user
  if (user.twoFactorEnabled) {
    const otpSent = await sendOTPEmail(user.email, 'login', user.fullName);
    return res.status(200).json({
      success: true,
      message: "2FA enabled. Verification code sent to your email",
      requiresOTP: true,
      twoFactorRequired: true
    });
  }
  
  generateToken(res, user._id);
  
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  
  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Forgot password - send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }
  
  const otpSent = await sendOTPEmail(email, 'password_reset', user.fullName);
  if (!otpSent.success) {
    res.status(500);
    throw new Error("Failed to send reset code");
  }
  
  res.status(200).json({
    success: true,
    message: "Password reset code sent to your email",
    ...(process.env.NODE_ENV === 'development' && { devOTP: otpSent.otp })
  });
});

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  
  // Verify OTP
  const otpValid = await verifyOTP(email, otp, 'password_reset');
  if (!otpValid.success) {
    res.status(400);
    throw new Error(otpValid.message);
  }
  
  // Update password
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  
  user.password = newPassword;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: "Password reset successful. Please login with your new password."
  });
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = asyncHandler(async (req, res) => {
  const { email, type = 'verification', name = '' } = req.body;
  
  const otpSent = await sendOTPEmail(email, type, name);
  if (!otpSent.success) {
    res.status(500);
    throw new Error("Failed to send verification code");
  }
  
  res.status(200).json({
    success: true,
    message: "New verification code sent",
    ...(process.env.NODE_ENV === 'development' && { devOTP: otpSent.otp })
  });
});

export {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  resendOTP
};