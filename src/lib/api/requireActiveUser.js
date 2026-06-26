import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

let clientPromise;
function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }
  return clientPromise;
}

/**
 * Verifies the request has a valid session AND that the underlying user is
 * not blocked, re-checked fresh against the DB (not the cached session
 * payload). Use this inside any Next.js Route Handler that performs a
 * mutation (orders, payments, wishlist, etc).
 *
 * @param {Request} request
 * @returns {Promise<{ok: true, session: object} | {ok: false, status: number, error: string}>}
 */
export async function requireActiveUser(request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return { ok: false, status: 401, error: "Not authenticated" };
  }

  const client = await getClient();
  const db = client.db("reselll_hub_db");
  const usersCollection = db.collection("user");

  let freshUser;
  try {
    freshUser = await usersCollection.findOne({
      _id: new ObjectId(session.user.id),
    });
  } catch {
    freshUser = null;
  }

  if (!freshUser) {
    return { ok: false, status: 401, error: "User not found" };
  }

  if (freshUser.status === "blocked") {
    return {
      ok: false,
      status: 403,
      error: "Your account has been blocked. Please contact support.",
    };
  }

  return { ok: true, session, user: freshUser };
}
