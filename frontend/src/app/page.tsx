"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FaShieldAlt,
  FaLock,
  FaClock,
  FaUserTie,
  FaUser,
  FaArrowRight,
  FaRobot,
  FaDatabase,
  FaChartLine,
  FaCheckCircle,
  FaServer,
  FaCode,
  FaTerminal,
  FaGlobe,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaBook,
  FaFileAlt,
  FaNpm,
  FaStar,
  FaNetworkWired,
  FaBrain,
  FaBolt,
  FaGem,
  FaCube,
  FaRocket,
} from "react-icons/fa";

// ─── Types ───────────────────────────────────────────────────────────────────
interface FeedEvent {
  id: number;
  time: string;
  userId: string;
  event: string;
  score: number;
  decision: "ALLOW" | "CHALLENGE" | "REVIEW" | "BLOCK";
}

// ─── Static data ─────────────────────────────────────────────────────────────
const FEED_EVENTS: FeedEvent[] = [
  { id: 1, time: "09:41:03", userId: "usr_8k2m", event: "LOGIN", score: 8, decision: "ALLOW" },
  { id: 2, time: "09:41:07", userId: "usr_4p9x", event: "TRANSFER", score: 73, decision: "CHALLENGE" },
  { id: 3, time: "09:41:12", userId: "usr_r7nq", event: "WITHDRAWAL", score: 91, decision: "BLOCK" },
  { id: 4, time: "09:41:18", userId: "usr_2c5f", event: "LOGIN", score: 12, decision: "ALLOW" },
  { id: 5, time: "09:41:24", userId: "usr_9vd3", event: "PAYMENT", score: 55, decision: "REVIEW" },
  { id: 6, time: "09:41:29", userId: "usr_6bw1", event: "LOGIN", score: 4, decision: "ALLOW" },
  { id: 7, time: "09:41:35", userId: "usr_3hs8", event: "TRANSFER", score: 88, decision: "BLOCK" },
];

const FEATURES = [
  {
    icon: <FaBrain className="w-4 h-4" />,
    title: "AI-Powered Detection",
    desc: "25 rules across 6 risk categories, evaluated in under 2ms per event.",
  },
  {
    icon: <FaRobot className="w-4 h-4" />,
    title: "Natural Language Explanations",
    desc: "Every decision ships with a plain-English rationale via Ollama + MiniMax.",
  },
  {
    icon: <FaDatabase className="w-4 h-4" />,
    title: "Zero-Dependency Storage",
    desc: "Local JSON files with 5 MB auto-pruning. No database config required.",
  },
  {
    icon: <FaChartLine className="w-4 h-4" />,
    title: "Real-time Risk Scoring",
    desc: "0–100 score with instant ALLOW / CHALLENGE / REVIEW / BLOCK verdicts.",
  },
  {
    icon: <FaCube className="w-4 h-4" />,
    title: "Node.js Built-ins Only",
    desc: "Pure stdlib — zero npm dependencies, zero supply-chain risk.",
  },
  {
    icon: <FaNetworkWired className="w-4 h-4" />,
    title: "Omni-channel",
    desc: "Unified API for mobile, web, ATM, branch, and programmatic access.",
  },
];

const STATS = [
  { value: "99.9%", label: "Detection accuracy" },
  { value: "<2ms", label: "Evaluation latency" },
  { value: "50M+", label: "Events processed" },
  { value: "150+", label: "Countries served" },
];

const QUICK_START = `// 1. Install
npm install trust-ai

// 2. Initialize
const trust = require('trust-ai');
await trust.AI('your-ollama-api-key');

// 3. Evaluate
const result = await trust({
  identity:       { userId: 'user_123', accountAgeDays: 365 },
  device:         { deviceId: 'iphone15_abc', isNewDevice: false },
  location:       { city: 'Mumbai', country: 'IN' },
  authentication: { method: 'PASSWORD', mfaEnabled: true },
  behavior:       { eventType: 'LOGIN', loginHour: 10 }
});

console.log(result.riskScore);  // → 5
console.log(result.decision);   // → "ALLOW"`;

const FULL_CONTEXT = `const result = await trust({
  identity: {
    userId:         'user_123',   // required
    accountAgeDays: 365,
    kycVerified:    true,
    accountType:    'SAVINGS',
  },
  device: {
    deviceId:    'iphone15_abc', // required
    os:          'iOS 18',
    browser:     'Safari',
    isNewDevice: false,
  },
  location: {
    city:      'Mumbai',
    country:   'IN',             // ISO 3166-1 alpha-2
    ipAddress: '117.201.88.14',
  },
  authentication: {
    method:       'PASSWORD',    // PASSWORD|OTP|BIOMETRIC|SOCIAL|PIN
    failedLogins: 0,
    mfaEnabled:   true,
    otpPassed:    true,
  },
  behavior: {
    eventType:   'LOGIN',        // LOGIN|TRANSACTION|PROFILE_UPDATE|…
    loginHour:   10,             // 0–23
    typingSpeed: 72,             // WPM
  },
  transaction: {                 // only for TRANSACTION events
    amount:         5000,
    currency:       'INR',
    type:           'TRANSFER',
    beneficiaryNew: false,
  },
  metadata: {
    channel:   'WEB',            // MOBILE_APP|WEB|ATM|BRANCH|API
    timestamp: new Date(),
  },
});`;

const RISK_RESULT = `{
  riskScore:       44,           // 0–100
  trustScore:      56,           // 100 - riskScore
  severity:        'MEDIUM',     // LOW | MEDIUM | HIGH | CRITICAL
  decision:        'CHALLENGE',  // ALLOW | CHALLENGE | REVIEW | BLOCK

  reasons: [
    'Unknown device: Chrome_Windows (+18)',
    'Login from new city: Mumbai (+8)',
    'New IP subnet 103.21.x.x (+6)',
    'No MFA on account (+7)',
  ],

  explanation:     'AI-written human-readable summary…',

  recommendations: [
    'Send OTP challenge before allowing access',
    'Push in-app notification',
    'Cap transaction ceiling',
    'Force-enroll this account in MFA',
  ],

  timestamp:  '2026-06-19T09:41:03.000Z',
  incidentId: 'INC-20260619-4B1BC801',  // MEDIUM and above only
}`;

const API_EXAMPLES = `// ── Customer Chatbot ─────────────────────────────────
const res = await trust.chatbot.chat(
  'Why was my login blocked?',
  'user_123'            // scopes RAG to this user's events
);
// res.message     → jargon-free explanation
// res.confidence  → 0–1
// res.sources     → relevant past events used as context


// ── Bank Analyst Dashboard ────────────────────────────
const res = await trust.dashboard.query(
  'Is user_123 compromised and what should we do?',
  { userId: 'user_123' }
);
// res.answer    → detailed AI analysis
// res.actions   → recommended steps for the analyst

// System-wide question (no userId)
const res = await trust.dashboard.query(
  'How many CRITICAL events happened today?'
);

// Raw stats for dashboard widgets
const stats = await trust.dashboard.getStats();
// { totalUsers, totalEvents, criticalEvents, highEvents, … }


// ── Audit Logs ────────────────────────────────────────
const logs = trust.provideLog('user_123', {
  severity:  'CRITICAL',
  eventType: 'LOGIN',
  since:     new Date('2026-01-01'),
  limit:     50,
});

// All CRITICAL events across all users
const logs = trust.provideLog(undefined, { severity: 'CRITICAL' });


// ── Memory Stats ──────────────────────────────────────
const mem = trust.memory.stats();
// { users: 2800, logs: 6700, vectors: 86400, totalMB: '0.09' }`;

const SCORE_RANGES = [
  { range: "0 – 25", severity: "LOW", decision: "ALLOW", color: "text-emerald-700 bg-emerald-50 ring-emerald-200", dot: "bg-emerald-400", meaning: "Clean session — grant access immediately" },
  { range: "26 – 50", severity: "MEDIUM", decision: "CHALLENGE", color: "text-amber-700 bg-amber-50 ring-amber-200", dot: "bg-amber-400", meaning: "Anomaly detected — require OTP before proceeding" },
  { range: "51 – 75", severity: "HIGH", decision: "REVIEW", color: "text-orange-700 bg-orange-50 ring-orange-200", dot: "bg-orange-400", meaning: "Multiple signals — hold for analyst review" },
  { range: "76 – 100", severity: "CRITICAL", decision: "BLOCK", color: "text-red-700 bg-red-50 ring-red-200", dot: "bg-red-400", meaning: "Clear attack pattern — terminate session" },
];

const RULE_CATEGORIES = [
  {
    name: "Device",
    cap: 22,
    rules: [
      { label: "New device", score: "+18" },
      { label: "Device changed mid-session", score: "+12" },
    ],
  },
  {
    name: "Location",
    cap: 30,
    rules: [
      { label: "New country", score: "+24" },
      { label: "New city", score: "+8" },
      { label: "Impossible travel", score: "+28" },
      { label: "New IP subnet", score: "+6" },
    ],
  },
  {
    name: "Authentication",
    cap: 38,
    rules: [
      { label: "1–2 failed logins", score: "+7 each" },
      { label: "≥ 3 failed logins", score: "+22" },
      { label: "OTP failed", score: "+13" },
      { label: "Password reset", score: "+16" },
      { label: "Account recovery", score: "+23" },
      { label: "Phone / email changed", score: "+20" },
      { label: "No MFA enrolled", score: "+7" },
    ],
  },
  {
    name: "Behavior",
    cap: 18,
    rules: [
      { label: "Midnight hour (0–6 AM)", score: "+10" },
      { label: "Off-pattern login hour", score: "+5" },
      { label: "Bot-speed typing > 250 WPM", score: "+12" },
      { label: "No mouse on web", score: "+8" },
      { label: "Session < 30 s", score: "+4" },
    ],
  },
  {
    name: "Transaction",
    cap: 22,
    rules: [
      { label: "Amount > 5× average", score: "+15" },
      { label: "Amount > 10× average", score: "+22" },
      { label: "New beneficiary", score: "+10" },
      { label: "High transaction frequency", score: "+12" },
      { label: "Suspicious round number", score: "+4" },
    ],
  },
  {
    name: "Velocity",
    cap: 18,
    rules: [
      { label: "3–4 events / hr", score: "+10" },
      { label: "5–9 events / hr", score: "+15" },
      { label: "10+ events / hr", score: "+18" },
    ],
  },
];

const SCENARIO_EXAMPLES = [
  { scenario: "Clean first login", score: "~10", decision: "ALLOW", color: "text-emerald-600" },
  { scenario: "Clean returning login", score: "~5", decision: "ALLOW", color: "text-emerald-600" },
  { scenario: "New country only", score: "~34", decision: "CHALLENGE", color: "text-amber-600" },
  { scenario: "New device + 2 failed logins", score: "~46", decision: "CHALLENGE", color: "text-amber-600" },
  { scenario: "New device + new city + 2 failures", score: "~56", decision: "REVIEW", color: "text-orange-600" },
  { scenario: "Full attack (10+ signals)", score: "~91", decision: "BLOCK", color: "text-red-600" },
];

// ─── Decision badge ───────────────────────────────────────────────────────────
function DecisionBadge({ decision }: { decision: FeedEvent["decision"] }) {
  const map: Record<FeedEvent["decision"], string> = {
    ALLOW: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    CHALLENGE: "bg-amber-50 text-amber-700 ring-amber-200",
    REVIEW: "bg-blue-50 text-blue-700 ring-blue-200",
    BLOCK: "bg-red-50 text-red-700 ring-red-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider ring-1 ring-inset ${map[decision]}`}
    >
      {decision}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const docsRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [scrolled, setScrolled] = useState(false);
  const [feedIndex, setFeedIndex] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState<FeedEvent[]>([FEED_EVENTS[0]]);
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate a live event feed
  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      setFeedIndex((prev) => {
        const next = (prev + 1) % FEED_EVENTS.length;
        setVisibleEvents((cur) => {
          const updated = [FEED_EVENTS[next], ...cur].slice(0, 5);
          return updated;
        });
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isMounted]);

  const scrollToDocs = () => docsRef.current?.scrollIntoView({ behavior: "smooth" });
  const handleGetStarted = () => router.push("/portal-login");

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* ── Render banner ───────────────────────────────────────────────────── */}
      {showBanner && (
        <div className="relative z-[60] flex items-center justify-center gap-3 bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-center">
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="text-[11px] font-mono text-amber-800">
            First load may be slow — the server wakes from sleep on demand.{" "}
            <span className="font-bold">If it times out, wait 30s and retry.</span>
          </p>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-2 flex-shrink-0 text-amber-500 hover:text-amber-800 transition-colors text-xs leading-none"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaShieldAlt className={`w-4 h-4 ${scrolled ? "text-gray-900" : "text-white"}`} />
            <span className={`font-semibold text-sm tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
              TrustAI
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToDocs}
              className={`text-xs font-medium transition-colors ${
                scrolled ? "text-gray-500 hover:text-gray-900" : "text-white/60 hover:text-white"
              }`}
            >
              Docs
            </button>
            <button
              onClick={handleGetStarted}
              className="text-xs font-semibold bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-[#0A0A0B] overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/3 w-[480px] h-[480px] bg-white/[0.025] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 lg:py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 items-center">
            {/* Left */}
            <div className="space-y-8">
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-mono font-semibold tracking-widest text-gray-400 uppercase">
                  Active · Production-ready
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-[-0.03em]">
                  Fraud stops
                  <br />
                  <span className="text-gray-400">here.</span>
                </h1>
                <p className="mt-6 text-base text-gray-400 leading-relaxed max-w-md font-light">
                  TrustAI evaluates every banking event in under 2ms — scoring risk, explaining decisions, and blocking threats before they settle.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleGetStarted}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-md hover:bg-gray-100 transition-colors"
                >
                  Get started
                  <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={scrollToDocs}
                  className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-white/70 text-sm font-medium rounded-md hover:border-white/20 hover:text-white transition-colors"
                >
                  <FaBook className="w-3 h-3" />
                  Documentation
                </button>
              </div>

              {/* Trust line */}
              <div className="flex flex-wrap gap-5 pt-2">
                {[
                  { icon: <FaLock className="w-3 h-3" />, label: "TLS 1.3" },
                  { icon: <FaClock className="w-3 h-3" />, label: "24 / 7 Monitoring" },
                  { icon: <FaGem className="w-3 h-3" />, label: "SOC 2 Ready" },
                ].map((t) => (
                  <span key={t.label} className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
                    {t.icon}
                    {t.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Live event terminal */}
            <div className="rounded-xl bg-[#111113] border border-white/8 overflow-hidden shadow-2xl">
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-[#0d0d0f]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#333]" />
                <span className="ml-3 text-[10px] font-mono text-gray-600">trust-ai · live event feed</span>
                <span className="ml-auto flex items-center gap-1 text-[9px] font-mono text-emerald-500">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE
                </span>
              </div>

              {/* Header row */}
              <div className="grid grid-cols-[56px_1fr_44px_80px] gap-2 px-4 py-2 border-b border-white/5">
                {["TIME", "EVENT", "SCORE", "DECISION"].map((h) => (
                  <span key={h} className="text-[9px] font-mono font-semibold tracking-widest text-gray-600">
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5 min-h-[220px]">
                {visibleEvents.map((ev, idx) => (
                  <div
                    key={ev.id + "-" + idx}
                    className={`grid grid-cols-[56px_1fr_44px_80px] gap-2 px-4 py-2.5 items-center transition-all duration-500 ${
                      idx === 0 ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <span className="text-[10px] font-mono text-gray-500">{ev.time}</span>
                    <div>
                      <span className="text-[11px] font-mono text-gray-200">{ev.event}</span>
                      <span className="text-[9px] font-mono text-gray-600 block">{ev.userId}</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        ev.score >= 80
                          ? "text-red-400"
                          : ev.score >= 50
                          ? "text-amber-400"
                          : "text-gray-300"
                      }`}
                    >
                      {ev.score}
                    </span>
                    <DecisionBadge decision={ev.decision} />
                  </div>
                ))}
              </div>

              {/* Role selector */}
              <div className="border-t border-white/5 p-4 space-y-2">
                <p className="text-[10px] font-mono text-gray-600 mb-3 uppercase tracking-widest">
                  Select your portal
                </p>
                {[
                  { role: "bank", icon: <FaUserTie className="w-3.5 h-3.5" />, label: "Bank Employee", sub: "Admin dashboard · Fraud monitoring" },
                  { role: "customer", icon: <FaUser className="w-3.5 h-3.5" />, label: "Customer", sub: "Security · Transactions · Alerts" },
                ].map(({ role, icon, label, sub }) => (
                  <button
                    key={role}
                    onClick={handleGetStarted}
                    onMouseEnter={() => setHoveredRole(role)}
                    onMouseLeave={() => setHoveredRole(null)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 ${
                      hoveredRole === role
                        ? "border-white/20 bg-white/8"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <span className="text-gray-400">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[12px] font-semibold text-white block">{label}</span>
                      <span className="text-[10px] font-mono text-gray-500">{sub}</span>
                    </div>
                    <FaArrowRight
                      className={`w-3 h-3 flex-shrink-0 transition-all duration-200 ${
                        hoveredRole === role ? "text-white translate-x-0.5" : "text-gray-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
            {STATS.map((s, i) => (
              <div key={i} className="px-6 first:pl-0 last:pr-0">
                <div className="text-2xl font-bold text-gray-900 tracking-tight">{s.value}</div>
                <div className="text-xs text-gray-400 mt-0.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-[11px] font-mono font-semibold tracking-widest text-gray-400 uppercase mb-3">
              Capabilities
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Everything you need to stop fraud.
              <br />
              <span className="text-gray-400">Nothing you don't.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-900 group-hover:text-white transition-colors mb-4">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Documentation ───────────────────────────────────────────────────── */}
      <section ref={docsRef} className="bg-gray-50 border-t border-gray-100 py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[11px] font-mono font-semibold tracking-widest text-gray-400 uppercase mb-3">
                Documentation
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                TrustAI package
              </h2>
              <p className="text-sm text-gray-400 mt-2 max-w-lg font-light">
                AI-powered fraud detection, risk scoring, and account takeover prevention for Node.js ≥ 18.
                Zero runtime dependencies. Works offline via mock mode.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <FaNpm className="w-5 h-5 text-red-500" />
                <code className="text-xs font-mono bg-white border border-gray-200 px-3 py-1.5 rounded-md text-gray-700 select-all">
                  npm install trust-ai
                </code>
              </div>
              <span className="text-[10px] font-mono text-gray-400">Requires Node.js ≥ 18 · MIT License · CommonJS</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1 mb-8 bg-white border border-gray-200 rounded-lg p-1 w-fit">
            {[
              { id: "overview", label: "Overview" },
              { id: "how-it-works", label: "How it works" },
              { id: "quickstart", label: "Quickstart" },
              { id: "rules", label: "Rule engine" },
              { id: "api", label: "API reference" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab panels ── */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="divide-y divide-gray-100">
                {/* Key properties */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">Key properties</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { title: "Zero Dependencies", desc: "All features built on Node.js built-ins only. No supply-chain risk, no peer dependencies." },
                      { title: "Offline / Mock Mode", desc: "Pass mockMode: true to skip all API calls. Build and test locally without any credentials." },
                      { title: "Local JSON Storage", desc: "Data lives in data/users.json, logs.json, vectors.json. Auto-pruned at 5 MB each." },
                      { title: "Full TypeScript", desc: "Strict type definitions ship with the package for TrustContext, RiskResult, and all options." },
                      { title: "CommonJS", desc: "require('trust-ai') works in any Node.js ≥ 18 project with no config." },
                      { title: "Deterministic scoring", desc: "Same inputs always produce the same score. AI only writes the explanation — it never changes the verdict." },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-4 rounded-lg bg-gray-50 border border-gray-100">
                        <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Score ranges */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">Score ranges</p>
                  <div className="rounded-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    <div className="grid grid-cols-[80px_80px_90px_1fr] gap-4 px-4 py-2 bg-gray-50">
                      {["Score", "Severity", "Decision", "Meaning"].map((h) => (
                        <span key={h} className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase">{h}</span>
                      ))}
                    </div>
                    {SCORE_RANGES.map((row) => (
                      <div key={row.severity} className="grid grid-cols-[80px_80px_90px_1fr] gap-4 px-4 py-3 items-center hover:bg-gray-50 transition-colors">
                        <span className="text-xs font-mono font-semibold text-gray-700">{row.range}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${row.dot}`} />
                          <span className="text-xs font-mono text-gray-700">{row.severity}</span>
                        </div>
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold tracking-wider ring-1 ring-inset w-fit ${row.color}`}>
                          {row.decision}
                        </span>
                        <span className="text-xs text-gray-500">{row.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data files */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">Data files</p>
                  <div className="bg-[#0A0A0B] rounded-lg p-4 font-mono text-xs">
                    <p className="text-gray-500 mb-3">Auto-created in your project root, gitignored by default.</p>
                    {[
                      { file: "data/users.json", desc: "User profiles & behavioral baselines. Prunes users inactive 90+ days." },
                      { file: "data/logs.json", desc: "Full audit event log. Drops oldest entries when > 5 MB." },
                      { file: "data/vectors.json", desc: "RAG vector index for chatbot & dashboard. Keeps the 1000 most recent docs." },
                    ].map((f) => (
                      <div key={f.file} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                        <span className="text-emerald-400 shrink-0">{f.file}</span>
                        <span className="text-gray-500">{f.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── HOW IT WORKS ── */}
            {activeTab === "how-it-works" && (
              <div className="divide-y divide-gray-100">
                {/* Pipeline */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-6">Evaluation pipeline</p>
                  <div className="space-y-0">
                    {[
                      { step: "01", title: "Load user profile", detail: "Fetches the user's existing baseline from users.json — device history, known cities, typical login hours, average transaction amounts. New users get a blank baseline and a small +10 base score.", ai: false },
                      { step: "02", title: "Rule engine scores 25 signals", detail: "Evaluates inputs across 6 categories: Device, Location, Authentication, Behavior, Transaction, Velocity. Each category has an independent cap to prevent one dimension from dominating.", ai: false },
                      { step: "03", title: "Severity + decision computed", detail: "Score 0–25 → LOW/ALLOW. Score 26–50 → MEDIUM/CHALLENGE. Score 51–75 → HIGH/REVIEW. Score 76–100 → CRITICAL/BLOCK. Recommendations are generated from the active rule flags.", ai: false },
                      { step: "04", title: "AI writes the explanation", detail: "The final verdict is handed to MiniMax (via Ollama Cloud) with instructions to write a clear, jargon-free explanation for the operator or customer. AI cannot alter the score or decision.", ai: true },
                      { step: "05", title: "Event indexed in vector DB", detail: "The event is embedded with a local sinusoidal hash and stored in vectors.json. This powers the RAG context for the chatbot and dashboard analyst on future queries.", ai: false },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4 py-5 border-b border-gray-100 last:border-0">
                        <div className="flex flex-col items-center gap-1 shrink-0">
                          <span className="w-7 h-7 rounded-full bg-gray-900 text-white text-[10px] font-bold font-mono flex items-center justify-center">{item.step}</span>
                          {idx < 4 && <span className="w-px flex-1 bg-gray-200 mt-1" />}
                        </div>
                        <div className="pb-2 flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5">
                            <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                            {item.ai && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-violet-50 text-violet-600 ring-1 ring-inset ring-violet-200">
                                <FaRobot className="w-2.5 h-2.5" /> AI
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI vs Rules */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">AI vs rule engine</p>
                  <div className="rounded-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    <div className="grid grid-cols-[1fr_80px_80px] gap-4 px-4 py-2 bg-gray-50">
                      {["Task", "Rules", "AI"].map((h) => (
                        <span key={h} className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase">{h}</span>
                      ))}
                    </div>
                    {[
                      { task: "Risk score (0–100)", rules: true, ai: false },
                      { task: "Severity (LOW → CRITICAL)", rules: true, ai: false },
                      { task: "Decision (ALLOW → BLOCK)", rules: true, ai: false },
                      { task: "Recommendations", rules: true, ai: false },
                      { task: "Human-readable explanation", rules: false, ai: true },
                      { task: "Customer chatbot responses", rules: false, ai: true },
                      { task: "Dashboard analyst responses", rules: false, ai: true },
                      { task: "Vector embeddings", rules: true, ai: false },
                    ].map((row) => (
                      <div key={row.task} className="grid grid-cols-[1fr_80px_80px] gap-4 px-4 py-2.5 items-center hover:bg-gray-50 transition-colors">
                        <span className="text-xs text-gray-700">{row.task}</span>
                        <span>{row.rules ? <FaCheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <span className="w-3.5 h-3.5 block rounded-full border border-gray-200" />}</span>
                        <span>{row.ai ? <FaCheckCircle className="w-3.5 h-3.5 text-violet-500" /> : <span className="w-3.5 h-3.5 block rounded-full border border-gray-200" />}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3 font-mono">
                    The rule engine is the source of truth. AI receives the final verdict and is instructed only to explain — it cannot alter the score or decision.
                  </p>
                </div>
              </div>
            )}

            {/* ── QUICKSTART ── */}
            {activeTab === "quickstart" && (
              <div className="divide-y divide-gray-100">
                {/* Steps */}
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { step: "01", label: "Install", code: "npm install trust-ai" },
                      { step: "02", label: "Initialize", code: "await trust.AI(apiKey)" },
                      { step: "03", label: "Evaluate", code: "await trust(context)" },
                    ].map((item) => (
                      <div key={item.step} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <p className="text-[10px] font-mono text-gray-400 mb-1">{item.step}</p>
                        <p className="text-xs font-semibold text-gray-900 mb-1">{item.label}</p>
                        <code className="text-[10px] font-mono text-gray-500 block">{item.code}</code>
                      </div>
                    ))}
                  </div>
                  {/* Minimal example */}
                  <div className="bg-[#0A0A0B] rounded-lg overflow-x-auto">
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="ml-2 text-[10px] font-mono text-gray-600">minimal.js</span>
                    </div>
                    <pre className="text-xs text-gray-300 font-mono p-5 whitespace-pre leading-relaxed overflow-x-auto">
                      <code>{QUICK_START}</code>
                    </pre>
                  </div>
                </div>

                {/* Full context */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">Full TrustContext</p>
                  <div className="bg-[#0A0A0B] rounded-lg overflow-x-auto">
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="ml-2 text-[10px] font-mono text-gray-600">full-context.js</span>
                    </div>
                    <pre className="text-xs text-gray-300 font-mono p-5 whitespace-pre leading-relaxed overflow-x-auto">
                      <code>{FULL_CONTEXT}</code>
                    </pre>
                  </div>
                </div>

                {/* RiskResult */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">RiskResult response</p>
                  <div className="bg-[#0A0A0B] rounded-lg overflow-x-auto">
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="ml-2 text-[10px] font-mono text-gray-600">response.json</span>
                    </div>
                    <pre className="text-xs text-gray-300 font-mono p-5 whitespace-pre leading-relaxed overflow-x-auto">
                      <code>{RISK_RESULT}</code>
                    </pre>
                  </div>
                </div>

                {/* Env vars */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">Environment variables</p>
                  <div className="bg-[#0A0A0B] rounded-lg p-4 font-mono text-xs">
                    <p className="text-gray-500 mb-3"># Alternative to hardcoding in trust.AI()</p>
                    <p className="text-gray-300">OLLAMA_API_KEY=your-key</p>
                    <p className="text-gray-300">OLLAMA_MODEL=minimax-m3 <span className="text-gray-600"> # optional, default</span></p>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 mb-1">Mock mode</p>
                      <code className="text-[10px] font-mono text-gray-500">await trust.AI(key, {"{"} mockMode: true {"}"})</code>
                      <p className="text-xs text-gray-400 mt-1">Skips all API calls. Uses built-in fallback responses. Ideal for CI and local dev.</p>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 mb-1">Custom model</p>
                      <code className="text-[10px] font-mono text-gray-500">await trust.AI(key, {"{"} model: 'minimax-m3' {"}"})</code>
                      <p className="text-xs text-gray-400 mt-1">Any Ollama-compatible model. Defaults to MiniMax M3 if not specified.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── RULE ENGINE ── */}
            {activeTab === "rules" && (
              <div className="divide-y divide-gray-100">
                {/* Scoring formula */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">Scoring formula</p>
                  <div className="bg-[#0A0A0B] rounded-lg p-5 font-mono text-xs mb-4">
                    <p className="text-gray-400 mb-3"># How the final score is computed</p>
                    <p className="text-gray-200">finalScore = softCap( base + Σ capped(category) )</p>
                    <div className="mt-4 space-y-1.5 text-gray-500">
                      <p><span className="text-gray-300">base</span>         = 10 (new user, no baseline) | 5 (returning user)</p>
                      <p><span className="text-gray-300">capped(cat)</span>  = min(Σ rules in category, category cap)</p>
                      <p><span className="text-gray-300">softCap</span>      = diminishing returns above 85, prevents artificial 100s</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Each category has an independent cap so a single compromised dimension (e.g. a flagged location)
                    can't push the score to BLOCK on its own. Multiple weak signals across categories accumulate naturally.
                  </p>
                </div>

                {/* Categories */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">
                    25 rules across 6 categories
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {RULE_CATEGORIES.map((cat) => (
                      <div key={cat.name} className="rounded-lg border border-gray-100 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                          <span className="text-xs font-semibold text-gray-900">{cat.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">cap {cat.cap} pts</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                          {cat.rules.map((rule) => (
                            <div key={rule.label} className="flex items-center justify-between px-4 py-2">
                              <span className="text-xs text-gray-600">{rule.label}</span>
                              <span className="text-[11px] font-mono font-bold text-gray-900">{rule.score}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scenario examples */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">Example outcomes</p>
                  <div className="rounded-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    <div className="grid grid-cols-[1fr_64px_100px] gap-4 px-4 py-2 bg-gray-50">
                      {["Scenario", "Score", "Decision"].map((h) => (
                        <span key={h} className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase">{h}</span>
                      ))}
                    </div>
                    {SCENARIO_EXAMPLES.map((row) => (
                      <div key={row.scenario} className="grid grid-cols-[1fr_64px_100px] gap-4 px-4 py-2.5 items-center hover:bg-gray-50 transition-colors">
                        <span className="text-xs text-gray-700">{row.scenario}</span>
                        <span className={`text-xs font-mono font-bold ${row.color}`}>{row.score}</span>
                        <span className={`text-[10px] font-mono font-bold ${row.color}`}>{row.decision}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── API REFERENCE ── */}
            {activeTab === "api" && (
              <div className="divide-y divide-gray-100">
                {/* trust() */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-sm font-mono font-bold text-gray-900">trust(context)</code>
                    <span className="text-[10px] font-mono text-gray-400">→ Promise&lt;RiskResult&gt;</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">Evaluates one user event and returns a full risk assessment.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Chatbot", code: "trust.chatbot.chat()" },
                      { label: "Dashboard", code: "trust.dashboard.query()" },
                      { label: "Dashboard stats", code: "trust.dashboard.getStats()" },
                      { label: "Audit logs", code: "trust.provideLog()" },
                      { label: "Memory stats", code: "trust.memory.stats()" },
                      { label: "Initialize", code: "trust.AI(key, opts)" },
                    ].map((item) => (
                      <div key={item.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-[10px] font-semibold text-gray-700">{item.label}</p>
                        <code className="text-[10px] font-mono text-gray-400 mt-0.5 block">{item.code}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full API code */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">All methods with examples</p>
                  <div className="bg-[#0A0A0B] rounded-lg overflow-x-auto">
                    <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5">
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="w-2 h-2 rounded-full bg-[#333]" />
                      <span className="ml-2 text-[10px] font-mono text-gray-600">api-reference.js</span>
                    </div>
                    <pre className="text-xs text-gray-300 font-mono p-5 whitespace-pre leading-relaxed overflow-x-auto">
                      <code>{API_EXAMPLES}</code>
                    </pre>
                  </div>
                </div>

                {/* trust.AI options */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">trust.AI(apiKey, options)</p>
                  <div className="rounded-lg border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    <div className="grid grid-cols-[120px_80px_80px_1fr] gap-4 px-4 py-2 bg-gray-50">
                      {["Option", "Type", "Default", "Description"].map((h) => (
                        <span key={h} className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase">{h}</span>
                      ))}
                    </div>
                    {[
                      { opt: "apiKey", type: "string", def: "—", desc: "Your Ollama Cloud API key. Required unless using env var." },
                      { opt: "options.model", type: "string", def: "minimax-m3", desc: "Any Ollama-compatible model identifier." },
                      { opt: "options.mockMode", type: "boolean", def: "false", desc: "Skip all API calls, use built-in fallback responses." },
                    ].map((row) => (
                      <div key={row.opt} className="grid grid-cols-[120px_80px_80px_1fr] gap-4 px-4 py-2.5 items-start hover:bg-gray-50 transition-colors">
                        <code className="text-[10px] font-mono text-gray-800">{row.opt}</code>
                        <span className="text-[10px] font-mono text-violet-600">{row.type}</span>
                        <code className="text-[10px] font-mono text-gray-400">{row.def}</code>
                        <span className="text-xs text-gray-500">{row.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* TypeScript */}
                <div className="p-6 sm:p-8">
                  <p className="text-[9px] font-mono font-bold tracking-widest text-gray-400 uppercase mb-4">TypeScript usage</p>
                  <div className="bg-[#0A0A0B] rounded-lg p-4 font-mono text-xs">
                    <p className="text-gray-300">{"import trust from 'trust-ai';"}</p>
                    <p className="text-gray-300">{"import type { TrustContext, RiskResult } from 'trust-ai';"}</p>
                    <p className="text-gray-600 mt-3">{"//"} Full type safety — no any</p>
                    <p className="text-gray-300">{"await trust.AI(process.env.OLLAMA_API_KEY!);"}</p>
                    <p className="text-gray-300">{"const result: RiskResult = await trust({ ... } as TrustContext);"}</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────────────── */}
      <section className="bg-[#0A0A0B] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-[11px] font-mono font-semibold tracking-widest text-gray-500 uppercase mb-4">
            Ready to deploy
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
            Protect your customers.
            <br />
            <span className="text-gray-500">Start in under five minutes.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleGetStarted}
              className="group flex items-center gap-2 px-6 py-3 bg-white text-gray-900 text-sm font-semibold rounded-md hover:bg-gray-100 transition-colors"
            >
              Open portal
              <FaArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={scrollToDocs}
              className="px-6 py-3 border border-white/10 text-white/70 text-sm font-medium rounded-md hover:border-white/20 hover:text-white transition-colors"
            >
              Read the docs
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0A0A0B] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <FaShieldAlt className="w-3.5 h-3.5 text-gray-500" />
              <span className="text-sm font-semibold text-white">TrustAI</span>
              <span className="text-xs text-gray-600 ml-1">© 2024</span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex gap-5">
                {["Privacy", "Terms", "Contact"].map((l) => (
                  <a key={l} href="#" className="text-xs text-gray-500 hover:text-white transition-colors">
                    {l}
                  </a>
                ))}
              </div>
              <div className="flex gap-3">
                {[FaTwitter, FaLinkedin, FaGithub].map((Icon, i) => (
                  <Icon key={i} className="w-3.5 h-3.5 text-gray-600 hover:text-white transition-colors cursor-pointer" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}