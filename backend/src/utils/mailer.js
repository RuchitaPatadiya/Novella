import nodemailer from "nodemailer";
import dns from "dns";

// Configure nodemailer transporter using Gmail SMTP with forced IPv4 DNS lookup
const transporter = nodemailer.createTransport({
  service: "gmail",
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { ...options, family: 4 }, callback);
  },
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;
