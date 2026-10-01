import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireStudent();
  if (auth.error) return auth.error;

  try {
    const hostels = await prisma.hostel.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(hostels);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch hostels" }, { status: 500 });
  }
}
