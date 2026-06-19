"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AnalystLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("analyst@trustai.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simple routing based on email input to let the user view both dashboards
    setTimeout(() => {
      if (email.toLowerCase().includes("customer") || email.toLowerCase().includes("arjun")) {
        router.push("/customer-portal");
      } else {
        router.push("/admin-dashboard");
      }
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#f8f9fa]">
      {/* Left Panel: Light Grid & Branding */}
      <div className="relative flex flex-col justify-between w-full lg:w-[60%] p-8 lg:p-16 bg-[#f3f4f6] bg-square-grid border-r border-[#e5e7eb] overflow-hidden min-h-[400px] lg:min-h-screen">
        {/* Header Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-black text-white shadow-sm">
            {/* Custom Shield Lock SVG */}
            <svg
              className="w-5 h-5 text-white"
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
          <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-start my-auto py-12 z-10 max-w-xl">
          <h1 className="font-outfit text-4xl lg:text-5xl font-semibold tracking-tight text-black leading-[1.15]">
            AI-Powered Banking Security
          </h1>
          <p className="mt-4 text-base lg:text-lg text-neutral-600 font-light leading-relaxed">
            Next-generation fraud detection and transaction monitoring for elite financial institutions.
          </p>

          {/* Floated 3D Shield Image */}
          <div className="relative mt-12 w-full max-w-[420px] aspect-square rounded-2xl border border-neutral-200/80 bg-white/40 backdrop-blur-sm shadow-xl p-4 overflow-hidden flex items-center justify-center group">
            <div className="absolute inset-0 bg-radial-gradient from-cyan-500/5 to-transparent pointer-events-none" />
            <Image
              src="/shield_3d.png"
              alt="3D Metallic Security Shield"
              width={380}
              height={380}
              priority
              className="object-contain drop-shadow-2xl select-none"
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-500 z-10 mt-6">
          Enterprise Grade Integrity &bull; Verified Access Only
        </div>
      </div>

      {/* Right Panel: Login Card */}
      <div className="flex flex-col items-center justify-center w-full lg:w-[40%] p-6 lg:p-12 bg-white min-h-[500px]">
        <div className="w-full max-w-md">
          {/* Welcome Card Box */}
          <div className="w-full border border-neutral-200/80 rounded-2xl bg-[#fafafa]/50 p-8 lg:p-10 shadow-sm">
            <h2 className="font-outfit text-2xl font-semibold text-black tracking-tight">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500 font-normal">
              Sign in to your account
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Email Address
                  </label>
                </div>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {/* Mail Icon */}
                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.92V6.75" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="analyst@trustai.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs text-neutral-500 hover:text-black font-normal transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {/* Lock Icon */}
                    <svg className="h-4.5 w-4.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-black transition-colors"
                  >
                    {showPassword ? (
                      /* Eye Slash Icon */
                      <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      /* Eye Icon */
                      <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-device"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                />
                <label htmlFor="remember-device" className="ml-2 text-xs text-neutral-500 font-normal select-none">
                  Remember this device for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-70 disabled:active:scale-100 shadow-sm"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-xs text-neutral-500">
              New to the Command Center?{" "}
              <a href="#register" onClick={(e) => e.preventDefault()} className="font-semibold text-black hover:underline">
                Register new account
              </a>
            </div>
          </div>

          {/* Under Card Status Indicators */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs font-normal text-neutral-500">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00b87c] animate-pulse" />
              <span>Global API: Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Lock Shield Icon */}
              <svg className="h-3.5 w-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span>SSO Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
