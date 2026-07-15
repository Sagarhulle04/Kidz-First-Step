import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/user.model.js";
import Product from "./models/product.model.js";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const productsData = [
  {
    name: "Cuddly Teddy Bear",
    category: "soft-toys",
    brand: "satishsea",
    categoryPrice: "499",
    brandPrice: "899",
    quantity: 20,
    productImage: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Dancing Robot Toy",
    category: "best-seller",
    brand: "snehalsea",
    categoryPrice: "999",
    brandPrice: "1499",
    quantity: 15,
    productImage: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Xylophone Musical Kit",
    category: "musical-toys",
    brand: "rushsea",
    categoryPrice: "299",
    brandPrice: "599",
    quantity: 25,
    productImage: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Interactive Alphabets Book",
    category: "learning-toys",
    brand: "anikitasea",
    categoryPrice: "349",
    brandPrice: "649",
    quantity: 30,
    productImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Dinosaur Plush Toy",
    category: "soft-toys",
    brand: "purnavsea",
    categoryPrice: "450",
    brandPrice: "799",
    quantity: 12,
    productImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mini Piano Keyboard",
    category: "musical-toys",
    brand: "satishsea",
    categoryPrice: "1199",
    brandPrice: "1899",
    quantity: 8,
    productImage: "https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Smart Blocks Set",
    category: "learning-toys",
    brand: "snehalsea",
    categoryPrice: "599",
    brandPrice: "999",
    quantity: 40,
    productImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Baby Walker & Activity Center",
    category: "new-arrival",
    brand: "rushsea",
    categoryPrice: "1499",
    brandPrice: "2499",
    quantity: 10,
    productImage: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Stuffed Bunny Rabbit",
    category: "soft-toys",
    brand: "anikitasea",
    categoryPrice: "399",
    brandPrice: "699",
    quantity: 18,
    productImage: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Wooden Train Track Set",
    category: "best-seller",
    brand: "purnavsea",
    categoryPrice: "899",
    brandPrice: "1399",
    quantity: 22,
    productImage: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Kids Drum Set",
    category: "musical-toys",
    brand: "snehalsea",
    categoryPrice: "1599",
    brandPrice: "2999",
    quantity: 5,
    productImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Shapes & Colors Sorter",
    category: "learning-toys",
    brand: "satishsea",
    categoryPrice: "249",
    brandPrice: "499",
    quantity: 35,
    productImage: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Remote Control Racing Car",
    category: "best-seller",
    brand: "rushsea",
    categoryPrice: "799",
    brandPrice: "1299",
    quantity: 14,
    productImage: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Plush Elephant Friend",
    category: "soft-toys",
    brand: "purnavsea",
    categoryPrice: "499",
    brandPrice: "899",
    quantity: 20,
    productImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Stacking Cups Tower",
    category: "learning-toys",
    brand: "anikitasea",
    categoryPrice: "199",
    brandPrice: "399",
    quantity: 50,
    productImage: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Baby Rattle & Teether Set",
    category: "new-arrival",
    brand: "satishsea",
    categoryPrice: "299",
    brandPrice: "499",
    quantity: 28,
    productImage: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Pull-Along Duck Toy",
    category: "best-seller",
    brand: "rushsea",
    categoryPrice: "349",
    brandPrice: "599",
    quantity: 15,
    productImage: "https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Musical Activity Table",
    category: "musical-toys",
    brand: "purnavsea",
    categoryPrice: "1999",
    brandPrice: "3499",
    quantity: 7,
    productImage: "https://images.unsplash.com/photo-1515488042361-404e9250afef?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Alphabet Floor Puzzle",
    category: "learning-toys",
    brand: "snehalsea",
    categoryPrice: "449",
    brandPrice: "799",
    quantity: 22,
    productImage: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Soft Plush Monkey",
    category: "soft-toys",
    brand: "anikitasea",
    categoryPrice: "399",
    brandPrice: "699",
    quantity: 16,
    productImage: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80",
  }
];

async function seed() {
  try {
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is not defined.");
    }
    await mongoose.connect(MONGODB_URL);
    console.log("Connected to MongoDB for seeding products...");

    // Create or update admin user
    const adminEmail = "admin@gmail.com";
    let adminUser = await User.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash("123456", 10);

    if (!adminUser) {
      adminUser = await User.create({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        gender: "male",
        role: "admin",
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      });
      console.log(`Created admin user: ${adminEmail}`);
    } else {
      adminUser.password = hashedPassword;
      adminUser.role = "admin";
      await adminUser.save();
      console.log(`Updated existing admin user: ${adminEmail}`);
    }

    // Delete existing products
    await Product.deleteMany({});
    console.log("Deleted existing products.");

    // Add 20 products
    const productsToInsert = productsData.map((product) => ({
      ...product,
      user: adminUser._id,
    }));

    await Product.insertMany(productsToInsert);
    console.log("Successfully seeded 20 products.");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
