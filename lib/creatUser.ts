import prisma from "./prisma";

interface CreateUserInput {
  name: string;
  email: string;
  hashedPassword: string | null; // This can be null for OAuth users
}

export async function createUserWithWallet(data: CreateUserInput) {
  try {
    if (!data.name || !data.email) {
      throw new Error("Name and email are required.");
    }

    // Check if the user already exists in the database
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { wallets: true, backupWallets: true },
    });

    if (!user) {
      // If the user doesn't exist, create the user and the associated wallets
      const createdUser = await prisma.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: data.hashedPassword || null, // Set password only for custom users
          isVerified: true, // Automatically mark as verified for OAuth users
        },
      });

      const walletId = `wallet-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

      // Use a transaction to ensure all steps are executed
      const updatedUser = await prisma.$transaction(async (prisma) => {
        // Create the main wallet for the user
        await prisma.wallet.create({
          data: {
            user: { connect: { email: createdUser.email } }, // Using 'connect' to reference the user by email
            walletId,
            balance: 0.0,
            currency: "USD",
          },
        });

        const defaultBackupWallets = [
          { name: "Metamask", logo: "/assets/metamask.svg", currency: "ETH" },
          { name: "Trust Wallet", logo: "/assets/trust-wallet-token.svg", currency: "Multi" },
          { name: "Binance", logo: "/assets/binance-svgrepo-com.svg", currency: "BNB" },
        ];

        // Create backup wallets using 'connect' for the user, ensuring email is set properly
        for (const wallet of defaultBackupWallets) {
          await prisma.backupWallet.create({
            data: {
              email: createdUser.email, // Setting the email here
              name: wallet.name,
              logo: wallet.logo,
              balance: 0.0,
              currency: wallet.currency,
            },
          });
        }

        // Return the created user with wallets and backup wallets
        const updatedUser = await prisma.user.findUnique({
          where: { email: createdUser.email },
          include: { wallets: true, backupWallets: true },
        });

        return updatedUser;
      });

      return { user: updatedUser, message: "User, wallet, and backup wallets created successfully." };
    } else {
      // If the user already exists, just return the existing user data
      return { user, message: "User already exists." };
    }
  } catch (error: any) {
    console.error("Error creating user with wallet:", error);
    throw new Error(`Failed to create user: ${error.message}`);
  }
}
