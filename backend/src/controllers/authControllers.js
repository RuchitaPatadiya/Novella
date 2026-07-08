import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import transporter from "../utils/mailer.js";

// Helper: Generate JSON Web Token and set it in a secure Cookie
export const generateToken = (res, userId) => {
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

  // Validate password complexity
  const passwordError = (() => {
    if (!password || password.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character (e.g. !, @, #, $, %).";
    return null;
  })();

  if (passwordError) {
    return res.status(400).json({ message: passwordError });
  }

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
    secure: process.env.NODE_ENV !== "development", // Uses secure HTTPS connections in production
    sameSite: "strict", // Blocks cross-site request forgery (CSRF attacks)
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



// @desc    Generate password reset token and send actual email via Gmail SMTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set it in schema (expires in 10 minutes)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log(`\n=================================================`);
    console.log(`[PASSWORD RESET REQUEST RECEIVED]`);
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log(`=================================================\n`);

    // Setup email data
    const mailOptions = {
      from: `"Novella Atelier" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Password Reset Request - Novella",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 32px; border-radius: 4px; background-color: #ffffff;">
          <h2 style="font-size: 20px; font-weight: 300; color: #111827; text-align: center; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Novella Atelier</h2>
          <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 20px;">Hello ${user.name},</p>
          <p style="font-size: 13px; color: #4b5563; line-height: 1.6; margin-bottom: 24px;">We received a request to reset the password for your account. Click the button below to proceed. This link will expire in 10 minutes.</p>
          <div style="text-align: center; margin-bottom: 28px;">
            <a href="${resetUrl}" style="background-color: #111827; color: #f9fafb; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-weight: 500; text-decoration: none; padding: 14px 28px; border-radius: 2px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 11px; color: #9ca3af; line-height: 1.6; margin-bottom: 8px;">If you did not request this, you can safely ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
          <p style="font-size: 10px; color: #9ca3af; text-align: center;">Novella Co. premium home design atelier.</p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "A password reset link has been sent to your email inbox." });
  } catch (error) {
    res.status(500).json({ message: "Request failed: " + error.message });
  }
};

// @desc    Verify reset token & update password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash incoming token to match database record
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with matching token and valid expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired password reset token." });
    }

    // Set new password (will be hashed automatically by pre-save hook)
    user.password = password;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;

    await user.save();

    res.status(200).json({ message: "Your password has been updated successfully. Please log in." });
  } catch (error) {
    res.status(500).json({ message: "Failed to reset password: " + error.message });
  }
};

// @desc    Get user address book
// @route   GET /api/auth/profile/addresses
// @access  Protected
export const getUserAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user.addresses || []);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses: " + error.message });
  }
};

// @desc    Add a saved address to profile
// @route   POST /api/auth/profile/addresses
// @access  Protected
export const addUserAddress = async (req, res) => {
  const { name, street, apartment, city, state, zipCode, phone, isDefault } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create address item
    const newAddress = {
      name,
      street,
      apartment,
      city,
      state,
      zipCode,
      phone,
      isDefault: !!isDefault
    };

    // If marked as default, clear any other defaults
    if (newAddress.isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(newAddress);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to add address: " + error.message });
  }
};

// @desc    Delete a saved address
// @route   DELETE /api/auth/profile/addresses/:addressId
// @access  Protected
export const deleteUserAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address: " + error.message });
  }
};