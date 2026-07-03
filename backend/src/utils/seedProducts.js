const seedProducts = [
  {
    id: 1,
    name: "Atelier Curved Bouclé Sofa",
    category: "furniture",
    price: 68000,
    originalPrice: 75000,
    rating: 4.9,
    reviewsCount: 142,
    badge: "Bestseller",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1000&q=80",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1000&q=80",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1000&q=80"
    ],
    description: "An organic sculptural masterpiece wrapped in luxurious Belgian cream bouclé yarn. Designed with fluid architectural curves, deep supportive seating, and a kiln-dried hardwood frame to elevate your salon or living area.",
    specifications: {
      "Dimensions": "W: 96\" | D: 42\" | H: 30\" | Seat H: 16\"",
      "Material": "Textured Bouclé (Wool-Cotton Blend), Hardwood Frame",
      "Cushion Fill": "High-Density Foam & Duck Down Wrap",
      "Support": "Eight-Way Hand-Tied Springs"
    },
    careInstructions: "Gently vacuum using a soft brush attachment. Professional cleaning recommended for spills. Rotate cushions periodically to preserve fullness.",
    spaces: ["living-room"],
    collections: ["modern-minimalist", "best-sellers", "luxury-living"]
  },
  {
    id: 2,
    name: "Nouveau Plaster Arc Pendant",
    category: "lighting",
    price: 14500,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 96,
    badge: "New",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a35086e84?w=1000&q=80"
    ],
    description: "Inspired by wabi-sabi aesthetics, this pendant light is individually hand-cast in textured white plaster. Its dramatic minimalist dome shape casts a soft, focused pool of light, perfect for illuminating curated dining tables.",
    specifications: {
      "Dimensions": "Dia: 20\" | H: 10\" | Canopy: 5\"",
      "Material": "Hand-Cast Fiber Plaster, Matte Brass hardware",
      "Cord": "78\" Adjustable sand-colored braided fabric cord",
      "Socket": "E27 Base, Max 60W (LED compatible)"
    },
    careInstructions: "Ensure electrical supply is turned off before cleaning. Dust carefully using a dry microfiber cloth. Do not use damp towels or chemical sprays.",
    spaces: ["dining-room", "living-room"],
    collections: ["modern-minimalist", "new-arrivals"]
  },
  {
    id: 3,
    name: "Pillar Travertine Coffee Table",
    category: "furniture",
    price: 32000,
    originalPrice: 38000,
    rating: 4.9,
    reviewsCount: 78,
    badge: "Limited Edition",
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1000&q=80"
    ],
    description: "Sculpted entirely from raw, solid Italian travertine blocks. This coffee table features two heavy cylindrical pillars supporting a thick honed rectangular top, showcasing beautiful, unsealed natural stone veins.",
    specifications: {
      "Dimensions": "W: 48\" | D: 24\" | H: 15\" | Top Thickness: 2\"",
      "Material": "100% Genuine Italian Travertine",
      "Weight": "118 lbs",
      "Finish": "Honed Matte, unsealed to maintain natural stone characteristics"
    },
    careInstructions: "Coasters recommended to prevent staining. Blot spills immediately with water and a soft cloth. Avoid abrasive cleaners or acidic solutions.",
    spaces: ["living-room"],
    collections: ["modern-minimalist", "luxury-living", "best-sellers"]
  },
  {
    id: 4,
    name: "Fluted Terracotta Urn",
    category: "decor-accessories",
    price: 5800,
    originalPrice: 6500,
    rating: 4.7,
    reviewsCount: 114,
    badge: "Trending",
    images: [
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=1000&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1000&q=80"
    ],
    description: "Handcrafted on the wheel by artisans, this fluted terracotta urn brings warm Mediterranean textures to your console. Features beautiful vertical ridges and a natural raw exterior finish with a glazed interior.",
    specifications: {
      "Dimensions": "Dia: 9\" | H: 14\"",
      "Material": "Earthy Terracotta Clay",
      "Glaze": "Clear waterproof interior glaze",
      "Origin": "Handmade in Puglia, Italy"
    },
    careInstructions: "Wipe with a soft dry cloth. Safe for water and fresh stems, but handle with care as it is fragile.",
    spaces: ["living-room", "bedroom", "outdoor"],
    collections: ["boho-chic", "best-sellers"]
  },
  {
    id: 5,
    name: "Asymmetrical Organic Mirror",
    category: "wall-decor",
    price: 11200,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 165,
    badge: "Atelier Choice",
    images: [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=80"
    ],
    description: "An elegant, irregular organic-shaped wall mirror featuring a thin, solid dark oak frame. Its flowing lines reflect light dynamically, working as a functional wall sculpture in entries, bedrooms, or dressing areas.",
    specifications: {
      "Dimensions": "W: 28\" | H: 42\" | Depth: 1.2\"",
      "Material": "Solid White Oak (Dark Walnut Stain), High-Clarity Reflective Glass",
      "Mounting": "Heavy-duty steel wire pre-mounted for vertical or angled hanging"
    },
    careInstructions: "Clean glass surfaces with standard glass cleaner. Dust timber frames with a dry, clean cloth.",
    spaces: ["bedroom", "home-office", "living-room"],
    collections: ["scandinavian", "new-arrivals", "best-sellers"]
  },
  {
    id: 6,
    name: "Alabaster Eclipse Sconce",
    category: "lighting",
    price: 9800,
    originalPrice: null,
    rating: 4.7,
    reviewsCount: 52,
    badge: "New",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a35086e84?w=1000&q=80",
      "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1000&q=80"
    ],
    description: "Carved from a single disc of translucent Spanish alabaster, this sconce diffuses a soft, warm lunar-like glow. Complemented by backplates of solid brushed brass for an elegant, sculptural wall presence.",
    specifications: {
      "Dimensions": "Dia: 8\" | D: 3.5\"",
      "Material": "Solid Spanish Alabaster, Brushed Brass backplate",
      "Light Source": "Integrated G9 warm-white dimmable LED (Included)",
      "Installation": "Hardwired, professional installation required"
    },
    careInstructions: "Clean using a soft, dry microfiber cloth. Do not use water or glass cleaners on porous alabaster.",
    spaces: ["bedroom", "living-room", "dining-room"],
    collections: ["modern-minimalist", "luxury-living", "new-arrivals"]
  },
  {
    id: 7,
    name: "Ribbed Belgian Linen Throw",
    category: "textiles",
    price: 4200,
    originalPrice: 4800,
    rating: 4.8,
    reviewsCount: 88,
    badge: "Sale",
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&q=80",
      "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=1000&q=80"
    ],
    description: "Woven in Belgium from premium organic flax linen yarns. This thick throw features structural ribbed weaves and raw fringe details, providing a luxurious, breathable layer for your bedding or sofa setups.",
    specifications: {
      "Dimensions": "52\" x 76\"",
      "Material": "100% Belgian Flax Linen",
      "Weight": "2.8 lbs",
      "Finishing": "Pre-washed for signature softness"
    },
    careInstructions: "Machine wash cold on a delicate cycle using mild detergent. Tumble dry on low heat or hang dry.",
    spaces: ["bedroom", "living-room", "outdoor"],
    collections: ["scandinavian", "boho-chic"]
  },
  {
    id: 8,
    name: "Travertine Desk Organizer Set",
    category: "decor-accessories",
    price: 3400,
    originalPrice: null,
    rating: 4.6,
    reviewsCount: 39,
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1000&q=80",
      "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=1000&q=80"
    ],
    description: "A three-piece set of desk trays and holders carved from rich, warm-beige Italian travertine. Designed to bring minimalist architectural order to your home studio or executive office workspace.",
    specifications: {
      "Pieces": "1 x Letter Tray, 1 x Pen Holder, 1 x Card Cup",
      "Material": "Solid Italian Travertine Stone",
      "Weight Set": "5.6 lbs"
    },
    careInstructions: "Wipe with a soft dry cloth. Keep away from inks and oils to prevent staining.",
    spaces: ["home-office"],
    collections: ["luxury-living", "best-sellers"]
  },
  {
    id: 9,
    name: "Monolithic Concrete Side Table",
    category: "furniture",
    price: 16500,
    originalPrice: 19800,
    rating: 4.7,
    reviewsCount: 63,
    badge: "Trending",
    images: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1000&q=80",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1000&q=80"
    ],
    description: "An industrial-chic side table cast in solid fiber-reinforced concrete. It features a tapered cylindrical body with a smooth, hand-finished surface, making it suitable for both indoor salons and outdoor terrace gardens.",
    specifications: {
      "Dimensions": "Dia: 15\" | H: 18\"",
      "Material": "Fiber-Reinforced Structural Concrete",
      "Weight": "38 lbs",
      "Protector": "Non-slip rubber pads pre-applied under base"
    },
    careInstructions: "Clean with mild soapy water. Cover during harsh winter months if kept outdoors.",
    spaces: ["outdoor", "living-room"],
    collections: ["boho-chic", "scandinavian"]
  },
  {
    id: 10,
    name: "Plaster Wabi-Sabi Table Lamp",
    category: "lighting",
    price: 7800,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 110,
    badge: "Best Seller",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a35086e84?w=1000&q=80",
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&q=80"
    ],
    description: "Handcrafted using concrete and coarse plaster, this bedside table lamp features a tactile, cratered surface reminiscent of rocky cliffs. Finished with an organic linen drum shade for soft, calming light.",
    specifications: {
      "Dimensions": "Total H: 22\" | Shade Dia: 12\" | Base Dia: 6\"",
      "Material": "Textured Plaster Base, 100% Belgian Linen Shade",
      "Bulb Type": "E26 socket, Max 40W (Dimmable LED recommended)"
    },
    careInstructions: "Unplug before dusting. Dust the plaster base with a soft dry brush; clean linen shade with a lint roller.",
    spaces: ["bedroom", "home-office", "living-room"],
    collections: ["scandinavian", "best-sellers", "boho-chic"]
  },
  {
    id: 11,
    name: "Abstract Earth Canvas Art",
    category: "wall-decor",
    price: 12500,
    originalPrice: 15000,
    rating: 4.8,
    reviewsCount: 82,
    badge: "Sale",
    images: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1000&q=80",
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000&q=80"
    ],
    description: "An evocative abstract print on museum-grade canvas, featuring layered earth tones of sand, charcoal, and ochre. Stretched manually over solid timber stretcher bars and framed in raw oak.",
    specifications: {
      "Dimensions": "W: 30\" | H: 40\" | Frame Depth: 2\"",
      "Material": "Archival Giclée ink, Fine Cotton Canvas, Solid Oak frame",
      "Mounts": "Heavy-duty wire pre-installed on backing"
    },
    careInstructions: "Dust periodically with a clean, dry, lint-free cloth. Do not mount in high-humidity areas.",
    spaces: ["living-room", "home-office", "bedroom"],
    collections: ["boho-chic", "new-arrivals"]
  },
  {
    id: 12,
    name: "Solid Walnut Credenza",
    category: "furniture",
    price: 74000,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 45,
    badge: "Masterpiece",
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1000&q=80",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1000&q=80"
    ],
    description: "Meticulously built in solid European walnut. This credenza displays stunning continuous grain matching across the three soft-close cabinet doors. Features minimalist recessed pulls and slender tapered legs.",
    specifications: {
      "Dimensions": "W: 72\" | D: 18\" | H: 30\" (Interior shelves adjustable)",
      "Material": "Solid Premium European Walnut, Walnut Veneer backing",
      "Hardware": "German soft-close hinges"
    },
    careInstructions: "Use coasters and heat-resistant pads. Clean with a damp microfiber cloth and wipe dry immediately. Apply oil conditioner twice a year.",
    spaces: ["dining-room", "living-room", "home-office"],
    collections: ["modern-minimalist", "luxury-living"]
  }
];

export default seedProducts;
