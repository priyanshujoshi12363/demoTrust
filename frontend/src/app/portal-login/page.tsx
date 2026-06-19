"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function StaffLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("name@bank.com");
  const [password, setPassword] = useState("••••••••");
  const [deptId, setDeptId] = useState("SEC-00");
  const [twoFactor, setTwoFactor] = useState("000 000");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/admin-dashboard");
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#0c0c0e]">
      {/* Left Panel: Dark Slate, Dot Grid, and Brand Badge */}
      <div className="relative flex flex-col justify-between w-full lg:w-[60%] p-8 lg:p-16 bg-[#0f0f11] bg-dot-grid-dark border-r border-[#1f2025] overflow-hidden min-h-[450px] lg:min-h-screen">
        {/* Header Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-white text-black shadow-md">
            {/* Custom Shield Lock SVG */}
            <svg
              className="w-5 h-5 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
              />
            </svg>
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-white">TrustAI</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-start my-auto py-12 z-10 max-w-xl">
          <h1 className="font-outfit text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
            Advanced Fraud Detection &<br />Administrative Control.
          </h1>
          <p className="mt-5 text-sm lg:text-base text-neutral-400 font-light leading-relaxed">
            Real-time transaction monitoring and security orchestration for high-stakes financial operations. Built for analysts who demand precision.
          </p>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#2d2f39] bg-[#1a1b21] font-mono text-[10px] font-bold tracking-[0.1em] text-neutral-300">
              <span className="h-2 w-2 rounded-full bg-[#00b87c]" />
              <span>SYSTEM READY</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#2d2f39] bg-[#1a1b21] font-mono text-[10px] font-bold tracking-[0.1em] text-neutral-300">
              {/* Lock Icon */}
              <svg className="h-3 w-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span>TLS 1.3 ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Server Rack Image Overlay at Bottom */}
        <div className="absolute bottom-0 right-0 w-[450px] h-[250px] opacity-25 pointer-events-none select-none z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0f0f11] via-transparent to-transparent z-10" />
          <Image
            src="/server_rack.png"
            alt="Server Rack Hardware"
            fill
            className="object-cover filter grayscale"
          />
        </div>
      </div>

      {/* Right Panel: White Login Form */}
      <div className="flex flex-col items-center justify-between w-full lg:w-[40%] p-6 lg:p-12 bg-white min-h-[600px]">
        {/* Empty placeholder for alignment */}
        <div className="hidden lg:block h-10 w-full" />

        {/* Card Container */}
        <div className="w-full max-w-sm my-auto">
          <h2 className="font-outfit text-2xl font-semibold text-black tracking-tight">
            Bank Security Portal
          </h2>
          <p className="mt-1 text-sm text-neutral-500 font-normal">
            Authorized Personnel Only
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                Email Address
              </label>
              <div className="relative rounded-md shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* Mail icon */}
                  <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.92V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="name@bank.com"
                />
              </div>
            </div>

            {/* Row: Password & Dept. ID */}
            <div className="grid grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                  Password
                </label>
                <div className="relative rounded-md shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {/* Lock Icon */}
                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              {/* Dept. ID */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                  Dept. ID
                </label>
                <div className="relative rounded-md shadow-xs">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {/* ID badge icon */}
                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25zm.001-12a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 4.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    required
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    className="block w-full rounded-md border border-neutral-300 bg-[#fafafa]/50 py-2 pl-9 pr-3 font-mono text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black uppercase"
                    placeholder="SEC-00"
                  />
                </div>
              </div>
            </div>

            {/* 2FA Code */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                  2fa Code
                </label>
                <a
                  href="#resend"
                  onClick={(e) => e.preventDefault()}
                  className="font-mono text-[9px] font-bold tracking-wider text-neutral-500 hover:text-black transition-colors uppercase"
                >
                  Resend SMS?
                </a>
              </div>
              <div className="relative rounded-md shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  {/* Security Key / Check Icon */}
                  <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.03 0 1.9.732 2.076 1.708M3.75 21.75h16.5M3.75 16.5h16.5m-16.5-5.25h16.5m-16.5-5.25h16.5" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.value)}
                  className="block w-full rounded-md border border-neutral-300 bg-white py-2 pl-9 pr-3 font-mono text-sm tracking-widest text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="000 000"
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <input
                id="remember-workstation"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
              />
              <label htmlFor="remember-workstation" className="ml-2 text-xs text-neutral-500 font-normal select-none">
                Remember this workstation for 12 hours
              </label>
            </div>

            {/* Submit Secure Login */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-black py-2.5 px-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-70 disabled:active:scale-100 shadow-sm"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Secure Login</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="w-full max-w-sm mt-8 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
          <span>&copy; 2024 TrustAI Systems</span>
          <div className="flex gap-4">
            <a href="#legal" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">Legal</a>
            <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-black transition-colors">Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
