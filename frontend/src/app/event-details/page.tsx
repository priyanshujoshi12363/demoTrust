"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function EventDetails() {
  const router = useRouter();
  const [monitorSession, setMonitorSession] = useState(true);
  const [tagFrequent, setTagFrequent] = useState(false);
  const [notifyUser, setNotifyUser] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Security incident event #auth_982x is loaded. Ask me anything about this session." }
  ]);

  const handleApplyActions = () => {
    alert("Actions applied: " + JSON.stringify({ monitorSession, tagFrequent, notifyUser }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatHistory(prev => [...prev, { sender: "user", text: userText }]);
    setChatMessage("");

    setTimeout(() => {
      let botResponse = "This event is marked low risk (12/100) because it matches Arjun's typical login location (Mumbai), browser (Safari 17.1), and was successfully completed with a 2FA OTP verification code.";
      if (userText.toLowerCase().includes("mumbai") || userText.toLowerCase().includes("location")) {
        botResponse = "The Mumbai location is registered as Arjun's primary residence. The IP address belongs to Reliance Jio, his usual ISP.";
      } else if (userText.toLowerCase().includes("device") || userText.toLowerCase().includes("iphone")) {
        botResponse = "The iPhone 15 Pro has been used for 98% of Arjun's logins over the past 6 months. It has a verified hardware token.";
      }
      setChatHistory(prev => [...prev, { sender: "bot", text: botResponse }]);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#111] font-sans">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
        </div>

        {/* Center Tabs */}
        <div className="flex items-center gap-8 text-xs font-semibold text-neutral-500">
          <a href="#dashboard" onClick={(e) => { e.preventDefault(); router.push("/admin-dashboard"); }} className="hover:text-black transition-colors">
            Dashboard
          </a>
          <span className="relative py-1 text-black border-b-2 border-black font-semibold">
            Security Events
          </span>
          <a href="#policy" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">
            Policy Engine
          </a>
        </div>

        {/* Right side Profile & Icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#00b87c] ring-2 ring-white" />
          </button>
          {/* User Avatar */}
          <div className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-black text-white font-mono text-xs font-bold tracking-wider select-none shadow-sm">
            JD
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Back Link */}
        <div>
          <button
            onClick={() => router.push("/admin-dashboard")}
            className="flex items-center gap-2 font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 hover:text-black transition-colors uppercase"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns: Event, AI Reasoning, Verification Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header Card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
              <div className="flex items-center gap-4">
                {/* Shield Checked Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#00b87c]/5 border border-[#00b87c]/20 text-[#00b87c] shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-outfit text-xl font-bold text-neutral-900 leading-tight">LOGIN</h2>
                    <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] uppercase">
                      ALLOW
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light mt-1">
                    Event ID: auth_982x_mumbai_session_v4
                  </p>
                </div>
              </div>

              {/* Risk Score Display */}
              <div className="flex items-center gap-4 bg-neutral-50 border border-neutral-100 rounded-xl px-5 py-3 w-full sm:w-auto self-stretch justify-between shrink-0">
                <div className="text-left">
                  <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">
                    Risk Score
                  </span>
                  <span className="font-outfit text-3xl font-bold text-neutral-800 leading-tight">12</span>
                  <span className="text-[10px] font-semibold text-[#00b87c] block mt-0.5 leading-none">
                    Low Severity
                  </span>
                </div>
              </div>
            </div>

            {/* AI Reasoning Card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs relative overflow-hidden">
              {/* Left Purple Accent Bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#7c3aed]" />
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#7c3aed]/5 text-[#7c3aed] mt-0.5 shrink-0">
                  {/* Bot Icon */}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21m0 0l-.813-5.096M9 21h3.75m-6.75-3h7.5a2.25 2.25 0 002.25-2.25v-3.75a2.25 2.25 0 00-2.25-2.25h-7.5A2.25 2.25 0 004.5 12v3.75a2.25 2.25 0 002.25 2.25zM9 3.75V1.5m3 2.25V1.5m3 2.25V1.5m-3 2.25h3M6 7.5h12" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="font-outfit text-base font-bold text-neutral-800 tracking-tight">
                    AI Reasoning
                  </h3>
                  <p className="text-xs text-neutral-500 font-light leading-relaxed">
                    This login attempt was verified through high-entropy signals. The user successfully completed a 2FA challenge (OTP) on a <span className="font-semibold text-neutral-800">known device</span> previously associated with their account. The location matches the user&apos;s primary residence in Mumbai, and the login time falls within their historical behavior pattern. No anomalies were detected in the keystroke dynamics or browser fingerprint.
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Breakdown Card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-mono text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
                Verification Breakdown
              </h3>

              <div className="divide-y divide-neutral-100">
                {/* Row 1: iPhone 15 Pro */}
                <div className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-600 shrink-0">
                      {/* Mobile Phone Icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3M9 18h6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">iPhone 15 Pro</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Mobile App (v12.4.1)
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] text-[10px] font-semibold tracking-wide uppercase shrink-0">
                    &bull; Known Device
                  </span>
                </div>

                {/* Row 2: Mumbai, IN */}
                <div className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-600 shrink-0">
                      {/* Map Pin Icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25gA7.5 7.5 0 1119.5 10.5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h4 className="text-sm font-semibold text-neutral-800 truncate">Mumbai, IN</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5 truncate">
                        IP: 103.21.158.42 (Reliance Jio)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] text-[10px] font-semibold tracking-wide uppercase">
                      &bull; Known Location
                    </span>

                    {/* Small Map Image Snippet */}
                    <div className="h-10 w-16 border border-neutral-200/80 rounded-md overflow-hidden relative shadow-xs hidden sm:block">
                      <Image
                        src="/mumbai_map.png"
                        alt="Mumbai map location"
                        fill
                        className="object-cover filter brightness-[0.98]"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Password + OTP */}
                <div className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-600 shrink-0">
                      {/* Shield Key Icon */}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">Password + OTP</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Multi-factor Authentication
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] text-[10px] font-semibold tracking-wide uppercase shrink-0">
                    &bull; Passed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Session Details */}
          <div className="space-y-6">
            {/* Card: Recommended Actions */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.732 2.076 1.708M3.75 21.75h16.5M3.75 16.5h16.5m-16.5-5.25h16.5m-16.5-5.25h16.5" />
                </svg>
                <h3 className="font-outfit text-base font-bold text-neutral-800 tracking-tight">
                  Recommended Actions
                </h3>
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                {/* Item 1 */}
                <div className="flex items-start">
                  <input
                    id="action-monitor"
                    type="checkbox"
                    checked={monitorSession}
                    onChange={(e) => setMonitorSession(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-neutral-300 text-black focus:ring-black accent-black mt-0.5 shrink-0"
                  />
                  <label htmlFor="action-monitor" className="ml-3 text-xs leading-normal">
                    <span className="font-semibold text-neutral-800 block">Monitor Session</span>
                    <span className="text-neutral-400 font-light mt-0.5 block">
                      Keep an active log for the next 2 hours.
                    </span>
                  </label>
                </div>

                {/* Item 2 */}
                <div className="flex items-start">
                  <input
                    id="action-tag"
                    type="checkbox"
                    checked={tagFrequent}
                    onChange={(e) => setTagFrequent(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-neutral-300 text-black focus:ring-black accent-black mt-0.5 shrink-0"
                  />
                  <label htmlFor="action-tag" className="ml-3 text-xs leading-normal">
                    <span className="font-semibold text-neutral-800 block">Tag as &apos;Frequent&apos;</span>
                    <span className="text-neutral-400 font-light mt-0.5 block">
                      Avoid future challenges for this device/IP combo.
                    </span>
                  </label>
                </div>

                {/* Item 3 */}
                <div className="flex items-start">
                  <input
                    id="action-notify"
                    type="checkbox"
                    checked={notifyUser}
                    onChange={(e) => setNotifyUser(e.target.checked)}
                    className="h-4.5 w-4.5 rounded border-neutral-300 text-black focus:ring-black accent-black mt-0.5 shrink-0"
                  />
                  <label htmlFor="action-notify" className="ml-3 text-xs leading-normal">
                    <span className="font-semibold text-neutral-800 block">Notify User</span>
                    <span className="text-neutral-400 font-light mt-0.5 block">
                      Send &apos;New Login&apos; email alert.
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3.5 pt-3">
                <button
                  onClick={handleApplyActions}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg bg-black text-xs font-semibold text-white hover:bg-neutral-800 transition-all active:scale-[0.99] shadow-sm"
                >
                  Apply Selected Actions
                </button>
                <button
                  onClick={() => router.push("/admin-dashboard")}
                  className="w-full flex items-center justify-center py-2.5 px-4 rounded-lg border border-neutral-200 hover:border-neutral-300 text-xs font-semibold text-neutral-800 bg-white transition-all active:scale-[0.99] shadow-xs"
                >
                  Ignore Event
                </button>
              </div>
            </div>

            {/* Card: Session Details */}
            <div className="bg-[#f0f1f4]/60 border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                Session Details
              </h3>

              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs font-normal">
                <div>
                  <span className="font-mono text-[8px] font-semibold text-neutral-400 block uppercase tracking-wider">
                    Start Time
                  </span>
                  <span className="text-neutral-800 font-medium block mt-1">Oct 24, 14:02:11</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] font-semibold text-neutral-400 block uppercase tracking-wider">
                    Duration
                  </span>
                  <span className="text-neutral-800 font-medium block mt-1">04m 12s (Active)</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] font-semibold text-neutral-400 block uppercase tracking-wider">
                    Latency
                  </span>
                  <span className="text-neutral-800 font-medium block mt-1">42ms</span>
                </div>
                <div>
                  <span className="font-mono text-[8px] font-semibold text-neutral-400 block uppercase tracking-wider">
                    Browser
                  </span>
                  <span className="text-neutral-800 font-medium block mt-1">Safari 17.1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Chatbot Button & Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {showBot && (
          <div className="w-80 h-[380px] bg-white border border-neutral-200 rounded-xl shadow-2xl flex flex-col overflow-hidden mb-1">
            <div className="bg-black text-white px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-bold font-outfit">TrustAI Bot Assistant</span>
              <button onClick={() => setShowBot(false)} className="text-neutral-400 hover:text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-neutral-50 text-[11px] leading-relaxed">
              {chatHistory.map((ch, idx) => (
                <div key={idx} className={`flex ${ch.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-1.5 rounded-xl ${ch.sender === "user" ? "bg-black text-white rounded-br-none" : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-none"} shadow-xs`}>
                    {ch.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-100 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about this event..."
                className="flex-1 rounded-lg border border-neutral-300 px-3 py-1 text-[11px] focus:border-black focus:outline-none"
              />
              <button type="submit" className="bg-black text-white rounded-lg px-2.5 py-1 text-[11px] font-semibold hover:bg-neutral-800">
                Send
              </button>
            </form>
          </div>
        )}
        <button
          onClick={() => setShowBot(!showBot)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white hover:bg-neutral-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {/* Chatbot Icon */}
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.596.596 0 01-.73-.73 5.964 5.964 0 011.018-2.65C4.385 16.25 3 14.288 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
