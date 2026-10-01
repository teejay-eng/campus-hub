import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [students, hostels, events, materials] = await Promise.all([
      prisma.student.count(),
      prisma.hostel.count(),
      prisma.event.count({ where: { date: { gte: today } } }),
      prisma.readingMaterial.count(),
    ]);

    const hostelSpaces = await prisma.hostel.aggregate({
      _sum: { availableSpaces: true },
    });

    return NextResponse.json({
      students,
      hostels,
      availableSpaces: hostelSpaces._sum.availableSpaces ?? 0,
      upcomingEvents: events,
      materials,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
