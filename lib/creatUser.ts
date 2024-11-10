import prisma from "./prisma";


interface CreateUserInput {
  name: string;
  email: string;
  hashedPassword: string;
}

export async function createUserWithWallet(data: CreateUserInput) {
  try {
    // Generate a unique wallet ID
    const walletId = `wallet-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

    // Create the user along with the associated wallet
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.hashedPassword ?? null, // for OAuth Users
        wallets: {
          create: {
            walletId: walletId, 
            balance: 0.0,
            currency: "USD", 
          },
        },
      },
      include: {
        wallets: true,
      },
    });

    return { user, message: "User and wallet created successfully" };
  } catch (error) {
    console.error("Error creating user and wallet:", error);
    throw new Error("Failed to create user and wallet");
  }
}
