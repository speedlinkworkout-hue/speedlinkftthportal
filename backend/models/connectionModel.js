import mongoose from "mongoose";

const dailyUsageSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  download: {
    type: Number,
    default: 0
  },
  upload: {
    type: Number,
    default: 0
  }
});

const connectionSchema = new mongoose.Schema({
  connectionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  planName: {
    type: String,
    required: true,
    enum: ["Basic 50Mbps", "Standard 100Mbps", "Pro 250Mbps", "Ultra 1Gbps"]
  },
  wifiSSID: {
    type: String,
    default: function() {
      return `FiberISP-${this._id.toString().slice(-6)}`;
    }
  },
  wifiPassword: {
    type: String,
    select: false
  },
  status: {
    type: String,
    enum: ["active", "suspended", "pending", "expired"],
    default: "pending"
  },
  activatedAt: Date,
  expiresAt: Date,
  monthlyUsage: {
    download: { type: Number, default: 0 },
    upload: { type: Number, default: 0 }
  },
  dailyUsage: [dailyUsageSchema]
}, {
  timestamps: true
});

// Index for faster queries
connectionSchema.index({ userId: 1 });
connectionSchema.index({ connectionId: 1 });
connectionSchema.index({ status: 1 });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;