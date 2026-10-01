import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const date = new Date(body.date);
    if (Number.isNaN(date.getTime())) {
      return NextResponse.json({ error: "Invalid date." }, { status: 400 });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: String(body.title).trim(),
        description: String(body.description).trim(),
        date,
        time: String(body.time).trim(),
        venue: String(body.venue).trim(),
        image: body.image?.trim() || null,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: " failed to update event" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
  }
}
