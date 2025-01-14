import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createUserWithWallet } from "@/lib/creatUser";
import { generateAndSendOtp } from "@/utils/generateAndSendOtp";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with the provided email.");
        }

        // Check if the user is verified
        if (!user.isVerified) {
          await generateAndSendOtp(credentials.email); // Trigger OTP resend logic
          throw new Error("User not verified");
        }

        if (!user.password) {
          throw new Error("Password is missing for this user. Please reset your password.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }

        // Return a user object with `id` as a string
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt", // Use JWT for session management
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email || !user.name) {
        throw new Error("User email or name is missing.");
      }

      try {
        // Handle user creation for Google login or non-existent users
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create user with wallet if they don't exist (for Google login or first time credentials login)
          await createUserWithWallet({
            email: user.email,
            name: user.name,
            hashedPassword: "", // No password for Google users, leave it empty
          });
        }
      } catch (error) {
        console.error("Error during user creation with wallet:", error);
        return false;
      }

      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        // Add user data to token (id, email, and name)
        token.id = user.id as string;
        token.email = user.email as string;
        token.name = user.name as string;
      }
      return token;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`; // Redirect to dashboard after sign-in
    },
  },
});
