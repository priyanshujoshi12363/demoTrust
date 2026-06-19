"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  FaSpinner,
  FaSearch,
  FaRobot,
  FaUser,
  FaArrowRight,
  FaCopy,
  FaDownload,
  FaEllipsisV,
  FaBars,
  FaTimes,
  FaComments,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaHistory,
  FaFilter,
  FaFileAlt,
  FaPaperPlane,
  FaMicrophone,
  FaImage,
  FaPaperclip,
  FaTrash,
  FaEdit,
  FaBookmark,
  FaShare,
  FaThumbsUp,
  FaThumbsDown,
  FaInfoCircle,
  FaLightbulb,
  FaChartLine,
  FaUserShield,
  FaLock,
  FaGlobe,
  FaDatabase,
  FaServer,
  FaCloud,
  FaCode,
  FaTerminal,
  FaBug,
  FaFire,
  FaBell,
  FaCog,
  FaPlus,
  FaMinus,
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";
import { 
  HiOutlineShieldCheck,
  HiOutlineChatAlt2,
  HiOutlineSearch,
  HiOutlineDocument,
  HiOutlineUserGroup,
  HiOutlineCog
} from "react-icons/hi";
import { MdOutlineSecurity, MdOutlineAnalytics, MdOutlineSupportAgent } from "react-icons/md";
import { BsShieldCheck, BsShieldLock } from "react-icons/bs";
import { IoIosSend, IoIosAttach } from "react-icons/io";
import AdminLayout from "../../components/admin/AdminLayout";
import { sendAnalystChat, getIncidents } from "@/lib/api";

export default function ChatbotConsole() {
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  
  // ============================================
  // Chat State
  // ============================================
  const [chatMessage, setChatMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([
    {
      sender: "bot",
      text: "Welcome to TrustAI Analyst Chatbot. I can help you with:\n• Security investigations\n• User risk analysis\n• Incident reports\n• Threat intelligence\n\nHow can I assist you today?",
      time: new Date().toLocaleTimeString()
    }
  ]);

  // ============================================
  // Investigations State
  // ============================================
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvestigation, setSelectedInvestigation] = useState<any>(null);
  const [filterType, setFilterType] = useState("all");

  // ============================================
  // Load Data
  // ============================================
  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      setToken(tokenData);
      fetchInvestigations(tokenData);
    } else {
      setLoading(false);
    }
  }, []);

  // ============================================
  // Scroll to bottom of chat
  // ============================================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ============================================
  // Fetch Investigations
  // ============================================
  const fetchInvestigations = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await getIncidents(authToken, "ALL", 20);
      if (response.success) {
        const formatted = response.incidents.map((inc: any) => ({
          id: inc.incidentId || `INC-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          title: `${inc.eventType || "Security"} Event`,
          time: new Date(inc.createdAt).toLocaleTimeString(),
          desc: inc.reasons?.[0] || `${inc.severity} risk detected`,
          critical: inc.severity === "CRITICAL",
          auth: inc.decision === "BLOCK" || inc.decision === "CHALLENGE",
          severity: inc.severity,
          decision: inc.decision,
          riskScore: inc.riskScore,
          userId: inc.userId,
          incidentId: inc.incidentId,
        }));
        setInvestigations(formatted);
        if (formatted.length > 0) {
          setSelectedInvestigation(formatted[0]);
        }
      } else {
        setInvestigations(generateMockInvestigations());
      }
    } catch (error) {
      console.error("Error fetching investigations:", error);
      setInvestigations(generateMockInvestigations());
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Generate Mock Investigations
  // ============================================
  const generateMockInvestigations = () => {
    return [
      { id: "1", title: "High-Risk Login Block", time: "10:24 AM", desc: "Reviewing block for ID: #9942-X...", critical: true, auth: true },
      { id: "2", title: "Daily Security Audit", time: "08:15 AM", desc: "All protocols verified for node #01.", critical: false, auth: false },
      { id: "3", title: "API Key Rotation", time: "Yesterday", desc: "Successful rotation of 4 keys.", critical: false, auth: false },
      { id: "4", title: "Suspicious Transfer", time: "Yesterday", desc: "Large transfer to new beneficiary.", critical: true, auth: true },
      { id: "5", title: "MFA Bypass Attempt", time: "2 days ago", desc: "Multiple failed MFA attempts.", critical: true, auth: false },
    ];
  };

  // ============================================
  // Handle Send Message
  // ============================================
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const currentTime = new Date().toLocaleTimeString();
    
    setChatHistory(prev => [...prev, { sender: "user", text: textToSend, time: currentTime }]);
    setChatMessage("");
    setIsTyping(true);

    try {
      let context = "";
      if (selectedInvestigation) {
        context = ` (Context: User ${selectedInvestigation.userId || "unknown"}, Incident: ${selectedInvestigation.incidentId || "N/A"})`;
      }

      const response = await sendAnalystChat(textToSend + context, token);
      
      if (response.success) {
        setChatHistory(prev => [...prev, {
          sender: "bot",
          text: response.result?.answer || response.result?.message || "I've analyzed your request.",
          time: currentTime,
          payload: response.result?.payload || null
        }]);
      } else {
        let replyText = "I'm having trouble processing that request. Please try again.";
        if (textToSend.toLowerCase().includes("block") || textToSend.toLowerCase().includes("login")) {
          replyText = "The login was blocked due to multiple failed attempts from an unrecognized device.";
        } else if (textToSend.toLowerCase().includes("critical") || textToSend.toLowerCase().includes("alert")) {
          replyText = "There are currently critical alerts requiring immediate attention.";
        } else {
          replyText = "I can help you analyze users, events, or security threats. Please ask a specific question.";
        }
        setChatHistory(prev => [...prev, { sender: "bot", text: replyText, time: currentTime }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [...prev, {
        sender: "bot",
        text: "Sorry, I'm having trouble connecting to the AI service. Please try again.",
        time: currentTime
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ============================================
  // Handle Investigation Click
  // ============================================
  const handleInvestigationClick = (investigation: any) => {
    setSelectedInvestigation(investigation);
    setIsMobilePanelOpen(false);
    const contextMessage = `I want to investigate this event: ${investigation.title} (${investigation.desc})`;
    handleSendMessage(contextMessage);
  };

  // ============================================
  // Copy to Clipboard
  // ============================================
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // ============================================
  // Filter Investigations
  // ============================================
  const filteredInvestigations = investigations.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === "all" ||
      (filterType === "critical" && item.critical) ||
      (filterType === "auth" && item.auth);
    
    return matchesSearch && matchesFilter;
  });

  // ============================================
  // Loading State
  // ============================================
  if (loading) {
    return (
      <AdminLayout title="AI Chatbot" subtitle="Loading chatbot...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
            <p className="text-neutral-500">Loading chatbot...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <AdminLayout title="AI Security Chatbot" subtitle="Advanced threat investigation assistant">
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-280px)] min-h-[500px]">
        {/* ============================================ */}
        {/* INVESTIGATIONS PANEL */}
        {/* ============================================ */}
        <div className={`
          lg:w-80 flex flex-col bg-white border border-neutral-200/80 rounded-xl overflow-hidden
          transition-all duration-300 ease-in-out
          ${isMobilePanelOpen ? 'fixed inset-0 z-50 m-4' : 'hidden lg:flex'}
        `}>
          {/* Mobile Panel Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-neutral-100">
            <span className="font-semibold text-neutral-800 flex items-center gap-2">
              <FaHistory className="w-4 h-4 text-neutral-600" />
              Investigations
            </span>
            <button 
              onClick={() => setIsMobilePanelOpen(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <FaTimes className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          {/* Search & Filter */}
          <div className="p-4 border-b border-neutral-100 shrink-0 space-y-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
                placeholder="Search investigations..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  filterType === "all" 
                    ? "bg-black text-white" 
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <FaFilter className="w-3 h-3 inline mr-1" />
                All
              </button>
              <button
                onClick={() => setFilterType("critical")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  filterType === "critical" 
                    ? "bg-red-500 text-white" 
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <FaFire className="w-3 h-3 inline mr-1" />
                Critical
              </button>
              <button
                onClick={() => setFilterType("auth")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  filterType === "auth" 
                    ? "bg-blue-500 text-white" 
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <FaShieldAlt className="w-3 h-3 inline mr-1" />
                Auth
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
            {filteredInvestigations.length > 0 ? (
              filteredInvestigations.map((item) => {
                const isActive = selectedInvestigation?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleInvestigationClick(item)}
                    className={`p-4 cursor-pointer relative transition-all ${
                      isActive ? "bg-neutral-50/80" : "hover:bg-neutral-50/40"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
                    )}
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-semibold text-neutral-800 flex-1">{item.title}</h4>
                      <span className="font-mono text-[9px] text-neutral-400 flex items-center gap-1 shrink-0 ml-2">
                        <FaClock className="w-2.5 h-2.5" />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-light mt-1 truncate">
                      {item.desc}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      {item.critical && (
                        <span className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200 uppercase flex items-center gap-1">
                          <FaExclamationTriangle className="w-2.5 h-2.5" />
                          Critical
                        </span>
                      )}
                      {item.auth && (
                        <span className="font-mono text-[8px] font-bold px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase flex items-center gap-1">
                          <FaShieldAlt className="w-2.5 h-2.5" />
                          Auth
                        </span>
                      )}
                      {item.riskScore && (
                        <span className={`font-mono text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${
                          item.riskScore >= 76 ? "bg-red-50 text-red-600" :
                          item.riskScore >= 51 ? "bg-orange-50 text-orange-600" :
                          "bg-green-50 text-green-600"
                        }`}>
                          <FaChartLine className="w-2.5 h-2.5" />
                          {item.riskScore}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-neutral-400">
                <FaSearch className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
                <p className="text-sm font-medium">No investigations found</p>
                <p className="text-xs">Try adjusting your search</p>
              </div>
            )}
          </div>

          {/* Mobile Panel Footer */}
          <div className="lg:hidden p-4 border-t border-neutral-100">
            <button 
              onClick={() => setIsMobilePanelOpen(false)}
              className="w-full py-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        {/* ============================================ */}
        {/* CHAT PANEL */}
        {/* ============================================ */}
        <div className="flex-1 flex flex-col bg-white border border-neutral-200/80 rounded-xl overflow-hidden">
          {/* Chat Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Panel Toggle */}
              <button 
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                onClick={() => setIsMobilePanelOpen(true)}
              >
                <FaBars className="w-5 h-5 text-neutral-600" />
              </button>

              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black text-white shadow-xs shrink-0">
                <FaRobot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <FaComments className="w-3.5 h-3.5 text-neutral-600" />
                  TrustBot
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-[8px] sm:text-[9px] text-neutral-400 uppercase flex items-center gap-1">
                    <FaShieldAlt className="w-2.5 h-2.5" />
                    Active Security Module
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-neutral-400">
              <button className="hover:text-black transition-colors p-1" title="Download Log">
                <FaDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button className="hover:text-black transition-colors p-1" title="Bookmark">
                <FaBookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button className="hover:text-black transition-colors p-1" title="Share">
                <FaShare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button className="hover:text-black transition-colors p-1" title="More">
                <FaEllipsisV className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 bg-neutral-50/50">
            {chatHistory.map((chat, index) => {
              const isUser = chat.sender === "user";
              return (
                <div key={index} className={`flex gap-2 sm:gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}>
                  {!isUser && (
                    <div className="flex items-center justify-center w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full bg-neutral-200 text-neutral-700 font-mono text-[8px] sm:text-[9px] shrink-0 self-start mt-0.5">
                      <FaRobot className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  )}

                  <div className="space-y-1 max-w-[85%] sm:max-w-[70%]">
                    <div
                      className={`rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-black text-white rounded-tr-none"
                          : "bg-white border border-neutral-200/80 text-neutral-800 rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-xs sm:text-sm">{chat.text}</div>

                      {chat.payload && (
                        <div className="mt-3 rounded-lg bg-[#18181b] border border-neutral-800 p-3 sm:p-4 font-mono text-[8px] sm:text-[10px] text-neutral-300 leading-normal overflow-x-auto">
                          <pre>{JSON.stringify(chat.payload, null, 2)}</pre>
                        </div>
                      )}

                      {chat.payload && (
                        <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-2">
                          <button 
                            onClick={() => copyToClipboard(JSON.stringify(chat.payload, null, 2))}
                            className="px-2 py-1 text-[8px] sm:text-[10px] font-medium border border-neutral-200 hover:bg-neutral-50 rounded-md bg-white text-neutral-600 transition-colors flex items-center gap-1"
                          >
                            <FaCopy className="w-3 h-3" />
                            Copy
                          </button>
                          <button className="px-2 py-1 text-[8px] sm:text-[10px] font-medium border border-neutral-200 hover:bg-neutral-50 rounded-md bg-white text-neutral-600 transition-colors flex items-center gap-1">
                            <FaCode className="w-3 h-3" />
                            Re-run Scan
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="font-mono text-[7px] sm:text-[8px] text-neutral-400 block px-1 flex items-center gap-1">
                      <FaClock className="w-2.5 h-2.5" />
                      {chat.time}
                    </span>
                  </div>

                  {isUser && (
                    <div className="flex items-center justify-center w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full bg-black text-white font-mono text-[8px] sm:text-[9px] shrink-0 self-start mt-0.5">
                      <FaUser className="w-3 h-3 sm:w-4 sm:h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-2 sm:gap-3.5 justify-start">
                <div className="flex items-center justify-center w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-full bg-neutral-200 text-neutral-700 font-mono text-[8px] sm:text-[9px] shrink-0">
                  <FaRobot className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="bg-white border border-neutral-200/80 rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-xs rounded-tl-none flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-3 sm:px-6 pt-2 pb-1 bg-white border-t border-neutral-100 flex flex-wrap gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => handleSendMessage("Why was this login blocked?")}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-600 transition-all active:scale-[0.98] flex items-center gap-1"
            >
              <FaExclamationTriangle className="w-2.5 h-2.5" />
              Why blocked?
            </button>
            <button
              onClick={() => handleSendMessage("Show today's critical events")}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-600 transition-all active:scale-[0.98] flex items-center gap-1"
            >
              <FaFire className="w-2.5 h-2.5" />
              Critical events
            </button>
            <button
              onClick={() => handleSendMessage("Analyze user risk profile")}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-600 transition-all active:scale-[0.98] flex items-center gap-1"
            >
              <FaChartLine className="w-2.5 h-2.5" />
              Analyze risk
            </button>
            <button
              onClick={() => handleSendMessage("What are the top security threats?")}
              className="px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] font-semibold border border-neutral-200 hover:bg-neutral-50 rounded-full text-neutral-600 transition-all active:scale-[0.98] flex items-center gap-1"
            >
              <FaShieldAlt className="w-2.5 h-2.5" />
              Top threats
            </button>
          </div>

          {/* Input Area */}
          <div className="px-3 sm:px-6 pb-3 sm:pb-4 pt-1.5 bg-white shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(chatMessage);
              }}
              className="relative flex items-center"
            >
              <div className="absolute left-3 flex items-center gap-1">
                <button type="button" className="p-1 text-neutral-400 hover:text-black transition-colors">
                  <IoIosAttach className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button type="button" className="p-1 text-neutral-400 hover:text-black transition-colors hidden sm:block">
                  <FaMicrophone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full bg-[#f3f4f6]/80 border border-neutral-200/60 rounded-lg py-2 pl-14 pr-14 sm:pr-16 text-xs sm:text-sm focus:bg-white focus:border-black focus:outline-none transition-all placeholder-neutral-500 text-neutral-800"
                placeholder="Ask about investigations, users, or security events..."
                disabled={isTyping}
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button type="button" className="p-1 text-neutral-400 hover:text-black transition-colors">
                  <FaImage className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  type="submit"
                  className="p-1.5 bg-black hover:bg-neutral-800 text-white rounded-md transition-all active:scale-[0.9] flex items-center justify-center disabled:opacity-50"
                  disabled={isTyping || !chatMessage.trim()}
                >
                  {isTyping ? (
                    <FaSpinner className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <IoIosSend className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </form>
            <div className="text-center font-mono text-[7px] sm:text-[8px] uppercase tracking-wider text-neutral-400 mt-1 flex items-center justify-center gap-2">
              <FaLock className="w-2.5 h-2.5" />
              End-to-End Encrypted Session
              <span className="hidden sm:inline">&bull; TrustAI Core v4.2</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}