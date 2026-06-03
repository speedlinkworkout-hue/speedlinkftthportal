import asyncHandler from "express-async-handler";
import axios from "axios";
import User from "../models/userModel.js";
import Connection from "../models/connectionModel.js";
import Payment from "../models/paymentModel.js";
import Transaction from "../models/transactionModel.js";
import PendingPurchase from "../models/pendingPurchaseModel.js";

// Plan configurations
const availablePlans = [
  {
    id: "plan_basic",
    name: "Basic 50Mbps",
    speed: "50Mbps",
    price: 29.99,
    priceNGN: 15000,
    duration: 30,
    features: ["Unlimited Data", "24/7 Support", "Free Installation"]
  },
  {
    id: "plan_standard",
    name: "Standard 100Mbps",
    speed: "100Mbps",
    price: 49.99,
    priceNGN: 25000,
    duration: 30,
    features: ["Unlimited Data", "24/7 Support", "Free Installation", "Static IP"]
  },
  {
    id: "plan_pro",
    name: "Pro 250Mbps",
    speed: "250Mbps",
    price: 79.99,
    priceNGN: 40000,
    duration: 30,
    features: ["Unlimited Data", "Priority Support", "Free Installation", "Static IP", "Free Router"]
  },
  {
    id: "plan_ultra",
    name: "Ultra 1Gbps",
    speed: "1Gbps",
    price: 129.99,
    priceNGN: 65000,
    duration: 30,
    features: ["Unlimited Data", "24/7 Priority Support", "Free Installation", "Static IP", "Free Mesh Router", "Business SLA"]
  }
];

// @desc    Get all available plans
// @route   GET /api/plans
// @access  Public
const getPlans = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    count: availablePlans.length,
    plans: availablePlans
  });
});

// @desc    Get single plan by ID
// @route   GET /api/plans/:planId
// @access  Public
const getPlanById = asyncHandler(async (req, res) => {
  const plan = availablePlans.find(p => p.id === req.params.planId);
  
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }
  
  res.status(200).json({
    success: true,
    plan
  });
});

// @desc    Initialize Paystack payment
// @route   POST /api/plans/purchase/initialize
// @access  Private
const initializePayment = asyncHandler(async (req, res) => {
  const { planId, connectionId } = req.body;
  
  const plan = availablePlans.find(p => p.id === planId);
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }
  
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  
  // Check if connection exists and belongs to user
  let connection = null;
  if (connectionId) {
    connection = await Connection.findOne({
      _id: connectionId,
      userId: user._id
    });
    
    if (!connection) {
      res.status(404);
      throw new Error("Connection not found");
    }
  }
  
  const reference = `FIB-${user._id.toString().slice(-8)}-${Date.now()}`;
  
  // Save pending purchase
  const pendingPurchase = await PendingPurchase.create({
    reference,
    userId: user._id,
    planId: plan.id,
    planName: plan.name,
    amount: plan.priceNGN,
    connectionId: connection?._id,
    isNewConnection: !connection
  });
  
  // Initialize Paystack transaction
  const response = await axios.post(
    "https://api.paystack.co/transaction/initialize",
    {
      email: user.email,
      amount: plan.priceNGN * 100,
      currency: "NGN",
      reference,
      metadata: {
        userId: user._id.toString(),
        planId: plan.id,
        planName: plan.name,
        connectionId: connection?._id?.toString() || null,
        pendingPurchaseId: pendingPurchase._id.toString()
      },
      callback_url: `${process.env.FRONTEND_URL}/payment/verify`
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );
  
  if (!response.data.status) {
    await PendingPurchase.deleteOne({ _id: pendingPurchase._id });
    res.status(400);
    throw new Error("Payment initialization failed");
  }
  
  res.status(200).json({
    success: true,
    message: "Payment initialized",
    authorization_url: response.data.data.authorization_url,
    reference
  });
});

// @desc    Verify payment and activate connection
// @route   POST /api/plans/purchase/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
  const { reference } = req.body;
  
  if (!reference) {
    res.status(400);
    throw new Error("Payment reference is required");
  }
  
  // Verify with Paystack
  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    }
  );
  
  if (!response.data.status || response.data.data.status !== "success") {
    res.status(400);
    throw new Error("Payment verification failed");
  }
  
  const transaction = response.data.data;
  const metadata = transaction.metadata;
  
  // Get pending purchase
  const pendingPurchase = await PendingPurchase.findOne({
    reference,
    status: "pending"
  });
  
  if (!pendingPurchase) {
    res.status(404);
    throw new Error("Pending purchase not found or already processed");
  }
  
  const user = await User.findById(pendingPurchase.userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  
  const plan = availablePlans.find(p => p.id === pendingPurchase.planId);
  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }
  
  let connection;
  
  // Create or update connection
  if (pendingPurchase.isNewConnection) {
    // Create new connection
    connection = await Connection.create({
      connectionId: `FIB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      userId: user._id,
      planName: plan.name,
      wifiPassword: Math.random().toString(36).substring(2, 12),
      status: "active",
      activatedAt: new Date(),
      expiresAt: new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000)
    });
  } else {
    // Update existing connection
    connection = await Connection.findById(pendingPurchase.connectionId);
    if (connection) {
      connection.planName = plan.name;
      connection.status = "active";
      connection.activatedAt = new Date();
      connection.expiresAt = new Date(Date.now() + plan.duration * 24 * 60 * 60 * 1000);
      await connection.save();
    }
  }
  
  // Create payment record
  const payment = await Payment.create({
    reference,
    userId: user._id,
    connectionId: connection._id,
    amount: pendingPurchase.amount,
    planName: plan.name,
    planId: plan.id,
    status: "success",
    paidAt: new Date(),
    metadata: transaction.metadata
  });
  
  // Create transaction record
  await Transaction.create({
    reference,
    userId: user._id,
    type: "payment",
    amount: pendingPurchase.amount,
    status: "completed",
    paymentId: payment._id,
    connectionId: connection._id,
    completedAt: new Date()
  });
  
  // Mark pending purchase as completed
  pendingPurchase.status = "completed";
  await pendingPurchase.save();
  
  res.status(200).json({
    success: true,
    message: "Payment verified and plan activated",
    connection: {
      id: connection._id,
      connectionId: connection.connectionId,
      planName: connection.planName,
      status: connection.status,
      expiresAt: connection.expiresAt
    }
  });
});

// @desc    Get user's connections
// @route   GET /api/plans/my-connections
// @access  Private
const getUserConnections = asyncHandler(async (req, res) => {
  const connections = await Connection.find({ 
    userId: req.user._id 
  }).select("-wifiPassword");
  
  res.status(200).json({
    success: true,
    count: connections.length,
    connections
  });
});

// @desc    Get payment history
// @route   GET /api/plans/payments/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate("connectionId", "connectionId planName");
  
  res.status(200).json({
    success: true,
    count: payments.length,
    payments
  });
});

// @desc    Paystack webhook
// @route   POST /api/plans/webhook/paystack
// @access  Public
const paystackWebhook = asyncHandler(async (req, res) => {
  const crypto = await import("crypto");
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest("hex");
  
  if (hash !== req.headers["x-paystack-signature"]) {
    res.status(401);
    throw new Error("Invalid webhook signature");
  }
  
  const event = req.body;
  
  if (event.event === "charge.success") {
    const transaction = event.data;
    const reference = transaction.reference;
    
    const pendingPurchase = await PendingPurchase.findOne({ reference });
    if (pendingPurchase && pendingPurchase.status === "pending") {
      // Process the payment (same logic as verifyPayment)
      // You can call a shared service function here
    }
  }
  
  res.status(200).json({ success: true });
});

export {
  getPlans,
  getPlanById,
  initializePayment,
  verifyPayment,
  getUserConnections,
  getPaymentHistory,
  paystackWebhook
};