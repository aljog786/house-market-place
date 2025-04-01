import express from "express";
import { 
    registerUserWithSession, 
    verifyOTPAndRegister 
  } from "../controllers/otpController.js";
  
  const router = express.Router();
  
  router.post("/register", registerUserWithSession);
  router.post("/verify-otp", verifyOTPAndRegister);

export default router;
