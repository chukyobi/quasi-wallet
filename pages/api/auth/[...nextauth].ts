import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../lib/prisma";
import { createUserWithWallet } from "../../../lib/creatUser"; 

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

      if (!user.name) {
        throw new Error("Google account name is missing.");
      }

      // Check if the user already exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        await createUserWithWallet({
          email: user.email,
          name: user.name,
          hashedPassword: "", 
        });
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
        // Ensure user is complete
        if (user.id && user.email && user.name) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
        } else {
          throw new Error("User data is incomplete.");
        }
      }
      return token;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`; // Redirect to dashboard after sign-in
    },
  },
});
