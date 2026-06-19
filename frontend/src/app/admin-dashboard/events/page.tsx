"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EventsLog() {
  const router = useRouter();
  const [severityFilter, setSeverityFilter] = useState("All Severities");
  const [decisionFilter, setDecisionFilter] = useState("All Decisions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Raw mock events data matching the Image 6 table rows
  const allEvents = [
    { time: "2023-10-31 14:22:05", id: "#TXN-99201-B", severity: "CRITICAL", decision: "BLOCKED", score: 94 },
    { time: "2023-10-31 14:18:12", id: "#TXN-99185-A", severity: "HIGH", decision: "FLAGGED", score: 78 },
    { time: "2023-10-31 14:15:30", id: "#TXN-99172-C", severity: "MEDIUM", decision: "ALLOWED", score: 42 },
    { time: "2023-10-31 14:04:12", id: "#TXN-99168-X", severity: "MEDIUM", decision: "ALLOWED", score: 50 },
    { time: "2023-10-31 14:05:12", id: "#TXN-99167-X", severity: "MEDIUM", decision: "ALLOWED", score: 33 },
    { time: "2023-10-31 14:06:12", id: "#TXN-99166-X", severity: "LOW", decision: "ALLOWED", score: 49 },
    { time: "2023-10-31 14:07:12", id: "#TXN-99165-X", severity: "MEDIUM", decision: "ALLOWED", score: 33 },
    { time: "2023-10-31 14:08:12", id: "#TXN-99164-X", severity: "MEDIUM", decision: "ALLOWED", score: 39 },
    { time: "2023-10-31 14:09:12", id: "#TXN-99163-X", severity: "MEDIUM", decision: "ALLOWED", score: 2 },
    { time: "2023-10-31 14:10:12", id: "#TXN-99162-X", severity: "MEDIUM", decision: "ALLOWED", score: 38 },
  ];

  // Filter items
  const filteredEvents = allEvents.filter(ev => {
    const matchesSeverity = severityFilter === "All Severities" || ev.severity === severityFilter.toUpperCase();
    const matchesDecision = decisionFilter === "All Decisions" || ev.decision === decisionFilter.toUpperCase();
    const matchesSearch = searchQuery === "" || ev.id.toLowerCase().includes(searchQuery.toLowerCase()) || ev.time.includes(searchQuery);
    return matchesSeverity && matchesDecision && matchesSearch;
  });

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleReset = () => {
    setSeverityFilter("All Severities");
    setDecisionFilter("All Decisions");
    setSearchQuery("");
    setSelectedRows([]);
    setCurrentPage(1);
  };

  const getSeverityStyles = (sev: string) => {
    if (sev === "CRITICAL") return "bg-red-50 text-red-600 border border-red-200";
    if (sev === "HIGH") return "bg-orange-50 text-orange-600 border border-orange-200";
    if (sev === "MEDIUM") return "bg-blue-50 text-blue-600 border border-blue-200";
    return "bg-neutral-50 text-neutral-600 border border-neutral-200"; // LOW
  };

  const getDecisionStyles = (dec: string) => {
    if (dec === "BLOCKED") return "text-red-700 font-semibold border border-red-300 bg-red-50/20";
    if (dec === "FLAGGED") return "text-purple-700 font-semibold border border-purple-300 bg-purple-50/20";
    return "text-green-700 font-semibold border border-green-300 bg-green-50/20"; // ALLOWED
  };

  const getScoreStyles = (score: number) => {
    if (score >= 76) return "text-[#ef4444]";
    if (score >= 51) return "text-[#f59e0b]";
    return "text-neutral-500";
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#111] font-sans">
      {/* Top Header navbar */}
      <header className="w-full bg-white border-b border-neutral-200/80 px-6 py-3 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
          <span className="h-4 w-[1px] bg-neutral-300" />
          <span className="text-xs font-semibold text-neutral-500 tracking-wide">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f3f4f6]/80 text-xs rounded-lg border border-neutral-200/60 py-2 pl-9 pr-3 text-neutral-800 placeholder-neutral-500 focus:bg-white focus:border-black focus:outline-none transition-all"
            placeholder="Search events, IDs, or IP address..."
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <button className="relative p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-neutral-200 font-sans text-xs font-semibold text-neutral-700">
            Analyst Profile
          </div>
        </div>
      </header>

      {/* Body container */}
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-200/60 text-xs font-semibold text-neutral-800 transition-colors"
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

          {/* Sidebar Bottom Profile Card */}
          <div className="mt-auto border-t border-neutral-200/80 pt-4 flex items-center gap-3 pl-3">
            <div className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-black text-white font-mono text-[10px] font-bold select-none shadow-xs">
              AP
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-800 leading-none">Analyst Profile</h4>
              <span className="text-[10px] text-neutral-400 font-light mt-1 block">Level 4 Clearance</span>
            </div>
          </div>
        </aside>

        {/* Middle Main Content Panel (Events Table & Filters) */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-white border-l border-neutral-200/80">
          {/* Filters Area */}
          <div className="space-y-4">
            {/* Header / Date Picker row */}
            <div className="flex flex-wrap items-end gap-4">
              {/* Date Range */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase block">
                  Date Range
                </span>
                <div className="relative rounded-md shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    defaultValue="Oct 24 - Oct 31, 2023"
                    className="block w-52 rounded-lg border border-neutral-200/80 bg-white py-2 pl-9 pr-3 text-xs text-neutral-800 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Severity Dropdown */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase block">
                  Severity
                </span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="block w-40 rounded-lg border border-neutral-200/80 bg-white py-2 px-3 text-xs text-neutral-800 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option>All Severities</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              {/* Decision Dropdown */}
              <div className="space-y-1.5">
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase block">
                  Decision
                </span>
                <select
                  value={decisionFilter}
                  onChange={(e) => setDecisionFilter(e.target.value)}
                  className="block w-40 rounded-lg border border-neutral-200/80 bg-white py-2 px-3 text-xs text-neutral-800 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                >
                  <option>All Decisions</option>
                  <option>Blocked</option>
                  <option>Flagged</option>
                  <option>Allowed</option>
                </select>
              </div>

              {/* Filter Action Buttons */}
              <div className="flex items-center gap-3.5 pb-0.5">
                <button className="flex items-center justify-center gap-2 rounded-lg bg-black py-2.5 px-4 text-xs font-semibold text-white transition-all hover:bg-neutral-800 shadow-sm">
                  {/* Filter icon */}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v3.059-1.096c0 .54-.384 1.006-.917 1.096A50.065 50.065 0 0113.5 9v11.25a.75.75 0 01-1.07.676l-3.999-2a.75.75 0 01-.43-.676V9A50.062 50.062 0 013.003 5.83c-.53-.09-.915-.556-.915-1.096V4.774c0-.54.384-1.006.917-1.096A48.116 48.116 0 0112 3z" />
                  </svg>
                  <span>Apply Filters</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black font-semibold transition-colors"
                >
                  {/* Refresh icon */}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Reset</span>
                </button>
              </div>

              {/* Export CSV button - Right aligned */}
              <div className="ml-auto pb-0.5">
                <button className="flex items-center gap-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 py-2.5 px-4 text-xs font-semibold text-neutral-700 shadow-xs">
                  {/* Download Icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Pagination / Item count label row */}
            <div className="flex items-center justify-between border-t border-neutral-100 pt-4 pb-1">
              <span className="text-xs text-neutral-500 font-light">
                Showing <span className="font-semibold text-neutral-800">{filteredEvents.length}</span> of <span className="font-semibold text-neutral-800">1,247</span> events
              </span>

              {/* Pagination Controls */}
              <div className="flex items-center gap-4 text-xs">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-200 rounded-md transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <span className="font-mono text-neutral-600">
                  Page <span className="font-semibold text-black">{currentPage}</span> of <span className="font-semibold text-black">6</span>
                </span>
                <button
                  disabled={currentPage === 6}
                  onClick={() => setCurrentPage(p => Math.min(6, p + 1))}
                  className="p-1 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-200 rounded-md transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Events Log Table */}
          <div className="overflow-x-auto border border-neutral-200/80 rounded-xl bg-white shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
                  <th className="py-3.5 pl-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredEvents.length && filteredEvents.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRows(filteredEvents.map(ev => ev.id));
                        } else {
                          setSelectedRows([]);
                        }
                      }}
                      className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                    />
                  </th>
                  <th className="py-3.5 font-semibold">Timestamp</th>
                  <th className="py-3.5 font-semibold">Event ID</th>
                  <th className="py-3.5 font-semibold">Severity</th>
                  <th className="py-3.5 font-semibold">Decision</th>
                  <th className="py-3.5 font-semibold text-center">Score</th>
                  <th className="py-3.5 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => router.push("/event-details")}
                    className="hover:bg-neutral-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 pl-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(event.id)}
                        onChange={() => toggleSelectRow(event.id)}
                        className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                      />
                    </td>
                    <td className="py-4 font-mono text-neutral-400">{event.time}</td>
                    <td className="py-4 font-mono font-bold text-neutral-800">{event.id}</td>
                    <td className="py-4">
                      <span className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded uppercase ${getSeverityStyles(event.severity)}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`font-mono text-[8px] font-bold px-2.5 py-0.5 rounded uppercase ${getDecisionStyles(event.decision)}`}>
                        {event.decision}
                      </span>
                    </td>
                    <td className={`py-4 font-mono font-bold text-center ${getScoreStyles(event.score)}`}>
                      {event.score}
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
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
