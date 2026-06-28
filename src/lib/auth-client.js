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
        status: {
          type: "string",
          required: false,
          defaultValue: "active",
        },
        // ✅ Added — needed to detect if Google user has chosen a role yet
        roleSelected: {
          type: "boolean",
          required: false,
          defaultValue: false,
        },
      },
    }),
  ],
});

export const { signIn, signUp, useSession, signOut } = authClient;
