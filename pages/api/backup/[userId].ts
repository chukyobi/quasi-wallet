import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; 

  console.log("Received userId (as email):", userId);

  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ message: "Invalid userId" });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
   
    const user = await prisma.user.findUnique({
      where: { email: userId },
      include: { backupWallets: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const backupWallets = user.backupWallets;  

 
    if (!backupWallets || backupWallets.length === 0) {
      return res.status(404).json({ message: "No backup wallets found" });
    }
    return res.status(200).json({ wallets: backupWallets });
  } catch (error) {
    console.error("Error fetching backup wallets:", error);
    return res.status(500).json({ message: "Error fetching backup wallets" });
  }
}
