// app/components/admin/SidebarNav.tsx

import { 
  FaHome, 
  FaHistory, 
  FaUsers, 
  FaCommentDots,
  FaShieldAlt,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

export interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

export const navItems: NavItem[] = [
  { name: "Dashboard", icon: FaHome, path: "/admin-dashboard" },
  { name: "Events", icon: FaHistory, path: "/admin-dashboard/events" },
  { name: "Users", icon: FaUsers, path: "/admin-dashboard/users" },
  { name: "Chatbot", icon: FaCommentDots, path: "/admin-dashboard/chatbot" },
];

export const bottomNavItems: NavItem[] = [
  { name: "Settings", icon: FaCog, path: "/admin-dashboard/settings" },
];