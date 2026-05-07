import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCollection } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isRegister: { label: 'Is Register', type: 'text' },
      },
      async authorize(credentials) {
        const users = await getCollection('users');

        if (credentials.isRegister === 'true') {
          const existing = await users.findOne({ email: credentials.email });
          if (existing) throw new Error('Email-ul există deja');

          const hashed = await bcrypt.hash(credentials.password, 10);
          const result = await users.insertOne({
            email: credentials.email,
            password: hashed,
            name: credentials.name,
          });
          return { id: result.insertedId.toString(), email: credentials.email, name: credentials.name };
        } else {
          const user = await users.findOne({ email: credentials.email });
          if (!user) throw new Error('Utilizatorul nu există');
          const valid = await bcrypt.compare(credentials.password, user.password);
          if (!valid) throw new Error('Parolă incorectă');
          return { id: user._id.toString(), email: user.email, name: user.name };
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.id = token.id;
      return session;
    },
  },
  pages: { signIn: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };