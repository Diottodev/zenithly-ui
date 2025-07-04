import { auth } from "$/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isPublicPage = [
    "/api",
    "/_next",
    "/favicon.ico",
    "/not-found",
    "/exp3-static",
  ].some((path) => request.nextUrl.pathname.startsWith(path));
  const validRoutes = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/dashboard",
    "/not-found",
  ];
  if (request.nextUrl.pathname === "/auth" && request.nextUrl.hash !== "") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }
  const isValidAuthRoute =
    request.nextUrl.pathname === "/auth" && request.nextUrl.hash === "";
  const isValidRoute = validRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      (route !== "/" && request.nextUrl.pathname.startsWith(route + "/"))
  );
  if (!isValidRoute && !isValidAuthRoute) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  if (!isPublicPage && !isValidRoute) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
  if (isPublicPage) {
    return NextResponse.next();
  }
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (!session?.user && request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    if (session?.user && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    if (!session?.user && !isAuthPage && !isPublicPage) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error("Erro no middleware:", error);
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/not-found", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
