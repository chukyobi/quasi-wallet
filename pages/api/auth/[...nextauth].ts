import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../lib/prisma";
import { createUserWithWallet } from "../../../lib/creatUser"; // Ensure this import is correct

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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

      // Check if the user already exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        // Create user and wallet if the user doesn't exist
        await createUserWithWallet({
          email: user.email,
          name: user.name!,
          hashedPassword: "", // No password for Google users
        });
      }
      return true;
    },

    async session({ session, token }) {
      if (session.user) {
        // Ensure that the user properties are set on the session object
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        // Store necessary user details in the JWT token
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`; // Redirect to dashboard after sign-in
    },
  },
});
