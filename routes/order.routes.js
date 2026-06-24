import express from "express";
import { auth } from "../middleware/auth.js";
import { fetchOrders, orderDetails } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/placeOrder/:id", auth, orderDetails);
router.get("/fetchOrder/:id", auth, fetchOrders);

export default router;
