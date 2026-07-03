import "dotenv/config";
import connectDB from "./config/db.js";
import Product from "./models/Product.js";
import seedProducts from "./utils/seedProducts.js";

const importData = async () => {
  try {
    // 1. Boot up database connection
    await connectDB();

    // 2. Clear any existing products
    await Product.deleteMany();
    console.log("Existing products cleared from collection...");

    // 3. Insert our 12 premium products
    await Product.insertMany(seedProducts);
    console.log("12 Premium Products Seeded Successfully!");

    process.exit(0);
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

importData();
