import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
export async function GET(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: { hostel: true, grades: true },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json(student);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const newHostelId = body.hostelId !== undefined ? body.hostelId || null : existing.hostelId;

    if (newHostelId !== existing.hostelId) {
      if (newHostelId) {
        const hostel = await prisma.hostel.findUnique({ where: { id: newHostelId } });
        if (!hostel || hostel.availableSpaces <= 0) {
          return NextResponse.json({ error: "Hostel has no available space." }, { status: 400 });
        }
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (newHostelId !== existing.hostelId) {
        if (existing.hostelId) {
          await tx.hostel.update({
            where: { id: existing.hostelId },
            data: { availableSpaces: { increment: 1 } },
          });
        }
        if (newHostelId) {
          await tx.hostel.update({
            where: { id: newHostelId },
            data: { availableSpaces: { decrement: 1 } },
          });
        }
      }

      return tx.student.update({
        where: { id },
        data: {
          fullName: body.fullName?.trim() ?? existing.fullName,
          age: body.age !== undefined ? Number(body.age) : existing.age,
          email: body.email?.trim().toLowerCase() ?? existing.email,
          school: body.school?.trim() ?? existing.school,
          faculty: body.faculty?.trim() ?? existing.faculty,
          course: body.course?.trim() ?? existing.course,
          hostelId: newHostelId,
        },
        include: { hostel: true },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      if (existing.hostelId) {
        await tx.hostel.update({
          where: { id: existing.hostelId },
          data: { availableSpaces: { increment: 1 } },
        });
      }
      await tx.user.delete({ where: { id: existing.userId } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
