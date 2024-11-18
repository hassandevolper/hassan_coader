// Import necessary modules and providers
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/app/utils/redis_db";

// Define NextAuth options
export const authOptions = {
  providers: [
    // GitHub OAuth Provider
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        try {
          const userData = await db.get(`user:${credentials.email}`);
          const user = userData ? JSON.parse(userData) : null;

          if (user) {
            const isValidPassword = await bcrypt.compare(credentials.password, user.password);
            if (isValidPassword) {
              return { id: user.id, email: user.email, name: user.name, image: user.image };
            } else {
              throw new Error("Invalid password");
            }
          } else {
            const userId = `user:${credentials.email}`;
            const newUser = {
              id: userId,
              email: credentials.email,
              name: "New User",  // Assign a default name or allow user input
              image: "",        // Optional placeholder image URL
              password: await bcrypt.hash(credentials.password, 10),
            };

            await db.set(userId, JSON.stringify(newUser), { ex: 60 * 60 * 24 * 7 });
            return { id: newUser.id, email: newUser.email, name: newUser.name, image: newUser.image };
          }
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error("Failed to authorize user");
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "Credentials" || account.provider === "github") {
        try {
          if (account.provider === "github") {
            const userId = `user:${user.email}`;
            const existingUser = await db.get(userId);

            if (!existingUser) {
              const newUser = { id: userId, email: user.email, name: user.name, image: user.image };
              await db.set(userId, JSON.stringify(newUser), { ex: 60 * 60 * 24 * 7 });
            }
          }
        } catch (error) {
          console.error("Error saving GitHub user:", error);
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      // Persist the access token, user ID, email, name, and image if available
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.id = profile?.id || token.id;
        token.name = profile?.name || token.name;
        token.image = profile?.avatar_url || token.image;
      }
      return token;
    },

    async session({ session, token }) {
      // Include additional user info in the session
      session.accessToken = token.accessToken;
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;        // Include name in session
      session.user.image = token.image;      // Include image in session
      return session;
    },
  },
};

// Export handler
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
