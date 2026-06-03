import mongoose from "mongoose";

const pendingPurchaseSchema = new mongoose.Schema({
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
  planId: {
    type: String,
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Connection"
  },
  isNewConnection: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "expired"],
    default: "pending"
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
    }
  }
}, {
  timestamps: true
});

// Auto-expire pending purchases
pendingPurchaseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingPurchase = mongoose.model("PendingPurchase", pendingPurchaseSchema);

export default PendingPurchase;