import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; 
  const { publicAddress, balance, walletName } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Find the user by email (userId)
    const user = await prisma.user.findUnique({
      where: { email: userId as string },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if a wallet with the given name exists for this user
    const existingWallet = await prisma.backupWallet.findFirst({
      where: {
        name: walletName,
        user: {
          email: userId as string, 
        },
      },
    });

    if (existingWallet) {
      // Update the existing wallet
      const updatedWallet = await prisma.backupWallet.update({
        where: { id: existingWallet.id }, 
        data: {
          publicAddress,
          balance,
          currency: 'ETH', 
          updatedAt: new Date(),
        },
      });

      return res.status(200).json(updatedWallet);
    } else {

    }
  } catch (error) {
    console.error('Error saving wallet data:', error);
    return res.status(500).json({ error: 'Failed to store wallet data' });
  }
}
