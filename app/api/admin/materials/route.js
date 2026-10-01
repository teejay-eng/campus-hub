import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const q = new URL(request.url).searchParams.get("q")?.trim() || "";
    const materials = await prisma.readingMaterial.findMany({
      where: q
        ? {
            OR: [{ title: { contains: q } }, { course: { contains: q } }],
          }
        : undefined,
      orderBy: { title: "asc" },
    });
    return NextResponse.json(materials);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    if (!body.title || !body.description || !body.course || !body.category || !body.fileUrl) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const material = await prisma.readingMaterial.create({
      data: {
        title: String(body.title).trim(),
        description: String(body.description).trim(),
        course: String(body.course).trim(),
        category: String(body.category).trim(),
        fileUrl: String(body.fileUrl).trim(),
      },
    });

    return NextResponse.json(material, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create material" }, { status: 500 });
  }
}
