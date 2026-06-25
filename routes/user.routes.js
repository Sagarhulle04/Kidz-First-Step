import express from "express";
import {
  fetchProfile,
  login,
  logout,
  register,
  updateProfile,
} from "../controllers/user.controller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/fetchProfile", auth, fetchProfile);
router.put("/updateProfile", auth, updateProfile);
router.post("/logout", auth, logout);
export default router;
