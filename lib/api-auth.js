import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { NextResponse } from "next/server";

export async function requireSession() {
  return getServerSession(authOptions);
}

export async function requireAdmin() {
  const session = await requireSession();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}

export async function requireStudent() {
  const session = await requireSession();
  if (!session?.user || session.user.role !== "STUDENT") {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session };
}
