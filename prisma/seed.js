/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Compass Hub (development demo data)...");

  await prisma.grade.deleteMany();
  await prisma.user.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.event.deleteMany();
  await prisma.readingMaterial.deleteMany();

  const adminPassword = await bcrypt.hash("Admin@123", 12);
  await prisma.user.create({
    data: {
      email: "admin@compasshub.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const hostels = await Promise.all([
    prisma.hostel.create({
      data: {
        name: "North Hall",
        location: "North Campus",
        capacity: 120,
        availableSpaces: 18,
        gender: "MALE",
        description: "Modern male hostel with study rooms and 24/7 security.",
      },
    }),
    prisma.hostel.create({
      data: {
        name: "Rose Residency",
        location: "East Campus",
        capacity: 100,
        availableSpaces: 5,
        gender: "FEMALE",
        description: "Female hostel close to the library and health center.",
      },
    }),
    prisma.hostel.create({
      data: {
        name: "Unity Hostel",
        location: "Central Campus",
        capacity: 200,
        availableSpaces: 42,
        gender: "MIXED",
        description: "Mixed postgraduate blocks with shared kitchen facilities.",
      },
    }),
    prisma.hostel.create({
      data: {
        name: "Lakeview Lodge",
        location: "West Campus",
        capacity: 80,
        availableSpaces: 0,
        gender: "MIXED",
        description: "Scenic lakeside accommodation — currently at full capacity.",
      },
    }),
  ]);

  const studentPassword = await bcrypt.hash("Student@123", 12);

  const studentsData = [
    {
      studentId: "CH2024001",
      fullName: "Amina Okoro",
      email: "amina.okoro@student.compasshub.edu",
      age: 21,
      school: "School of Arts",
      faculty: "Humanities",
      course: "Music",
      yearOfAdmission: 2024,
      hostelId: hostels[1].id,
    },
    {
      studentId: "CH2023008",
      fullName: "James Mbeki",
      email: "james.mbeki@student.compasshub.edu",
      age: 22,
      school: "School of Science",
      faculty: "Earth Sciences",
      course: "Geography",
      yearOfAdmission: 2023,
      hostelId: hostels[0].id,
    },
    {
      studentId: "CH2024015",
      fullName: "Sarah Chen",
      email: "sarah.chen@student.compasshub.edu",
      age: 20,
      school: "School of Computing",
      faculty: "Information Technology",
      course: "Software Engineering",
      yearOfAdmission: 2024,
      hostelId: hostels[2].id,
    },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const user = await prisma.user.create({
      data: {
        email: s.email,
        password: studentPassword,
        role: "STUDENT",
      },
    });
    const student = await prisma.student.create({
      data: {
        userId: user.id,
        studentId: s.studentId,
        fullName: s.fullName,
        age: s.age,
        email: s.email,
        school: s.school,
        faculty: s.faculty,
        course: s.course,
        yearOfAdmission: s.yearOfAdmission,
        hostelId: s.hostelId,
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
      },
    });
    createdStudents.push(student);
  }

  const today = new Date();
  const addDays = (d) => {
    const x = new Date(today);
    x.setDate(x.getDate() + d);
    return x;
  };

  await prisma.event.createMany({
    data: [
      {
        title: "Freshers Welcome Week",
        description: "Orientation sessions, campus tours, and faculty introductions for new students.",
        date: addDays(7),
        time: "9:00 AM",
        venue: "Main Auditorium",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      },
      {
        title: "Career Fair 2026",
        description: "Meet employers and explore internship opportunities across industries.",
        date: addDays(14),
        time: "10:00 AM",
        venue: "Sports Complex Hall B",
        image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
      },
      {
        title: "Tech Innovation Summit",
        description: "Student startups showcase and keynote talks from industry leaders.",
        date: addDays(21),
        time: "2:00 PM",
        venue: "Innovation Hub",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f39ca069?w=800&q=80",
      },
      {
        title: "Cultural Night",
        description: "Music, dance, and food celebrating campus diversity.",
        date: addDays(28),
        time: "6:00 PM",
        venue: "Amphitheatre",
        image: "https://images.unsplash.com/photo-1492684223066-81342eeedaff?w=800&q=80",
      },
      {
        title: "Research Symposium",
        description: "Undergraduate and postgraduate research presentations.",
        date: addDays(35),
        time: "11:00 AM",
        venue: "Faculty of Science Block",
        image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
      },
      {
        title: "Past Alumni Dinner",
        description: "Archived event for testing filters.",
        date: addDays(-30),
        time: "7:00 PM",
        venue: "Alumni Center",
        image: null,
      },
    ],
  });

  await prisma.readingMaterial.createMany({
    data: [
      {
        title: "Music Research Methods",
        description: "Introductory guide to qualitative music research.",
        course: "MUS301",
        category: "Lecture Notes",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "Geography Fieldwork Manual",
        description: "Practical manual for GEO302 field studies.",
        course: "GEO302",
        category: "Manual",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "Software Engineering Patterns",
        description: "Design patterns reference for enterprise applications.",
        course: "CSC401",
        category: "Reference",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "Database Systems Workbook",
        description: "SQL exercises and normalization problems.",
        course: "CSC210",
        category: "Workbook",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        title: "Academic Writing Guide",
        description: "Citation styles and thesis formatting for all faculties.",
        course: "GEN100",
        category: "Guide",
        fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  });

  await prisma.grade.createMany({
    data: [
      {
        studentId: createdStudents[0].id,
        courseCode: "MUS301",
        courseName: "Music Research",
        semester: 1,
        academicYear: "2024/2025",
        marks: 78,
        grade: "B",
      },
      {
        studentId: createdStudents[1].id,
        courseCode: "GEO302",
        courseName: "Geography",
        semester: 1,
        academicYear: "2024/2025",
        marks: 85,
        grade: "A",
      },
      {
        studentId: createdStudents[1].id,
        courseCode: "GEO201",
        courseName: "Physical Geography",
        semester: 2,
        academicYear: "2023/2024",
        marks: 72,
        grade: "B",
      },
      {
        studentId: createdStudents[2].id,
        courseCode: "CSC401",
        courseName: "Software Engineering",
        semester: 1,
        academicYear: "2024/2025",
        marks: 91,
        grade: "A",
      },
      {
        studentId: createdStudents[2].id,
        courseCode: "CSC210",
        courseName: "Database Systems",
        semester: 1,
        academicYear: "2024/2025",
        marks: 48,
        grade: "E",
      },
    ],
  });

  console.log("Seed complete.");
  console.log("Demo admin: admin@compasshub.com / Admin@123");
  console.log("Demo students (all): Student@123");
  console.log("  - amina.okoro@student.compasshub.edu or CH2024001");
  console.log("  - james.mbeki@student.compasshub.edu or CH2023008");
  console.log("  - sarah.chen@student.compasshub.edu or CH2024015");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
