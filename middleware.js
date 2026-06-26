import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

// Reuse a single client across invocations instead of connecting fresh on
// every request — connecting per-request was also masking failures by
// being slow/error-prone under load.
let clientPromise;
function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/seller") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/account");

  // 1. No session cookie & route is protected
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Session exists — verify it's actually valid AND the user is active.
  if (sessionCookie) {
    try {
      const session = await auth.api.getSession({ headers: request.headers });

      if (!session?.user) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("better-auth.session_token");
        return res;
      }

      // Re-fetch the user's status directly from the DB rather than trusting
      // whatever getSession() returned. getSession() can reflect a stale
      // snapshot (cookie cache, in-flight request started before an admin
      // blocked the user, etc). This is the authoritative check.
      const client = await getClient();
      const db = client.db("reselll_hub_db");
      const usersCollection = db.collection("user");
      const sessionsCollection = db.collection("session");

      let freshUser;
      try {
        freshUser = await usersCollection.findOne({
          _id: new ObjectId(session.user.id),
        });
      } catch {
        freshUser = null;
      }

      if (!freshUser) {
        // User no longer exists (deleted) or id mismatch — force re-login.
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.delete("better-auth.session_token");
        return res;
      }

      if (freshUser.status === "blocked") {
        // Invalidate the session immediately so it can't be reused.
        const sessionToken = request.cookies.get("better-auth.session_token");
        if (sessionToken?.value) {
          // better-auth's session collection stores the raw token under
          // the `token` field (NOT `sessionToken`).
          await sessionsCollection.deleteOne({ token: sessionToken.value });
        }
        const url = new URL("/login", request.url);
        url.searchParams.set("blocked", "1");
        const res = NextResponse.redirect(url);
        res.cookies.delete("better-auth.session_token");
        return res;
      }
    } catch (err) {
      console.error("Middleware session check failed:", err);
      const res = NextResponse.redirect(new URL("/login", request.url));
      res.cookies.delete("better-auth.session_token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/seller/:path*",
    "/checkout/:path*",
    "/wishlist/:path*",
    "/account/:path*",
    "/login",
    "/register",
  ],
};
