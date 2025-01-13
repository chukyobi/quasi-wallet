import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { createUserWithWallet } from '@/lib/creatUser';

export default async function verifyOtp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ message: 'OTP and email are required.' });
  }

  try {
    // Retrieve the user from the database using email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the OTP matches
    if (otp.trim() !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    // Check if the OTP has expired
    if (user.otpExpires && new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired.' });
    }

    // Update the user as verified
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        otp: null,
        otpExpires: null,
      },
    });

    // If the user is verified, proceed to create the wallet and backup wallets
    const { user: updatedUser } = await createUserWithWallet({
      email: user.email,
      name: user.name,
      hashedPassword: user.password || "",  
    });

    
    return res.status(200).json({
      success: true,
      message: 'User verified successfully and wallet created.',
      user: {
        email: updatedUser?.email,
        name: updatedUser?.name,
        wallets: updatedUser?.wallets,
        backupWallets: updatedUser?.backupWallets,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong.',
    });
  }
}
