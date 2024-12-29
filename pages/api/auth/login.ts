import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; 
import bcrypt from 'bcryptjs'; 
import { sign } from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the password is valid (make sure user.password is not null)
    if (!user.password) {
      return NextResponse.json({ error: 'Password not set' }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    // Create a JWT token
    const token = sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!, // Ensure this environment variable is set correctly
      { expiresIn: '1h' }
    );

    // Respond with the token and user info
    return NextResponse.json({ token, user }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
