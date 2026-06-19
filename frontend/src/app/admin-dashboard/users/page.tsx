"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();
  const [blocked, setBlocked] = useState(false);
  const [verified, setVerified] = useState(true);
  const [aiQuery, setAiQuery] = useState("");
  const [aiInsightText, setAiInsightText] = useState(
    '"Last 48 hours show zero anomalies. Risk profile remains minimal. Recommended action: Standard monitoring."'
  );

  const handleBlockToggle = () => {
    setBlocked(!blocked);
    alert(blocked ? "User Unblocked" : "User Blocked");
  };

  const handleVerifyToggle = () => {
    setVerified(!verified);
    alert(verified ? "User verification revoked" : "User verified successfully");
  };

  const handleAiQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiInsightText("Analyzing query: " + aiQuery + "...");
    setTimeout(() => {
      let response = '"No anomalies detected for query: ' + aiQuery + '. User has logged in from verified device hashes with zero IP changes in the last 72 hours."';
      if (aiQuery.toLowerCase().includes("conflict") || aiQuery.toLowerCase().includes("failed")) {
        response = '"IP Conflict detected on Oct 24 from 204.92.12.5 (failed auth). This is a known VPN subnet. Recommended: enforce stricter location geo rules."';
      }
      setAiInsightText(response);
      setAiQuery("");
    }, 800);
  };

  // Timeline dots mock representation (20 events)
  // Types: R = Red (critical), B = Black (block/flag), G = Gray (low risk)
  const timelineEvents = [
    { type: "R" },
    { type: "G" },
    { type: "G" },
    { type: "G" },
    { type: "G" },
    { type: "B" },
    { type: "G" },
    { type: "G" },
    { type: "G" },
    { type: "R" },
    { type: "G" },
    { type: "G" },
    { type: "G" },
    { type: "B" },
    { type: "G" },
    { type: "G" },
    { type: "B" },
    { type: "G" },
    { type: "G" },
    { type: "G" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#111] font-sans">
      {/* Top Header navbar */}
      <header className="w-full bg-white border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-400">
          <span>DIRECTORY</span>
          <span>/</span>
          <span className="font-bold text-black border-b border-black pb-0.5 select-none">
            USER_39201
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <button className="relative p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-neutral-200 text-neutral-700 font-mono text-xs font-bold tracking-wider select-none shadow-sm">
            AN
          </div>
        </div>
      </header>

      {/* Body Area */}
      <div className="flex-1 flex flex-row overflow-hidden w-full">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#f8f9fa] border-r border-neutral-200/80 px-4 py-6 hidden lg:flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase block pl-3">
                TrustAI
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-black hover:bg-neutral-100 transition-all"
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-200/60 text-xs font-semibold text-neutral-800 transition-colors"
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

          {/* Sidebar Bottom Profile Card */}
          <div className="mt-auto border-t border-neutral-200/80 pt-4 flex items-center gap-3 pl-3 shrink-0">
            <div className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-black text-white font-mono text-[10px] font-bold select-none shadow-xs">
              JD
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-800 leading-none">John Doe</h4>
              <span className="text-[10px] text-neutral-400 font-light mt-1 block">Lead Analyst</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white border-l border-neutral-200/80">
          {/* User Profile Info Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
            <div className="flex items-center gap-5">
              {/* Large JD Avatar */}
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black text-white font-mono text-xl font-bold select-none shadow-sm">
                JD
              </div>
              <div className="space-y-1">
                <h2 className="font-outfit text-2xl font-bold text-neutral-900 tracking-tight leading-tight">
                  Jonathan Davis
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 font-normal">
                  <a href="mailto:j.davis@securebank.com" className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.92V6.75" />
                    </svg>
                    <span>j.davis@securebank.com</span>
                  </a>
                  <a href="tel:+15550123456" className="flex items-center gap-1.5 hover:text-black transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.14-4.118-6.944-6.94l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span>+1 (555) 012-3456</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Verification actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleBlockToggle}
                className="px-4 py-2 border border-red-500 hover:bg-red-50 rounded-lg text-xs font-semibold text-red-500 transition-colors shadow-xs"
              >
                Block User
              </button>
              <button
                onClick={handleVerifyToggle}
                className="flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-neutral-800 rounded-lg text-xs font-semibold text-white transition-colors shadow-sm"
              >
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <span>Verify User</span>
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Trust Score Circle Gauge & AI Insight */}
            <div className="space-y-6">
              {/* Trust Score Card */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-outfit text-sm font-bold text-neutral-800 tracking-tight">
                    Trust Score
                  </h3>
                  {/* Info Icon */}
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.085 1.026l-.137.137-.01.01-.02.022m-.182.182l-.009.009-.011.011M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                {/* SVG Gauge */}
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-neutral-100"
                      strokeWidth="8.5"
                      fill="transparent"
                    />
                    {/* Gauge arc (92%) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-black"
                      strokeWidth="8.5"
                      fill="transparent"
                      strokeDasharray="263.8"
                      strokeDashoffset={263.8 - (263.8 * 92) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="font-outfit text-3xl font-bold text-neutral-800">92</span>
                    <span className="font-mono text-[8px] font-bold tracking-wider text-neutral-400 uppercase mt-0.5">
                      Normal
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 font-light leading-relaxed text-center">
                  This user shows normal behavior. High score reflects consistent device usage and geolocation patterns.
                </p>
              </div>

              {/* AI Insight Card */}
              <div className="bg-black text-white rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  {/* Sparkles icon */}
                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h3.75m-6.75-3h7.5a2.25 2.25 0 002.25-2.25v-3.75a2.25 2.25 0 00-2.25-2.25h-7.5A2.25 2.25 0 004.5 12v3.75a2.25 2.25 0 002.25 2.25zM9 3.75V1.5m3 2.25V1.5m3 2.25V1.5m-3 2.25h3M6 7.5h12" />
                  </svg>
                  <h3 className="font-outfit text-sm font-semibold tracking-tight">AI Insight</h3>
                </div>

                <div className="p-3.5 rounded-lg bg-[#1f2025]/50 border border-neutral-800 font-sans text-xs text-neutral-400 font-light italic leading-relaxed">
                  {aiInsightText}
                </div>

                {/* Query Input */}
                <form onSubmit={handleAiQuerySubmit} className="relative flex items-center mt-3">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="w-full bg-[#18181b] border border-neutral-850 rounded-lg py-2 pl-3 pr-9 text-xs focus:border-white focus:outline-none transition-all placeholder-neutral-600 text-neutral-300"
                    placeholder="Ask about this user..."
                  />
                  <button
                    type="submit"
                    className="absolute right-1 text-neutral-500 hover:text-white transition-colors"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            {/* Right Columns: Risk Timeline & Event History (spans 2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Risk Timeline Card */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="font-outfit text-sm font-bold text-neutral-800 tracking-tight">
                    Risk Timeline
                  </h3>
                  <span className="font-mono text-[8px] font-bold tracking-wider text-neutral-400 uppercase">
                    Last 20 Events
                  </span>
                </div>

                {/* Dots row */}
                <div className="flex items-center justify-between gap-1 py-3 border-b border-neutral-50">
                  {timelineEvents.map((ev, i) => {
                    let dotColor = "bg-neutral-200"; // Low risk (gray)
                    if (ev.type === "R") dotColor = "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]";
                    if (ev.type === "B") dotColor = "bg-neutral-900";
                    return (
                      <span
                        key={i}
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${dotColor} transition-transform hover:scale-125 cursor-pointer`}
                        title={`Event ${i + 1}`}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-between text-[9px] font-mono text-neutral-400">
                  <span>48H AGO</span>
                  <span>CURRENT</span>
                </div>
              </div>

              {/* Event History Card */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <h3 className="font-outfit text-sm font-bold text-neutral-800 tracking-tight">
                    Event History
                  </h3>
                  <button className="flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider text-neutral-500 hover:text-black uppercase">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9" />
                    </svg>
                    <span>Filters</span>
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-neutral-100 font-mono text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 font-semibold">Event Type</th>
                        <th className="pb-3 font-semibold">Date/Time</th>
                        <th className="pb-3 font-semibold">IP Address</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-sans">
                      {/* Row 1: Session Login */}
                      <tr>
                        <td className="py-4 flex items-center gap-2 font-semibold text-neutral-800">
                          <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                          </svg>
                          <span>Session Login</span>
                        </td>
                        <td className="py-4 font-mono text-neutral-400">
                          Oct 24, 2023 &bull; 14:22:01
                        </td>
                        <td className="py-4 font-mono text-neutral-700">192.168.1.45</td>
                        <td className="py-4">
                          <span className="font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-200 uppercase">
                            Success
                          </span>
                        </td>
                      </tr>

                      {/* Row 2: IP Conflict */}
                      <tr>
                        <td className="py-4 flex items-center gap-2 font-semibold text-neutral-800">
                          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span>IP Conflict</span>
                        </td>
                        <td className="py-4 font-mono text-neutral-400">
                          Oct 24, 2023 &bull; 09:12:45
                        </td>
                        <td className="py-4 font-mono text-neutral-700">204.92.12.5</td>
                        <td className="py-4">
                          <span className="font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase">
                            Failed
                          </span>
                        </td>
                      </tr>

                      {/* Row 3: Wire Transfer */}
                      <tr>
                        <td className="py-4 flex items-center gap-2 font-semibold text-neutral-800">
                          <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h11.25" />
                          </svg>
                          <span>Wire Transfer</span>
                        </td>
                        <td className="py-4 font-mono text-neutral-400">
                          Oct 23, 2023 &bull; 18:05:12
                        </td>
                        <td className="py-4 font-mono text-neutral-700">192.168.1.45</td>
                        <td className="py-4">
                          <span className="font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-200 uppercase">
                            Success
                          </span>
                        </td>
                      </tr>

                      {/* Row 4: Password Update */}
                      <tr>
                        <td className="py-4 flex items-center gap-2 font-semibold text-neutral-800">
                          <svg className="w-4 h-4 text-neutral-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                          <span>Password Update</span>
                        </td>
                        <td className="py-4 font-mono text-neutral-400">
                          Oct 23, 2023 &bull; 11:30:00
                        </td>
                        <td className="py-4 font-mono text-neutral-700">192.168.1.45</td>
                        <td className="py-4">
                          <span className="font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-200 uppercase">
                            Success
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 flex justify-center">
                  <button className="rounded-lg border border-neutral-200 hover:bg-neutral-50 py-2.5 px-6 font-mono text-[9px] font-bold tracking-wider text-neutral-600 uppercase shadow-xs">
                    View All Events
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
