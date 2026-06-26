import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }
    const qty = Number(quantity) || 1;

    // Check product availability
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += qty;
    } else {
      // Add new item
      cart.items.push({ productId, quantity: qty });
    }

    await cart.save();
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
    res.status(200).json({ success: true, message: "Added to Cart", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(400).json({ success: false, message: "Cart not found" });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
    res.status(200).json({ success: true, message: "Removed from Cart", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
