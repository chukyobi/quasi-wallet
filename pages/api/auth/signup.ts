import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "../../../lib/prisma";
import sendVerificationEmail from "../../../utils/sendVerificationEmail";
import crypto from "crypto";

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Define types for request body (Optional but good practice for TypeScript)
  interface SignupRequestBody {
    email: string;
    name: string;
    password: string;
  }

  const { email, name, password }: SignupRequestBody = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(10000, 99999).toString();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes

    // Create the user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        isVerified: false,
        otp,          
        otpExpires,    
      },
    });

    // Send the verification email
    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) {
      // Handle failure in sending email
      return res.status(500).json({ message: "Error sending verification email" });
    }

    res.status(201).json({
      message: "User created successfully. Verification email sent.",
      user: { email: newUser.email, name: newUser.name },
    });
  } catch (error: any) {
    // Improved error handling
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
