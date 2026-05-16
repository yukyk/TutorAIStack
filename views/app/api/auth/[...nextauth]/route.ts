import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'select_account',
          scope: 'openid profile email',
        },
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: 'admin', email: credentials.email, name: 'Admin', isAdmin: true } as any;
        }

        const { data: user } = await supabase
          .from('users')
          .select('id, name, email, password_hash')
          .eq('email', credentials.email)
          .single();

        if (!user?.password_hash) return null;

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) return null;

        return { id: String(user.id), email: user.email, name: user.name };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', user.email)
            .single();

          if (!existing) {
            await supabase
              .from('users')
              .insert({
                name: user.name,
                email: user.email,
                password_hash: null,
              });
          }
        } catch (err) {
          console.error('Google signIn DB error:', err);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if ((user as any)?.isAdmin) {
        token.isAdmin = true;
        token.adminToken = process.env.ADMIN_PASSWORD;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.isAdmin) {
        (session.user as any).isAdmin = true;
        (session.user as any).adminToken = token.adminToken;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      token = {};
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
