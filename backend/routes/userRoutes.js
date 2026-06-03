import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  changeWifiPassword,
  getConnectionUsage
} from "../controllers/userController.js";

const router = express.Router();

router.use(protect);

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.put("/connections/:connectionId/wifi-password", changeWifiPassword);
router.get("/connections/:connectionId/usage", getConnectionUsage);

export default router;