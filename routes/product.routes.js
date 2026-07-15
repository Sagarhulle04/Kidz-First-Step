import express from "express";
import { auth } from "../middleware/auth.js";
import {
  addProduct,
  deleteProduct,
  fetchAllProducts,
  fetchProduct,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/addProduct", auth, addProduct);
router.get("/fetchProduct/:id", auth, fetchProduct);
router.get("/allProducts", auth, fetchAllProducts);
router.delete("/deleteProduct/:id", auth, deleteProduct);
router.put("/updateProduct/:id", auth, updateProduct);

export default router;
