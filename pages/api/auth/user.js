import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next'; // Importing types
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  // Check if the session exists and if the user is defined
  if (!session || !session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Now we can safely access session.user.id
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }, // Accessing user ID
      select: {
        name: true,
       
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
}
