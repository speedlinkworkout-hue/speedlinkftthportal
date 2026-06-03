import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ["payment", "refund", "subscription_renewal", "plan_upgrade"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "failed"],
    default: "pending"
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment"
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Connection"
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  completedAt: Date
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ userId: 1 });
transactionSchema.index({ reference: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;