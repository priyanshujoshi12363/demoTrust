"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaShieldAlt, 
  FaUser, 
  FaClock, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaMobileAlt,
  FaRobot,
  FaChartLine,
  FaTimesCircle,
  FaKey,
  FaLock,
  FaGlobe,
  FaSpinner,
  FaEnvelope,
  FaPhone,
  FaIdCard,
  FaHistory,
  FaBell,
  FaCog,
  FaMoneyBillWave
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { 
  sendCustomerChat,
  getUserProfile,
  getUserLogs,
  evaluateEvent,
  updateUserProfile
} from "@/lib/api";

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  
  // ============================================
  // Chatbot State
  // ============================================
  const [showTrustBot, setShowTrustBot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Hello! I am TrustBot. How can I help secure your account today?" }
  ]);

  // ============================================
  // Load User & Risk Data from localStorage + API
  // ============================================
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const risk = localStorage.getItem("riskData");
    const tokenData = localStorage.getItem("token");
    
    if (userData) setUser(JSON.parse(userData));
    if (risk) setRiskData(JSON.parse(risk));
    if (tokenData) setToken(tokenData);

    const fetchData = async () => {
      if (!tokenData || !userData) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        
        const profileResponse = await getUserProfile(parsedUser.userId, tokenData);
        if (profileResponse.success) {
          setProfile(profileResponse.verification);
        }

        const logsResponse = await getUserLogs(parsedUser.userId, tokenData, { limit: 10 });
        if (logsResponse.success) {
          setLogs(logsResponse.mongoLogs || []);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================
  // Handle Refresh Data
  // ============================================
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const profileResponse = await getUserProfile(user.userId, token);
      if (profileResponse.success) {
        setProfile(profileResponse.verification);
      }

      const logsResponse = await getUserLogs(user.userId, token, { limit: 10 });
      if (logsResponse.success) {
        setLogs(logsResponse.mongoLogs || []);
      }
    } catch (error) {
      console.error("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // ============================================
  // Handle Logout
  // ============================================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("riskData");
    router.push("/");
  };

  // ============================================
  // Handle Chat with Real API
  // ============================================
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatMessage("");
    setIsChatLoading(true);

    try {
      const response = await sendCustomerChat(userMsg, token);
      
      if (response.success) {
        setChatHistory(prev => [...prev, { 
          sender: "bot", 
          text: response.result?.message || "I've analyzed your request. How else can I help you?" 
        }]);
      } else {
        let fallbackResponse = "I'm having trouble connecting. Please try again later.";
        
        if (userMsg.toLowerCase().includes("risk") || userMsg.toLowerCase().includes("score")) {
          fallbackResponse = `Your current risk score is ${riskData?.riskScore || 12}/100 with ${riskData?.severity || 'LOW'} severity.`;
        } else if (userMsg.toLowerCase().includes("recommend") || userMsg.toLowerCase().includes("action")) {
          fallbackResponse = riskData?.recommendations?.join(". ") || "No pending recommendations.";
        } else if (userMsg.toLowerCase().includes("profile") || userMsg.toLowerCase().includes("verify")) {
          fallbackResponse = `Your KYC status: ${profile?.kycVerified ? '✅ Verified' : '⚠️ Pending'}. MFA: ${profile?.mfaEnabled ? '✅ Enabled' : '❌ Disabled'}.`;
        }
        
        setChatHistory(prev => [...prev, { sender: "bot", text: fallbackResponse }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, { 
        sender: "bot", 
        text: "Sorry, I'm having trouble connecting. Please try again." 
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ============================================
  // Helper Functions
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
    const map: Record<string, JSX.Element> = {
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
  // Loading State
  // ============================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa] text-[#111] font-sans">
      {/* ============================================ */}
      {/* TOP NAVBAR */}
      {/* ============================================ */}
      <header className="w-full bg-white border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HiOutlineShieldCheck className="w-6 h-6 text-black" />
          <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
          <span className="bg-black text-white font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">
            Customer Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors disabled:opacity-50"
          >
            {refreshing ? (
              <FaSpinner className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            )}
          </button>
          <button className="relative p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors">
            <FaBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#00b87c] ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-black text-white font-mono text-xs font-bold tracking-wider select-none shadow-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
            <span className="text-sm font-medium hidden sm:block">{user?.name || "User"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-neutral-500 hover:text-black transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-200/80">
          <div>
            <h1 className="font-outfit text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
              Good morning, {user?.name || "User"} 👋
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {riskData && (
                <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(riskData.severity)} border`}>
                  {getSeverityIcon(riskData.severity)}
                  <span>Risk: {riskData.severity}</span>
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full border border-neutral-300 bg-white text-neutral-700 text-xs font-medium">
                {user?.accountType || "Premium"} Account
              </span>
              {profile && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  profile.kycVerified ? 'bg-green-50 text-green-700 border-green-300' : 'bg-yellow-50 text-yellow-700 border-yellow-300'
                }`}>
                  {profile.kycVerified ? '✅ KYC Verified' : '⚠️ KYC Pending'}
                </span>
              )}
              {profile?.mfaEnabled && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-300">
                  🔒 MFA Active
                </span>
              )}
            </div>
          </div>
          <div className="text-left md:text-right">
            <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">
              Last Security Check
            </span>
            <span className="font-mono text-xl font-bold tracking-tight text-neutral-800">
              {new Date().toLocaleTimeString()} UTC
            </span>
          </div>
        </div>

        {/* ============================================ */}
        {/* USER PROFILE SUMMARY CARDS */}
        {/* ============================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <FaUser className="w-4 h-4" />
              <span className="text-[10px] font-medium">User ID</span>
            </div>
            <p className="font-mono text-sm font-bold text-neutral-800 mt-1 truncate">{user?.userId || "N/A"}</p>
          </div>
          <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <FaEnvelope className="w-4 h-4" />
              <span className="text-[10px] font-medium">Email</span>
            </div>
            <p className="font-mono text-sm font-bold text-neutral-800 mt-1 truncate">{user?.email || "N/A"}</p>
          </div>
          <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <FaIdCard className="w-4 h-4" />
              <span className="text-[10px] font-medium">Account Type</span>
            </div>
            <p className="font-mono text-sm font-bold text-neutral-800 mt-1">{user?.accountType || "SAVINGS"}</p>
          </div>
          <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
            <div className="flex items-center gap-2 text-neutral-500">
              <FaHistory className="w-4 h-4" />
              <span className="text-[10px] font-medium">Total Events</span>
            </div>
            <p className="font-mono text-sm font-bold text-neutral-800 mt-1">{logs?.length || 0}</p>
          </div>
        </div>

        {/* ============================================ */}
        {/* RISK ASSESSMENT SECTION - Quick Actions Removed */}
        {/* ============================================ */}
        {riskData && (
          <div className="mt-6">
            <div className={`bg-white border-2 rounded-2xl p-6 shadow-xs ${getSeverityColor(riskData.severity)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getSeverityIcon(riskData.severity)}
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Risk Score</p>
                    <div className="flex items-center gap-3">
                      <span className="font-outfit text-4xl font-bold text-neutral-900">{riskData.riskScore}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getSeverityColor(riskData.severity)}`}>
                        {riskData.severity}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">Trust Score: {riskData.trustScore}/100</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-500">Decision</p>
                  <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${getDecisionColor(riskData.decision)} border`}>
                    {riskData.decision}
                  </span>
                  {riskData.incidentId && (
                    <p className="text-[10px] text-neutral-400 mt-1 font-mono">ID: {riskData.incidentId}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {riskData.reasons && riskData.reasons.length > 0 && (
                <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                    <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    {riskData.reasons.map((reason: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                        <span className="text-neutral-400 mt-0.5">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {riskData.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <FaRobot className="w-4 h-4" />
                    AI Security Analysis
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed">{riskData.explanation}</p>
                </div>
              )}
            </div>

            {riskData.recommendations && riskData.recommendations.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6 mt-6">
                <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4" />
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {riskData.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="text-purple-500 mt-0.5">▸</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* ACCOUNT SECURE CARD & RECENT ACTIVITY */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xs">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-neutral-100" strokeWidth="10" fill="transparent" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className={`${riskData?.riskScore <= 25 ? 'stroke-[#00b87c]' : riskData?.riskScore <= 50 ? 'stroke-yellow-500' : riskData?.riskScore <= 75 ? 'stroke-orange-500' : 'stroke-red-500'}`}
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * (riskData?.riskScore || 12)) / 100}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease-out" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="font-outfit text-4xl font-bold text-neutral-800">{riskData?.riskScore || 12}</span>
                  <span className="font-mono text-[8px] font-bold tracking-widest text-neutral-400 uppercase mt-0.5">
                    Risk Score
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-2">
                  <FaShieldAlt className={`w-5 h-5 ${riskData?.riskScore <= 25 ? 'text-[#00b87c]' : riskData?.riskScore <= 50 ? 'text-yellow-500' : riskData?.riskScore <= 75 ? 'text-orange-500' : 'text-red-500'}`} />
                  <h3 className={`font-outfit text-lg font-bold tracking-tight ${riskData?.riskScore <= 25 ? 'text-[#00b87c]' : riskData?.riskScore <= 50 ? 'text-yellow-600' : riskData?.riskScore <= 75 ? 'text-orange-600' : 'text-red-600'}`}>
                    {riskData?.riskScore <= 25 ? 'Your Account is Secure' : riskData?.riskScore <= 50 ? 'Moderate Risk Detected' : riskData?.riskScore <= 75 ? 'High Risk Alert' : 'Critical Security Alert'}
                  </h3>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  {riskData?.riskScore <= 25 
                    ? 'We are continuously monitoring for unauthorized access. No anomalies detected.' 
                    : riskData?.riskScore <= 50 
                    ? 'Some unusual patterns detected. Please review the recommendations above.' 
                    : 'Immediate attention required. Please follow the recommended actions below.'}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 pt-2 text-xs font-normal text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <FaClock className="w-3.5 h-3.5" />
                    <span>Last checked: just now</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                    <span>{riskData?.decision === 'ALLOW' ? 'Access Allowed' : 'Verification Required'}</span>
                  </div>
                  {profile?.mfaEnabled && (
                    <div className="flex items-center gap-1.5">
                      <FaKey className="w-3.5 h-3.5" />
                      <span>MFA Active</span>
                    </div>
                  )}
                  {riskData?.incidentId && (
                    <div className="flex items-center gap-1.5">
                      <FaKey className="w-3.5 h-3.5" />
                      <span className="font-mono text-[10px]">{riskData.incidentId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Activity Logs (from API) */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="font-outfit text-lg font-bold text-neutral-800 tracking-tight">
                  Recent Activity
                </h3>
                <button className="font-mono text-[10px] font-bold tracking-wider text-neutral-500 hover:text-black transition-colors uppercase">
                  View All
                </button>
              </div>

              <div className="divide-y divide-neutral-100">
                {logs && logs.length > 0 ? (
                  logs.slice(0, 5).map((log: any, idx: number) => (
                    <div key={idx} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-800">{log.eventType || 'Security Event'}</h4>
                        <p className="text-xs text-neutral-400 font-light mt-0.5">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                        {log.reasons && log.reasons.length > 0 && (
                          <p className="text-[10px] text-neutral-400 mt-0.5 truncate max-w-[200px]">
                            {log.reasons[0]}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border uppercase ${
                          log.decision === 'ALLOWED' || log.decision === 'ALLOW' 
                            ? 'border-[#00b87c]/30 bg-[#00b87c]/5 text-[#00b87c]' 
                            : log.decision === 'BLOCKED' || log.decision === 'BLOCK'
                            ? 'border-red-300 bg-red-50 text-red-600'
                            : 'border-yellow-300 bg-yellow-50 text-yellow-600'
                        }`}>
                          {log.decision || 'ALLOWED'}
                        </span>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Score: {log.riskScore}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-sm text-neutral-400">
                    No recent activity found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Metrics */}
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                  Trust Score
                </span>
                <div className="font-outfit text-3xl font-bold text-neutral-800 mt-1">{riskData?.trustScore || 88}%</div>
              </div>
              <div className="flex items-center gap-1.5 text-[#00b87c] font-semibold text-sm">
                <FaChartLine className="w-4 h-4" />
                <span>{riskData?.riskScore <= 25 ? '+2%' : '-5%'}</span>
              </div>
            </div>

            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                  KYC Status
                </span>
                <div className="font-outfit text-2xl font-bold mt-1">
                  {profile?.kycVerified ? (
                    <span className="text-[#00b87c]">Verified ✅</span>
                  ) : (
                    <span className="text-yellow-600">Pending ⚠️</span>
                  )}
                </div>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                profile?.kycVerified ? 'bg-[#00b87c]/5 border-[#00b87c]/20 text-[#00b87c]' : 'bg-yellow-50 border-yellow-200 text-yellow-600'
              }`}>
                <FaUser className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                  Security Events
                </span>
                <div className="font-outfit text-2xl font-bold text-neutral-800 mt-1">
                  {riskData?.decision === 'BLOCK' ? '1 Alert' : '0 Alerts'}
                </div>
              </div>
              <div className={`p-2.5 rounded-lg border ${riskData?.decision === 'BLOCK' ? 'bg-red-50 border-red-200 text-red-500' : 'bg-[#00b87c]/5 border-[#00b87c]/20 text-[#00b87c]'}`}>
                <FaShieldAlt className="w-5 h-5" />
              </div>
            </div>

            {/* Security Actions */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-outfit text-base font-bold text-neutral-800 tracking-tight">
                Security Actions
              </h3>
              <button 
                onClick={() => router.push("/customer-portal/transaction")}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-black text-sm font-semibold text-white hover:bg-neutral-800 transition-all"
              >
                <FaMoneyBillWave className="w-4 h-4 text-white" />
                New Transaction
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neutral-900 bg-white text-sm font-semibold text-black hover:bg-neutral-50 transition-all">
                <FaExclamationTriangle className="w-4 h-4 text-neutral-900" />
                Report Suspicious Activity
              </button>
              <button
                onClick={() => setShowTrustBot(!showTrustBot)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-all"
              >
                <FaRobot className="w-4.5 h-4.5 text-neutral-700" />
                Chat with TrustBot
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-all">
                <FaCog className="w-4 h-4" />
                Security Settings
              </button>
            </div>

            {/* Advisory Card */}
            <div className="bg-black text-white rounded-2xl p-6 shadow-md relative overflow-hidden space-y-4">
              <div className="inline-block bg-[#1f2025] px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-widest text-[#a1a1aa] uppercase">
                Advisory
              </div>
              <h4 className="font-outfit text-base font-bold text-white tracking-tight leading-snug">
                {riskData?.decision === 'ALLOW' ? 'Advanced Protection is Active' : 'Security Verification Required'}
              </h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                {riskData?.decision === 'ALLOW' 
                  ? 'Our AI agents are shielding your transactions with quantum-safe encryption protocols.' 
                  : 'Please complete the recommended security actions to regain full access.'}
              </p>
              <div className="flex items-center gap-3 pt-2">
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
                  {riskData?.decision === 'ALLOW' ? 'Monitored by Global Security Ops' : 'Security Team Alerted'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================ */}
      {/* TRUSTBOT CHAT WITH REAL API */}
      {/* ============================================ */}
      {showTrustBot && (
        <div className="fixed bottom-6 right-6 w-96 h-[480px] bg-white border border-neutral-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#00b87c] animate-pulse" />
              <span className="font-outfit font-bold text-sm">TrustAI Chatbot</span>
            </div>
            <button onClick={() => setShowTrustBot(false)} className="text-neutral-400 hover:text-white transition-colors">
              ✕
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-neutral-50 text-xs">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 ${msg.sender === "user" ? "bg-black text-white rounded-br-none" : "bg-white border border-neutral-200 text-neutral-800 rounded-bl-none"} shadow-xs`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3 shadow-xs rounded-tl-none flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask TrustBot about your security..."
              className="flex-1 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs focus:border-black focus:outline-none"
              disabled={isChatLoading}
            />
            <button 
              type="submit" 
              className="bg-black text-white rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-neutral-800 transition-all disabled:opacity-50"
              disabled={isChatLoading || !chatMessage.trim()}
            >
              {isChatLoading ? <FaSpinner className="w-3.5 h-3.5 animate-spin" /> : "Send"}
            </button>
          </form>
        </div>
      )}

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}
      <footer className="w-full bg-[#f8f9fa] border-t border-neutral-200/80 mt-16 px-6 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div>
          <span className="font-bold text-neutral-800">TrustAI</span> &copy; 2024 Secure Infrastructure.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-black transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
}