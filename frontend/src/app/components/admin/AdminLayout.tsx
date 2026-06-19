// app/components/admin/AdminLayout.tsx

"use client";

import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { FaBars, FaBell, FaUser } from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import Sidebar from "./Sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ 
  children, 
  title = "Admin Dashboard",
  subtitle = "Security Command Center"
}: AdminLayoutProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200/80 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-1.5 hover:bg-neutral-100 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <FaBars className="w-5 h-5 text-neutral-600" />
          </button>

          <div className="flex items-center gap-2">
            <HiOutlineShieldCheck className="w-6 h-6 text-black hidden sm:block" />
            <span className="font-outfit text-lg sm:text-xl font-bold tracking-tight text-black">TrustAI</span>
          </div>
          
          <span className="hidden md:block h-4 w-[1px] bg-neutral-300" />
          <span className="hidden md:block text-xs font-medium text-neutral-500 tracking-wide truncate max-w-[150px]">
            {subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="relative p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
            <FaBell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-neutral-200">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-white font-mono text-[10px] sm:text-xs font-bold select-none">
              AS
            </div>
            <span className="text-xs font-semibold text-neutral-700 hidden sm:inline">
              Analyst
            </span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-outfit text-xl sm:text-2xl font-bold text-neutral-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-neutral-500 font-light mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Page Content */}
          {children}
        </main>
      </div>
    </div>
  );
}