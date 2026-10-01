import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

function parseDate(dateStr) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export async function GET(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const dateFilter = new URL(request.url).searchParams.get("date");
    const where = dateFilter
      ? {
          date: {
            gte: new Date(dateFilter),
            lt: new Date(new Date(dateFilter).getTime() + 86400000),
          },
        }
      : undefined;

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const date = parseDate(body.date);
    if (!body.title || !body.description || !date || !body.time || !body.venue) {
      return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title: String(body.title).trim(),
        description: String(body.description).trim(),
        date,
        time: String(body.time).trim(),
        venue: String(body.venue).trim(),
        image: body.image?.trim() || null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
