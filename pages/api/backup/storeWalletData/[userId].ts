import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; 
  const { publicAddress, walletName, seedPhrase, privateKey, qrCodeData } = req.body;

  if (req.method !== 'PUT') { // Ensure the method is 'PUT' for update operations
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate that publicAddress is provided
    if (!publicAddress) {
      return res.status(400).json({ error: 'Public address is required.' });
    }

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

    // Prepare the update data object
    const updateData: Record<string, any> = {
      publicAddress, // Required field
    };

    // Add optional fields if provided
    if (seedPhrase) {
      updateData.seedPhrase = seedPhrase; // Ensure secure handling if saving sensitive data
    }
    if (privateKey) {
      updateData.privateKey = privateKey; // Ensure secure handling if saving sensitive data
    }
    if (qrCodeData) {
      updateData.qrCodeData = qrCodeData;
    }

    // Update the existing wallet with the new data
    const updatedBackupWallet = await prisma.backupWallet.update({
      where: { id: existingWallet.id }, // Use the unique identifier of the wallet
      data: updateData,
    });

    return res.status(200).json({ message: 'Wallet data updated successfully', updatedBackupWallet });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
