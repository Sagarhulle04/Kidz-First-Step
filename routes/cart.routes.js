import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/cart", auth, getCart);
router.post("/cart/add", auth, addToCart);
router.delete("/cart/item/:productId", auth, removeFromCart);
router.post("/cart/clear", auth, clearCart);

export default router;
