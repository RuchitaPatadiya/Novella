import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Helper: Generate JSON Web Token and set it in a secure Cookie
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token is valid for 30 days
  });

  // Attach token to an HTTP-Only cookie in the browser
  res.cookie("token", token, {
    httpOnly: true, // Prevents browser JavaScript from reading the token (protects against XSS attacks)
    secure: process.env.NODE_ENV !== "development", // Uses secure HTTPS connections in production
    sameSite: "strict", // Blocks cross-site request forgery (CSRF attacks)
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // 2. Create the user in MongoDB (the password is automatically hashed by our pre-save hook!)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // 3. Generate token & set cookie
      generateToken(res, user._id);

      // 4. Send back user details (excluding password)
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        orders: user.orders,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    res.status(500).json({ message: "Registration failed. " + error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });

    // 2. Verify user exists and check password hash
    if (user && (await user.comparePassword(password))) {
      // 3. Generate token & set cookie
      generateToken(res, user._id);

      res.status(200).json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        orders: user.orders,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed. " + error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Protected/Public
export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set cookie expiry to the past, clearing it instantly
  });
  res.status(200).json({ message: "Logged out successfully." });
};

// @desc    Get user profile details
// @route   GET /api/auth/profile
// @access  Protected
export const getUserProfile = async (req, res) => {
  // req.user will be pre-loaded by our authMiddleware in the next step
  if (req.user) {
    res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      address: req.user.address,
      orders: req.user.orders,
      isAdmin: req.user.isAdmin,
      createdAt: req.user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  } else {
    res.status(404).json({ message: "User not found." });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Protected
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update fields if they are sent in request body, else keep current database values
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      user.address = req.body.address !== undefined ? req.body.address : user.address;
      user.orders = req.body.orders || user.orders;

      // If user is also changing password
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.status(200).json({
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        orders: updatedUser.orders,
        isAdmin: updatedUser.isAdmin,
        createdAt: updatedUser.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile. " + error.message });
  }
};