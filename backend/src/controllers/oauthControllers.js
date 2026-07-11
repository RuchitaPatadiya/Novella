import User from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import { generateToken, migrateLegacyAddress } from "./authControllers.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Authenticate user using Google ID Token
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    // 1. Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    // 2. Find or create user in MongoDB
    let user = await User.findOne({ email });

    if (!user) {
      // Create user with a random password if they don't exist yet
      const randomPassword = Math.random().toString(36).slice(-16);
      user = await User.create({
        name,
        email,
        password: randomPassword,
      });
    }

    // 3. Generate secure cookie token
    generateToken(res, user._id);

    // Auto-migrate legacy address if empty
    const addressesList = await migrateLegacyAddress(user);

    // 4. Send back details
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      addresses: addressesList,
      orders: user.orders,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    });
  } catch (error) {
    res.status(401).json({ message: "Google login failed: " + error.message });
  }
};