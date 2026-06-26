import Address from "../models/address.schema.js";
import Order from "../models/order.schema.js";
import Product from "../models/product.model.js";

export const orderDetails = async (req, res) => {
  const { address, city, pincode, phone, notes } = req.body;
  try {
    if (!address || !city || !pincode || !phone || !notes) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const product = await Product.findById(req.params.id);
    const user = req.user;

    if (user?.role === "admin") {
      return res
        .status(400)
        .json({ success: false, message: "Admin cannot order the product" });
    }

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product not found" });
    }

    if (product.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    if (phone.length !== 10) {
      return res
        .status(400)
        .json({ success: false, message: "Mobile Number Digits should be 10" });
    }

    const addressDetails = await Address.create({
      user: req.user._id,
      product: product?._id,
      address,
      notes,
      pincode,
      phone,
      city,
    });

    console.log(product);

    const order = await Order.create({
      user: req.user._id,
      product: product?._id,
      address: addressDetails,
    });

    product.quantity = product.quantity - 1;
    await product.save();

    res.status(201).json({ success: true, message: "Order Placed", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchOrders = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "-password")
      .populate("product")
      .populate("address");

    if (!order) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order details", order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: "My Orders", orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchAdminOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }

    // Find all products created by this admin
    const products = await Product.find({ user: req.user._id });
    const productIds = products.map((p) => p._id);

    // Find orders containing these products
    const orders = await Order.find({ product: { $in: productIds } })
      .populate("user", "-password")
      .populate("product")
      .populate("address")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, message: "Customer Orders", orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
