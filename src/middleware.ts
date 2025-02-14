export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/home",  // Protect dashboard and subpages
    "/profile",    // Protect profile pages
    "/request-management",   // Protect settings pages
    "/admins/:path*",      // Protect admin panel
    "/teachers/:path*", // Any custom protected folder
    "/student/:path*",
    "/vocabulary-list",
    "/my-requests",
    "/password-change",
    "/((?!signin|signup|api|public).*)", // Protect all pages except these
  ],
};