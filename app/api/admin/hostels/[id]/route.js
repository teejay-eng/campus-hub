import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const cap = Number(body.capacity);
    const avail = Number(body.availableSpaces);

    if (avail > cap) {
      return NextResponse.json({ error: "Available spaces cannot exceed capacity." }, { status: 400 });
    }

    const hostel = await prisma.hostel.update({
      where: { id },
      data: {
        name: String(body.name).trim(),
        location: String(body.location).trim(),
        capacity: cap,
        availableSpaces: avail,
        gender: body.gender,
        description: String(body.description).trim(),
      },
    });

    return NextResponse.json(hostel);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update hostel" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const assigned = await prisma.student.count({ where: { hostelId: id } });
    if (assigned > 0) {
      return NextResponse.json(
        { error: "Cannot delete hostel with assigned students." },
        { status: 400 }
      );
    }
    await prisma.hostel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete hostel" }, { status: 500 });
  }
}
