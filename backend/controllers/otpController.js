import OTP from "../models/otp.js";
import nodemailer from "nodemailer";
import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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

export const registerUserWithSession = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  req.session.registration = { name, email, password };

  const otp = generateOTP();
  await OTP.create({ email, otp });
  
  await sendEmail(email, otp);

  res.status(200).json({ message: "OTP sent to your email" });
});

export const verifyOTPAndRegister = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  
  if (!req.session.registration) {
    res.status(400);
    throw new Error("Registration data not found in session. Please restart the registration process.");
  }
  
  const { email, name, password } = req.session.registration;

  const validOTP = await OTP.findOne({ email, otp });
  if (!validOTP) {
    res.status(400);
    throw new Error("Invalid OTP or OTP has expired");
  }
  
  await OTP.deleteOne({ email });

  const user = await User.create({ name, email, password });
  if (!user) {
    res.status(400);
    throw new Error("User creation failed");
  }
  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  req.session.registration = null;

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token,
  });
});
