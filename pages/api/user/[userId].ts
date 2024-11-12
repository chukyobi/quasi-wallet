import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; 

  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    // Fetch the user by email
    const user = await prisma.user.findUnique({
      where: { email: userId as string },
      select: { name: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ name: user.name });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ message: 'Error fetching user data' });
  }
}
