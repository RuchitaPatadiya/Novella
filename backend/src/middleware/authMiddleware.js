import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Read the JWT token from the secure browser cookies
  token = req.cookies.token;

  if (token) {
    try {
      // Decode and verify the token signature
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the decoded ID (exclude their password hash)
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user record not found." });
      }

      // Everything checks out! Call next() to proceed to the controller
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(401).json({ message: "Not authorized, token validation failed." });
    }
  } else {
    res.status(401).json({ message: "Not authorized, login session token not found." });
  }
};

// Admin middleware: checks if req.user has administrator privileges
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access Denied: Atelier Administrator credentials required." });
  }
};