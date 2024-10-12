import { NextAuthOptions, User, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from 'bcrypt';
import prisma from "./prisma";

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) return null;

        const dbUser = await prisma.user.findFirst({
          where: { email: credentials.email },
        });

        if (dbUser) {
          const passwordMatch = await bcrypt.compare(credentials.password, dbUser.password);

          if (passwordMatch) {
            const { password, id, ...userWithoutPassword } = dbUser;
            return {
              ...userWithoutPassword,
              id: id.toString(), // Convert id to string
            } as User;
          }
        }

        return null; // Trigger "Access Denied" message for invalid credentials
      }

    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: 'profile email https://www.googleapis.com/auth/user.addresses.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.phonenumbers.read',
        },
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Request additional user information from Google People API
      const res = await fetch(`https://people.googleapis.com/v1/people/me?personFields=names,addresses,birthdays,phoneNumbers`, {
        headers: {
          Authorization: `Bearer ${account?.access_token}`,
        },
      });

      const googleProfileData = await res.json();
      const { names, addresses, birthdays, phoneNumbers } = googleProfileData;
      console.log(googleProfileData);

      const firstname = names?.[0]?.givenName || "";
      const lastname = names?.[0]?.familyName || "";
      const address = addresses?.[0]?.formattedValue || "";
      let birthdate: Date | null = null;

      if (birthdays?.[0]?.date) {
        const birthdateString = birthdays[0].date; // Expecting format YYYY-MM-DD
        console.log('Birthdate string received:', birthdateString); // Debug log

        // Parse birthdateString to Date object if it's a valid string
        if (typeof birthdateString === 'string') {
          const birthdateParts = birthdateString.split('-'); // Assuming YYYY-MM-DD
          const year = parseInt(birthdateParts[0], 10); // Convert year to number
          const month = parseInt(birthdateParts[1], 10) - 1; // Month is zero-indexed
          const day = parseInt(birthdateParts[2], 10); // Convert day to number

          // Create Date object
          birthdate = new Date(year, month, day);
        }
      }

      const phone = phoneNumbers?.[0]?.value || "";

      // Ensure user.email is defined
      if (!user.email) {
        console.error("User email is not defined.");
        return false; // Prevent further processing
      }

      // Check if the user exists in the database
      let dbUser = await prisma.user.findUnique({
        where: { email: user.email }, // user.email is now guaranteed to be a string
      });

      if (!dbUser) {
        // Create a new user with additional Google info
        dbUser = await prisma.user.create({
          data: {
            firstname,
            lastname,
            address,
            birthdate: birthdate || null,
            phone,
            email: user.email,
            password: ""
          },
        });
      } /* else {
        // Update existing user with new information from Google
        await prisma.user.update({
          where: { email: user.email },
          data: {
            firstname,
            lastname,
            address,
            birthdate: birthdate,
            phone,
          },
        });
      } */

      return true;
    },
    async session({ session, token, user }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

export async function loginIsRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/");
}

/* export function loginIsRequiredClient() {
  if (typeof window !== "undefined") {
    const session = useSession();
    const router = useRouter();
    if (!session) router.push("/"); 
  }
} */
