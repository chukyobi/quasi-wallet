import { NextApiRequest, NextApiResponse } from 'next';
import prisma  from "@/lib/prisma";  // adjust path to your Prisma client import

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, walletId } = req.query;

  try {
    // Ensure userId is a string (it could be string[] if multiple query parameters are passed)
    const userEmail = Array.isArray(userId) ? userId[0] : userId;

    // Ensure walletId is a number (parseInt will return NaN if not valid)
    const walletIdNum = parseInt(walletId as string);

    if (!userEmail || isNaN(walletIdNum)) {
      return res.status(400).json({ error: "Invalid userId or walletId" });
    }

    // Query the BackupWallet by email (userId) and walletId
    const wallet = await prisma.backupWallet.findFirst({
      where: {
        email: userEmail,  // Safely pass the email as string
        id: walletIdNum,   // Pass walletId as a number
      },
    });

    if (wallet) {
      // If wallet exists, check for a public address
      if (wallet.publicAddress) {
        return res.status(200).json({ publicAddress: wallet.publicAddress });
      } else {
        return res.status(200).json({ publicAddress: null });
      }
    } else {
      return res.status(404).json({ error: "Wallet not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
