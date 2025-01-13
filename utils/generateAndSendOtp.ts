// utils/generateAndSendOtp.ts
import prisma from "@/lib/prisma";
import sendVerificationEmail from "@/utils/sendVerificationEmail";
import crypto from "crypto";

export async function generateAndSendOtp(email: string) {
  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("User not found");
    }

    // Generate a new OTP
    const otp = crypto.randomInt(10000, 99999).toString();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 30 minutes

    // Update the OTP and expiration time in the database
    await prisma.user.update({
      where: { email },
      data: {
        otp,
        otpExpires,
        isVerified: false, // Ensure the user is not verified until OTP is verified
      },
    });

    // Send the OTP via email
    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) {
      throw new Error("Error sending verification email");
    }

    return { success: true, message: "OTP resent successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate and send OTP");
  }
}
