import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Assuming prisma is set up in this file

type Wallet = {
  id: string;
  name: string;
  publicAddress: string;
  logo?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query; // userId will be the email passed as part of the URL

  if (req.method === "GET") {
    try {
      // Query the BackupWallet table using Prisma to get wallets for the user
      const wallets = await prisma.backupWallet.findMany({
        where: {
          email: userId as string, // Ensure userId is the email
        },
        select: {
          id: true,
          name: true,
          publicAddress: true,
          logo: true,
        },
      });

      // Filter wallets to only return those with a publicAddress
      const walletsWithPublicAddress = wallets.filter((wallet) => wallet.publicAddress);

      return res.status(200).json(walletsWithPublicAddress);
    } catch (error) {
      console.error("Error fetching wallets:", error);
      return res.status(500).json({ error: "Failed to fetch wallets" });
    }
  } else {
    // Handle unsupported request method
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
