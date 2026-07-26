// middleware.js
// Gates the admin machine manager only. Deliberately does NOT touch
// /api/catalog (the public read endpoint the live configurator depends on) —
// the old admin panel's middleware had to special-case a growing list of
// "public" /api/admin/* GET paths to avoid blocking the configurator, which
// caused real bugs. This version avoids that failure mode by construction:
// the public read path lives entirely outside /api/admin/*, so there is
// nothing to bypass here.
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/admin/login", "/api/admin/login", "/api/admin/logout"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // /admin/leads is a pre-existing, already-public leads dashboard unrelated
  // to the machine manager — it must stay reachable with no login, exactly as
  // it already was before this middleware existed.
  if (pathname.startsWith("/admin/leads")) {
    return NextResponse.next();
  }

  // Fail closed, not open: if ADMIN_PASSWORD isn't configured, deny every
  // request rather than falling back to a fixed, source-visible secret.
  // login.js already refuses to *issue* a token without a real password
  // configured, but a middleware fallback secret would still let anyone who
  // has seen this source forge their own valid cookie and bypass login
  // entirely — there's no legitimate reason to ever accept a token in that
  // state, so don't try.
  if (!process.env.ADMIN_PASSWORD) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Server misconfigured: ADMIN_PASSWORD not set" }, { status: 503 });
    }
    return new NextResponse("Server misconfigured: ADMIN_PASSWORD not set", { status: 503 });
  }
  const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_PASSWORD);

  const token = request.cookies.get("admin_session")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (err) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
