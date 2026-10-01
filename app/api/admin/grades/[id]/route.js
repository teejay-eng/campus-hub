import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { gradeFromMarks } from "@/lib/grading";

export async function PUT(request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const marks = Number(body.marks);
    const letter = gradeFromMarks(marks);

    if (letter === null) {
      return NextResponse.json({ error: "Marks must be between 0 and 100." }, { status: 400 });
    }

    const grade = await prisma.grade.update({
      where: { id },
      data: {
        studentId: body.studentId,
        courseCode: String(body.courseCode).trim(),
        courseName: String(body.courseName).trim(),
        semester: Number(body.semester),
        academicYear: String(body.academicYear).trim(),
        marks,
        grade: letter,
      },
      include: { student: true },
    });

    return NextResponse.json(grade);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update grade" }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await prisma.grade.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete grade" }, { status: 500 });
  }
}
