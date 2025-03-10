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
    "/password-setup",
    "/my-requests",
    "/user-stats",
    "/mock-test",
    "/test-venues",
    "/((?!signin|signup|password-reset-request|find-my-id|api|public).*)", // Protect all pages except these
  ],
};