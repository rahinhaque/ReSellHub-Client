import { betterAuth } from "better-auth";
import { MongoClient, ObjectId } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db("reselll_hub_db");
const usersCollection = db.collection("user");

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
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
    },
  },

  // IMPORTANT: this app has no separate better-auth `id` field on the user
  // document — only Mongo's `_id`. better-auth uses `_id` (cast to string)
  // as the user identifier, and session.userId stores that same string.
  // Every lookup below MUST use `_id`, never a nonexistent `id` field.
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          let user;
          try {
            user = await usersCollection.findOne({
              _id: new ObjectId(session.userId),
            });
          } catch {
            // session.userId wasn't a valid ObjectId string — treat as not found
            user = null;
          }

          if (user?.status === "blocked") {
            throw new Error(
              "Your account has been blocked. Please contact support.",
            );
          }

          return { data: session };
        },
      },
    },
  },

  // Also disable/limit the cookie cache so a block takes effect on the very
  // next request instead of waiting out a cached session window. If you
  // need the performance win later, re-enable with a short maxAge (e.g. 5s)
  // and rely on the session-table delete (server.js) + middleware re-check
  // instead of this hook alone for sub-cache-window freshness.
  session: {
    cookieCache: {
      enabled: false,
    },
  },
});
