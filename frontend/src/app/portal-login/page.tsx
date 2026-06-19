"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserTie,
  FaUser,
  FaUserPlus,
  FaPhone,
  FaIdCard,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaKey,
  FaMobileAlt,
  FaArrowRight,
  FaSpinner,
  FaDatabase,
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { api } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────
type Decision = "ALLOW" | "CHALLENGE" | "REVIEW" | "BLOCK";
type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const severityStyle: Record<Severity, string> = {
  LOW: "text-emerald-700 bg-emerald-50 border-emerald-200",
  MEDIUM: "text-amber-700 bg-amber-50 border-amber-200",
  HIGH: "text-orange-700 bg-orange-50 border-orange-200",
  CRITICAL: "text-red-700 bg-red-50 border-red-200",
};

const decisionStyle: Record<Decision, string> = {
  ALLOW: "text-emerald-700 bg-emerald-50 ring-emerald-200",
  CHALLENGE: "text-amber-700 bg-amber-50 ring-amber-200",
  REVIEW: "text-blue-700 bg-blue-50 ring-blue-200",
  BLOCK: "text-red-700 bg-red-50 ring-red-200",
};

function getSeverityIcon(severity: string) {
  const cls = "w-4 h-4";
  if (severity === "LOW") return <FaCheckCircle className={`${cls} text-emerald-500`} />;
  if (severity === "CRITICAL") return <FaTimesCircle className={`${cls} text-red-500`} />;
  return <FaExclamationTriangle className={`${cls} ${severity === "HIGH" ? "text-orange-500" : "text-amber-500"}`} />;
}

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({
  label,
  children,
  right,
}: {
  label: string;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="font-mono text-[9px] font-bold tracking-[0.18em] text-gray-400 uppercase">
          {label}
        </label>
        {right}
      </div>
      {children}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
function Input({
  icon,
  right,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder-gray-400 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
      />
      {right && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          {right}
        </span>
      )}
    </div>
  );
}

// ─── Primary button ───────────────────────────────────────────────────────────
function PrimaryBtn({
  children,
  disabled,
  loading,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 py-2.5 px-4 text-sm font-semibold text-white transition hover:bg-gray-700 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {loading ? (
        <FaSpinner className="h-4 w-4 animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}

// ─── Step list for checking screen ───────────────────────────────────────────
const CHECK_STEPS = [
  "Checking device information",
  "Verifying location data",
  "Authenticating credentials",
  "Running AI security analysis",
];

// ─────────────────────────────────────────────────────────────────────────────
export default function PortalLogin() {
  const router = useRouter();

  // UI State
  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState<"customer" | "bank" | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"bank" | "customer" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkStep, setCheckStep] = useState(0);

  // Device & Location
  const [deviceInfo, setDeviceInfo] = useState({
    deviceId: "",
    os: "Unknown",
    browser: "Unknown",
    isNewDevice: false,
  });
  const [locationInfo, setLocationInfo] = useState({
    ipAddress: "",
    country: "Unknown",
    city: "Unknown",
  });

  // Forms
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    accountType: "SAVINGS",
  });

  // Risk & OTP
  const [showRiskResult, setShowRiskResult] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [riskResult, setRiskResult] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const HARDCODED_OTP = "123456";

  // ── Detect device & location ─────────────────────────────────────────────
  useEffect(() => {
    const ua = window.navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";
    if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";
    else if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";
    if (ua.indexOf("Windows") > -1) os = "Windows";
    else if (ua.indexOf("Mac") > -1) os = "macOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";
    const screenInfo = `${window.screen.width}x${window.screen.height}`;
    const deviceId = `${browser}_${os}_${screenInfo}`.replace(/\s/g, "_");
    setDeviceInfo({ deviceId: deviceId.slice(0, 40), os, browser, isNewDevice: false });

    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((d) =>
        setLocationInfo({ ipAddress: d.ip || "Unknown", country: d.country_code || "Unknown", city: d.city || "Unknown" })
      )
      .catch(() =>
        setLocationInfo({ ipAddress: "Unknown", country: "Unknown", city: "Unknown" })
      );
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const handleBack = () => router.push("/");

  const routeToDashboard = (user: any) => {
    if (user.role === "admin" || user.role === "analyst") router.push("/admin-dashboard");
    else router.push("/customer-portal");
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setIsChecking(true);
    setCheckStep(0);

    const delays = [500, 1000, 1500, 2000];
    for (let i = 0; i < delays.length; i++) {
      setCheckStep(i);
      await new Promise((res) => setTimeout(res, delays[i]));
    }

    try {
      const response = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          device: deviceInfo,
          location: locationInfo,
          behavior: { eventType: "LOGIN", loginHour: new Date().getHours(), sessionDuration: 0, typingSpeed: 72 },
          metadata: { channel: "WEB", userAgent: window.navigator.userAgent, timestamp: new Date().toISOString() },
        }),
      });
      const data = await response.json();
      if (!data.success) { setError(data.message || "Login failed"); setLoading(false); setIsChecking(false); return; }
      setUserData(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("riskData", JSON.stringify(data.risk));
      setRiskResult(data.risk);
      setShowRiskResult(true);
      setLoading(false);
      setIsChecking(false);
      if (data.risk.decision === "CHALLENGE" || data.risk.decision === "REVIEW") setShowOTP(true);
      else routeToDashboard(data.user);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
      setIsChecking(false);
    }
  };

  // ── OTP ───────────────────────────────────────────────────────────────────
  const handleVerifyOTP = () => {
    if (otpInput === HARDCODED_OTP) {
      setOtpSuccess(true);
      setOtpError("");
      setTimeout(() => { if (userData) routeToDashboard(userData); }, 1500);
    } else {
      setOtpError("Invalid OTP. Please try again.");
      setOtpInput("");
    }
  };

  // ── Register ──────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
          phone: registerData.phone,
          accountType: registerData.accountType,
          role: selectedRole === "bank" ? "analyst" : "customer",
        }),
      });
      const data = await response.json();
      if (!data.success) { setError(data.message || "Registration failed"); setLoading(false); return; }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      routeToDashboard(data.user);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  // ── Toggle mode ───────────────────────────────────────────────────────────
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSelectedRole(null);
    setLoginRole(null);
    setShowRiskResult(false);
    setShowOTP(false);
    setRiskResult(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full bg-white">

      {/* ── Left panel ───────────────────────────────────────────────────── */}
      <aside className="relative hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-12 bg-[#0A0A0B] flex-shrink-0 overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        {/* Soft glow */}
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

        {/* Back */}
        <div className="relative z-10">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-medium">Back to home</span>
          </button>
        </div>

        {/* Brand + copy */}
        <div className="relative z-10 space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center">
              <HiOutlineShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">TrustAI</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-white leading-tight tracking-tight">
              {isLogin ? "Secure access\nportal." : "Create your\naccount."}
            </h1>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed font-light">
              {isLogin
                ? "Sign in to access your personalized dashboard and AI-powered security features."
                : "Join TrustAI to protect your banking experience with real-time fraud detection."}
            </p>
          </div>

          {/* Mini stat pills */}
          <div className="space-y-2 pt-2">
            {[
              { dot: "bg-emerald-400", label: "AI risk scoring on every login" },
              { dot: "bg-gray-600", label: "Device & location fingerprinting" },
              { dot: "bg-gray-600", label: "OTP challenge on suspicious events" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                <span className="text-xs text-gray-500 font-mono">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-gray-600 font-mono">
          © 2026 TrustAI · All rights reserved
        </p>
      </aside>

      {/* ── Right panel ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto bg-gray-50">
        {/* Mobile back */}
        <div className="lg:hidden w-full max-w-sm mb-8">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-medium">Back</span>
          </button>
        </div>

        <div className="w-full max-w-sm space-y-6">

          {/* ── Error banner ────────────────────────────────────────────── */}
          {error && !isChecking && (
            <div className="flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <FaTimesCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* ── CHECKING SCREEN ─────────────────────────────────────────── */}
          {isChecking && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FaSpinner className="w-5 h-5 text-gray-900 animate-spin" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Analyzing your login</h2>
                <p className="text-xs text-gray-400 mt-1 font-mono">AI security check in progress</p>
              </div>

              {/* Context data */}
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-3 flex items-center gap-1.5">
                  <FaDatabase className="w-3 h-3" /> Data being analyzed
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Device", value: `${deviceInfo.browser} · ${deviceInfo.os}` },
                    { label: "Location", value: `${locationInfo.city}, ${locationInfo.country}` },
                    { label: "IP Address", value: locationInfo.ipAddress },
                    { label: "Timestamp", value: new Date().toLocaleTimeString() },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-[11px] text-gray-400">{row.label}</span>
                      <span className="text-[11px] font-mono text-gray-700">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div className="px-5 py-4 space-y-2">
                {CHECK_STEPS.map((step, idx) => {
                  const done = idx < checkStep;
                  const active = idx === checkStep;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                        done ? "bg-emerald-50" : active ? "bg-gray-100" : ""
                      }`}
                    >
                      {done ? (
                        <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      ) : active ? (
                        <FaSpinner className="w-3.5 h-3.5 text-gray-600 animate-spin flex-shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-xs font-mono ${done ? "text-emerald-700" : active ? "text-gray-800" : "text-gray-400"}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── RISK RESULT ─────────────────────────────────────────────── */}
          {showRiskResult && riskResult && !showOTP && !isChecking && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Security assessment</h2>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">Login attempt analyzed</p>
              </div>

              {/* Score strip */}
              <div className={`px-6 py-4 border-b border-gray-100 ${severityStyle[riskResult.severity as Severity] || "bg-gray-50 border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {getSeverityIcon(riskResult.severity)}
                    <div>
                      <p className="text-[10px] font-mono font-bold tracking-widest uppercase text-current opacity-60">
                        Risk score
                      </p>
                      <p className="text-2xl font-bold leading-none">{riskResult.riskScore}<span className="text-sm font-normal opacity-50">/100</span></p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-60 mb-1">Decision</p>
                    <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold tracking-wider ring-1 ring-inset ${decisionStyle[riskResult.decision as Decision] || ""}`}>
                      {riskResult.decision}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs opacity-70">
                  Trust score: <strong>{riskResult.trustScore}/100</strong>
                </div>
              </div>

              {/* Reasons */}
              {riskResult.reasons?.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-3">
                    Risk factors
                  </p>
                  <ul className="space-y-1.5">
                    {riskResult.reasons.map((r: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="mt-1 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Explanation */}
              {riskResult.explanation && (
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-2">
                    AI explanation
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">{riskResult.explanation}</p>
                </div>
              )}

              {/* Recommendations */}
              {riskResult.recommendations?.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-3">
                    Recommendations
                  </p>
                  <ul className="space-y-1.5">
                    {riskResult.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <FaArrowRight className="w-2.5 h-2.5 mt-0.5 text-gray-400 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Incident ID */}
              {riskResult.incidentId && (
                <div className="px-6 py-3 border-b border-gray-100">
                  <span className="text-[10px] font-mono text-gray-400">
                    Incident · <span className="text-gray-600">{riskResult.incidentId}</span>
                  </span>
                </div>
              )}

              {/* CTA */}
              <div className="px-6 py-5">
                <PrimaryBtn
                  onClick={() => {
                    if (riskResult.decision === "CHALLENGE" || riskResult.decision === "REVIEW") setShowOTP(true);
                    else routeToDashboard(userData);
                  }}
                >
                  {riskResult.decision === "ALLOW" ? "Continue to dashboard" : "Verify with OTP"}
                  <FaArrowRight className="w-3.5 h-3.5" />
                </PrimaryBtn>
              </div>
            </div>
          )}

          {/* ── OTP VERIFICATION ────────────────────────────────────────── */}
          {showOTP && !isChecking && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 text-center">
                <div className="w-12 h-12 mx-auto rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                  <FaMobileAlt className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-base font-bold text-gray-900">OTP verification</h2>
                <p className="text-xs text-gray-400 mt-1">
                  A one-time password was sent to your registered mobile
                </p>
                <p className="text-[10px] font-mono text-gray-400 mt-1">
                  Demo OTP: <span className="font-bold text-gray-600">123456</span>
                </p>
              </div>

              <div className="px-6 py-5 space-y-4">
                <Field label="Enter OTP">
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="block w-full rounded-lg border border-gray-200 bg-white py-3 text-center text-xl tracking-[0.6em] font-mono text-gray-900 placeholder-gray-300 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="000000"
                    maxLength={6}
                  />
                  {otpError && <p className="text-xs text-red-600 mt-1">{otpError}</p>}
                  {otpSuccess && (
                    <div className="flex items-center gap-1.5 text-emerald-600 mt-1">
                      <FaCheckCircle className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">Verified — redirecting…</span>
                    </div>
                  )}
                </Field>

                <PrimaryBtn
                  onClick={handleVerifyOTP}
                  disabled={otpInput.length !== 6 || otpSuccess}
                >
                  {otpSuccess ? (
                    <><FaCheckCircle className="w-3.5 h-3.5" /> Verified</>
                  ) : (
                    <><FaKey className="w-3.5 h-3.5" /> Verify OTP</>
                  )}
                </PrimaryBtn>

                <button
                  onClick={() => setOtpInput(HARDCODED_OTP)}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-900 transition-colors font-mono"
                >
                  Autofill demo OTP
                </button>

                <button
                  onClick={() => { setShowOTP(false); setShowRiskResult(true); }}
                  className="w-full text-center text-xs text-gray-400 hover:text-gray-900 transition-colors"
                >
                  ← Back to security assessment
                </button>
              </div>
            </div>
          )}

          {/* ── LOGIN FORM ──────────────────────────────────────────────── */}
          {!isChecking && !showRiskResult && !showOTP && isLogin && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">

              {/* Role picker — shown when no role selected */}
              {!loginRole && (
                <>
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-base font-bold text-gray-900">Welcome back</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Choose how you're signing in</p>
                  </div>
                  <div className="px-6 py-6 space-y-3">
                    <button
                      onClick={() => setLoginRole("customer")}
                      className="group w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center transition-colors flex-shrink-0">
                        <FaUser className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Customer</p>
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">Security · Transactions · Alerts</p>
                      </div>
                      <FaArrowRight className="w-3 h-3 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>

                    <button
                      onClick={() => setLoginRole("bank")}
                      className="group w-full flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center transition-colors flex-shrink-0">
                        <FaUserTie className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Bank Employee</p>
                        <p className="text-[11px] font-mono text-gray-400 mt-0.5">Admin dashboard · Fraud monitoring</p>
                      </div>
                      <FaArrowRight className="w-3 h-3 text-gray-300 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </button>
                  </div>
                  <div className="px-6 pb-5 text-center border-t border-gray-100 pt-4">
                    <button
                      onClick={toggleMode}
                      className="text-xs text-gray-400 hover:text-gray-900 transition-colors font-medium"
                    >
                      Don't have an account?{" "}
                      <span className="text-gray-900 underline underline-offset-2">Sign up</span>
                    </button>
                  </div>
                </>
              )}

              {/* Customer login */}
              {loginRole === "customer" && (
                <>
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                    <button
                      onClick={() => setLoginRole(null)}
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <FaArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Customer sign in</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Access your account portal</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-500 text-[10px] font-mono">
                      <FaUser className="w-2.5 h-2.5" /> Customer
                    </span>
                  </div>
                  <form onSubmit={handleLogin} className="px-6 py-5 space-y-4">
                    <Field label="Email address">
                      <Input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: (e.target as HTMLInputElement).value })}
                        placeholder="you@example.com"
                        icon={<FaEnvelope className="w-3.5 h-3.5" />}
                      />
                    </Field>
                    <Field
                      label="Password"
                      right={
                        <a href="#" className="text-[10px] font-mono text-gray-400 hover:text-gray-900 transition-colors">
                          Forgot password?
                        </a>
                      }
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: (e.target as HTMLInputElement).value })}
                        placeholder="••••••••"
                        icon={<FaLock className="w-3.5 h-3.5" />}
                        right={
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-900 transition-colors">
                            {showPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                          </button>
                        }
                      />
                    </Field>
                    <PrimaryBtn type="submit" loading={loading}>
                      Sign in <FaArrowRight className="w-3.5 h-3.5" />
                    </PrimaryBtn>
                  </form>
                  <div className="px-6 pb-5 text-center border-t border-gray-100 pt-4">
                    <button onClick={toggleMode} className="text-xs text-gray-400 hover:text-gray-900 transition-colors font-medium">
                      Don't have an account?{" "}
                      <span className="text-gray-900 underline underline-offset-2">Sign up</span>
                    </button>
                  </div>
                </>
              )}

              {/* Bank employee login */}
              {loginRole === "bank" && (
                <>
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
                    <button
                      onClick={() => setLoginRole(null)}
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <FaArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">Employee sign in</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Access the admin dashboard</p>
                    </div>
                    <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-900 text-white text-[10px] font-mono">
                      <FaUserTie className="w-2.5 h-2.5" /> Staff
                    </span>
                  </div>

                  {/* Staff notice */}
                  <div className="mx-6 mt-5 flex items-start gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <FaShieldAlt className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-mono text-gray-500 leading-relaxed">
                      Use your organization credentials. Access is logged and monitored.
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="px-6 py-5 space-y-4">
                    <Field label="Work email">
                      <Input
                        type="email"
                        required
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: (e.target as HTMLInputElement).value })}
                        placeholder="you@bank.com"
                        icon={<FaEnvelope className="w-3.5 h-3.5" />}
                      />
                    </Field>
                    <Field label="Password">
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: (e.target as HTMLInputElement).value })}
                        placeholder="••••••••"
                        icon={<FaLock className="w-3.5 h-3.5" />}
                        right={
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-900 transition-colors">
                            {showPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                          </button>
                        }
                      />
                    </Field>
                    <PrimaryBtn type="submit" loading={loading}>
                      Access dashboard <FaArrowRight className="w-3.5 h-3.5" />
                    </PrimaryBtn>
                  </form>
                  <div className="px-6 pb-5 text-center border-t border-gray-100 pt-4">
                    <button onClick={toggleMode} className="text-xs text-gray-400 hover:text-gray-900 transition-colors font-medium">
                      Not an employee?{" "}
                      <span className="text-gray-900 underline underline-offset-2">Create customer account</span>
                    </button>
                  </div>
                </>
              )}

            </div>
          )}

          {/* ── REGISTER FORM ───────────────────────────────────────────── */}
          {!isChecking && !showRiskResult && !showOTP && !isLogin && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">Create account</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in the details to get started</p>
              </div>

              <form onSubmit={handleRegister} className="px-6 py-5 space-y-4">
                {/* Role picker */}
                <Field label="I am a">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { role: "bank" as const, icon: <FaUserTie className="w-3.5 h-3.5" />, label: "Bank employee" },
                      { role: "customer" as const, icon: <FaUser className="w-3.5 h-3.5" />, label: "Customer" },
                    ].map(({ role, icon, label }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                          selectedRole === role
                            ? "border-gray-900 bg-gray-900 text-white"
                            : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900"
                        }`}
                      >
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Full name">
                  <Input
                    type="text"
                    required
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: (e.target as HTMLInputElement).value })}
                    placeholder="John Doe"
                    icon={<FaUser className="w-3.5 h-3.5" />}
                  />
                </Field>

                <Field label="Email address">
                  <Input
                    type="email"
                    required
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: (e.target as HTMLInputElement).value })}
                    placeholder="you@example.com"
                    icon={<FaEnvelope className="w-3.5 h-3.5" />}
                  />
                </Field>

                <Field label="Password">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: (e.target as HTMLInputElement).value })}
                    placeholder="Min 6 characters"
                    icon={<FaLock className="w-3.5 h-3.5" />}
                    right={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                      </button>
                    }
                  />
                </Field>

                <Field label="Phone number">
                  <Input
                    type="tel"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: (e.target as HTMLInputElement).value })}
                    placeholder="+91 98765 43210"
                    icon={<FaPhone className="w-3.5 h-3.5" />}
                  />
                </Field>

                {selectedRole === "customer" && (
                  <Field label="Account type">
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <FaIdCard className="w-3.5 h-3.5" />
                      </span>
                      <select
                        value={registerData.accountType}
                        onChange={(e) => setRegisterData({ ...registerData, accountType: e.target.value })}
                        className="block w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-900 transition focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 appearance-none"
                      >
                        <option value="SAVINGS">Savings</option>
                        <option value="CURRENT">Current</option>
                        <option value="BUSINESS">Business</option>
                      </select>
                    </div>
                  </Field>
                )}

                {!selectedRole && (
                  <p className="flex items-center gap-1.5 text-[11px] text-amber-600 font-mono">
                    <FaExclamationTriangle className="w-3 h-3 flex-shrink-0" />
                    Select your role to continue
                  </p>
                )}

                <PrimaryBtn type="submit" loading={loading} disabled={!selectedRole}>
                  <FaUserPlus className="w-3.5 h-3.5" /> Create account
                </PrimaryBtn>
              </form>

              <div className="px-6 pb-5 text-center">
                <button
                  onClick={toggleMode}
                  className="text-xs text-gray-400 hover:text-gray-900 transition-colors font-medium"
                >
                  Already have an account? <span className="text-gray-900 underline underline-offset-2">Sign in</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer note */}
          <p className="text-center text-[10px] font-mono text-gray-400">
            Secure · Encrypted · Trusted
          </p>
        </div>
      </main>
    </div>
  );
}