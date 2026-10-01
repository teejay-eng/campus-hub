import { prisma } from "@/lib/prisma";

export async function adjustHostelSpaces(hostelId, delta) {
  if (!hostelId || delta === 0) return;

  const hostel = await prisma.hostel.findUnique({ where: { id: hostelId } });
  if (!hostel) return;

  const next = Math.min(hostel.capacity, Math.max(0, hostel.availableSpaces + delta));
  await prisma.hostel.update({
    where: { id: hostelId },
    data: { availableSpaces: next },
  });
}
