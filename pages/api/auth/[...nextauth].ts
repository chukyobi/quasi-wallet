import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        
        if (!credentials || !credentials.email || !credentials.password) {
          throw new Error("Credentials are missing");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

     
        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user.id.toString(), name: user.name, email: user.email }; 
        }

        return null; 
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
