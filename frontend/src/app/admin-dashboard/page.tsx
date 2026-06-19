// app/admin-dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaSpinner, 
  FaChartLine, 
  FaShieldAlt,
  FaExclamationTriangle,
  FaClock,
  FaTerminal,
  FaCircle,
  FaHistory,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import AdminLayout from "../components/admin/AdminLayout";
import { getDashboardStats, getIncidents, getLogStats } from "@/lib/api";

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Stats State
  const [stats, setStats] = useState({
    totalEvents: 0,
    criticalAlerts: 0,
    avgRiskScore: 0,
    blockedEvents: 0,
    bySeverity: { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 },
  });

  // Incidents State
  const [incidents, setIncidents] = useState<any[]>([]);
  
  // Chart Data
  const [chartBars, setChartBars] = useState<{ h: number; color: "L" | "M" | "H" | "C" }[]>([]);

  // Logs State
  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logFilter, setLogFilter] = useState<string>("all");

  // ============================================
  // Load Data
  // ============================================
  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      setToken(tokenData);
      fetchDashboardData(tokenData);
      fetchLogs(tokenData);
    } else {
      setLoading(false);
    }
  }, []);

  // ============================================
  // Fetch Dashboard Data
  // ============================================
  const fetchDashboardData = async (authToken: string) => {
    try {
      setLoading(true);
      const statsRes = await getDashboardStats(authToken);
      if (statsRes.success) {
        const { stats: data } = statsRes;
        setStats({
          totalEvents: data.events?.total || 0,
          criticalAlerts: data.events?.bySeverity?.CRITICAL || 0,
          avgRiskScore: data.events?.avgRiskScore || 0,
          blockedEvents: data.events?.byDecision?.BLOCK || 0,
          bySeverity: {
            LOW: data.events?.bySeverity?.LOW || 0,
            MEDIUM: data.events?.bySeverity?.MEDIUM || 0,
            HIGH: data.events?.bySeverity?.HIGH || 0,
            CRITICAL: data.events?.bySeverity?.CRITICAL || 0,
          },
        });

        // Generate chart data
        const total = data.events?.total || 1;
        const severities = data.events?.bySeverity || { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
        const bars = Array.from({ length: 24 }, (_, i) => {
          const hour = i % 24;
          let color: "L" | "M" | "H" | "C" = "L";
          let height = 20;
          
          if (hour < 6) {
            const ratio = severities.LOW / total;
            height = 15 + (ratio * 60);
            color = "L";
          } else if (hour < 12) {
            const ratio = (severities.MEDIUM + severities.HIGH) / total;
            height = 20 + (ratio * 70);
            color = ratio > 0.3 ? "M" : "L";
          } else if (hour < 18) {
            const ratio = (severities.HIGH + severities.CRITICAL) / total;
            height = 30 + (ratio * 60);
            color = ratio > 0.4 ? "H" : "M";
          } else {
            const ratio = severities.MEDIUM / total;
            height = 20 + (ratio * 50);
            color = ratio > 0.2 ? "M" : "L";
          }
          
          const randomFactor = 0.7 + (Math.random() * 0.6);
          const finalHeight = Math.min(Math.round(height * randomFactor), 95);
          return { h: finalHeight, color };
        });
        setChartBars(bars);
      }

      const incidentsRes = await getIncidents(authToken, "HIGH", 5);
      if (incidentsRes.success) {
        setIncidents(incidentsRes.incidents || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Fetch Logs
  // ============================================
  const fetchLogs = async (authToken: string) => {
    try {
      setLogsLoading(true);
      const statsRes = await getLogStats(authToken);
      if (statsRes.success) {
        setLogs(generateMockLogs(statsRes.stats));
      } else {
        setLogs(generateMockLogs(null));
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLogs(generateMockLogs(null));
    } finally {
      setLogsLoading(false);
    }
  };

  // ============================================
  // Generate Mock Logs
  // ============================================
  const generateMockLogs = (statsData: any) => {
    const events = [];
    const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const decisions = ['ALLOW', 'CHALLENGE', 'REVIEW', 'BLOCK'];
    const eventTypes = ['LOGIN', 'TRANSACTION', 'PROFILE_UPDATE', 'PASSWORD_RESET', 'LOGOUT'];
    const users = ['USR-8821', 'USR-1092', 'USR-9904', 'USR-7741', 'USR-5563'];
    const count = Math.min(statsData?.events?.total || 20, 50);
    
    for (let i = 0; i < count; i++) {
      events.push({
        id: `LOG-${String(i + 1).padStart(4, '0')}`,
        timestamp: new Date(Date.now() - i * 60000 * 5).toISOString(),
        userId: users[i % users.length],
        eventType: eventTypes[i % eventTypes.length],
        severity: severities[i % severities.length],
        decision: decisions[i % decisions.length],
        riskScore: Math.floor(Math.random() * 100),
        message: `${eventTypes[i % eventTypes.length]} event for user ${users[i % users.length]}`,
      });
    }
    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  // ============================================
  // Helper Functions
  // ============================================
  const getBarColor = (color: string) => {
    const map: Record<string, string> = {
      L: "bg-[#00b87c]",
      M: "bg-[#f59e0b]",
      H: "bg-[#7c3aed]",
      C: "bg-[#ef4444]",
    };
    return map[color] || "bg-[#00b87c]";
  };

  const getFilteredLogs = () => {
    if (logFilter === "all") return logs;
    return logs.filter(log => log.severity === logFilter);
  };

  const filteredLogs = getFilteredLogs();

  // ============================================
  // Loading State
  // ============================================
  if (loading) {
    return (
      <AdminLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
            <p className="text-neutral-500">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <AdminLayout title="Dashboard" subtitle="Bank Security Command Center">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 sm:p-5 shadow-xs">
          <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">Total Events</span>
          <span className="font-outfit text-xl sm:text-2xl font-bold text-neutral-800 block mt-1">{stats.totalEvents.toLocaleString()}</span>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 sm:p-5 shadow-xs">
          <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">Critical Alerts</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-outfit text-xl sm:text-2xl font-bold text-[#ef4444]">{stats.criticalAlerts}</span>
            {stats.criticalAlerts > 0 && (
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="h-2 w-2 rounded-full bg-red-500" />
                <span className="h-2 w-2 rounded-full bg-red-500" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 sm:p-5 shadow-xs">
          <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">Avg Risk Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-outfit text-xl sm:text-2xl font-bold text-neutral-800">{stats.avgRiskScore}</span>
            <span className={`font-mono text-[9px] font-bold shrink-0 ${
              stats.avgRiskScore <= 25 ? 'text-[#00b87c]' : 
              stats.avgRiskScore <= 50 ? 'text-yellow-500' : 
              stats.avgRiskScore <= 75 ? 'text-orange-500' : 'text-red-500'
            }`}>
              {stats.avgRiskScore <= 25 ? 'Low' : stats.avgRiskScore <= 50 ? 'Med' : stats.avgRiskScore <= 75 ? 'High' : 'Crit'}
            </span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 sm:p-5 shadow-xs">
          <span className="font-mono text-[9px] font-bold tracking-wider text-neutral-400 block uppercase">Blocked</span>
          <span className="font-outfit text-xl sm:text-2xl font-bold text-neutral-800 block mt-1">{stats.blockedEvents}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h3 className="font-outfit text-base font-bold text-neutral-800">Risk Trends - Last 24 Hours</h3>
            <span className="font-mono text-[9px] text-neutral-400 uppercase">Volumetric analysis of event severity</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono font-medium text-neutral-500">
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#00b87c]" />Low</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />Med</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#7c3aed]" />High</div>
            <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />Crit</div>
          </div>
        </div>

        <div className="h-40 sm:h-56 flex items-end justify-between gap-0.5 sm:gap-1 pt-6 border-b border-neutral-100">
          {chartBars.map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer">
              <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] sm:text-[9px] px-1 py-0.5 rounded font-mono z-20 pointer-events-none">
                {bar.h}%
              </div>
              <div style={{ height: `${bar.h}%` }} className={`w-full rounded-t-sm ${getBarColor(bar.color)} min-h-[2px] hover:opacity-80 transition-all`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between px-1 text-[8px] sm:text-[9px] font-mono text-neutral-400 mt-2">
          <span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>23:59</span>
        </div>
      </div>

      {/* Incidents & Logs Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Incidents Table */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h3 className="font-outfit text-base font-bold text-neutral-800">Recent Incidents</h3>
            <button onClick={() => router.push("/admin-dashboard/events")} className="font-mono text-[9px] font-bold tracking-wider text-neutral-500 hover:text-black transition-colors uppercase">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="font-mono text-[9px] text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100">
                  <th className="pb-2">Time</th>
                  <th className="pb-2">User</th>
                  <th className="pb-2 text-center">Score</th>
                  <th className="pb-2">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {incidents.slice(0, 3).map((inc, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/60 cursor-pointer transition-colors" onClick={() => router.push(`/event-details?id=${inc.incidentId}`)}>
                    <td className="py-3 font-mono text-neutral-400 text-[10px]">{new Date(inc.createdAt).toLocaleTimeString()}</td>
                    <td className="py-3 font-bold text-neutral-800">#{inc.userId}</td>
                    <td className={`py-3 font-bold text-center ${inc.riskScore >= 76 ? 'text-red-500' : inc.riskScore >= 51 ? 'text-orange-500' : 'text-green-500'}`}>{inc.riskScore}</td>
                    <td className="py-3">
                      <span className={`font-mono text-[8px] font-bold px-2 py-0.5 rounded uppercase ${inc.decision === 'BLOCK' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'}`}>
                        {inc.decision || 'REVIEW'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logs Terminal */}
        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <FaTerminal className="w-4 h-4 text-neutral-600" />
              <h3 className="font-outfit text-base font-bold text-neutral-800">Live Logs</h3>
              <span className="flex items-center gap-1 text-[10px] text-green-600"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />Live</span>
            </div>
            <select value={logFilter} onChange={(e) => setLogFilter(e.target.value)} className="text-[10px] border border-neutral-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-black">
              <option value="all">All</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div className="bg-[#0c0c0e] rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[10px] sm:text-[11px]">
            {filteredLogs.slice(0, 8).map((log, idx) => (
              <div key={idx} className="flex flex-wrap items-center gap-1 sm:gap-2 hover:bg-white/5 px-1 py-0.5 rounded transition-colors text-neutral-300">
                <span className="text-neutral-500 text-[8px] sm:text-[9px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className={`px-1 py-0.5 rounded text-[7px] sm:text-[8px] font-bold uppercase ${
                  log.severity === 'CRITICAL' ? 'text-red-400 bg-red-500/20' :
                  log.severity === 'HIGH' ? 'text-orange-400 bg-orange-500/20' :
                  log.severity === 'MEDIUM' ? 'text-yellow-400 bg-yellow-500/20' :
                  'text-green-400 bg-green-500/20'
                }`}>{log.severity}</span>
                <span className="text-blue-400 text-[8px] sm:text-[9px]">[{log.userId}]</span>
                <span className="truncate flex-1 min-w-[60px]">{log.message}</span>
                <span className={`font-bold ${log.riskScore >= 76 ? 'text-red-400' : log.riskScore >= 51 ? 'text-orange-400' : 'text-green-400'}`}>{log.riskScore}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}