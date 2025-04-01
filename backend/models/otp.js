import mongoose from 'mongoose';

const otpSchema = mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // OTP expires in 300 seconds (5 minutes)
});

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
