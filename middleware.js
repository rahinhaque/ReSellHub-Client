import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const ROLE_ROUTES = {
  "/dashboard/admin": ["admin"],
  "/dashboard/seller": ["seller", "admin"],
  "/dashboard/buyer": ["buyer", "admin"],
};

const PROTECTED_ROUTES = [
  "/dashboard",
  "/checkout",
  "/wishlist",
  "/account",
  "/auth-callback", // ✅ protect callback too
  "/choose-role", // ✅ must be logged in to choose role
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  const sessionCookie = getSessionCookie(request);

  // ── 1. No session → redirect to login ──────────────────────────────────────
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  // ── 2. Role-based dashboard protection ─────────────────────────────────────
  if (sessionCookie && pathname.startsWith("/dashboard")) {
    const jwtToken = request.cookies.get("jwt_token")?.value;

    // No JWT yet — session exists but client hasn't fetched one yet.
    // Let through; the dashboard layout will handle the redirect.
    if (!jwtToken) {
      return NextResponse.next();
    }

    try {
      const { payload } = await jwtVerify(jwtToken, JWT_SECRET);

      // ── Expired JWT → clear cookie and let through ──────────────────────
      if (Date.now() / 1000 > payload.exp) {
        const res = NextResponse.next();
        res.cookies.delete("jwt_token");
        return res;
      }

      const role = payload.role;

      // ── Wrong role for this dashboard section → redirect to own dashboard ─
      for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
        if (pathname.startsWith(routePrefix) && !allowedRoles.includes(role)) {
          return NextResponse.redirect(
            new URL(`/dashboard/${role}`, request.url),
          );
        }
      }
    } catch {
      // JWT invalid → clear and let through
      const res = NextResponse.next();
      res.cookies.delete("jwt_token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkout/:path*",
    "/wishlist/:path*",
    "/account/:path*",
    "/auth-callback", // ✅ added
    "/choose-role", // ✅ added
  ],
};
