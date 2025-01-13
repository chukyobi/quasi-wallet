import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createUserWithWallet } from "@/lib/creatUser";

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

        if (!user.password) {
          throw new Error("Password is missing for this user. Please reset your password.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials.");
        }

        // Return a user object with `id` as a string
        return {
          id: user.id.toString(), // Convert id to string if it's a number
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        throw new Error("Google account email is missing.");
      }

      if (!user.name) {
        throw new Error("Google account name is missing.");
      }

      try {
        // Check if the user already exists in the database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create the user with wallet if they don't exist
          await createUserWithWallet({
            email: user.email,
            name: user.name,
            hashedPassword: "",
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
        // Add user data to token
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
