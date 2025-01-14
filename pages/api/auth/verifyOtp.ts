import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function verifyOtp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ message: "OTP and email are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (otp.trim() !== user.otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (user.otpExpires && new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired." });
    }

    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User verified successfully. Redirecting to login.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
