import {
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  History,
  Home,
  LayoutDashboard,
  User,
  Users,
} from "lucide-react";

export const navIcons = {
  "layout-dashboard": LayoutDashboard,
  users: Users,
  building: Building2,
  "book-open": BookOpen,
  calendar: Calendar,
  "graduation-cap": GraduationCap,
  user: User,
  home: Home,
  history: History,
};

export function NavIcon({ name, className }) {
  const Icon = navIcons[name];
  if (!Icon) return null;
  return <Icon className={className} />;
}
