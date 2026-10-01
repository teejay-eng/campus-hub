import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all") === "true";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.event.findMany({
      where: all ? undefined : { date: { gte: today } },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
