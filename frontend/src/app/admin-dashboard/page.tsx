"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminDashboard() {
  const router = useRouter();
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "system",
      text: "I've detected an unusual cluster of login attempts from a new IP block in Singapore. Three accounts were affected but successfully blocked.",
      time: "14:02 PM"
    }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatHistory(prev => [...prev, { sender: "user", text: userText, time: "14:25 PM" }]);
    setChatMessage("");

    setTimeout(() => {
      let botResponse = "Checking command center audits. I recommend auditing the Singapore IP block immediately to prevent further attempts. Would you like me to export the activity log?";
      if (userText.toLowerCase().includes("singapore") || userText.toLowerCase().includes("audit")) {
        botResponse = "Initiating IP range audit for block 192.168.10.x (SG). 3 anomalies were resolved, 0 remaining active threats.";
      } else if (userText.toLowerCase().includes("increase") || userText.toLowerCase().includes("ach")) {
        botResponse = "Temporary rule created: ACH transfers > $10,000 will now trigger mandatory biometric MFA for the next 4 hours.";
      } else if (userText.toLowerCase().includes("usr-8821")) {
        botResponse = "User #USR-8821 was blocked due to a high risk score of 92 during a cross-border ACH transfer from a new location (Singapore).";
      }
      setChatHistory(prev => [...prev, { sender: "system", text: botResponse, time: "14:26 PM" }]);
    }, 800);
  };

  const handleSuggestedAction = (actionText: string, prompt: string) => {
    setChatHistory(prev => [...prev, { sender: "user", text: actionText, time: "14:25 PM" }]);
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: "system", text: prompt, time: "14:26 PM" }]);
    }, 600);
  };

  // 24 hours of volumetric data for the bar chart. Values correspond to height ratios.
  // Colors: L = Low (green), M = Med (orange), H = High (purple), C = Critical (red)
  const chartBars = [
    { h: 42, color: "L" }, // 00:00
    { h: 50, color: "L" },
    { h: 65, color: "M" },
    { h: 35, color: "L" }, // 04:00
    { h: 80, color: "H" },
    { h: 90, color: "C" },
    { h: 72, color: "H" },
    { h: 42, color: "L" }, // 08:00
    { h: 32, color: "L" },
    { h: 55, color: "M" },
    { h: 50, color: "M" },
    { h: 38, color: "L" }, // 12:00
    { h: 44, color: "L" },
    { h: 50, color: "L" },
    { h: 60, color: "M" },
    { h: 78, color: "H" }, // 16:00
    { h: 88, color: "C" },
    { h: 82, color: "H" },
    { h: 44, color: "L" },
    { h: 38, color: "L" }, // 20:00
    { h: 58, color: "M" },
    { h: 28, color: "L" },
    { h: 42, color: "L" },
    { h: 52, color: "L" }, // 23:59
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#111] font-sans">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-neutral-200/80 px-6 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
          <span className="h-4 w-[1px] bg-neutral-300" />
          <span className="text-xs font-medium text-neutral-500 tracking-wide">
            Bank Security Command Center
          </span>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center w-full max-w-md relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full bg-[#f3f4f6]/80 text-xs rounded-lg border border-neutral-200/60 py-2 pl-9 pr-3 text-neutral-800 placeholder-neutral-500 focus:bg-white focus:border-black focus:outline-none transition-all"
            placeholder="Search by User ID, email, or device..."
          />
        </div>

        {/* Right side Profile & Icons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 pl-3 border-l border-neutral-200">
            <div className="h-7.5 w-7.5 rounded-full overflow-hidden border border-neutral-200 relative">
              <Image
                src="/analyst_sarah.png"
                alt="Analyst Sarah K."
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-neutral-700 hidden sm:inline">
              Analyst Sarah K.
            </span>
          </div>


          <button className="relative p-1 rounded-md text-neutral-500 hover:text-black transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-row overflow-hidden w-full">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#f8f9fa] border-r border-neutral-200/80 px-4 py-6 hidden lg:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase block pl-3">
                Admin Command
              </span>
              <span className="text-[10px] font-normal text-neutral-500 pl-3 block mt-0.5">
                Security Portal
              </span>
            </div>

            {/* Sidebar Navigation */}
            <nav className="space-y-1">
              <a
                href="/admin-dashboard"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/admin-dashboard");
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-200/60 text-xs font-semibold text-neutral-800 transition-colors"
              >
                {/* Grid Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <span>Dashboard</span>
              </a>

              <a
                href="/admin-dashboard/events"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/admin-dashboard/events");
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all"
              >
                {/* Calendar/List Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
                <span>Events</span>
              </a>

              <a
                href="/admin-dashboard/users"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/admin-dashboard/users");
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all"
              >
                {/* Users Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span>Users</span>
              </a>

              <a
                href="/admin-dashboard/chatbot"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/admin-dashboard/chatbot");
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all"
              >
                {/* Bot Message Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.596.596 0 01-.73-.73 5.964 5.964 0 011.018-2.65C4.385 16.25 3 14.288 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span>Chatbot</span>
              </a>

              <a
                href="#settings"
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all"
              >
                {/* Settings Icon */}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </a>
            </nav>
          </div>
        </aside>

        {/* Middle Main Content Panel (Dashboard Stats & Chart) */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Dashboard Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Events */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
              <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">
                Total Events
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-outfit text-2xl font-bold text-neutral-800">1,247</span>
                <span className="font-mono text-[8px] font-bold text-neutral-400 shrink-0">
                  +12% vs last 24h
                </span>
              </div>
            </div>

            {/* Critical Alerts */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
              <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">
                Critical Alerts
              </span>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-outfit text-2xl font-bold text-[#ef4444]">3</span>
                {/* Triple Warning Dots */}
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                </div>
              </div>
            </div>

            {/* Avg Risk Score */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
              <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">
                Avg Risk Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-outfit text-2xl font-bold text-neutral-800">28</span>
                <span className="font-mono text-[9px] font-bold text-[#00b87c] shrink-0">
                  Stable
                </span>
              </div>
            </div>

            {/* Blocked */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs">
              <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">
                Blocked
              </span>
              <div className="font-outfit text-2xl font-bold text-neutral-800 mt-1">12</div>
            </div>
          </div>

          {/* Risk Trends Bar Chart */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h3 className="font-outfit text-base font-bold text-neutral-800 tracking-tight">
                  Risk Trends - Last 24 Hours
                </h3>
                <span className="font-mono text-[9px] text-neutral-400 uppercase mt-0.5 block">
                  Volumetric analysis of event severity
                </span>
              </div>

              {/* Legends */}
              <div className="flex items-center gap-4 text-[10px] font-mono font-medium text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00b87c]" />
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                  <span>Med</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#7c3aed]" />
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                  <span>Critical</span>
                </div>
              </div>
            </div>

            {/* Bars Layout Container */}
            <div className="h-56 flex items-end justify-between gap-1 pt-6 border-b border-neutral-100">
              {chartBars.map((bar, i) => {
                // Map L/M/H/C to classes
                let colorClass = "bg-[#00b87c]";
                if (bar.color === "M") colorClass = "bg-[#f59e0b]";
                if (bar.color === "H") colorClass = "bg-[#7c3aed]";
                if (bar.color === "C") colorClass = "bg-[#ef4444]";

                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] px-1.5 py-0.5 rounded font-mono z-20 pointer-events-none uppercase">
                      Val: {bar.h} ({bar.color})
                    </div>
                    {/* The Bar */}
                    <div
                      style={{ height: `${bar.h}%` }}
                      className={`w-full rounded-t-sm ${colorClass} min-h-[4px] hover:opacity-80 transition-all`}
                    />
                  </div>
                );
              })}
            </div>

            {/* X-Axis labels */}
            <div className="flex justify-between px-1 text-[9px] font-mono text-neutral-400">
              <span>00:00</span>
              <span>04:00</span>
              <span>08:00</span>
              <span>12:00</span>
              <span>16:00</span>
              <span>20:00</span>
              <span>23:59</span>
            </div>
          </div>

          {/* Recent Incidents Table */}
          <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="font-outfit text-base font-bold text-neutral-800 tracking-tight">
                Recent Incidents
              </h3>
              <a href="#all-events" onClick={(e) => e.preventDefault()} className="font-mono text-[9px] font-bold tracking-wider text-neutral-500 hover:text-black transition-colors uppercase">
                View All
              </a>
            </div>

            {/* Custom Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-100 font-mono text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="pb-3 font-semibold">User ID</th>
                    <th className="pb-3 font-semibold">Event</th>
                    <th className="pb-3 font-semibold text-center">Risk Score</th>
                    <th className="pb-3 font-semibold">Decision</th>
                    <th className="pb-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {/* Row 1: Blocked */}
                  <tr
                    onClick={() => router.push("/event-details")}
                    className="hover:bg-neutral-50/60 cursor-pointer transition-colors"
                  >
                    <td className="py-4 font-mono text-neutral-400">14:23:01</td>
                    <td className="py-4 font-bold text-neutral-800">#USR-8821</td>
                    <td className="py-4 text-neutral-500 font-light">Cross-border ACH Transfer</td>
                    <td className="py-4 font-bold text-[#ef4444] text-center">92</td>
                    <td className="py-4">
                      <span className="font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase">
                        Blocked
                      </span>
                    </td>
                    <td className="py-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-3 text-neutral-400">
                        <button
                          onClick={() => router.push("/event-details")}
                          className="hover:text-black transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button className="hover:text-black transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2: Flagged */}
                  <tr className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 font-mono text-neutral-400">14:18:44</td>
                    <td className="py-4 font-bold text-neutral-800">#USR-1092</td>
                    <td className="py-4 text-neutral-500 font-light">Multiple Login Failures</td>
                    <td className="py-4 font-bold text-[#7c3aed] text-center">74</td>
                    <td className="py-4">
                      <span className="font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 rounded bg-purple-50 text-purple-600 border border-purple-200 uppercase">
                        Flagged
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-3 text-neutral-400">
                        <button
                          onClick={() => router.push("/event-details")}
                          className="hover:text-black transition-colors"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button className="hover:text-black transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3: Cleared */}
                  <tr className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-4 font-mono text-neutral-400">13:55:12</td>
                    <td className="py-4 font-bold text-neutral-800">#USR-9904</td>
                    <td className="py-4 text-neutral-500 font-light">Balance Inquiry</td>
                    <td className="py-4 font-bold text-[#00b87c] text-center">12</td>
                    <td className="py-4">
                      <span className="font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200 uppercase">
                        Cleared
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center justify-center gap-3 text-neutral-400">
                        <button
                          onClick={() => router.push("/event-details")}
                          className="hover:text-black transition-colors"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        <button className="hover:text-black transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Right Sidebar: TrustAI Analyst Chatbot */}
        <aside className="w-80 bg-white border-l border-neutral-200/80 px-4 py-6 hidden xl:flex flex-col justify-between shrink-0">
          <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
            <div>
              <h3 className="font-outfit text-sm font-bold text-neutral-800 tracking-tight">
                TrustAI Analyst
              </h3>
              <span className="font-mono text-[9px] text-neutral-400 uppercase mt-0.5 block">
                Advanced predictive threat detection
              </span>
            </div>

            {/* Chat Box Container */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {chatHistory.map((chat, idx) => (
                <div key={idx} className="space-y-1">
                  <div
                    className={`rounded-xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      chat.sender === "user"
                        ? "bg-neutral-100 text-neutral-800 rounded-tr-none ml-6"
                        : "bg-black text-white rounded-tl-none mr-6"
                    }`}
                  >
                    {chat.text}
                  </div>
                  <span className="font-mono text-[8px] text-neutral-400 block px-1">
                    {chat.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Suggested Actions Section */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 shrink-0">
              <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase block">
                Suggested Actions
              </span>
              <div className="space-y-1.5">
                <button
                  onClick={() =>
                    handleSuggestedAction(
                      "Audit Singapore IP range",
                      "Initiating IP range audit for block 192.168.10.x. Found 3 blocked attempts. Integrity verified."
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-lg text-left text-xs text-neutral-700 transition-all"
                >
                  <span>Audit Singapore IP range</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    handleSuggestedAction(
                      "Export report for #USR-8821",
                      "Report for user #USR-8821 generated. File download: trustai_report_usr8821.pdf (Size: 120 KB)."
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-lg text-left text-xs text-neutral-700 transition-all"
                >
                  <span>Export report for #USR-8821</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    handleSuggestedAction(
                      "Update high-risk watch list",
                      "High-risk watch list updated successfully. Added 1 new identifier. Monitored active status is synced."
                    )
                  }
                  className="w-full flex items-center justify-between px-3 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/60 rounded-lg text-left text-xs text-neutral-700 transition-all"
                >
                  <span>Update high-risk watch list</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Advisory Question */}
            <div className="p-3 bg-neutral-100 border border-neutral-200/60 rounded-lg text-xs text-neutral-700 font-light shrink-0 leading-relaxed">
              Should I increase the risk threshold for all cross-border ACH transfers for the next 4 hours?
            </div>

            {/* Input Send Area */}
            <form onSubmit={handleSendMessage} className="relative pt-2 shrink-0">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full bg-[#f3f4f6]/80 border border-neutral-200/60 rounded-lg py-2.5 pl-3 pr-10 text-xs focus:bg-white focus:border-black focus:outline-none transition-all placeholder-neutral-500 text-neutral-800"
                placeholder="Ask AI Analyst..."
              />
              <button
                type="submit"
                className="absolute right-1.5 bottom-1.5 p-1.5 bg-black hover:bg-neutral-800 text-white rounded-md transition-all active:scale-[0.9] flex items-center justify-center"
              >
                {/* Send Paper Airplane Icon */}
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
