import prisma from "./prisma";
import { randomBytes } from "crypto";

interface CreateUserInput {
  name: string;
  email: string;
  hashedPassword: string;
}

export async function createUserWithWallet(data: CreateUserInput) {
  try {
    // Validate required fields
    if (!data.name || !data.email) {
      throw new Error("Name and email are required.");
    }

    // Generate a unique wallet ID
    const walletId = `wallet-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    // Default backup wallets
    const defaultBackupWallets = [
      { name: "Metamask", logo: "/assets/metamask.svg", currency: "ETH" },
      { name: "Trust Wallet", logo: "/assets/trust-wallet-token.svg", currency: "Multi" },
      { name: "Binance", logo: "/assets/binance-svgrepo-com.svg", currency: "BNB" },
    ];

    // Create user along with their primary wallet and backup wallets
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.hashedPassword ?? null, // For OAuth users, password might not be provided
        wallets: {
          create: {
            walletId: walletId,
            balance: 0.0,
            currency: "USD",
          },
        },
        backupWallets: {
          create: defaultBackupWallets.map((wallet) => ({
            name: wallet.name,
            logo: wallet.logo,
            balance: 0.0,
            currency: wallet.currency,
          })),
        },
      },
      include: {
        wallets: true,
        backupWallets: true,
      },
    });

    return { user, message: "User, wallet, and backup wallets created successfully" };
  } catch (error: any) {
    console.error("Error creating user, wallet, and backup wallets:", error);
    throw new Error(`Failed to create user, wallet, or backup wallets: ${error.message}`);
  }
}
