import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; // userId is obtained from the query parameters

  console.log("Received userId (as email):", userId);

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: "Invalid userId" });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Find the user based on their email and include their wallets
    const user = await prisma.user.findUnique({
      where: { email: userId },
      include: { wallets: true },
    });

    if (!user) {
      console.log(`No user found with email: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Assuming the first wallet is desired if multiple wallets exist
    const wallet = user.wallets[0];

    if (!wallet) {
      console.log(`No wallet found for user with email: ${userId}`);
      return res.status(404).json({ message: "Wallet not found" });
    }

    // Return the wallet balance
    return res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    return res.status(500).json({ message: "Error fetching wallet data" });
  }
}
