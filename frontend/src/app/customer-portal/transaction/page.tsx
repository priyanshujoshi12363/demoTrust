"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaLock,
  FaUnlock,
  FaSpinner,
  FaMoneyBillWave,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaGlobe,
  FaMobileAlt,
  FaLaptop,
  FaCreditCard,
  FaExchangeAlt,
  FaInfoCircle
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { evaluateEvent } from "@/lib/api";

export default function TransactionPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ============================================
  // Transaction Form State
  // ============================================
  const [transactionData, setTransactionData] = useState({
    amount: "",
    currency: "INR",
    type: "TRANSFER",
    beneficiaryName: "",
    beneficiaryAccount: "",
    beneficiaryBank: "",
    beneficiaryNew: false,
    frequency: 1,
    description: "",
  });

  // ============================================
  // Device & Location Info (Auto-detected)
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
  // Load User & Detect Device
  // ============================================
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const tokenData = localStorage.getItem("token");
    
    if (userData) setUser(JSON.parse(userData));
    if (tokenData) setToken(tokenData);

    // Detect device
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

    // Get location
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
  // Handle Transaction Submission
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    setIsProcessing(true);

    try {
      const amount = parseFloat(transactionData.amount);
      
      const response = await evaluateEvent({
        device: deviceInfo,
        location: locationInfo,
        authentication: {
          method: "PASSWORD",
          failedLogins: 0,
          mfaEnabled: true,
          otpPassed: true,
        },
        behavior: {
          eventType: "TRANSACTION",
          loginHour: new Date().getHours(),
          sessionDuration: 0,
          typingSpeed: 72,
        },
        transaction: {
          amount: amount,
          currency: transactionData.currency,
          type: transactionData.type,
          beneficiaryNew: transactionData.beneficiaryNew,
          frequency: transactionData.frequency,
        },
        metadata: {
          channel: "WEB",
          userAgent: window.navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      }, token);

      setResult(response);
      setShowResult(true);
      setLoading(false);
      setIsProcessing(false);
    } catch (error) {
      console.error("Transaction evaluation error:", error);
      setLoading(false);
      setIsProcessing(false);
      alert("Failed to evaluate transaction. Please try again.");
    }
  };

  // ============================================
  // Handle Back
  // ============================================
  const handleBack = () => {
    if (showResult) {
      setShowResult(false);
      setResult(null);
    } else {
      router.push("/customer-portal");
    }
  };

  // ============================================
  // Handle Transaction Confirmation
  // ============================================
  const handleConfirm = () => {
    alert(`✅ Transaction of ₹${transactionData.amount} confirmed successfully!`);
    router.push("/customer-portal");
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
  // Render
  // ============================================
  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="w-full bg-white border-b border-neutral-200/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HiOutlineShieldCheck className="w-6 h-6 text-black" />
          <span className="font-outfit text-xl font-bold tracking-tight text-black">TrustAI</span>
          <span className="bg-black text-white font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded uppercase">
            Secure Transaction
          </span>
        </div>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* ============================================ */}
        {/* TRANSACTION FORM */}
        {/* ============================================ */}
        {!showResult && (
          <>
            <div className="mb-8">
              <h1 className="font-outfit text-3xl font-bold text-neutral-900">
                Secure Transaction
              </h1>
              <p className="text-sm text-neutral-500 font-light mt-1">
                Enter transaction details below. We'll analyze the security risk in real-time.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-neutral-200/80 rounded-2xl p-6 md:p-8 shadow-xs space-y-6">
              {/* Amount & Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Amount
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaMoneyBillWave className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={transactionData.amount}
                      onChange={(e) => setTransactionData({ ...transactionData, amount: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Currency
                  </label>
                  <select
                    value={transactionData.currency}
                    onChange={(e) => setTransactionData({ ...transactionData, currency: e.target.value })}
                    className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 px-3 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                  </select>
                </div>
              </div>

              {/* Transaction Type */}
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["TRANSFER", "PAYMENT", "WITHDRAWAL", "DEPOSIT"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTransactionData({ ...transactionData, type })}
                      className={`py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                        transactionData.type === type
                          ? "border-black bg-neutral-50 text-black"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Beneficiary Details */}
              <div className="space-y-4">
                <h3 className="font-outfit text-base font-bold text-neutral-800">Beneficiary Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaUser className="h-4 w-4 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={transactionData.beneficiaryName}
                        onChange={(e) => setTransactionData({ ...transactionData, beneficiaryName: e.target.value })}
                        className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                      Account Number
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaCreditCard className="h-4 w-4 text-neutral-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={transactionData.beneficiaryAccount}
                        onChange={(e) => setTransactionData({ ...transactionData, beneficiaryAccount: e.target.value })}
                        className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Bank Name
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaBuilding className="h-4 w-4 text-neutral-400" />
                    </div>
                    <input
                      type="text"
                      value={transactionData.beneficiaryBank}
                      onChange={(e) => setTransactionData({ ...transactionData, beneficiaryBank: e.target.value })}
                      className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 pl-10 pr-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                      placeholder="Bank Name"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    id="beneficiaryNew"
                    type="checkbox"
                    checked={transactionData.beneficiaryNew}
                    onChange={(e) => setTransactionData({ ...transactionData, beneficiaryNew: e.target.checked })}
                    className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                  />
                  <label htmlFor="beneficiaryNew" className="text-sm text-neutral-700">
                    This is a new beneficiary
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Transaction Description
                  </label>
                  <input
                    type="text"
                    value={transactionData.description}
                    onChange={(e) => setTransactionData({ ...transactionData, description: e.target.value })}
                    className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 px-3 text-sm text-neutral-800 placeholder-neutral-400 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Optional description"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] font-bold tracking-[0.15em] text-neutral-500 uppercase">
                    Frequency (per month)
                  </label>
                  <select
                    value={transactionData.frequency}
                    onChange={(e) => setTransactionData({ ...transactionData, frequency: Number(e.target.value) })}
                    className="block w-full rounded-lg border border-neutral-300/80 bg-white py-2.5 px-3 text-sm text-neutral-800 transition-all focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value={1}>1 - One-time</option>
                    <option value={2}>2 - Occasional</option>
                    <option value={5}>5 - Regular</option>
                    <option value={10}>10 - Frequent</option>
                    <option value={20}>20+ - High Frequency</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-black py-3 px-4 text-sm font-semibold text-white hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <FaShieldAlt className="h-4 w-4" />
                    <span>Check Transaction Security</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* ============================================ */}
        {/* SECURITY RESULT */}
        {/* ============================================ */}
        {showResult && result && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>New Transaction</span>
              </button>
            </div>

            {/* Result Header */}
            <div className={`p-6 rounded-2xl border-2 ${getSeverityColor(result.result.severity)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getSeverityIcon(result.result.severity)}
                  <div>
                    <h2 className="font-outfit text-2xl font-bold">
                      {result.result.decision === 'ALLOW' ? '✅ Transaction Approved' :
                       result.result.decision === 'CHALLENGE' ? '⚠️ Verification Required' :
                       result.result.decision === 'REVIEW' ? '📋 Under Review' :
                       '❌ Transaction Blocked'}
                    </h2>
                    <p className="text-sm text-neutral-500">
                      Risk Score: {result.result.riskScore}/100 • Trust Score: {result.result.trustScore}/100
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${getDecisionColor(result.result.decision)}`}>
                    {result.result.decision}
                  </span>
                  {result.result.incidentId && (
                    <p className="text-[10px] text-neutral-400 mt-1 font-mono">ID: {result.result.incidentId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Reasons */}
            {result.result.reasons && result.result.reasons.length > 0 && (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
                <h4 className="text-sm font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                  <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />
                  Risk Factors
                </h4>
                <ul className="space-y-2">
                  {result.result.reasons.map((reason: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-600">
                      <span className="text-neutral-400 mt-0.5">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Explanation */}
            {result.result.explanation && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <FaInfoCircle className="w-4 h-4" />
                  AI Security Analysis
                </h4>
                <p className="text-sm text-neutral-700 leading-relaxed">{result.result.explanation}</p>
              </div>
            )}

            {/* Recommendations */}
            {result.result.recommendations && result.result.recommendations.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <FaCheckCircle className="w-4 h-4" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.result.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="text-purple-500 mt-0.5">▸</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Transaction Summary */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs">
              <h4 className="text-sm font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="w-4 h-4" />
                Transaction Summary
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500">Amount</span>
                  <p className="font-bold text-neutral-900">₹{transactionData.amount}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Currency</span>
                  <p className="font-bold text-neutral-900">{transactionData.currency}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Type</span>
                  <p className="font-bold text-neutral-900">{transactionData.type}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Beneficiary</span>
                  <p className="font-bold text-neutral-900 truncate">{transactionData.beneficiaryName || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleBack}
                className="py-3 px-4 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-all"
              >
                Edit Transaction
              </button>
              {result.result.decision === 'ALLOW' ? (
                <button
                  onClick={handleConfirm}
                  className="py-3 px-4 rounded-lg bg-black text-sm font-semibold text-white hover:bg-neutral-800 transition-all"
                >
                  Confirm & Complete
                </button>
              ) : result.result.decision === 'CHALLENGE' ? (
                <button
                  onClick={() => router.push("/portal-login")}
                  className="py-3 px-4 rounded-lg bg-yellow-500 text-sm font-semibold text-white hover:bg-yellow-600 transition-all"
                >
                  Verify Identity
                </button>
              ) : (
                <button
                  disabled
                  className="py-3 px-4 rounded-lg bg-red-500 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
                >
                  Transaction Blocked
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#f8f9fa] border-t border-neutral-200/80 mt-8 px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div>
          <span className="font-bold text-neutral-800">TrustAI</span> &copy; 2024 Secure Infrastructure.
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}