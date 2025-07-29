// src/modules/otp/otp.routes.ts
import express from "express";
import { OTPController } from "./otp.controller";

const router = express.Router();

router.post("/send", OTPController.sendOTP); // otp will be generated and stored in redis and then will be sent to email 
router.post("/verify", OTPController.verifyOTP);
// when a user uses the otp this route will verify the otp taking from the redis and compare .
//  if otp matches we will make isVerified true 

export const OtpRoutes = router;