
"use client";

import { useRouter, usePathname } from "next/navigation";
import { 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { navItems, bottomNavItems } from "./SidebarNav";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("riskData");
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); // Close sidebar on mobile
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 z-50
          w-72 lg:w-64 h-full
          bg-white border-r border-neutral-200/80
          flex flex-col shrink-0 overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="px-4 py-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
              <HiOutlineShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-outfit text-sm font-bold text-black">Command Center</h2>
              <p className="text-[10px] text-neutral-400 font-medium">Security Portal</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button 
            className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive 
                    ? "bg-black text-white shadow-sm" 
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                  }
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                <span>{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-neutral-100 space-y-2">
          {/* System Status */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-100">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-neutral-600">System Online</span>
          </div>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}