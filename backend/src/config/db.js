import mongoose from "mongoose"
import PromoCode from "../models/PromoCode.js";
import CmsSetting from "../models/CmsSetting.js";
import Category from "../models/Category.js";
import Collection from "../models/Collection.js";

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

        // Seed default CMS settings if they do not exist
        const defaultCms = [
          {
            key: "home_hero",
            value: {
              eyebrow: "New Collection 2025",
              headline: "Where every room tells your story.",
              subtext: "Handpicked furniture and décor for spaces that feel unmistakably like home.",
              ctaText: "Shop Now",
              ctaLink: "/shop",
              image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=80"
            }
          },
          {
            key: "home_editorial_promo",
            value: {
              eyebrow: "Exclusive Privilege",
              title: "Enjoy 10% Off Your First Order",
              code: "WELCOME10",
              subtext: "Use code WELCOME10 at checkout to unlock your introductory savings. Enjoy complimentary white-glove shipping on your first purchase.",
              image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1600&q=85",
              linkText: "Shop the Collection",
              linkPath: "/shop"
            }
          },
          {
            key: "home_spaces",
            value: [
              {
                id: "living-room",
                name: "Living Room",
                tagline: "The heart of every home",
                image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85"
              },
              {
                id: "bedroom",
                name: "Bedroom",
                tagline: "Rest in refined comfort",
                image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85"
              },
              {
                id: "dining-room",
                name: "Dining Room",
                tagline: "Gather around beauty",
                image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&q=85"
              }
            ]
          },
          {
            key: "brand_perks",
            value: [
              {
                title: "Curated in India",
                desc: "Every piece designed by our in-house team"
              },
              {
                title: "Free Styling Advice",
                desc: "Complimentary consultations on orders above ₹25,000"
              },
              {
                title: "30-Day Returns",
                desc: "Hassle-free returns on every order"
              }
            ]
          },
          {
            key: "team_members",
            value: [
              {
                name: "Ananya Sen",
                role: "Founder & Creative Director",
                bio: "Believes wabi-sabi principles and natural materials create living artwork.",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80"
              },
              {
                name: "Rajesh Malhotra",
                role: "Principal Architect",
                bio: "Specializes in organic architecture and bespoke wood design frameworks.",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80"
              },
              {
                name: "Meera Joshi",
                role: "Lead Textiles Curator",
                bio: "Curates premium fabrics, bouclés, and raw linen textures globally.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80"
              }
            ]
          },
          {
            key: "faqs_list",
            value: [
              {
                question: "What is wabi-sabi design?",
                answer: "Wabi-sabi is a Japanese aesthetic centering on the acceptance of transience and imperfection. In home decor, this translates to utilizing raw materials, organic contours, plaster textures, and items that age gracefully."
              },
              {
                question: "Do you deliver pan-India?",
                answer: "Yes, we ship our premium items and handcrafted furniture throughout India. All orders include secure, specialized handling to preserve delicate surfaces."
              },
              {
                question: "Can I cancel or return my order?",
                answer: "Yes. We offer free cancellations before shipment, and a 30-day returns window for items returned in their original condition."
              }
            ]
          },
          {
            key: "checkout_settings",
            value: {
              standardShippingFee: 0,
              expressShippingFee: 500,
              freeShippingThreshold: 25000,
              codFee: 50,
              taxRate: 18
            }
          }
        ];

        for (const item of defaultCms) {
          const exists = await CmsSetting.findOne({ key: item.key });
          if (!exists) {
            await CmsSetting.create(item);
            console.log(`Seeded default CMS setting: ${item.key}`);
          }
        }

        // Seed default categories if the collection is empty
        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
          const defaultCategories = [
            { slug: "furniture", name: "Furniture", description: "Impeccably crafted sofas, accent chairs, and solid stone tables designed to serve as the sculptural anchors of your home.", heroImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80", order: 1 },
            { slug: "lighting", name: "Lighting", description: "From statement floor lamps to minimalist marble pendants, discover lighting designed to sculpt shadow and warmth.", heroImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1600&q=80", order: 2 },
            { slug: "wall-decor", name: "Wall Decor", description: "Evocative hand-painted canvas art and organic woven rattan mirrors that transform empty walls into clean design statements.", heroImage: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&q=80", order: 3 },
            { slug: "textiles", name: "Textiles", description: "European flax linen blankets and hand-braided jute rugs that introduce tactile texture and natural comfort to your daily living.", heroImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80", order: 4 },
            { slug: "decor-accessories", name: "Decor Accessories", description: "Stoneware ceramic vases, artisan trays, and curated object designs that add organic layers and styling details to shelves and tables.", heroImage: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=1600&q=80", order: 5 },
          ];
          await Category.insertMany(defaultCategories);
          console.log("Seeded 5 default categories");
        }

        // Seed default collections if the collection is empty
        const collectionCount = await Collection.countDocuments();
        if (collectionCount === 0) {
          const defaultCollections = [
            { slug: "modern-minimalist", name: "Modern Minimalist", tagline: "Less is the ultimate luxury", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=85", order: 1 },
            { slug: "luxury-living", name: "Luxury Living", tagline: "Indulge in opulent comfort", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85", order: 2 },
            { slug: "scandinavian", name: "Scandinavian", tagline: "Nordic simplicity meets function", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85", order: 3 },
            { slug: "boho-chic", name: "Boho Chic", tagline: "Free-spirited eclectic warmth", image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=900&q=85", order: 4 },
            { slug: "new-arrivals", name: "New Arrivals", tagline: "Fresh additions to our catalog", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85", order: 5 },
            { slug: "best-sellers", name: "Best Sellers", tagline: "Our most loved pieces", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85", order: 6 },
          ];
          await Collection.insertMany(defaultCollections);
          console.log("Seeded 6 default collections");
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;