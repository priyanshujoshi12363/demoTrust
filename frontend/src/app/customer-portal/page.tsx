"use client";

import { useState } from "react";
import Image from "next/image";

export default function CustomerDashboard() {
  const [showTrustBot, setShowTrustBot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Hello Arjun, I am TrustBot. How can I help secure your account today?" }
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatMessage("");

    // Simulate TrustBot answer
    setTimeout(() => {
      let botResponse = "I've checked your account status. Your risk score is exceptionally low (12/100) and all 5 recent events were fully authorized by you. No further actions are needed.";
      if (userMsg.toLowerCase().includes("transfer") || userMsg.toLowerCase().includes("1250")) {
        botResponse = "The external transfer of $1,250.00 to Savings Acct ****8821 was flagged as low-risk because it matches your typical transfer patterns and was approved via SMS MFA from your iPhone 15 Pro.";
      } else if (userMsg.toLowerCase().includes("limit") || userMsg.toLowerCase().includes("change")) {
        botResponse = "To modify your transaction limits or settings, go to Security Settings. Note that any changes will require a biometric validation from your registered iPhone.";
      }
      setChatHistory(prev => [...prev, { sender: "bot", text: botResponse }]);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#111] font-sans">
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
          <span className="bg-black text-white font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">
            Customer Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#00b87c] ring-2 ring-white" />
          </button>
          {/* User Avatar */}
          <div className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-black text-white font-mono text-xs font-bold tracking-wider select-none shadow-sm">
            AA
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80">
          <div>
            <h1 className="font-outfit text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
              Good morning, Arjun
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] text-xs font-medium">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
                <span>Verified</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full border border-neutral-300 bg-white text-neutral-700 text-xs font-medium">
                Premium Account
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">
              Last Intelligence Update
            </span>
            <span className="font-mono text-xl font-bold tracking-tight text-neutral-800">
              14:24:02 UTC
            </span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Column: Account security and activity logs (spans 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Secure Card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xs">
              {/* Risk Gauge Circle */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-neutral-100"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  {/* Gauge Arc (12% of circum 251.2 = 30.14) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#00b87c]"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * 12) / 100}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-outfit text-4xl font-bold text-neutral-800">12</span>
                  <span className="font-mono text-[8px] font-bold tracking-widest text-neutral-400 uppercase mt-0.5">
                    Risk Score
                  </span>
                </div>
              </div>

              {/* Secure Description */}
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <svg className="w-5 h-5 text-[#00b87c] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                  <h3 className="font-outfit text-lg font-bold text-[#00b87c] tracking-tight">
                    Your Account is Secure
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  We are continuously monitoring for unauthorized access. No anomalies detected in the last 48 hours.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 pt-2 text-xs font-normal text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Last checked: 2 mins ago</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span>Multi-factor Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="font-outfit text-lg font-bold text-neutral-800 tracking-tight">
                  Recent Activity
                </h3>
                <a href="#all" onClick={(e) => e.preventDefault()} className="font-mono text-[10px] font-bold tracking-wider text-neutral-500 hover:text-black transition-colors uppercase">
                  View All Intelligence
                </a>
              </div>

              {/* Activity List */}
              <div className="divide-y divide-neutral-100">
                {/* Row 1: Portal Login */}
                <div className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-600 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">Portal Login</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Chrome via macOS &bull; London, UK
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-[10px] font-medium text-neutral-400">10:45 AM</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] uppercase">
                      ALLOWED
                    </span>
                  </div>
                </div>

                {/* Row 2: External Transfer */}
                <div className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-600 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h11.25" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">External Transfer - $1,250.00</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Target: Savings Acct &bull; **** 8821
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-[10px] font-medium text-neutral-400">Yesterday</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] uppercase">
                      ALLOWED
                    </span>
                  </div>
                </div>

                {/* Row 3: MFA Verification Success */}
                <div className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-600 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">MFA Verification Success</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Device: iPhone 15 Pro
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-[10px] font-medium text-neutral-400">Yesterday</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] uppercase">
                      ALLOWED
                    </span>
                  </div>
                </div>

                {/* Row 4: Security Settings Updated */}
                <div className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-600 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0a5.625 5.625 0 11-11.25 0 5.625 5.625 0 0111.25 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">Security Settings Updated</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Contact email modified
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-[10px] font-medium text-neutral-400">3 days ago</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] uppercase">
                      ALLOWED
                    </span>
                  </div>
                </div>

                {/* Row 5: Amazon Digital Services */}
                <div className="py-4.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-100 text-neutral-600 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-800">Amazon Digital Services - $14.99</h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        Recurring Subscription
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="font-mono text-[10px] font-medium text-neutral-400">4 days ago</span>
                    <span className="font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c] uppercase">
                      ALLOWED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Metrics, Actions, Advisory (spans 1 col) */}
          <div className="space-y-6">
            {/* Metric 1: Trust Score */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                  Trust Score
                </span>
                <div className="font-outfit text-3xl font-bold text-neutral-800 mt-1">92%</div>
              </div>
              <div className="flex items-center gap-1.5 text-[#00b87c] font-semibold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                <span>2%</span>
              </div>
            </div>

            {/* Metric 2: Active Sessions */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                  Active Sessions
                </span>
                <div className="font-outfit text-2xl font-bold text-neutral-800 mt-1">1 Device</div>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-500">
                {/* Mobile Phone Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3M9 18h6" />
                </svg>
              </div>
            </div>

            {/* Metric 3: Security Events */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                  Security Events
                </span>
                <div className="font-outfit text-2xl font-bold text-neutral-800 mt-1">0 Alerts</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#00b87c]/5 border border-[#00b87c]/20 text-[#00b87c]">
                {/* Shield Icon */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
            </div>

            {/* Card: Security Actions */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-outfit text-base font-bold text-neutral-800 tracking-tight">
                Security Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neutral-900 bg-white text-sm font-semibold text-black hover:bg-neutral-50 transition-all active:scale-[0.99] shadow-xs">
                  {/* Warning Triangle Icon */}
                  <svg className="w-4 h-4 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Report Suspicious Activity</span>
                </button>
                <button
                  onClick={() => setShowTrustBot(!showTrustBot)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-black text-sm font-semibold text-white hover:bg-neutral-800 transition-all active:scale-[0.99] shadow-sm"
                >
                  {/* Chatbot Icon */}
                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a.596.596 0 01-.73-.73 5.964 5.964 0 011.018-2.65C4.385 16.25 3 14.288 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                  <span>Chat with TrustBot</span>
                </button>
              </div>
            </div>

            {/* Card: Advisory (Black Card) */}
            <div className="bg-black text-white rounded-2xl p-6 shadow-md relative overflow-hidden space-y-4">
              <div className="inline-block bg-[#1f2025] px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest text-[#a1a1aa] uppercase">
                Advisory
              </div>
              <h4 className="font-outfit text-base font-bold text-white tracking-tight leading-snug">
                Advanced Protection is Active
              </h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Our AI agents are shielding your transactions with quantum-safe encryption protocols.
              </p>
              <div className="flex items-center gap-3 pt-2">
                {/* Avatars Overlay */}
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full border border-black bg-neutral-700 overflow-hidden relative">
                    <div className="h-full w-full bg-slate-400 flex items-center justify-center text-[8px]">👩</div>
                  </div>
                  <div className="h-6 w-6 rounded-full border border-black bg-neutral-600 overflow-hidden relative">
                    <div className="h-full w-full bg-zinc-400 flex items-center justify-center text-[8px]">🧔</div>
                  </div>
                  <div className="h-6 w-6 rounded-full border border-black bg-neutral-500 overflow-hidden relative">
                    <div className="h-full w-full bg-blue-400 flex items-center justify-center text-[8px]">👵</div>
                  </div>
                  <div className="h-6 w-6 rounded-full border border-black bg-[#1f2025] text-white flex items-center justify-center text-[8px] font-bold">
                    +4
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono tracking-wide uppercase">
                  Monitored by Global Security Ops
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* TrustBot Slide-out Panel (Interactive Detail) */}
      {showTrustBot && (
        <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-white border border-neutral-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00b87c] animate-pulse" />
              <span className="font-outfit font-bold text-sm">TrustAI Chatbot</span>
            </div>
            <button onClick={() => setShowTrustBot(false)} className="text-neutral-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Chat Logs */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50 text-xs">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 ${msg.sender === "user" ? "bg-black text-white rounded-br-none" : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-none"} shadow-xs`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask TrustBot about your recent activity..."
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs focus:border-black focus:outline-none"
            />
            <button type="submit" className="bg-black text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-neutral-800">
              Send
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-[#f8f9fa] border-t border-neutral-200/80 mt-16 px-6 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div>
          <span className="font-bold text-neutral-800">TrustAI</span> &copy; 2024 Secure Infrastructure.
        </div>
        <div className="flex gap-6">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}
