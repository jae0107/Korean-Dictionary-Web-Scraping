import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      accountId: string;
      status: 'PENDING' | 'DENIED' | 'APPROVED';
      role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPERADMIN';
      accessToken: string;
    };
  }
}