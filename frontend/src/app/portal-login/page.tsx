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
  FaLaptop,
  FaGlobe,
  FaClock,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaKey,
  FaMobileAlt,
  FaArrowRight,
  FaSpinner,
  FaDatabase,
  FaNetworkWired
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import {api} from "@/lib/api";

export default function PortalLogin() {
  const router = useRouter();
  
  // ============================================
  // UI State
  // ============================================
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"bank" | "customer" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checkStep, setCheckStep] = useState(0);

  // ============================================
  // Device & Location Info
  // ============================================
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

  // ============================================
  // Form Data
  // ============================================
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    accountType: "SAVINGS",
  });

  // ============================================
  // Risk & OTP State
  // ============================================
  const [showRiskResult, setShowRiskResult] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [riskResult, setRiskResult] = useState<any>(null);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const HARDCODED_OTP = "123456";

  // ============================================
  // Sample Data for Display
  // ============================================
  const sampleData = {
    device: {
      deviceId: "Chrome_Windows_1920x1080",
      os: "Windows",
      browser: "Chrome",
      isNewDevice: false,
    },
    location: {
      ipAddress: "103.21.158.42",
      country: "IN",
      city: "Mumbai",
    },
    behavior: {
      eventType: "LOGIN",
      loginHour: 14,
      sessionDuration: 0,
      typingSpeed: 72,
    },
    metadata: {
      channel: "WEB",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      timestamp: new Date().toISOString(),
    },
  };

  // Sample Response Data
  const sampleResponse = {
    success: true,
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: "65a1b2c3d4e5f67890123456",
      userId: "user_JObyohTB76",
      name: "Priyanshu Joshi",
      email: "joshipriyanshu5753@gmail.com",
      role: "customer",
      kycVerified: false,
    },
    risk: {
      riskScore: 44,
      trustScore: 56,
      severity: "MEDIUM",
      decision: "CHALLENGE",
      reasons: [
        "Unknown device: Chrome_Windows_1920x1080 (+18)",
        "Login from new city: Mumbai (+8)",
        "New IP subnet 103.21.x.x (+6)",
        "No MFA on account (+7)",
      ],
      explanation: "This login event was challenged primarily due to the use of an unrecognized Windows/Chrome device...",
      recommendations: [
        "Send OTP challenge before allowing access",
        "Push in-app notification",
        "Cap transaction ceiling",
        "Force-enroll this account in MFA",
      ],
      timestamp: new Date().toISOString(),
      incidentId: "INC-20260619-4B1BC801",
    },
  };

  // ============================================
  // Detect Device & Location
  // ============================================
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    let browser = "Unknown";
    let os = "Unknown";

    if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
    else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
    else if (userAgent.indexOf("Edge") > -1) browser = "Edge";

    if (userAgent.indexOf("Windows") > -1) os = "Windows";
    else if (userAgent.indexOf("Mac") > -1) os = "macOS";
    else if (userAgent.indexOf("Linux") > -1) os = "Linux";
    else if (userAgent.indexOf("Android") > -1) os = "Android";
    else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) os = "iOS";

    const screenInfo = `${window.screen.width}x${window.screen.height}`;
    const deviceId = `${browser}_${os}_${screenInfo}`.replace(/\s/g, "_");

    setDeviceInfo({
      deviceId: deviceId.slice(0, 40),
      os,
      browser,
      isNewDevice: false,
    });

    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        setLocationInfo({
          ipAddress: data.ip || "Unknown",
          country: data.country_code || "Unknown",
          city: data.city || "Unknown",
        });
      })
      .catch(() => {
        setLocationInfo({
          ipAddress: "Unknown",
          country: "Unknown",
          city: "Unknown",
        });
      });
  }, []);

  // ============================================
  // Navigation
  // ============================================
  const handleBack = () => router.push("/");

  const routeToDashboard = (user: any) => {
    if (user.role === "admin" || user.role === "analyst") {
      router.push("/admin-dashboard");
    } else {
      router.push("/customer-portal");
    }
  };

  // ============================================
  // Handle Login with Sample Data Display
  // ============================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setIsChecking(true);
    setCheckStep(0);

    // Show checking steps
    const steps = [
      { msg: "🔍 Checking device information...", delay: 500 },
      { msg: "🌐 Verifying location data...", delay: 1000 },
      { msg: "🔐 Authenticating credentials...", delay: 1500 },
      { msg: "🛡️ Running AI security analysis...", delay: 2000 },
    ];

    for (let i = 0; i < steps.length; i++) {
      setCheckStep(i);
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));
    }

    try {
      const response = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
          device: deviceInfo,
          location: locationInfo,
          behavior: {
            eventType: "LOGIN",
            loginHour: new Date().getHours(),
            sessionDuration: 0,
            typingSpeed: 72,
          },
          metadata: {
            channel: "WEB",
            userAgent: window.navigator.userAgent,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        setIsChecking(false);
        return;
      }

      // Store in localStorage
      setUserData(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("riskData", JSON.stringify(data.risk));

      setRiskResult(data.risk);
      setShowRiskResult(true);
      setLoading(false);
      setIsChecking(false);

      if (data.risk.decision === "CHALLENGE" || data.risk.decision === "REVIEW") {
        setShowOTP(true);
      } else {
        routeToDashboard(data.user);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
      setIsChecking(false);
    }
  };

  // ============================================
  // OTP Verification
  // ============================================
  const handleVerifyOTP = () => {
    if (otpInput === HARDCODED_OTP) {
      setOtpSuccess(true);
      setOtpError("");
      setTimeout(() => {
        if (userData) routeToDashboard(userData);
      }, 1500);
    } else {
      setOtpError("Invalid OTP. Please try again.");
      setOtpInput("");
    }
  };

  // ============================================
  // Registration
  // ============================================
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

      if (!data.success) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      routeToDashboard(data.user);
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  // ============================================
  // Toggle Mode
  // ============================================
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSelectedRole(null);
    setShowRiskResult(false);
    setShowOTP(false);
    setRiskResult(null);
  };

// ============================================
// Helper Functions - FIXED
// ============================================

const getSeverityColor = (severity: string) => {
  const map: Record<string, string> = {
    LOW: "text-green-600 bg-green-50 border-green-200",
    MEDIUM: "text-yellow-600 bg-yellow-50 border-yellow-200",
    HIGH: "text-orange-600 bg-orange-50 border-orange-200",
    CRITICAL: "text-red-600 bg-red-50 border-red-200",
  };
  return map[severity] || "text-neutral-600 bg-neutral-50 border-neutral-200";
};

const getSeverityIcon = (severity: string) => {
  const map: Record<string, React.ReactElement> = {  // ← Changed from JSX.Element
    LOW: <FaCheckCircle className="w-5 h-5 text-green-500" />,
    MEDIUM: <FaExclamationTriangle className="w-5 h-5 text-yellow-500" />,
    HIGH: <FaExclamationTriangle className="w-5 h-5 text-orange-500" />,
    CRITICAL: <FaTimesCircle className="w-5 h-5 text-red-500" />,
  };
  return map[severity] || <FaShieldAlt className="w-5 h-5 text-neutral-500" />;
};

const getDecisionColor = (decision: string) => {
  const map: Record<string, string> = {
    ALLOW: "text-green-600 bg-green-50 border-green-200",
    CHALLENGE: "text-yellow-600 bg-yellow-50 border-yellow-200",
    REVIEW: "text-orange-600 bg-orange-50 border-orange-200",
    BLOCK: "text-red-600 bg-red-50 border-red-200",
  };
  return map[decision] || "text-neutral-600 bg-neutral-50 border-neutral-200";
};
  // ============================================
  // Render
  // ============================================
  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]">
      {/* Left Panel */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-16 bg-gradient-to-br from-black to-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10">
          <button onClick={handleBack} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
            <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
        </div>

        <div className="relative z-10 flex items-center gap-3 mt-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <HiOutlineShieldCheck className="w-7 h-7 text-white" />
          </div>
          <span className="font-outfit text-2xl font-bold tracking-tight">TrustAI</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="font-outfit text-4xl font-bold leading-tight mb-4">
            {isLogin ? "Secure Access Portal" : "Create Your Account"}
          </h1>
          <p className="text-lg text-neutral-300 font-light leading-relaxed">
            {isLogin 
              ? "Sign in to access your personalized dashboard and security features."
              : "Join TrustAI and protect your banking experience with AI-powered security."}
          </p>
        </div>

        <div className="relative z-10 text-xs text-neutral-500">
          <span>© 2026 TrustAI Systems. All rights reserved.</span>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile Back */}
          <div className="lg:hidden mb-6">
            <button onClick={handleBack} className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors group">
              <FaArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          {/* ============================================ */}
          {/* CHECKING SCREEN - Shows sample data being checked */}
          {/* ============================================ */}
          {isChecking && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 mb-4">
                  <FaSpinner className="w-8 h-8 animate-spin" />
                </div>
                <h2 className="font-outfit text-2xl font-bold text-black tracking-tight">
                  Analyzing Your Login
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Checking your device, location, and credentials
                </p>
              </div>

              {/* Sample Data Display */}
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                <h4 className="text-xs font-bold uppercase text-neutral-500 mb-3 flex items-center gap-2">
                  <FaDatabase className="w-3 h-3" />
                  Data Being Analyzed
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Device</span>
                    <span className="font-mono text-neutral-800">{deviceInfo.browser} on {deviceInfo.os}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Location</span>
                    <span className="font-mono text-neutral-800">{locationInfo.city}, {locationInfo.country}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">IP Address</span>
                    <span className="font-mono text-neutral-800">{locationInfo.ipAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Time</span>
                    <span className="font-mono text-neutral-800">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Checking Steps */}
              <div className="space-y-2">
                {[
                  "🔍 Checking device information...",
                  "🌐 Verifying location data...",
                  "🔐 Authenticating credentials...",
                  "🛡️ Running AI security analysis...",
                ].map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    idx === checkStep ? "bg-blue-50 text-blue-700" :
                    idx < checkStep ? "bg-green-50 text-green-700" : "bg-neutral-50 text-neutral-400"
                  }`}>
                    {idx < checkStep ? (
                      <FaCheckCircle className="w-4 h-4 text-green-500" />
                    ) : idx === checkStep ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                    )}
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* RISK RESULT DISPLAY */}
          {/* ============================================ */}
          {showRiskResult && riskResult && !showOTP && !isChecking && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="font-outfit text-2xl font-bold text-black tracking-tight">
                  Security Assessment
                </h2>
                <p className="mt-1 text-sm text-neutral-500 font-light">Login attempt analyzed</p>
              </div>

              <div className={`p-4 rounded-xl border-2 ${getSeverityColor(riskResult.severity)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(riskResult.severity)}
                    <div>
                      <div className="text-sm font-semibold">Risk Score</div>
                      <div className="text-3xl font-bold">{riskResult.riskScore}/100</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">Decision</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDecisionColor(riskResult.decision)}`}>
                      {riskResult.decision}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="font-medium">Trust Score:</span> {riskResult.trustScore}/100
                </div>
              </div>

              {riskResult.reasons && riskResult.reasons.length > 0 && (
                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                  <h4 className="text-xs font-bold uppercase text-neutral-500 mb-2">Reasons</h4>
                  <ul className="space-y-1">
                    {riskResult.reasons.map((reason: string, idx: number) => (
                      <li key={idx} className="text-sm text-neutral-700 flex items-start gap-2">
                        <span className="text-neutral-400 mt-0.5">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {riskResult.explanation && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h4 className="text-xs font-bold uppercase text-blue-600 mb-2">AI Explanation</h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">{riskResult.explanation}</p>
                </div>
              )}

              {riskResult.recommendations && riskResult.recommendations.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h4 className="text-xs font-bold uppercase text-purple-600 mb-2">Recommendations</h4>
                  <ul className="space-y-2">
                    {riskResult.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="text-sm text-neutral-700 flex items-start gap-2">
                        <span className="text-purple-500 mt-0.5">▸</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {riskResult.incidentId && (
                <div className="text-center text-xs text-neutral-400">
                  Incident ID: <span className="font-mono">{riskResult.incidentId}</span>
                </div>
              )}

              <button
                onClick={() => {
                  if (riskResult.decision === "CHALLENGE" || riskResult.decision === "REVIEW") {
                    setShowOTP(true);
                  } else {
                    routeToDashboard(userData);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-black py-3 px-4 text-sm font-semibold text-white hover:bg-neutral-800 transition-all"
              >
                {riskResult.decision === "ALLOW" ? "Continue to Dashboard" : "Verify with OTP"}
                <FaArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ============================================ */}
          {/* OTP VERIFICATION */}
          {/* ============================================ */}
          {showOTP && !isChecking && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-yellow-100 text-yellow-600 mb-4">
                  <FaMobileAlt className="w-8 h-8" />
                </div>
                <h2 className="font-outfit text-2xl font-bold text-black tracking-tight">OTP Verification</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  We've sent a one-time password to your registered mobile number
                </p>
                <p className="text-xs text-neutral-400 mt-1">
                  (Demo OTP: <span className="font-mono font-bold">123456</span>)
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center text-2xl tracking-[0.5em] py-4 rounded-xl border-2 border-neutral-300 focus:border-black focus:outline-none focus:ring-1 focus:ring-black font-mono"
                    placeholder="000000"
                    maxLength={6}
                  />
                  {otpError && <p className="text-sm text-red-600 mt-1">{otpError}</p>}
                  {otpSuccess && (
                    <div className="flex items-center gap-2 text-green-600 mt-2">
                      <FaCheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">OTP Verified! Redirecting...</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={otpInput.length !== 6 || otpSuccess}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-black py-3 px-4 text-sm font-semibold text-white hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {otpSuccess ? (
                    <><FaCheckCircle className="h-4 w-4" /> Verified</>
                  ) : (
                    <><FaKey className="h-4 w-4" /> Verify OTP</>
                  )}
                </button>

                <button
                  onClick={() => setOtpInput(HARDCODED_OTP)}
                  className="w-full text-center text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  Use demo OTP: 123456
                </button>

                <button
                  onClick={() => {
                    setShowOTP(false);
                    setShowRiskResult(true);
                  }}
                  className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  ← Back to security assessment
                </button>
              </div>
            </div>
          )}

          {/* ============================================ */}
          {/* LOGIN FORM */}
          {/* ============================================ */}
          {!isChecking && !showRiskResult && !showOTP && isLogin && (
            <>
              <div className="mb-8">
                <h2 className="font-outfit text-2xl font-bold text-black tracking-tight">Welcome Back</h2>
                <p className="mt-1 text-sm text-neutral-500 font-light">Sign in to your account</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Email Address
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaEnvelope className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                      Password
                    </label>
                    <a href="#" className="text-xs text-neutral-500 hover:text-black transition-colors font-medium">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaLock className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Sign In</span>
                      <FaArrowLeft className="h-4 w-4 rotate-180" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={toggleMode} className="text-sm text-neutral-500 hover:text-black transition-colors font-medium">
                  Don't have an account? Sign Up
                </button>
              </div>
            </>
          )}

          {/* ============================================ */}
          {/* REGISTER FORM */}
          {/* ============================================ */}
          {!isChecking && !showRiskResult && !showOTP && !isLogin && (
            <>
              <div className="mb-8">
                <h2 className="font-outfit text-2xl font-bold text-black tracking-tight">Create Account</h2>
                <p className="mt-1 text-sm text-neutral-500 font-light">Fill in the details to get started</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase block mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole("bank")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      selectedRole === "bank" 
                        ? "border-black bg-neutral-50 shadow-sm" 
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <FaUserTie className={`w-4 h-4 ${selectedRole === "bank" ? "text-black" : "text-neutral-400"}`} />
                    <span className={`text-xs font-medium ${selectedRole === "bank" ? "text-black" : "text-neutral-600"}`}>
                      Bank Employee
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("customer")}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      selectedRole === "customer" 
                        ? "border-[#00b87c] bg-[#00b87c]/5 shadow-sm" 
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <FaUser className={`w-4 h-4 ${selectedRole === "customer" ? "text-[#00b87c]" : "text-neutral-400"}`} />
                    <span className={`text-xs font-medium ${selectedRole === "customer" ? "text-[#00b87c]" : "text-neutral-600"}`}>
                      Customer
                    </span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Full Name
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaUser className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Email Address
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaEnvelope className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Password
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaLock className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-black transition-colors"
                    >
                      {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Phone Number
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaPhone className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {selectedRole === "customer" && (
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                      Account Type
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaIdCard className="h-4 w-4 text-neutral-400" />
                      </div>
                      <select
                        value={registerData.accountType}
                        onChange={(e) => setRegisterData({ ...registerData, accountType: e.target.value })}
                        className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="SAVINGS">Savings</option>
                        <option value="CURRENT">Current</option>
                        <option value="BUSINESS">Business</option>
                      </select>
                    </div>
                  </div>
                )}

                {!selectedRole && (
                  <p className="text-center text-xs text-amber-600 font-medium">
                    ⚠️ Please select your role (Bank Employee or Customer)
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedRole}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-black py-3 px-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <FaUserPlus className="h-4 w-4" />
                      <span>Create Account</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button onClick={toggleMode} className="text-sm text-neutral-500 hover:text-black transition-colors font-medium">
                  Already have an account? Sign In
                </button>
              </div>
            </>
          )}

          <div className="mt-4 text-center text-xs text-neutral-400">
            <span>Secure &bull; Encrypted &bull; Trusted</span>
          </div>
        </div>
      </div>
    </div>
  );
}