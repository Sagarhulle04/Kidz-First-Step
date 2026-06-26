import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary, { uploadFileToCloudinary } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  const { name, email, password, gender, role } = req.body || {};
  const file = req?.files?.file;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    const existingEmail = await User.findOne({ email }).select("-password");

    if (existingEmail) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const cloudinary_url = await uploadFileToCloudinary(file);

    const user = await User.create({
      name,
      email,
      role,
      gender,
      password: hashPassword,
      profileImage: cloudinary_url,
    });

    res.status(201).json({ success: true, message: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentails" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Inavlid Credentails" });
    }

    const token = jwt.sign(
      {
        _id: user?._id,
        role: user?.role,
        email: user?.email,
        name: user?.name,
      },
      process.env.secretKey,
      { expiresIn: "2h" },
    );

    res
      .status(200)
      .json({ success: true, message: "LoggedIn Successfully", user, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchProfile = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400).json({ success: false, message: "Please Re-Login" });
    }

    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, message: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { name, email, gender } = req.body || {};
  const file = req?.files?.file;
  try {
    const user = await User.findById(req.user.id);
    console.log(user);

    const updateData = {};

    if (name) updateData.name = name;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter your name" });
    }

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload the image" });
    }

    if (file) {
      const result = await uploadFileToCloudinary(file);
      updateData.profileImage = result;
    }

    const updateUser = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });

    if (!updateUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "Profie Updated Successfully",
      updateUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
