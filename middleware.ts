import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/portal(.*)"]);

export default clerkMiddleware((auth, request) => {
  if (
    auth().userId &&
    !auth().orgId &&
    request.nextUrl.pathname !== "/org-selection"
  ) {
    const orgSelection = new URL("/org-selection", request.url);
    return NextResponse.redirect(orgSelection);
  }
  if (isProtectedRoute(request)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
