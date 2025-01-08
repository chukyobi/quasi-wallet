import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import sendVerificationEmail from "@/utils/sendVerificationEmail";
import crypto from "crypto";

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
    // Check if user already exists and is not verified
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // User exists but is not verified - generate and send new OTP
        const otp = crypto.randomInt(10000, 99999).toString();
        const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes

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

      // User exists and is verified
      return res.status(400).json({
        success: false,
        message: "User already exists. Do you want to sign in?",
      });
    }

    // User does not exist - create new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = crypto.randomInt(10000, 99999).toString();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes

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

    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: "Error sending verification email" });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully. Verification email sent.",
      user: { email: newUser.email, name: newUser.name },
    });
  } catch (error: any) {
    console.error("Error in signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
