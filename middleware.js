// middleware.js
import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const ROLE_ROUTES = {
  "/dashboard/admin": ["admin"],
  "/dashboard/seller": ["seller", "admin"],
  "/dashboard/buyer": ["buyer", "admin"],
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/wishlist") ||
    pathname.startsWith("/account");

  const sessionCookie = getSessionCookie(request);

  // No session → redirect to login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  // Has session → check JWT for role-based routing
  if (sessionCookie && pathname.startsWith("/dashboard")) {
    const jwtToken = request.cookies.get("jwt_token")?.value;

    if (!jwtToken) {
      // No JWT yet — session exists but useJwt hasn't fired
      // Allow through, the dashboard layout will handle it
      return NextResponse.next();
    }

    try {
      const { payload } = await jwtVerify(jwtToken, JWT_SECRET);
      const role = payload.role;

      // Check expiry
      if (Date.now() / 1000 > payload.exp) {
        const res = NextResponse.next();
        res.cookies.delete("jwt_token");
        return res;
      }

      // Role-based redirect
      for (const [routePrefix, allowedRoles] of Object.entries(ROLE_ROUTES)) {
        if (pathname.startsWith(routePrefix) && !allowedRoles.includes(role)) {
          return NextResponse.redirect(
            new URL(`/dashboard/${role}`, request.url),
          );
        }
      }
    } catch {
      // JWT invalid — clear and allow through
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
  ],
};
