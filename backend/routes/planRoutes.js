import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPlans,
  getPlanById,
  initializePayment,
  verifyPayment,
  getUserConnections,
  getPaymentHistory,
  paystackWebhook
} from "../controllers/planController.js";

const router = express.Router();

// Public
router.get("/", getPlans);
router.get("/:planId", getPlanById);
router.post("/webhook/paystack", paystackWebhook);

// Protected
router.use(protect);
router.post("/purchase/initialize", initializePayment);
router.post("/purchase/verify", verifyPayment);
router.get("/my-connections", getUserConnections);
router.get("/payments/history", getPaymentHistory);

export default router;