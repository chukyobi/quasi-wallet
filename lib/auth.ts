import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';
import { NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET;

interface Session {
    email: string;
    name: string;
    id: string | number;  
}
export async function setLoginSession(session: Session) {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined. Please set it in your environment variables.');
    }

    const token = jwt.sign(session, JWT_SECRET, { expiresIn: '1h' });

    // Set the cookie to expire in 1 week
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7); // Set expiration to 7 days from now

    // Directly handle the cookie setting
    const cookie = serialize('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        expires: oneWeekFromNow,
    });

    // Return the cookie to be set in the response in the next part of the app
    return cookie;
}
