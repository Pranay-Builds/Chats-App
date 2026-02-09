import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { sendVerificationEmail, signUpEmail } from "better-auth/api";
import { sendEmail } from "./sendEmail.js";
import { userAc } from "better-auth/plugins/admin/access";
import { generateFriendCode } from "../utils/generateFriendCode.js";

const prisma = new PrismaClient();

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("BETTER_AUTH_SECRET is required");
}

export const auth = betterAuth({
  baseURL: "http://localhost:5000",

  user: {
    additionalFields: {
      friendCode: {
        type: "string",
        required: true,
        input: false,
        unique: true
      }
    }
  },

  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["http://localhost:5173"],

  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const fixedUrl = new URL(url);
      fixedUrl.searchParams.set("callbackURL", "http://localhost:5173/reset-password");


      void sendEmail({
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click the link to reset your password: <a href="${url}">here</a></p>`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },

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

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          let friendCode: string | null = null;
          let created = false;


          while(!created) {
            try {
              friendCode = generateFriendCode();

              await prisma.user.update({
                where: { id: user.id },
                data: { friendCode }
              });

              created = true;
            } catch (error: any) {
              if (error.code !== "P002") throw error;
            }
          }
        }
      }
    }
  }
});