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

    // 3. Insert our 12 premium products (resetting placeholder ratings/counts to 0)
    const initializedProducts = seedProducts.map((p) => ({
      ...p,
      rating: 0,
      reviewsCount: 0
    }));
    await Product.insertMany(initializedProducts);
    console.log(`${initializedProducts.length} Premium Products Seeded Successfully (Ratings set to 0)!`);

    process.exit(0);
  } catch (error) {
    console.error(`Error during data seeding: ${error.message}`);
    process.exit(1);
  }
};

importData();
