"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  FaShieldAlt, 
  FaLock, 
  FaClock, 
  FaUserTie, 
  FaUser, 
  FaArrowRight,
  FaRobot,
  FaDatabase,
  FaChartLine
} from "react-icons/fa";
import { 
  HiOutlineShieldCheck, 
  HiOutlineChartBar
} from "react-icons/hi";
import { MdOutlineSupportAgent } from "react-icons/md";
import { BsShieldCheck } from "react-icons/bs";

export default function HomePage() {
  const router = useRouter();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  // Both roles go to portal-login
  const handleRoleSelect = () => {
    router.push("/portal-login");
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]">
      {/* Left Panel - Branding */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-16 bg-gradient-to-br from-black to-neutral-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <FaShieldAlt className="w-7 h-7 text-white" />
          </div>
          <span className="font-outfit text-2xl font-bold tracking-tight">TrustAI</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg">
          <h1 className="font-outfit text-5xl font-bold leading-tight mb-6">
            AI-Powered Banking Security
          </h1>
          <p className="text-lg text-neutral-300 font-light leading-relaxed">
            Advanced fraud detection, risk assessment, and account takeover prevention for modern financial institutions.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#00b87c] animate-pulse" />
              <span className="text-xs font-medium">Enterprise Grade</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <FaLock className="w-4 h-4" />
              <span className="text-xs font-medium">TLS 1.3 Encrypted</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <FaClock className="w-4 h-4" />
              <span className="text-xs font-medium">24/7 Monitoring</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-neutral-500">
          <span>© 2024 TrustAI Systems. All rights reserved.</span>
        </div>
      </div>

      {/* Right Panel - Role Selection */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-lg">
          {/* Mobile Logo */}
          <div className="flex items-center justify-center gap-3 mb-10 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black text-white">
              <FaShieldAlt className="w-6 h-6" />
            </div>
            <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
          </div>

          <div className="text-center mb-10">
            <h2 className="font-outfit text-3xl font-bold text-black tracking-tight">
              Welcome to TrustAI
            </h2>
            <p className="mt-2 text-neutral-500 font-light">
              Select your role to continue
            </p>
          </div>

          {/* Role Cards */}
          <div className="space-y-4">
            {/* Bank Employee Card */}
            <div
              onClick={handleRoleSelect}
              onMouseEnter={() => setHoveredRole("bank")}
              onMouseLeave={() => setHoveredRole(null)}
              className={`
                group relative p-6 rounded-2xl border-2 cursor-pointer
                transition-all duration-300 ease-in-out
                ${hoveredRole === "bank" 
                  ? "border-black bg-neutral-50 shadow-lg transform -translate-y-1" 
                  : "border-neutral-200 bg-white hover:border-neutral-300"
                }
              `}
            >
              <div className="flex items-center gap-5">
                {/* Icon Container */}
                <div className={`
                  flex items-center justify-center w-14 h-14 rounded-xl
                  transition-all duration-300
                  ${hoveredRole === "bank" 
                    ? "bg-black text-white" 
                    : "bg-neutral-100 text-neutral-600"
                  }
                `}>
                  <FaUserTie className="w-7 h-7" />
                </div>

                <div className="flex-1">
                  <h3 className="font-outfit text-lg font-bold text-black">
                    Bank Employee
                  </h3>
                  <p className="text-sm text-neutral-500 font-light">
                    Access admin dashboard, monitor fraud, manage security
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className={`
                  transition-all duration-300
                  ${hoveredRole === "bank" 
                    ? "opacity-100 transform translate-x-0" 
                    : "opacity-0 transform -translate-x-2"
                  }
                `}>
                  <FaArrowRight className="w-5 h-5 text-black" />
                </div>
              </div>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-2 mt-4 ml-[-4px]">
                <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium bg-neutral-100 text-neutral-600 rounded-full">
                  <HiOutlineShieldCheck className="w-3 h-3" />
                  Admin Access
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium bg-neutral-100 text-neutral-600 rounded-full">
                  <FaChartLine className="w-3 h-3" />
                  Analytics
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium bg-neutral-100 text-neutral-600 rounded-full">
                  <FaRobot className="w-3 h-3" />
                  AI Assistant
                </span>
              </div>
            </div>

            {/* Customer Card */}
            <div
              onClick={handleRoleSelect}
              onMouseEnter={() => setHoveredRole("customer")}
              onMouseLeave={() => setHoveredRole(null)}
              className={`
                group relative p-6 rounded-2xl border-2 cursor-pointer
                transition-all duration-300 ease-in-out
                ${hoveredRole === "customer" 
                  ? "border-[#00b87c] bg-[#00b87c]/5 shadow-lg transform -translate-y-1" 
                  : "border-neutral-200 bg-white hover:border-neutral-300"
                }
              `}
            >
              <div className="flex items-center gap-5">
                {/* Icon Container */}
                <div className={`
                  flex items-center justify-center w-14 h-14 rounded-xl
                  transition-all duration-300
                  ${hoveredRole === "customer" 
                    ? "bg-[#00b87c] text-white" 
                    : "bg-neutral-100 text-neutral-600"
                  }
                `}>
                  <FaUser className="w-7 h-7" />
                </div>

                <div className="flex-1">
                  <h3 className="font-outfit text-lg font-bold text-black">
                    Customer
                  </h3>
                  <p className="text-sm text-neutral-500 font-light">
                    View your account security, transaction history, and alerts
                  </p>
                </div>

                {/* Arrow Icon */}
                <div className={`
                  transition-all duration-300
                  ${hoveredRole === "customer" 
                    ? "opacity-100 transform translate-x-0" 
                    : "opacity-0 transform -translate-x-2"
                  }
                `}>
                  <FaArrowRight className="w-5 h-5 text-[#00b87c]" />
                </div>
              </div>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-2 mt-4 ml-[-4px]">
                <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium bg-[#00b87c]/10 text-[#00b87c] rounded-full">
                  <BsShieldCheck className="w-3 h-3" />
                  Account Security
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium bg-[#00b87c]/10 text-[#00b87c] rounded-full">
                  <FaDatabase className="w-3 h-3" />
                  Activity Logs
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium bg-[#00b87c]/10 text-[#00b87c] rounded-full">
                  <MdOutlineSupportAgent className="w-3 h-3" />
                  TrustBot
                </span>
              </div>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-3 gap-4 mt-8 p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
            <div className="text-center">
              <div className="flex items-center justify-center text-2xl font-bold text-black">
                99.9%
                <span className="ml-1 text-xs font-normal text-neutral-400">accuracy</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-medium mt-0.5">Detection Rate</div>
            </div>
            <div className="text-center border-x border-neutral-200">
              <div className="flex items-center justify-center text-2xl font-bold text-black">
                50M+
                <span className="ml-1 text-xs font-normal text-neutral-400">events</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-medium mt-0.5">Processed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-2xl font-bold text-black">
                24/7
                <span className="ml-1 text-xs font-normal text-neutral-400">monitoring</span>
              </div>
              <div className="text-[10px] text-neutral-500 font-medium mt-0.5">Active Protection</div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center text-xs text-neutral-400">
            <span>By continuing, you agree to our </span>
            <a href="#" className="text-neutral-600 hover:text-black transition-colors font-medium">Terms of Service</a>
            <span> and </span>
            <a href="#" className="text-neutral-600 hover:text-black transition-colors font-medium">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}