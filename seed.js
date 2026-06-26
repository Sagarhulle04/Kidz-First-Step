import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/user.model.js";
import Product from "./models/product.model.js";

const MONGODB_URL = "mongodb://localhost:27017/kidzfirststep";

async function seed() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB for seeding...");

    // 1. Create Admin User
    const adminExists = await User.findOne({ email: "admin@kfs.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "Admin KFS",
        email: "admin@kfs.com",
        password: hashedPassword,
        gender: "female",
        role: "admin",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      });
      console.log("Admin user seeded successfully.");
    } else {
      console.log("Admin user already exists.");
    }

    // 2. Create Regular User
    const userExists = await User.findOne({ email: "user@kfs.com" });
    if (!userExists) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      await User.create({
        name: "User KFS",
        email: "user@kfs.com",
        password: hashedPassword,
        gender: "male",
        role: "user",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      });
      console.log("Regular user seeded successfully.");
    } else {
      console.log("Regular user already exists.");
    }

    // 3. Create Product
    const adminUser = await User.findOne({ email: "admin@kfs.com" });
    const productExists = await Product.findOne({ name: "Cuddly Teddy Bear" });
    if (!productExists) {
      await Product.create({
        name: "Cuddly Teddy Bear",
        category: "soft-toys",
        brand: "satishsea",
        categoryPrice: 499,
        brandPrice: 899,
        quantity: 25,
        productImage: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=400&q=80",
        user: adminUser._id,
      });
      console.log("Product 'Cuddly Teddy Bear' seeded successfully.");
    } else {
      productExists.user = adminUser._id;
      await productExists.save();
      console.log("Product creator updated.");
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seed();
