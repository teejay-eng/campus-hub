/** Serializable nav config (no React components — safe for Server Components). */
export const adminNav = [
  { href: "/admin", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/admin/students", label: "Students", icon: "users" },
  { href: "/admin/hostels", label: "Hostels", icon: "building" },
  { href: "/admin/materials", label: "Reading Materials", icon: "book-open" },
  { href: "/admin/events", label: "Events", icon: "calendar" },
  { href: "/admin/grades", label: "Grades", icon: "graduation-cap" },
];

export const studentNav = [
  { href: "/student", label: "Dashboard", icon: "layout-dashboard" },
  { href: "/student/profile", label: "My Profile", icon: "user" },
  { href: "/student/accommodation", label: "Accommodation", icon: "home" },
  { href: "/student/materials", label: "Reading Materials", icon: "book-open" },
  { href: "/student/events", label: "Upcoming Events", icon: "calendar" },
  { href: "/student/grades", label: "My Grades", icon: "graduation-cap" },
  { href: "/student/history", label: "Academic History", icon: "history" },
];

export const navByKey = {
  admin: adminNav,
  student: studentNav,
};
