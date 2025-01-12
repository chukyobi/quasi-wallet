import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; 

export default async function verifyOtp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { otp, email } = req.body;

  if (!otp || !email) {
    return res.status(400).json({ message: 'OTP and email are required' });
  }

  try {
    // Retrieve the user from the database using email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP matches
    if (otp.trim() !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if the OTP has expired, ensuring otpExpires is not null
    if (user.otpExpires && new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Update the user as verified (set isVerified to true)
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true, 
        otp: null, 
        otpExpires: null, 
      },
    });

    // Return success response
    return res.status(200).json({
      success:true,
      message: 'User verified successfully',
      
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Something went wrong' 
    });
  }
}
