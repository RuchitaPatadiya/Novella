import mongoose from "mongoose"
import PromoCode from "../models/PromoCode.js";
import CmsSetting from "../models/CmsSetting.js";
import Category from "../models/Category.js";
import Collection from "../models/Collection.js";
import Subcategory from "../models/Subcategory.js";
import Product from "../models/Product.js";
import Showcase from "../models/Showcase.js";

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
          },
          {
            key: "about_stats",
            value: [
              {
                number: "2,400+",
                label: "Original Designs",
                desc: "Every piece conceived in-house"
              },
              {
                number: "12k+",
                label: "Happy Homes",
                desc: "Across India and beyond"
              },
              {
                number: "4.9★",
                label: "Average Rating",
                desc: "From our verified customers"
              },
              {
                number: "100%",
                label: "In-House Design",
                desc: "No outsourcing, ever"
              }
            ]
          },
          {
            key: "about_milestones",
            value: [
              {
                year: "2024",
                event: "Novella Founded",
                desc: "A design studio built on the belief that beauty belongs in every home."
              },
              {
                year: "2024",
                event: "First Collection",
                desc: "Our debut edit of 100 original pieces — each designed in-house."
              },
              {
                year: "2025",
                event: "12,000+ Happy Homes",
                desc: "Our designs found their way into homes across India and beyond."
              },
              {
                year: "2025",
                event: "2,400+ Original Pieces",
                desc: "Every single one conceived, designed, and crafted by Novella."
              }
            ]
          },
          {
            key: "shop_the_look",
            value: {
              image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=85",
              title: "Shop the Look",
              subtitle: "Click on the interactive pulse points on the design setup to view and shop featured furniture pieces instantly.",
              buttonText: "Shop Full Living Room",
              buttonLink: "/shop",
              hotspots: [
                {
                  id: "sofa",
                  top: "70%",
                  left: "55%",
                  matchName: "Sofa",
                  displayName: "Curved Sofa",
                  productId: "1",
                  fallback: { name: "Atelier Curved Bouclé Sofa", price: 68000, image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=400" }
                },
                {
                  id: "pendant",
                  top: "16%",
                  left: "50%",
                  matchName: "Pendant",
                  displayName: "Arc Pendant",
                  productId: "2",
                  fallback: { name: "Nouveau Plaster Arc Pendant", price: 14500, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400" }
                },
                {
                  id: "table",
                  top: "84%",
                  left: "41%",
                  matchName: "Table",
                  displayName: "Travertine Table",
                  productId: "3",
                  fallback: { name: "Pillar Travertine Coffee Table", price: 32000, image: "https://media.istockphoto.com/id/2235412216/photo/warm-and-inviting-boho-scandinavian-living-room-with-textured-sofas-and-wooden-accents-3d.jpg?w=400" }
                },
                {
                  id: "canvas",
                  top: "52%",
                  left: "21%",
                  matchName: "Canvas",
                  displayName: "Canvas Art",
                  productId: "4",
                  fallback: { name: "Abstract Earth Canvas Art", price: 12500, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400" }
                }
              ]
            }
          }
        ];

        for (const item of defaultCms) {
          const exists = await CmsSetting.findOne({ key: item.key });
          if (!exists) {
            await CmsSetting.create(item);
            console.log(`Seeded default CMS setting: ${item.key}`);
          }
             // Seed default categories if the collection is empty
        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
          const defaultCategories = [
            { slug: "furniture", name: "Furniture", description: "Impeccably crafted sofas, accent chairs, and solid stone tables designed to serve as the sculptural anchors of your home.", navbarDescription: "Sculptural anchors for your space.", heroImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80", order: 1 },
            { slug: "lighting", name: "Lighting", description: "From statement floor lamps to minimalist marble pendants, discover lighting designed to sculpt shadow and warmth.", navbarDescription: "Sculpt shadow and warmth.", heroImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1600&q=80", order: 2 },
            { slug: "wall-decor", name: "Wall Decor", description: "Evocative hand-painted canvas art and organic woven rattan mirrors that transform empty walls into clean design statements.", navbarDescription: "Transform empty walls into statements.", heroImage: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1600&q=80", order: 3 },
            { slug: "textiles", name: "Textiles", description: "European flax linen blankets and hand-braided jute rugs that introduce tactile texture and natural comfort to your daily living.", navbarDescription: "Introduce tactile textures.", heroImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80", order: 4 },
            { slug: "decor-accessories", name: "Decor Accessories", description: "Stoneware ceramic vases, artisan trays, and curated object designs that add organic layers and styling details to shelves and tables.", navbarDescription: "Layer details and styling.", heroImage: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=1600&q=80", order: 5 },
          ];
          await Category.insertMany(defaultCategories);
          console.log("Seeded 5 default categories");
        } else {
          // Migration check for existing records
          const furnitureCat = await Category.findOne({ slug: "furniture" });
          if (furnitureCat && !furnitureCat.navbarDescription) {
            await Category.updateOne({ slug: "furniture" }, { navbarDescription: "Sculptural anchors for your space." });
            await Category.updateOne({ slug: "lighting" }, { navbarDescription: "Sculpt shadow and warmth." });
            await Category.updateOne({ slug: "wall-decor" }, { navbarDescription: "Transform empty walls into statements." });
            await Category.updateOne({ slug: "textiles" }, { navbarDescription: "Introduce tactile textures." });
            await Category.updateOne({ slug: "decor-accessories" }, { navbarDescription: "Layer details and styling." });
            console.log("Migrated existing categories to include short navbarDescriptions");
          }
        }

        // Seed default collections if the collection is empty
        const collectionCount = await Collection.countDocuments();
        if (collectionCount === 0) {
          const defaultCollections = [
            { slug: "modern-minimalist", name: "Modern Minimalist", tagline: "Less is the ultimate luxury", navbarDescription: "Less is the ultimate luxury.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=85", order: 1 },
            { slug: "luxury-living", name: "Luxury Living", tagline: "Indulge in opulent comfort", navbarDescription: "Indulge in opulent comfort.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=85", order: 2 },
            { slug: "scandinavian", name: "Scandinavian", tagline: "Nordic simplicity meets function", navbarDescription: "Nordic simplicity meets function.", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85", order: 3 },
            { slug: "boho-chic", name: "Boho Chic", tagline: "Free-spirited eclectic warmth", navbarDescription: "Free-spirited eclectic warmth.", image: "https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?w=900&q=85", order: 4 },
            { slug: "new-arrivals", name: "New Arrivals", tagline: "Fresh additions to our catalog", navbarDescription: "Fresh additions to our catalog.", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=85", order: 5 },
            { slug: "best-sellers", name: "Best Sellers", tagline: "Our most loved pieces", navbarDescription: "Our most loved design pieces.", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=85", order: 6 },
          ];
          await Collection.insertMany(defaultCollections);
          console.log("Seeded 6 default collections");
        } else {
          // Migration check for existing records
          const modernColl = await Collection.findOne({ slug: "modern-minimalist" });
          if (modernColl && !modernColl.navbarDescription) {
            await Collection.updateOne({ slug: "modern-minimalist" }, { navbarDescription: "Less is the ultimate luxury." });
            await Collection.updateOne({ slug: "luxury-living" }, { navbarDescription: "Indulge in opulent comfort." });
            await Collection.updateOne({ slug: "scandinavian" }, { navbarDescription: "Nordic simplicity meets function." });
            await Collection.updateOne({ slug: "boho-chic" }, { navbarDescription: "Free-spirited eclectic warmth." });
            await Collection.updateOne({ slug: "new-arrivals" }, { navbarDescription: "Fresh additions to our catalog." });
            await Collection.updateOne({ slug: "best-sellers" }, { navbarDescription: "Our most loved design pieces." });
            console.log("Migrated existing collections to include short navbarDescriptions");
          }
        }       }

        // Seed default subcategories if the collection is empty
        const subcategoryCount = await Subcategory.countDocuments();
        if (subcategoryCount === 0) {
          const defaultSubcategories = [
            { slug: "sofa", name: "Sofa", category: "furniture", order: 1 },
            { slug: "coffee-table", name: "Coffee Table", category: "furniture", order: 2 },
            { slug: "side-table", name: "Side Table", category: "furniture", order: 3 },
            { slug: "credenza", name: "Credenza", category: "furniture", order: 4 },
            { slug: "table-lamp", name: "Table Lamp", category: "lighting", order: 5 },
            { slug: "pendant-light", name: "Hanging Light", category: "lighting", order: 6 },
            { slug: "wall-sconce", name: "Wall Sconce", category: "lighting", order: 7 },
            { slug: "vase", name: "Vases", category: "decor-accessories", order: 8 },
            { slug: "mirror", name: "Mirror", category: "wall-decor", order: 9 },
            { slug: "art", name: "Wall Art", category: "wall-decor", order: 10 },
            { slug: "textiles", name: "Throws", category: "textiles", order: 11 },
            { slug: "organizer", name: "Organizer", category: "decor-accessories", order: 12 },
          ];
          await Subcategory.insertMany(defaultSubcategories);
          console.log("Seeded 12 default subcategories (Atelier Types)");
        }

        // Migrate existing products with subcategories if empty
        const productsToMigrate = await Product.find({ $or: [{ subcategory: { $exists: false } }, { subcategory: "" }] });
        if (productsToMigrate.length > 0) {
          console.log(`Migrating subcategory field for ${productsToMigrate.length} products...`);
          const getProductType = (name) => {
            const n = name.toLowerCase();
            if (n.includes("sofa")) return "sofa";
            if (n.includes("coffee table")) return "coffee-table";
            if (n.includes("side table")) return "side-table";
            if (n.includes("credenza")) return "credenza";
            if (n.includes("table lamp")) return "table-lamp";
            if (n.includes("pendant")) return "pendant-light";
            if (n.includes("sconce")) return "wall-sconce";
            if (n.includes("urn") || n.includes("vase")) return "vase";
            if (n.includes("mirror")) return "mirror";
            if (n.includes("art") || n.includes("canvas")) return "art";
            if (n.includes("throw") || n.includes("rug")) return "textiles";
            if (n.includes("organizer") || n.includes("set")) return "organizer";
            return "";
          };
          for (const p of productsToMigrate) {
            const sub = getProductType(p.name);
            if (sub) {
              p.subcategory = sub;
              await p.save();
            }
          }
          console.log("Subcategory migration complete!");
        }

        // Seed default showcases if the collection is empty
        const showcaseCount = await Showcase.countDocuments();
        if (showcaseCount === 0) {
          const defaultShowcases = [
            {
              handle: "@jules_minimalist",
              image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80",
              space: "Bedroom Suite",
              productName: "Linen Duvet Set",
              productId: "4",
            },
            {
              handle: "@atelier_stone",
              image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=600&q=80",
              space: "Living Corner",
              productName: "Travertine Coffee Table",
              productId: "3",
            },
            {
              handle: "@warm_interiors",
              image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=600&q=80",
              space: "Dining Nook",
              productName: "Travertine Board",
              productId: "6",
            },
            {
              handle: "@clay_studio",
              image: "https://images.unsplash.com/photo-1606744824163-985d376605aa?w=600&q=80",
              space: "Console Shelf",
              productName: "Plaster Vase",
              productId: "2",
            },
          ];
          await Showcase.insertMany(defaultShowcases);
          console.log("Seeded 4 default showcases");
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;