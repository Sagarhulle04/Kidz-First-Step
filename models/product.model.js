import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "soft-toys",
        "musical-toys",
        "best-seller",
        "new-arrival",
        "learning-toys",
      ],
      reuqired: true,
    },
    brand: {
      type: String,
      enum: ["satishsea", "snehalsea", "rushsea", "anikitasea", "purnavsea"],
      required: true,
    },
    categoryPrice: {
      type: String,
      requred: true,
    },
    brandPrice: {
      type: String,
      required: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

export default Product;
