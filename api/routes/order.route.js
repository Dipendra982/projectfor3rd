import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  getMyOrders,
  getReceivedOrders,
  intent,
  confirm,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// Route for getting orders the user has placed (My Orders)
router.get("/my-orders", verifyToken, getMyOrders);

// Route for getting orders the seller has received (Received Orders)
router.get("/received-orders", verifyToken, getReceivedOrders);

// Route for creating a payment intent
router.post("/create-payment-intent/:id", verifyToken, intent);

// Route for confirming an order after payment
router.put("/", verifyToken, confirm);

// Route for updating the status of an order
router.patch("/:id", verifyToken, updateOrderStatus);

export default router;
