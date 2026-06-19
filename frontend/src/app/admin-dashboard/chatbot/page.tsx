"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ChatbotConsole() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      text: "I've analyzed the blocked login attempt from 10:24 AM. The action was triggered by a velocity mismatch on account USR_9942.",
      time: "10:25 AM"
    },
    {
      sender: "user",
      text: "Show me the raw metadata for that transaction.",
      time: "10:25 AM"
    },
    {
      sender: "bot",
      text: "Here is the event payload for EVD_9921_X:",
      time: "10:25 AM",
      payload: {
        event_id: "EVD_9921_X",
        status: "blocked",
        severity: "critical",
        risk_score: 98,
        factors: {
          ip_geo: "unknown",
          device_hash: "unrecognized",
          velocity: "4_attempts/min"
        },
        timestamp: "2023-11-24T10:24:12Z"
      }
    }
  ]);

  // Investigations list mock data
  const allInvestigations = [
    { id: "1", title: "High-Risk Login Block", time: "10:24 AM", desc: "Reviewing block for ID: #9942-X...", critical: true, auth: true },
    { id: "2", title: "Daily Security Audit", time: "08:15 AM", desc: "All protocols verified for node #01.", critical: false, auth: false },
    { id: "3", title: "API Key Rotation", time: "Yesterday", desc: "Successful rotation of 4 keys.", critical: false, auth: false },
  ];

  const filteredInvestigations = allInvestigations.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatHistory(prev => [...prev, { sender: "user", text: textToSend, time: currentTime }]);
    setChatMessage("");
    setIsTyping(true);

    // Simulate Bot response
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Understood. Re-running transaction scanners on account USR_9942. Security credentials remain blocked. Recommendation: Trigger SMS verification alert.";
      if (textToSend.toLowerCase().includes("why") || textToSend.toLowerCase().includes("block")) {
        replyText = "The transaction was blocked because the user attempted to authenticate 4 times within a single minute from an unrecognized device hash and an unknown geo IP block in Singapore.";
      } else if (textToSend.toLowerCase().includes("critical") || textToSend.toLowerCase().includes("today")) {
        replyText = "Today we have logged 1 CRITICAL incident (blocked login USR_9942), 2 HIGH alerts (multiple password failures on USR_1092), and 242 CLEARED events.";
      } else if (textToSend.toLowerCase().includes("rotate") || textToSend.toLowerCase().includes("keys")) {
        replyText = "API Key rotation command sent. 4 keys updated successfully. System protocol integrity verified at v4.2.";
      }

      setChatHistory(prev => [...prev, { sender: "bot", text: replyText, time: currentTime }]);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#111] font-sans">
      {/* Top Header navbar */}
      <header className="w-full bg-white border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
        </div>

        {/* Center Tabs */}
        <div className="flex items-center gap-8 text-xs font-semibold text-neutral-500">
          <a href="/admin-dashboard" onClick={(e) => { e.preventDefault(); router.push("/admin-dashboard"); }} className="hover:text-black transition-colors">
            Dashboard
          </a>
          <a href="/admin-dashboard/events" onClick={(e) => { e.preventDefault(); router.push("/admin-dashboard/events"); }} className="hover:text-black transition-colors">
            Events
          </a>
          <span className="relative py-1 text-black border-b-2 border-black font-semibold">
            Chatbot
          </span>
          <a href="#settings" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">
            Settings
          </a>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <button className="relative p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <div className="h-7.5 w-7.5 rounded-full overflow-hidden border border-neutral-200 relative shrink-0">
            <Image
              src="/analyst_sarah.png"
              alt="Analyst Sarah K."
              fill
              className="object-cover"
            />
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
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-neutral-200/60 text-xs font-semibold text-neutral-800 transition-colors"
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

          {/* Sidebar Bottom Status Card */}
          <div className="mt-auto border border-neutral-200/80 rounded-xl p-4 bg-white shadow-xs shrink-0 mx-2">
            <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase block">
              System Status
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-2 w-2 rounded-full bg-[#00b87c] animate-pulse" />
              <span className="text-xs font-semibold text-neutral-800">Secure Protocol Active</span>
            </div>
          </div>
        </aside>

        {/* Split pane for Chat Console */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sub-pane Left: Active Investigations (spans 1/3) */}
          <div className="w-80 bg-white border-r border-neutral-200/80 flex flex-col shrink-0">
            {/* Search Investigations */}
            <div className="p-4 border-b border-neutral-100">
              <div className="relative rounded-md shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-lg border border-neutral-200/80 bg-[#f9fafb] py-2 pl-9 pr-3 text-xs placeholder-neutral-500 focus:bg-white focus:border-black focus:outline-none"
                  placeholder="Search investigations..."
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
              {filteredInvestigations.map((item) => {
                const isActive = item.id === "1"; // Let first row be active to match Image 7
                return (
                  <div
                    key={item.id}
                    className={`p-4 cursor-pointer relative transition-all ${
                      isActive ? "bg-neutral-50/80" : "hover:bg-neutral-50/40"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
                    )}
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-neutral-800">{item.title}</h4>
                      <span className="font-mono text-[9px] text-neutral-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light mt-1 truncate">
                      {item.desc}
                    </p>
                    {/* Badge Row */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {item.critical && (
                        <span className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase">
                          Critical
                        </span>
                      )}
                      {item.auth && (
                        <span className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase">
                          Auth
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-pane Right: Chat Dialogue Logs (spans 2/3) */}
          <div className="flex-1 bg-white flex flex-col overflow-hidden">
            {/* TrustBot chat header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-3">
                {/* Bot Icon */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white shadow-xs shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h3.75m-6.75-3h7.5a2.25 2.25 0 002.25-2.25v-3.75a2.25 2.25 0 00-2.25-2.25h-7.5A2.25 2.25 0 004.5 12v3.75a2.25 2.25 0 002.25 2.25M9 3.75V1.5m3 2.25V1.5m3 2.25V1.5m-3 2.25h3M6 7.5h12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-800">TrustBot</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00b87c] animate-pulse" />
                    <span className="font-mono text-[9px] text-neutral-400 uppercase">
                      Active Security Module
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-3 text-neutral-400">
                <button className="hover:text-black transition-colors" title="Download Log">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </button>
                <button className="hover:text-black transition-colors">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Conversation Logs */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-neutral-50/50">
              {chatHistory.map((chat, index) => {
                const isUser = chat.sender === "user";
                return (
                  <div key={index} className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}>
                    {/* Bot Avatar */}
                    {!isUser && (
                      <div className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-neutral-200 text-neutral-700 font-mono text-[9px] shrink-0 self-start mt-0.5">
                        🤖
                      </div>
                    )}

                    <div className="space-y-1.5 max-w-[70%]">
                      {/* Message Bubble */}
                      <div
                        className={`rounded-xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                          isUser
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-white border border-neutral-200/80 text-neutral-800 rounded-tl-none"
                        }`}
                      >
                        <div>{chat.text}</div>

                        {/* Event JSON block (if present) */}
                        {chat.payload && (
                          <div className="mt-3.5 rounded-lg bg-[#18181b] border border-neutral-800 p-4 font-mono text-[10px] text-neutral-300 leading-normal overflow-x-auto relative group">
                            <pre>{JSON.stringify(chat.payload, null, 2)}</pre>
                          </div>
                        )}

                        {/* Copy / Scan buttons (if payload exists) */}
                        {chat.payload && (
                          <div className="mt-3 flex items-center gap-2">
                            <button className="px-2.5 py-1 text-[10px] font-medium border border-neutral-200 hover:bg-neutral-50 rounded-md bg-white text-neutral-600 transition-colors">
                              Copy Payload
                            </button>
                            <button className="px-2.5 py-1 text-[10px] font-medium border border-neutral-200 hover:bg-neutral-50 rounded-md bg-white text-neutral-600 transition-colors">
                              Re-run Scan
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Time */}
                      <span className="font-mono text-[8px] text-neutral-400 block px-1">
                        {chat.time}
                      </span>
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-black text-white font-mono text-[9px] shrink-0 self-start mt-0.5">
                        👤
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bot Typing Bubble */}
              {isTyping && (
                <div className="flex gap-3.5 justify-start">
                  <div className="flex items-center justify-center w-7.5 h-7.5 rounded-full bg-neutral-200 text-neutral-700 font-mono text-[9px] shrink-0">
                    🤖
                  </div>
                  <div className="bg-white border border-neutral-200/80 rounded-xl px-4 py-3 shadow-xs rounded-tl-none flex items-center gap-1">
                    <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Quick action reply tags */}
            <div className="px-6 pt-3 pb-1.5 bg-white border-t border-neutral-100 flex flex-wrap gap-2 shrink-0">
              <button
                onClick={() => handleSendMessage("Why was my login blocked?")}
                className="px-3 py-1.5 text-[10px] font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-600 transition-all active:scale-[0.98]"
              >
                Why was my login blocked?
              </button>
              <button
                onClick={() => handleSendMessage("Show today's critical events")}
                className="px-3 py-1.5 text-[10px] font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-600 transition-all active:scale-[0.98]"
              >
                Show today&apos;s critical events
              </button>
              <button
                onClick={() => handleSendMessage("Rotate security keys")}
                className="px-3 py-1.5 text-[10px] font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-600 transition-all active:scale-[0.98]"
              >
                Rotate security keys
              </button>
            </div>

            {/* Message input area */}
            <div className="px-6 pb-4 pt-1.5 bg-white flex flex-col gap-2 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(chatMessage);
                }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full bg-[#f3f4f6]/80 border border-neutral-200/60 rounded-lg py-2.5 pl-3 pr-16 text-xs focus:bg-white focus:border-black focus:outline-none transition-all placeholder-neutral-500 text-neutral-800"
                  placeholder="Type an investigation query..."
                />
                {/* Attachment Icon */}
                <button
                  type="button"
                  className="absolute right-10 p-1 text-neutral-400 hover:text-black transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </button>
                {/* Send Button */}
                <button
                  type="submit"
                  className="absolute right-1.5 p-1.5 bg-black hover:bg-neutral-800 text-white rounded-md transition-all active:scale-[0.9] flex items-center justify-center"
                >
                  {/* Send Paper Airplane Icon */}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
              <div className="text-center font-mono text-[8px] uppercase tracking-wider text-neutral-400 mt-1">
                End-to-End Encrypted Session &bull; TrustAI Core v4.2
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
