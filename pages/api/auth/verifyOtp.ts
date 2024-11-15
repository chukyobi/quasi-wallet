
import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';
import { createUserWithWallet } from '../../../lib/creatUser'; 

interface UserData {
  email: string;
  name: string;
  hashedPassword: string;
  otpExpires: Date;
  otp: string;
}

export default async function verifyOtp(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  try {
    // Parse cookie data
    const cookies = parse(req.headers.cookie || '');
    const userData: UserData | null = cookies.userData ? JSON.parse(cookies.userData) : null;

    if (!userData) {
      return res.status(400).json({ message: 'Invalid or missing user data' });
    }

    const { email, name, hashedPassword, otp: storedOtp, otpExpires } = userData;

    // Validate OTP
    if (otp.trim() !== storedOtp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Create user and wallet using the createUserWithWallet function
    await createUserWithWallet({
      email,
      name,
      hashedPassword,
    });

    // User and wallet are created, NextAuth will automatically handle the session.
    // Return a success response with a redirect URL.
    return res.status(200).json({
      message: 'User verified and created successfully',
      redirectUrl: '/dashboard', // Provide a URL to redirect after success
    });
  } catch (error) {
    console.error('Error verifying OTP or creating user:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
