import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; 
  const { publicAddress, walletName, seedPhrase, privateKey, qrCodeData } = req.body;

  if (req.method !== 'PUT') { // Changed to 'PUT' for update operation
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

    // Check if a backup wallet already exists for this user with the given wallet name
    const existingWallet = await prisma.backupWallet.findFirst({
      where: {
        email: userId as string,
        name: walletName,
      },
    });

    if (!existingWallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Update the existing wallet with the new data
    const updatedBackupWallet = await prisma.backupWallet.update({
      where: { id: existingWallet.id }, // Use the unique identifier of the wallet
      data: {
        publicAddress,
        seedPhrase, // Ensure you handle this securely (e.g., encrypt it before saving)
        privateKey, // Ensure you handle this securely (e.g., encrypt it before saving)
        qrCodeData,
      },
    });

    return res.status(200).json({ message: 'Wallet data updated successfully', updatedBackupWallet });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
