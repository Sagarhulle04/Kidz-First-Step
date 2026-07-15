import Product from "../models/product.model.js";
import { uploadFileToCloudinary } from "../utils/cloudinary.js";

export const addProduct = async (req, res) => {
  const { name, category, brand, categoryPrice, brandPrice, quantity } =
    req.body;
  const file = req?.files?.file;
  try {
    const role = req.user.role;

    if (role === "user") {
      return res
        .status(400)
        .json({ success: false, message: "Only Admin Can Add The Product" });
    }

    if (
      !name ||
      !category ||
      !brand ||
      !categoryPrice ||
      !brandPrice ||
      !file ||
      !quantity ||
      !file
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const result = await uploadFileToCloudinary(file);

    console.log(req.user._id);

    const product = await Product.create({
      name,
      category,
      brand,
      categoryPrice,
      brandPrice,
      quantity,
      productImage: result,
      user: req.user._id,
    });

    res
      .status(201)
      .json({ success: true, message: "Product Added Successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id).populate("user", "-password");

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product Not Found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Product Fetched", product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res
        .status(400)
        .json({ success: false, message: "Products Not Found" });
    }

    res.status(200).json({
      success: true,
      message: "All Products",
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const role = req.user.role;
    if (role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only Admin Can Delete The Product" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product Not Found" });
    }

    await Product.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const id = req.params.id;
  const { name, category, brand, categoryPrice, brandPrice, quantity } = req.body;
  const file = req?.files?.file;

  try {
    const role = req.user.role;
    if (role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only Admin Can Update The Product" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "Product Not Found" });
    }

    if (product.user && product.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You can only update products you created" });
    }

    const updateData = {
      name: name || product.name,
      category: category || product.category,
      brand: brand || product.brand,
      categoryPrice: categoryPrice || product.categoryPrice,
      brandPrice: brandPrice || product.brandPrice,
      quantity: quantity !== undefined ? quantity : product.quantity,
    };

    if (file) {
      const result = await uploadFileToCloudinary(file);
      updateData.productImage = result;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      success: true,
      message: "Product Updated Successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

