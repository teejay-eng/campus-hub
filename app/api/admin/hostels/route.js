import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const q = new URL(request.url).searchParams.get("q")?.trim() || "";
    const hostels = await prisma.hostel.findMany({
      where: q
        ? {
            OR: [{ name: { contains: q } }, { location: { contains: q } }],
          }
        : undefined,
      orderBy: { name: "asc" },
    });
    return NextResponse.json(hostels);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch hostels" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { name, location, capacity, availableSpaces, gender, description } = body;

    if (!name || !location || capacity == null || availableSpaces == null || !gender || !description) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const cap = Number(capacity);
    const avail = Number(availableSpaces);
    if (avail > cap || cap < 1 || avail < 0) {
      return NextResponse.json({ error: "Invalid capacity or available spaces." }, { status: 400 });
    }

    const hostel = await prisma.hostel.create({
      data: {
        name: String(name).trim(),
        location: String(location).trim(),
        capacity: cap,
        availableSpaces: avail,
        gender,
        description: String(description).trim(),
      },
    });

    return NextResponse.json(hostel, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create hostel" }, { status: 500 });
  }
}
