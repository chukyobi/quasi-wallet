import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { setLoginSession } from '../../../lib/auth';
import { parse } from 'cookie';

interface UserData {
  email: string;
  name: string | null; 
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

    const { email, name, hashedPassword, otp, otpExpires } = userData;

    // Validate OTP
    if (otp.trim() !== userData.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (new Date() > otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const user = await prisma.user.create({
      data: {
        email,
        name: name || '', 
        password: hashedPassword,
      },
    });

    const session = {
      email: user.email,
      name: user.name || '',
    };

    if (session.email && typeof session.name === 'string') {
      await setLoginSession(res, session);

      return res.status(200).json({ message: 'User verified and created successfully', user });
    } else {
      return res.status(400).json({ message: 'Invalid session data' });
    }
  } catch (error) {
    console.error('Error verifying OTP or creating user:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
}
