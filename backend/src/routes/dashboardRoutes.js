import express from "express";
import { getDashboardStats, getRecentRequests } from "../controllers/dashboardController.js";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getDashboardStats);
router.get("/recent", verifyToken, isAdmin, getRecentRequests);

export default router;
