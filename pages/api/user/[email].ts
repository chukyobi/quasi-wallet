import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

// Define the types for the response data
interface UserProfile {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  wallets: {
    id: number;
    walletId: string;  // Unique identifier for the wallet
    balance: number;
    currency: string;  // Currency type (e.g., BTC, ETH)
  }[];
  backupWallets: {
    id: number;
    name: string;      // Wallet name (e.g., Metamask, Binance)
    balance: number;
    currency: string;  // Currency type (e.g., BTC, ETH)
  }[];
  transactions: {
    id: number;
    amount: number;
    transactionType: string;  // Example: "deposit", "withdraw"
    currency: string;         // Currency type (e.g., BTC, ETH)
    transactionDate: string;
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    // Fetch the user with wallets, backup wallets, and transactions
    const user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        wallets: true,
        backupWallets: true,
        transactions: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user data as the response
    const responseData: UserProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      wallets: user.wallets.map((wallet) => ({
        id: wallet.id,
        walletId: wallet.walletId,  // Wallet's unique ID
        balance: wallet.balance,
        currency: wallet.currency,  // Currency type (e.g., BTC, ETH)
      })),
      backupWallets: user.backupWallets.map((backupWallet) => ({
        id: backupWallet.id,
        name: backupWallet.name,  // Name of the wallet (e.g., Metamask)
        balance: backupWallet.balance,
        currency: backupWallet.currency || "",  // Currency type (e.g., BTC, ETH)
      })),
      transactions: user.transactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount,
        transactionType: transaction.transactionType,  // Transaction type (e.g., deposit, withdraw)
        currency: transaction.currency,  // Currency type (e.g., BTC, ETH)
        transactionDate: transaction.transactionDate.toISOString(),
      })),
    };

    return res.status(200).json(responseData);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}
