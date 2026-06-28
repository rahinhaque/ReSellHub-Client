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
      // ✅ Tracks whether user explicitly chose a role (important for Google login)
      roleSelected: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },

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

  session: {
    cookieCache: {
      enabled: false,
    },
  },
});
