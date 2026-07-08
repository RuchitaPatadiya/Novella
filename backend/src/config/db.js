import mongoose from "mongoose"
import PromoCode from "../models/PromoCode.js";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Seed default promo codes if they do not exist
        const defaults = [
            {
                code: "WELCOME10",
                discountType: "percentage",
                value: 10,
                minPurchase: 0,
                expiryDate: new Date("2028-12-31"),
                isActive: true
            },
            {
                code: "ATELIER15",
                discountType: "percentage",
                value: 15,
                minPurchase: 5000,
                expiryDate: new Date("2028-12-31"),
                isActive: true
            },
            {
                code: "NOVELLA20",
                discountType: "percentage",
                value: 20,
                minPurchase: 10000,
                expiryDate: new Date("2028-12-31"),
                isActive: true
            }
        ];

        for (const item of defaults) {
            const exists = await PromoCode.findOne({ code: item.code });
            if (!exists) {
                await PromoCode.create(item);
                console.log(`Seeded default active promo code: ${item.code}`);
            }
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;