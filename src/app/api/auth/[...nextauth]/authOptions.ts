import { UserStatus } from "@/app/generated/gql/graphql";
import { AuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from "../../models";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "아이디",
          type: "text",
          placeholder: "아이디 입력 요망",
        },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials, req) {
        const tmpUser = await User.findOne({
          where: { email: credentials?.username },
          attributes: ["id", "sessionVersion"],
        });

        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
            sessionVersion: tmpUser?.sessionVersion,
          }),
        })
        const user = await res.json()

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          throw new Error("사용자를 찾을 수 없습니다.");

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sessionVersion = (user as User).sessionVersion;
      }
      if (trigger == "update") {
        token.isInTestMode = session.user.isInTestMode;
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token as any;
      session.user.sessionVersion = token.sessionVersion as number;
      return session;
    },
    async signIn({ user }) {
      const tmpUser = user as User;
      if (tmpUser.status === UserStatus.Pending && tmpUser.previousStatus !== 'APPROVED' && tmpUser.role !== 'STUDENT') {
        throw new Error('승인 대기중인 계정입니다.');
      } else if (tmpUser.status === UserStatus.Denied) {
        throw new Error('승인이 거부된 계정입니다.');
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: "/signin",
  },
};