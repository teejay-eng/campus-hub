import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/api-auth";
export async function GET(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const school = searchParams.get("school")?.trim() || "";
    const faculty = searchParams.get("faculty")?.trim() || "";

    const students = await prisma.student.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { fullName: { contains: q } },
                  { studentId: { contains: q } },
                  { email: { contains: q } },
                ],
              }
            : {},
          school ? { school: { contains: school } } : {},
          faculty ? { faculty: { contains: faculty } } : {},
        ],
      },
      include: { hostel: true },
      orderBy: { fullName: "asc" },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const {
      fullName,
      studentId,
      email,
      age,
      school,
      faculty,
      course,
      yearOfAdmission,
      hostelId,
      password,
    } = body;

    if (
      !fullName ||
      !studentId ||
      !email ||
      !age ||
      !school ||
      !faculty ||
      !course ||
      !yearOfAdmission ||
      !password
    ) {
      return NextResponse.json({ error: "All required fields must be filled." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use." }, { status: 409 });
    }

    const existingStudent = await prisma.student.findUnique({ where: { studentId } });
    if (existingStudent) {
      return NextResponse.json({ error: "Student ID already exists." }, { status: 409 });
    }

    if (hostelId) {
      const hostel = await prisma.hostel.findUnique({ where: { id: hostelId } });
      if (!hostel || hostel.availableSpaces <= 0) {
        return NextResponse.json({ error: "Selected hostel has no available space." }, { status: 400 });
      }
    }

    const hashed = await bcrypt.hash(password, 12);

    const student = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          password: hashed,
          role: "STUDENT",
        },
      });

      const created = await tx.student.create({
        data: {
          userId: user.id,
          studentId: String(studentId).trim(),
          fullName: String(fullName).trim(),
          age: Number(age),
          email: normalizedEmail,
          school: String(school).trim(),
          faculty: String(faculty).trim(),
          course: String(course).trim(),
          yearOfAdmission: Number(yearOfAdmission),
          hostelId: hostelId || null,
        },
        include: { hostel: true },
      });

      if (hostelId) {
        await tx.hostel.update({
          where: { id: hostelId },
          data: { availableSpaces: { decrement: 1 } },
        });
      }

      return created;
    });

    return NextResponse.json({ message: "Student added successfully.", student }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
