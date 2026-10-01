import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import DashboardShell from "@/components/DashboardShell";

export default async function AdminLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <DashboardShell title="Admin Portal" navKey="admin">
      {children}
    </DashboardShell>
  );
}
