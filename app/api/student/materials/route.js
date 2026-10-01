import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/api-auth";

export async function GET(request) {
  const auth = await requireStudent();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const course = searchParams.get("course")?.trim() || "";
    const category = searchParams.get("category")?.trim() || "";

    const materials = await prisma.readingMaterial.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [{ title: { contains: q } }, { course: { contains: q } }],
              }
            : {},
          course ? { course: { contains: course } } : {},
          category ? { category: { contains: category } } : {},
        ],
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch materials" }, { status: 500 });
  }
}
