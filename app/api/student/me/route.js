import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/api-auth";
import { isPassing } from "@/lib/grading";

export async function GET() {
  const auth = await requireStudent();
  if (auth.error) return auth.error;

  try {
    const student = await prisma.student.findUnique({
      where: { id: auth.session.user.studentRecordId },
      include: { hostel: true, grades: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingEvents = await prisma.event.count({ where: { date: { gte: today } } });

    const grades = student.grades;
    const average =
      grades.length > 0
        ? Math.round(grades.reduce((sum, g) => sum + g.marks, 0) / grades.length)
        : 0;
    const passed = grades.filter((g) => isPassing(g.marks)).length;

    return NextResponse.json({
      student,
      stats: {
        upcomingEvents,
        average,
        courseCount: grades.length,
        passed,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PUT(request) {
  const auth = await requireStudent();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const student = await prisma.student.update({
      where: { id: auth.session.user.studentRecordId },
      data: {
        fullName: body.fullName?.trim(),
        age: body.age !== undefined ? Number(body.age) : undefined,
        email: body.email?.trim().toLowerCase(),
        school: body.school?.trim(),
        faculty: body.faculty?.trim(),
        course: body.course?.trim(),
        profileImage: body.profileImage?.trim() || null,
      },
      include: { hostel: true },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
