import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import sendVerificationEmail from '@/utils/sendVerificationEmail';
import crypto from 'crypto';

export default async function resendOtp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a new OTP
    const otp = crypto.randomInt(10000, 99999).toString();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); // OTP expires in 15 minutes

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
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    // Respond with success
    res.status(200).json({
      message: 'OTP resent successfully. Please check your email.',
    });
  } catch (error: any) {
    console.error('Error in resendOtp API:', error);
    return res.status(500).json({
      message: 'Internal server error. Failed to resend OTP.',
    });
  }
}
