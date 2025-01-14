import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signIn } from "next-auth/react";  
import { generateAndSendOtp } from "@/utils/generateAndSendOtp";

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  interface LoginRequestBody {
    email: string;
    password: string;
  }

  const { email, password }: LoginRequestBody = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please sign up first.",
      });
    }

    // Check if the user is unverified
    if (!user.isVerified) {
      await generateAndSendOtp(email); // Trigger OTP resend logic
      return res.status(400).json({
        success: false,
        message: "Your email is not verified. A new OTP has been sent to your email.",
        actionRequired: "verifyEmail",
      });
    }

    // Ensure the password is not null
    if (!user.password) {
      return res.status(500).json({
        success: false,
        message: "Password is missing for this user.",
      });
    }

    // Compare the password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password.",
      });
    }

    // Use NextAuth's signIn to create a session
    const result = await signIn("credentials", {
      email: user.email,
      password, // Include the password for signIn
      redirect: false, // Prevent automatic redirection
    });

    if (result?.error) {
      return res.status(401).json({
        success: false,
        message: result.error,
      });
    }

    // Login successful, return user details
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { email: user.email, name: user.name },
    });
  } catch (error: any) {
    console.error("Error in login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
