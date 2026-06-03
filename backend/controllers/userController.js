import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Connection from "../models/connectionModel.js";
import Payment from "../models/paymentModel.js";

// @desc    Get user profile with connections
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  const connections = await Connection.find({ userId: user._id }).select("-wifiPassword");
  
  res.status(200).json({
    success: true,
    user,
    connections
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  
  user.fullName = req.body.fullName || user.fullName;
  user.email = req.body.email || user.email;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
  
  if (req.body.password) {
    user.password = req.body.password;
  }
  
  const updatedUser = await user.save();
  
  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user: {
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role
    }
  });
});

// @desc    Change WiFi password for connection
// @route   PUT /api/users/connections/:connectionId/wifi-password
// @access  Private
const changeWifiPassword = asyncHandler(async (req, res) => {
  const { wifiPassword } = req.body;
  
  if (!wifiPassword || wifiPassword.length < 8) {
    res.status(400);
    throw new Error("WiFi password must be at least 8 characters");
  }
  
  const connection = await Connection.findOne({
    _id: req.params.connectionId,
    userId: req.user._id
  });
  
  if (!connection) {
    res.status(404);
    throw new Error("Connection not found");
  }
  
  connection.wifiPassword = wifiPassword;
  await connection.save();
  
  res.status(200).json({
    success: true,
    message: "WiFi password changed successfully"
  });
});

// @desc    Get connection usage
// @route   GET /api/users/connections/:connectionId/usage
// @access  Private
const getConnectionUsage = asyncHandler(async (req, res) => {
  const { period = "monthly" } = req.query;
  
  const connection = await Connection.findOne({
    _id: req.params.connectionId,
    userId: req.user._id
  });
  
  if (!connection) {
    res.status(404);
    throw new Error("Connection not found");
  }
  
  let usageData = {};
  
  switch (period) {
    case "daily":
      usageData = connection.dailyUsage.slice(-7);
      break;
    case "weekly":
      // Aggregate weekly
      const weeklyMap = new Map();
      connection.dailyUsage.forEach(day => {
        const weekStart = new Date(day.date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyMap.has(weekKey)) {
          weeklyMap.set(weekKey, { download: 0, upload: 0, weekStart });
        }
        
        const week = weeklyMap.get(weekKey);
        week.download += day.download;
        week.upload += day.upload;
      });
      usageData = Array.from(weeklyMap.values()).slice(-4);
      break;
    default:
      usageData = {
        download: connection.monthlyUsage.download,
        upload: connection.monthlyUsage.upload,
        total: connection.monthlyUsage.download + connection.monthlyUsage.upload
      };
  }
  
  res.status(200).json({
    success: true,
    period,
    usage: usageData
  });
});

export {
  getUserProfile,
  updateUserProfile,
  changeWifiPassword,
  getConnectionUsage
};