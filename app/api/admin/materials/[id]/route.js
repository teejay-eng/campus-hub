import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const material = await prisma.readingMaterial.update({
      where: { id },
      data: {
        title: String(body.title).trim(),
        description: String(body.description).trim(),
        course: String(body.course).trim(),
        category: String(body.category).trim(),
        fileUrl: String(body.fileUrl).trim(),
      },
    });
    return NextResponse.json(material);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update material" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await prisma.readingMaterial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete material" }, { status: 500 });
  }
}
