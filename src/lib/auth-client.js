// lib/auth-client.js
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [
    inferAdditionalFields({
      user: {
        phone: {
          type: "string",
          required: false,
          defaultValue: "",
        },
        role: {
          type: "string",
          required: false,
          defaultValue: "buyer",
        },
      },
    }),
  ],
});

export const { signIn, signUp, useSession, signOut } = authClient;
