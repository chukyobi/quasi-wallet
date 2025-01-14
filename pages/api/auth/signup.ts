import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import sendVerificationEmail from "@/utils/sendVerificationEmail";
import crypto from "crypto";
import { createUserWithWallet } from "@/lib/creatUser";

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  interface SignupRequestBody {
    email: string;
    name: string;
    password: string;
  }

  const { email, name, password }: SignupRequestBody = req.body;

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Resend OTP for verification
        const otp = crypto.randomInt(10000, 99999).toString();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
          where: { email },
          data: { otp, otpExpires },
        });

        const emailSent = await sendVerificationEmail(email, otp);
        if (!emailSent) {
          return res.status(500).json({ message: "Error sending verification email" });
        }

        return res.status(200).json({
          success: true,
          message: "Verification email resent. Please verify your account.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "User already exists. Do you want to sign in?",
      });
    }

    // Hash the password and generate OTP
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = crypto.randomInt(10000, 99999).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Create user, wallet, and backup wallets in a transaction
    await prisma.$transaction(async (prisma) => {
      const result = await createUserWithWallet({
        email,
        name,
        hashedPassword,
      });
    
      if (!result || !result.user) {
        throw new Error("Failed to create user with wallet.");
      }
    
      const { user: createdUser } = result;
    
      // Update user with OTP details
      await prisma.user.update({
        where: { email: createdUser.email },
        data: {
          otp,
          otpExpires,
        },
      });
    });
    

    // Send verification email
    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Error sending verification email" });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully. Verification email sent.",
    });
  } catch (error: any) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
