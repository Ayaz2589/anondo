import GoogleProvider from 'next-auth/providers/google';
import { AuthService } from './auth-service';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'google') {
        try {
          // Create or update user in our database
          await AuthService.createOrUpdateUser({
            email: user.email!,
            name: user.name!,
            image: user.image,
            provider: 'google',
            providerId: account.providerAccountId,
          });
          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return true;
    },
    async session({ session }: any) {
      if (session.user?.email) {
        const user = await AuthService.getUserByEmail(session.user.email);
        if (user) {
          session.user.id = user.id;
        }
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
