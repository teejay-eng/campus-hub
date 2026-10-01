import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Student ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = credentials.identifier.trim();
        let user = await prisma.user.findUnique({
          where: { email: identifier.toLowerCase() },
          include: { student: true },
        });

        if (!user) {
          const student = await prisma.student.findUnique({
            where: { studentId: identifier },
            include: { user: true },
          });
          user = student?.user ?? null;
        }

        if (!user) {
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          studentRecordId: user.student?.id ?? null,
          fullName: user.student?.fullName ?? "Administrator",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.studentRecordId = user.studentRecordId;
        token.fullName = user.fullName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.studentRecordId = token.studentRecordId;
        session.user.fullName = token.fullName;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};
