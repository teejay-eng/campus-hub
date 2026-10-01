import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
import { gradeFromMarks } from "@/lib/grading";

export async function GET(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const academicYear = searchParams.get("academicYear");

    const grades = await prisma.grade.findMany({
      where: {
        studentId: studentId || undefined,
        academicYear: academicYear || undefined,
      },
      include: { student: true },
      orderBy: [{ academicYear: "desc" }, { semester: "asc" }],
    });

    return NextResponse.json(grades);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const marks = Number(body.marks);
    const letter = gradeFromMarks(marks);

    if (!body.studentId || !body.courseCode || !body.courseName || !body.semester || !body.academicYear) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (letter === null) {
      return NextResponse.json({ error: "Marks must be between 0 and 100." }, { status: 400 });
    }

    const grade = await prisma.grade.create({
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

    return NextResponse.json(grade, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create grade" }, { status: 500 });
  }
}
