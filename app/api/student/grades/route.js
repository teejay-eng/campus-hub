import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/api-auth";
import { isPassing } from "@/lib/grading";

export async function GET() {
  const auth = await requireStudent();
  if (auth.error) return auth.error;

  try {
    const grades = await prisma.grade.findMany({
      where: { studentId: auth.session.user.studentRecordId },
      orderBy: [{ academicYear: "desc" }, { semester: "asc" }],
    });

    const average =
      grades.length > 0
        ? Math.round(grades.reduce((sum, g) => sum + g.marks, 0) / grades.length)
        : 0;
    const passed = grades.filter((g) => isPassing(g.marks)).length;

    return NextResponse.json({ grades, average, courseCount: grades.length, passed });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch grades" }, { status: 500 });
  }
}
