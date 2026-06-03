import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Connection"
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "NGN"
  },
  planName: {
    type: String,
    required: true
  },
  planId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    default: "paystack"
  },
  paidAt: Date,
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ userId: 1 });
paymentSchema.index({ reference: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;