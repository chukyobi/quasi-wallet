import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../lib/prisma";

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

      // Check if user exists in the database
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      // If the user does not exist, create them in the database
      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: user.name,
            email: user.email,
            password: "", // Set an empty password for OAuth users
          },
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
        token.id = user.id;
        token.email = user.email; 
        token.name = user.name; 
      }
      return token;
    },

    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },
});
