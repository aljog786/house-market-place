// hmp-main/backend/controllers/otpController.js
import OTP from "../models/otp.js";
import nodemailer from "nodemailer";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

// Helper to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Function to send email using nodemailer
const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
  };
  await transporter.sendMail(mailOptions);
};

/**
 * POST /auth/register
 * Receives registration details, stores them in session, sends an OTP.
 */
export const registerUserWithSession = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  // Check if a user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  // Save registration details in session
  req.session.registration = { name, email, password };

  // Generate OTP and save it in DB (it expires after 5 minutes)
  const otp = generateOTP();
  await OTP.create({ email, otp });
  
  // Send OTP email
  await sendEmail(email, otp);

  res.status(200).json({ message: "OTP sent to your email" });
});

/**
 * POST /auth/verify-otp
 * Receives the OTP from the client, verifies it, and if valid, creates the user.
 */
export const verifyOTPAndRegister = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  
  // Check if registration data exists in session
  if (!req.session.registration) {
    res.status(400);
    throw new Error("Registration data not found in session. Please restart the registration process.");
  }
  
  const { email, name, password } = req.session.registration;

  // Verify OTP from the database
  const validOTP = await OTP.findOne({ email, otp });
  if (!validOTP) {
    res.status(400);
    throw new Error("Invalid OTP or OTP has expired");
  }
  
  // Remove OTP record to prevent reuse
  await OTP.deleteOne({ email });

  // Create the new user (assuming password hashing is done via pre-save middleware)
  const user = await User.create({ name, email, password });
  if (!user) {
    res.status(400);
    throw new Error("User creation failed");
  }
  
  // Generate JWT token for the new user
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set token as a cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  // Clear registration data from session
  req.session.registration = null;

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});
