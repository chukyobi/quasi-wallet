import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '../../../lib/prisma';
import sendVerificationEmail from '../../../utils/sendVerificationEmail';
import crypto from 'crypto';
import { serialize } from 'cookie';

export default async function signup(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, name, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Generate OTP and expiration time
    const otp = crypto.randomInt(10000, 99999).toString();
    const otpExpires = new Date(Date.now() + 30 * 60 * 1000); 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user data object
    const userData = {
      email,
      name,
      hashedPassword,
      otp,
      otpExpires,
    };

    // Serialize user data to a secure cookie
    const cookie = serialize('userData', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict', 
      maxAge: 30 * 60, 
      path: '/', 
    });

    res.setHeader('Set-Cookie', cookie);

    // Send the verification email
    const emailSent = await sendVerificationEmail(email, otp);
    if (!emailSent) {
      return res.status(500).json({ message: 'Error sending verification email' });
    }

    res.status(201).json({ message: 'OTP sent for verification' });
    
  } catch (error) {
    console.error('Error in signup:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';

    res.status(500).json({ message: errorMessage });
  }
}