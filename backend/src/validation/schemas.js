import Joi from "joi";

// Helper for strong password complexity validation rule
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

// 1. User Registration Schema
export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters.",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
  }),
  password: Joi.string().regex(passwordPattern).required().messages({
    "string.empty": "Password is required.",
    "string.pattern.base": "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special symbol.",
  }),
});

// 2. User Login Schema
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
  }),
});

// 3. Product Create / Update Schema
export const productSchema = Joi.object({
  id: Joi.number().integer().positive().optional(),
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Product name is required.",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "Price must be a number.",
    "number.positive": "Price must be a positive amount.",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category is required.",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be an integer.",
    "number.min": "Stock cannot be negative.",
  }),
  description: Joi.string().allow("").optional(),
  careInstructions: Joi.string().allow("").optional(),
  images: Joi.array().items(Joi.string()).optional(),
  dimensions: Joi.string().allow("").optional(),
  material: Joi.string().allow("").optional(),
  color: Joi.string().allow("").optional(),
  space: Joi.string().allow("").optional(),
  collectionType: Joi.string().allow("").optional(),
});

// 4. Order Creation Schema
export const orderSchema = Joi.object({
  orderId: Joi.string().required(),
  date: Joi.string().required(),
  products: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().integer().positive().required(),
      color: Joi.string().allow("").optional(),
      size: Joi.string().allow("").optional(),
      image: Joi.string().allow("").optional(),
    })
  ).min(1).required().messages({
    "array.min": "An order must contain at least 1 product.",
  }),
  shippingDetails: Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Recipient name is required.",
    }),
    address: Joi.object({
      street: Joi.string().required().messages({
        "string.empty": "Street address is required.",
      }),
      apartment: Joi.string().allow("").optional(),
      city: Joi.string().required().messages({
        "string.empty": "City is required.",
      }),
      state: Joi.string().required().messages({
        "string.empty": "State is required.",
      }),
      zipCode: Joi.string().required().messages({
        "string.empty": "ZIP/Postal code is required.",
      }),
    }).required(),
    phone: Joi.string().required().messages({
      "string.empty": "Phone number is required.",
    }),
    method: Joi.string().valid("standard", "express").required(),
  }).required(),
  paymentDetails: Joi.object({
    method: Joi.string().allow("").optional(),
    razorpayPaymentId: Joi.string().allow("").optional(),
    razorpayOrderId: Joi.string().allow("").optional(),
    razorpaySignature: Joi.string().allow("").optional(),
  }).optional(),
  pricingBreakdown: Joi.object({
    subtotal: Joi.number().min(0).required(),
    discount: Joi.number().min(0).required(),
    shipping: Joi.number().min(0).required(),
    total: Joi.number().min(0).required(),
    promoCode: Joi.string().allow(null, "").optional(),
  }).required(),
});

// 5. Razorpay Lightweight Order Init Schema
export const razorpayOrderSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
      quantity: Joi.number().integer().positive().required(),
      color: Joi.string().allow("").optional(),
      size: Joi.string().allow("").optional(),
      image: Joi.string().allow("").optional(),
    })
  ).min(1).required(),
  shippingDetails: Joi.object({
    method: Joi.string().valid("standard", "express").required(),
  }).required(),
  pricingBreakdown: Joi.object({
    promoCode: Joi.string().allow(null, "").optional(),
  }).optional(),
});
