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
  },
  {
    id: 13,
    name: "Japanese Oak Dining Table",
    category: "furniture",
    price: 84000,
    originalPrice: 92000,
    rating: 0,
    reviewsCount: 0,
    badge: "New",
    images: [
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=1000&q=80",
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1000&q=80"
    ],
    description: "Crafted from sustainable Japanese white oak, this dining table marries clean Scandinavian lines with raw Japanese wabi-sabi edge profiles. Hand-finished in a light matte oil to expose natural grain patterns.",
    specifications: {
      "Dimensions": "W: 84\" | D: 38\" | H: 30\"",
      "Material": "Solid Japanese White Oak",
      "Finish": "Natural Organic Matte Oil"
    },
    careInstructions: "Wipe with a damp cloth. Avoid harsh chemicals. Apply wood wax every 6 months to nourish the oak.",
    spaces: ["dining-room"],
    collections: ["wabi-sabi", "new-arrivals", "luxury-living"]
  },
  {
    id: 14,
    name: "Bouclé Lounge Armchair",
    category: "furniture",
    price: 29000,
    originalPrice: null,
    rating: 0,
    reviewsCount: 0,
    badge: "Bestseller",
    images: [
      "https://images.unsplash.com/photo-1598191383426-abf20c159816?w=1000&q=80",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1000&q=80"
    ],
    description: "The ultimate accent seat for your bedroom sanctuary or lounge. Draped in high-pile Belgian bouclé wool, featuring a low-slung contoured back and concealed swivel base for seamless rotation.",
    specifications: {
      "Dimensions": "W: 32\" | D: 34\" | H: 28\"",
      "Material": "High-Pile Bouclé (70% Wool, 30% Acrylic)",
      "Frame": "Reinforced Solid Pine"
    },
    careInstructions: "Professional upholstery cleaning recommended. Blot liquid stains immediately with a clean, dry cloth.",
    spaces: ["living-room", "bedroom"],
    collections: ["modern-minimalist", "best-sellers"]
  },
  {
    id: 15,
    name: "Travertine Arch Table Lamp",
    category: "lighting",
    price: 18500,
    originalPrice: 21000,
    rating: 0,
    reviewsCount: 0,
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1000&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1000&q=80"
    ],
    description: "Carved from a single block of natural beige travertine, this lamp features a bold geometric arch design. Finished with an organic raw linen shade that diffuses a warm, atmospheric glow.",
    specifications: {
      "Dimensions": "W: 12\" | H: 22\" | Depth: 6\"",
      "Material": "Honed Italian Travertine & Natural Linen Shade",
      "Socket": "E27, max 40W (LED compatible)"
    },
    careInstructions: "Wipe base with a dry microfiber cloth. Avoid getting moisture on the unsealed travertine stone.",
    spaces: ["living-room", "bedroom", "home-office"],
    collections: ["luxury-living", "wabi-sabi"]
  },
  {
    id: 16,
    name: "Brass Ocular Pendant Light",
    category: "lighting",
    price: 22000,
    originalPrice: 25000,
    rating: 0,
    reviewsCount: 0,
    badge: "Limited Edition",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a35086e84?w=1000&q=80"
    ],
    description: "A minimalist masterpiece crafted from solid hand-spun brass with a brushed, unlacquered finish that will develop a rich natural patina over time. Houses a frosted glass orb that casts even, glare-free light.",
    specifications: {
      "Dimensions": "Diameter: 16\" | Adjustable Cord: 60\"",
      "Material": "Spun Brass & Frosted White Glass",
      "Voltage": "220-240V"
    },
    careInstructions: "Dust lightly with a dry feather duster. Do not use metal polish unless you wish to remove the natural aged patina.",
    spaces: ["dining-room", "living-room"],
    collections: ["modern-minimalist", "luxury-living"]
  },
  {
    id: 17,
    name: "Ceramic Totem Sculpture",
    category: "decor-accessories",
    price: 8500,
    originalPrice: null,
    rating: 0,
    reviewsCount: 0,
    badge: null,
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=1000&q=80"
    ],
    description: "A hand-thrown ceramic sculpture composed of interlocking geometric clay totems. Finished in a textured, volcanic sand glaze that mimics the weathered stones of the Mediterranean coast.",
    specifications: {
      "Dimensions": "W: 6\" | H: 18\"",
      "Material": "Stoneware Clay",
      "Glaze": "Volcanic Matte White Sand"
    },
    careInstructions: "Wipe clean with a dry cloth. Handle with care as this piece is delicate and unglazed on the bottom.",
    spaces: ["living-room", "home-office", "bedroom"],
    collections: ["wabi-sabi", "new-arrivals"]
  },
  {
    id: 18,
    name: "Washed Silk Velvet Cushion",
    category: "textiles",
    price: 4500,
    originalPrice: 5500,
    rating: 0,
    reviewsCount: 0,
    badge: "Bestseller",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e6?w=1000&q=80"
    ],
    description: "Luxuriously heavy washed silk velvet cushions featuring a raw flanged edge. Garment-dyed in small batches for subtle variations in shade, offering unmatched softness and organic elegance.",
    specifications: {
      "Dimensions": "20\" x 20\"",
      "Material": "80% Silk, 20% Cotton Velvet",
      "Insert": "90% Duck Feather, 10% Down Fill"
    },
    careInstructions: "Dry clean only. Plump cushions regularly to maintain loft and shape.",
    spaces: ["living-room", "bedroom"],
    collections: ["modern-minimalist", "best-sellers"]
  }
];

export default seedProducts;
