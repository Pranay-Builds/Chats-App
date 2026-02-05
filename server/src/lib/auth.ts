import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail } from "better-auth/api";
import { sendEmail } from "./sendEmail.js";

const prisma = new PrismaClient();

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is required");
}

export const auth = betterAuth({
  baseURL: "http://localhost:5000",

  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["http://localhost:5173"],

  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },


  emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
      const fixedUrl = new URL(url);
      fixedUrl.searchParams.set("callbackURL", "http://localhost:5173");

      await sendEmail({
        to: user.email,
        subject: "Verify your Chats account",
        html: `<p>Verify your Chats Account, Click <a href="${fixedUrl.toString()}">here</a> to verify your email</p>`
      });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    redirectTo: "http://localhost:5173/verify"
  },


  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});