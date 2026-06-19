"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaSpinner,
  FaFileExport,
  FaFilter,
  FaSync,
  FaEye,
  FaEllipsisV,
  FaHistory,
  FaSearch
} from "react-icons/fa";
import AdminLayout from "../../components/admin/AdminLayout";
import { getIncidents } from "@/lib/api";

export default function EventsLog() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("All Severities");
  const [decisionFilter, setDecisionFilter] = useState("All Decisions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState<any[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const itemsPerPage = 10;

  // ============================================
  // Load Data
  // ============================================
  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      setToken(tokenData);
      fetchEvents(tokenData);
    } else {
      setLoading(false);
    }
  }, []);

  // ============================================
  // Fetch Events from API
  // ============================================
  const fetchEvents = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await getIncidents(authToken, "ALL", 100);
      if (response.success) {
        const formattedEvents = response.incidents.map((inc: any) => ({
          time: new Date(inc.createdAt).toLocaleString(),
          id: inc.incidentId || `#EVT-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
          severity: inc.severity || "MEDIUM",
          decision: inc.decision || "REVIEW",
          score: inc.riskScore || Math.floor(Math.random() * 100),
          userId: inc.userId,
          eventType: inc.eventType || "Security Event",
        }));
        setEvents(formattedEvents);
        setTotalEvents(response.total || formattedEvents.length);
      } else {
        setEvents(generateMockEvents());
        setTotalEvents(50);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents(generateMockEvents());
      setTotalEvents(50);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Generate Mock Events
  // ============================================
  const generateMockEvents = () => {
    const severities = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
    const decisions = ["BLOCKED", "FLAGGED", "ALLOWED"];
    const eventTypes = ["Login Attempt", "Transaction", "Profile Update", "Password Reset", "API Call"];
    const users = ["USR-8821", "USR-1092", "USR-9904", "USR-7741", "USR-5563", "USR-3321", "USR-9987"];
    
    const events = [];
    for (let i = 0; i < 25; i++) {
      const severity = severities[Math.floor(Math.random() * severities.length)];
      const decision = decisions[Math.floor(Math.random() * decisions.length)];
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      
      events.push({
        time: new Date(Date.now() - i * 60000 * 3).toLocaleString(),
        id: `#TXN-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        severity: severity,
        decision: decision,
        score: Math.floor(Math.random() * 100),
        userId: user,
        eventType: eventType,
      });
    }
    return events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };

  // ============================================
  // Filter Events
  // ============================================
  const filteredEvents = events.filter(ev => {
    const matchesSeverity = severityFilter === "All Severities" || ev.severity === severityFilter.toUpperCase();
    const matchesDecision = decisionFilter === "All Decisions" || ev.decision === decisionFilter.toUpperCase();
    const matchesSearch = searchQuery === "" || 
      ev.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ev.time.includes(searchQuery) ||
      ev.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.eventType?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesDecision && matchesSearch;
  });

  // ============================================
  // Pagination
  // ============================================
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================
  // Handlers
  // ============================================
  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedEvents.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedEvents.map(ev => ev.id));
    }
  };

  const handleReset = () => {
    setSeverityFilter("All Severities");
    setDecisionFilter("All Decisions");
    setSearchQuery("");
    setSelectedRows([]);
    setCurrentPage(1);
  };

  // ============================================
  // Styles
  // ============================================
  const getSeverityStyles = (sev: string) => {
    if (sev === "CRITICAL") return "bg-red-50 text-red-600 border border-red-200";
    if (sev === "HIGH") return "bg-orange-50 text-orange-600 border border-orange-200";
    if (sev === "MEDIUM") return "bg-blue-50 text-blue-600 border border-blue-200";
    return "bg-neutral-50 text-neutral-600 border border-neutral-200";
  };

  const getDecisionStyles = (dec: string) => {
    if (dec === "BLOCKED" || dec === "BLOCK") return "text-red-700 font-semibold border border-red-300 bg-red-50/20";
    if (dec === "FLAGGED" || dec === "REVIEW") return "text-purple-700 font-semibold border border-purple-300 bg-purple-50/20";
    return "text-green-700 font-semibold border border-green-300 bg-green-50/20";
  };

  const getScoreStyles = (score: number) => {
    if (score >= 76) return "text-[#ef4444]";
    if (score >= 51) return "text-[#f59e0b]";
    if (score >= 26) return "text-[#7c3aed]";
    return "text-[#00b87c]";
  };

  // ============================================
  // Loading State
  // ============================================
  if (loading) {
    return (
      <AdminLayout title="Events" subtitle="Loading events...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
            <p className="text-neutral-500">Loading events...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <AdminLayout title="Security Events" subtitle="Monitor and investigate all security events">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events..."
              className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-black w-full sm:w-48 md:w-64"
            />
          </div>

          {/* Filters */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-black"
          >
            <option>All Severities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            value={decisionFilter}
            onChange={(e) => setDecisionFilter(e.target.value)}
            className="text-sm border border-neutral-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-black"
          >
            <option>All Decisions</option>
            <option>Blocked</option>
            <option>Flagged</option>
            <option>Allowed</option>
          </select>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
          >
            <FaSync className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500 hidden md:inline">
            {filteredEvents.length} events
          </span>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black text-sm font-medium text-white hover:bg-neutral-800 transition-all">
            <FaFileExport className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 font-mono text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                <th className="py-3 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedEvents.length && paginatedEvents.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                  />
                </th>
                <th className="py-3 font-semibold">Timestamp</th>
                <th className="py-3 font-semibold hidden sm:table-cell">Event ID</th>
                <th className="py-3 font-semibold hidden md:table-cell">User</th>
                <th className="py-3 font-semibold">Severity</th>
                <th className="py-3 font-semibold hidden sm:table-cell">Decision</th>
                <th className="py-3 font-semibold text-center">Score</th>
                <th className="py-3 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event) => (
                  <tr
                    key={event.id}
                    onClick={() => router.push(`/event-details?id=${event.id}`)}
                    className="hover:bg-neutral-50/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 pl-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(event.id)}
                        onChange={() => toggleSelectRow(event.id)}
                        className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black"
                      />
                    </td>
                    <td className="py-3 font-mono text-neutral-400 text-[10px] sm:text-xs">
                      {event.time}
                    </td>
                    <td className="py-3 font-mono font-bold text-neutral-800 hidden sm:table-cell text-[10px] sm:text-xs">
                      {event.id}
                    </td>
                    <td className="py-3 font-mono text-neutral-600 hidden md:table-cell text-[10px] sm:text-xs">
                      {event.userId || "N/A"}
                    </td>
                    <td className="py-3">
                      <span className={`font-mono text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded uppercase ${getSeverityStyles(event.severity)}`}>
                        {event.severity}
                      </span>
                    </td>
                    <td className="py-3 hidden sm:table-cell">
                      <span className={`font-mono text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded uppercase ${getDecisionStyles(event.decision)}`}>
                        {event.decision}
                      </span>
                    </td>
                    <td className={`py-3 font-mono font-bold text-center ${getScoreStyles(event.score)} text-sm`}>
                      {event.score}
                    </td>
                    <td className="py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1 sm:gap-2 text-neutral-400">
                        <button
                          onClick={() => router.push(`/event-details?id=${event.id}`)}
                          className="p-1 hover:text-black transition-colors rounded hover:bg-neutral-100"
                          title="View Details"
                        >
                          <FaEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                        <button className="p-1 hover:text-black transition-colors rounded hover:bg-neutral-100">
                          <FaEllipsisV className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-400">
                    <div className="flex flex-col items-center gap-2">
                      <FaHistory className="w-8 h-8 text-neutral-300" />
                      <p className="text-sm font-medium">No events found</p>
                      <p className="text-xs">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500 order-2 sm:order-1">
              Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length}
            </span>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-neutral-600 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}