"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaSpinner,
  FaEye,
  FaEllipsisV,
  FaSearch,
  FaFilter,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaExclamationTriangle,
  FaUserCheck,
  FaUserSlash,
  FaClock,
  FaChartLine,
  FaArrowRight,
  FaUsers,
  FaUserPlus,
  FaUserCog,
  FaTrash,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaGlobe,
  FaLaptop,
  FaKey,
  FaLock,
  FaUnlock,
  FaIdCard,
  FaBuilding,
  FaMailBulk,
  FaUserTag,
  FaUserCircle,
  FaUserGraduate,
  FaUserTie,
  FaUserAstronaut,
  FaUserNinja,
  FaUserSecret,
  FaUserFriends,
  FaUserGroup,
  FaPlus,
  FaMinus,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaBell,
  FaCog,
  FaHome,
  FaHistory,
  FaCommentDots,
  FaSignOutAlt
} from "react-icons/fa";
import { HiOutlineShieldCheck } from "react-icons/hi";
import AdminLayout from "../../components/admin/AdminLayout";
import { getUsers, updateUserProfile } from "@/lib/api";

export default function UsersManagement() {
  const router = useRouter();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // ============================================
  // Users State
  // ============================================
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // ============================================
  // Filter State
  // ============================================
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  // ============================================
  // Load Users
  // ============================================
  useEffect(() => {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      setToken(tokenData);
      fetchUsers(tokenData);
    } else {
      setLoading(false);
    }
  }, [currentPage]);

  // ============================================
  // Fetch Users from API
  // ============================================
  const fetchUsers = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await getUsers(authToken, {
        limit: 20,
        page: currentPage,
      });
      
      if (response.success) {
        setUsers(response.users || []);
        setTotalUsers(response.total || 0);
        setTotalPages(response.pages || 1);
      } else {
        setUsers(generateMockUsers());
        setTotalUsers(50);
        setTotalPages(3);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers(generateMockUsers());
      setTotalUsers(50);
      setTotalPages(3);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // Generate Mock Users
  // ============================================
  const generateMockUsers = () => {
    const names = ["Jonathan Davis", "Sarah Mitchell", "Arjun Patel", "Priya Sharma", "Michael Chen", "Emily Wilson", "David Kim", "Lisa Park", "James O'Brien", "Maria Garcia"];
    const roles = ["customer", "analyst", "admin"];
    const accountTypes = ["SAVINGS", "CURRENT", "BUSINESS"];
    
    return Array.from({ length: 12 }, (_, i) => ({
      userId: `user_${Math.random().toString(36).substring(2, 10)}`,
      name: names[i % names.length],
      email: `${names[i % names.length].toLowerCase().replace(" ", ".")}@bank.com`,
      role: roles[i % roles.length],
      accountType: accountTypes[i % accountTypes.length],
      kycVerified: Math.random() > 0.3,
      isActive: Math.random() > 0.2,
      isBlocked: Math.random() > 0.85,
      lastRiskScore: Math.floor(Math.random() * 100),
      lastLoginAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      accountAgeDays: Math.floor(Math.random() * 365) + 30,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  // ============================================
  // Filter Users
  // ============================================
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === "" || 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.userId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === "All Roles" || user.role === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === "All Status" || 
      (statusFilter === "Active" && user.isActive && !user.isBlocked) ||
      (statusFilter === "Blocked" && user.isBlocked) ||
      (statusFilter === "Pending" && !user.isActive && !user.isBlocked);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // ============================================
  // Handlers
  // ============================================
  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleCloseDetail = () => {
    setShowUserDetail(false);
    setSelectedUser(null);
  };

  const handleToggleBlock = async (user: any) => {
    setUpdating(true);
    try {
      const response = await updateUserProfile(
        user.userId,
        { isBlocked: !user.isBlocked },
        token
      );
      if (response.success) {
        fetchUsers(token);
        if (selectedUser?.userId === user.userId) {
          setSelectedUser({ ...selectedUser, isBlocked: !selectedUser.isBlocked });
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleVerify = async (user: any) => {
    setUpdating(true);
    try {
      const response = await updateUserProfile(
        user.userId,
        { kycVerified: !user.kycVerified },
        token
      );
      if (response.success) {
        fetchUsers(token);
        if (selectedUser?.userId === user.userId) {
          setSelectedUser({ ...selectedUser, kycVerified: !selectedUser.kycVerified });
        }
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setUpdating(false);
    }
  };

  // ============================================
  // Helper Functions
  // ============================================
  const getStatusBadge = (user: any) => {
    if (user.isBlocked) {
      return { label: "Blocked", color: "bg-red-50 text-red-600 border-red-200" };
    }
    if (!user.isActive) {
      return { label: "Pending", color: "bg-yellow-50 text-yellow-600 border-yellow-200" };
    }
    return { label: "Active", color: "bg-green-50 text-green-600 border-green-200" };
  };

  const getRoleBadge = (role: string) => {
    const map: Record<string, string> = {
      admin: "bg-purple-50 text-purple-600 border-purple-200",
      analyst: "bg-blue-50 text-blue-600 border-blue-200",
      customer: "bg-neutral-50 text-neutral-600 border-neutral-200",
    };
    return map[role] || "bg-neutral-50 text-neutral-600 border-neutral-200";
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 76) return "text-red-500";
    if (score >= 51) return "text-orange-500";
    if (score >= 26) return "text-yellow-500";
    return "text-green-500";
  };

  const getRiskScoreLabel = (score: number) => {
    if (score >= 76) return "Critical";
    if (score >= 51) return "High";
    if (score >= 26) return "Medium";
    return "Low";
  };

  // ============================================
  // Loading State
  // ============================================
  if (loading) {
    return (
      <AdminLayout title="Users" subtitle="Loading users...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <FaSpinner className="w-12 h-12 animate-spin text-black mx-auto mb-4" />
            <p className="text-neutral-500">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ============================================
  // Render
  // ============================================
  return (
    <AdminLayout title="User Management" subtitle="Manage and monitor all users across your organization">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-neutral-500">
            <FaUsers className="w-4 h-4" />
            <span className="text-xs font-medium">Total Users</span>
          </div>
          <p className="font-outfit text-2xl font-bold text-neutral-800 mt-1">{totalUsers}</p>
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-green-600">
            <FaUserCheck className="w-4 h-4" />
            <span className="text-xs font-medium">Active</span>
          </div>
          <p className="font-outfit text-2xl font-bold text-neutral-800 mt-1">
            {users.filter(u => u.isActive && !u.isBlocked).length}
          </p>
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-red-600">
            <FaUserSlash className="w-4 h-4" />
            <span className="text-xs font-medium">Blocked</span>
          </div>
          <p className="font-outfit text-2xl font-bold text-neutral-800 mt-1">
            {users.filter(u => u.isBlocked).length}
          </p>
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-blue-600">
            <FaShieldAlt className="w-4 h-4" />
            <span className="text-xs font-medium">KYC Verified</span>
          </div>
          <p className="font-outfit text-2xl font-bold text-neutral-800 mt-1">
            {users.filter(u => u.kycVerified).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex-1 min-w-[180px] w-full sm:w-auto relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-black"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-black bg-white w-full sm:w-auto"
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Analyst</option>
            <option>Customer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:border-black bg-white w-full sm:w-auto"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Blocked</option>
            <option>Pending</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setRoleFilter("All Roles");
              setStatusFilter("All Status");
            }}
            className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors flex items-center gap-1"
          >
            <FaTimes className="w-3 h-3" />
            Clear
          </button>

          <div className="ml-auto text-xs text-neutral-500 hidden sm:block">
            {filteredUsers.length} of {totalUsers} users
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const status = getStatusBadge(user);
            const roleBadge = getRoleBadge(user.role);
            return (
              <div
                key={user.userId}
                onClick={() => handleUserClick(user)}
                className="bg-white border border-neutral-200/80 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-black/20 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 text-black font-mono text-base font-bold select-none">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <h3 className="font-outfit text-sm font-bold text-neutral-900 group-hover:text-black transition-colors">
                        {user.name || "Unknown User"}
                      </h3>
                      <p className="text-xs text-neutral-500 truncate max-w-[150px] flex items-center gap-1">
                        <FaEnvelope className="w-2.5 h-2.5" />
                        {user.email || "No email"}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${status.color} flex items-center gap-0.5`}>
                          {status.label === "Active" ? <FaCheckCircle className="w-2 h-2" /> :
                           status.label === "Blocked" ? <FaTimesCircle className="w-2 h-2" /> :
                           <FaClock className="w-2 h-2" />}
                          {status.label}
                        </span>
                        <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${roleBadge} flex items-center gap-0.5`}>
                          <FaUserTag className="w-2 h-2" />
                          {user.role || "customer"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs font-bold ${getRiskScoreColor(user.lastRiskScore || 0)}`}>
                      {user.lastRiskScore || 0}
                    </span>
                    <FaArrowRight className="w-3 h-3 text-neutral-400 group-hover:text-black transition-colors" />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    <span>{user.accountAgeDays || 0} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {user.kycVerified ? (
                      <FaCheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <FaTimesCircle className="w-3 h-3 text-yellow-500" />
                    )}
                    <span>{user.kycVerified ? "KYC Verified" : "KYC Pending"}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-neutral-400">
            <FaUsers className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm font-medium">No users found</p>
            <p className="text-xs">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-neutral-100">
        <span className="text-xs text-neutral-500 order-2 sm:order-1">
          Showing {filteredUsers.length} of {totalUsers} users
        </span>
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-40 flex items-center gap-1"
          >
            <FaChevronLeft className="w-3 h-3" />
            Previous
          </button>
          <span className="text-xs font-medium text-neutral-600 px-2">
            {currentPage} / {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1 text-xs border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-40 flex items-center gap-1"
          >
            Next
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ============================================ */}
      {/* USER DETAIL SIDEBAR */}
      {/* ============================================ */}
      {showUserDetail && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseDetail}
          />
          
          <div className="absolute right-0 top-0 h-full w-full sm:w-[450px] lg:w-[500px] bg-white shadow-2xl overflow-y-auto animate-slide-in">
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={handleCloseDetail}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <FaTimes className="w-5 h-5 text-neutral-600" />
              </button>

              {/* User Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-black text-white font-mono text-xl font-bold">
                  {selectedUser.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="font-outfit text-xl font-bold text-neutral-900">
                    {selectedUser.name || "Unknown User"}
                  </h2>
                  <p className="text-sm text-neutral-500 flex items-center gap-1">
                    <FaEnvelope className="w-3 h-3" />
                    {selectedUser.email}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getStatusBadge(selectedUser).color} flex items-center gap-1`}>
                      {getStatusBadge(selectedUser).label === "Active" ? <FaCheckCircle className="w-2.5 h-2.5" /> :
                       getStatusBadge(selectedUser).label === "Blocked" ? <FaTimesCircle className="w-2.5 h-2.5" /> :
                       <FaClock className="w-2.5 h-2.5" />}
                      {getStatusBadge(selectedUser).label}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getRoleBadge(selectedUser.role)} flex items-center gap-1`}>
                      <FaUserTag className="w-2.5 h-2.5" />
                      {selectedUser.role || "customer"}
                    </span>
                    {selectedUser.kycVerified && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border bg-green-50 text-green-600 border-green-200 flex items-center gap-1">
                        <FaCheckCircle className="w-2.5 h-2.5" />
                        KYC Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-neutral-50 rounded-xl p-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase flex items-center gap-1">
                    <FaIdCard className="w-3 h-3" />
                    User ID
                  </span>
                  <p className="font-mono text-sm font-bold text-neutral-800 truncate">{selectedUser.userId}</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase flex items-center gap-1">
                    <FaCalendarAlt className="w-3 h-3" />
                    Account Age
                  </span>
                  <p className="font-mono text-sm font-bold text-neutral-800">{selectedUser.accountAgeDays || 0} days</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase flex items-center gap-1">
                    <FaBuilding className="w-3 h-3" />
                    Account Type
                  </span>
                  <p className="font-mono text-sm font-bold text-neutral-800">{selectedUser.accountType || "SAVINGS"}</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3">
                  <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase flex items-center gap-1">
                    <FaClock className="w-3 h-3" />
                    Last Login
                  </span>
                  <p className="font-mono text-sm font-bold text-neutral-800">
                    {selectedUser.lastLoginAt ? new Date(selectedUser.lastLoginAt).toLocaleDateString() : "Never"}
                  </p>
                </div>
              </div>

              {/* Risk Score */}
              <div className="bg-white border border-neutral-200/80 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase flex items-center gap-1">
                    <FaChartLine className="w-3 h-3" />
                    Risk Score
                  </span>
                  <span className={`font-bold text-lg ${getRiskScoreColor(selectedUser.lastRiskScore || 0)}`}>
                    {selectedUser.lastRiskScore || 0}
                  </span>
                </div>
                <div className="mt-2 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (selectedUser.lastRiskScore || 0) >= 76 ? "bg-red-500" :
                      (selectedUser.lastRiskScore || 0) >= 51 ? "bg-orange-500" :
                      (selectedUser.lastRiskScore || 0) >= 26 ? "bg-yellow-500" :
                      "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(selectedUser.lastRiskScore || 0, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-400 mt-1 block">
                  {getRiskScoreLabel(selectedUser.lastRiskScore || 0)} risk level
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <h3 className="font-outfit text-sm font-bold text-neutral-800 flex items-center gap-2">
                  <FaUserCog className="w-4 h-4" />
                  Actions
                </h3>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleToggleBlock(selectedUser)}
                    disabled={updating}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                      selectedUser.isBlocked
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    } disabled:opacity-50`}
                  >
                    {selectedUser.isBlocked ? <FaUnlock /> : <FaLock />}
                    {selectedUser.isBlocked ? "Unblock User" : "Block User"}
                  </button>
                  
                  <button
                    onClick={() => handleToggleVerify(selectedUser)}
                    disabled={updating}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                      selectedUser.kycVerified
                        ? "bg-yellow-500 text-white hover:bg-yellow-600"
                        : "bg-black text-white hover:bg-neutral-800"
                    } disabled:opacity-50`}
                  >
                    <FaShieldAlt />
                    {selectedUser.kycVerified ? "Revoke KYC" : "Verify KYC"}
                  </button>

                  <button
                    onClick={() => {
                      handleCloseDetail();
                      router.push(`/user-profile?id=${selectedUser.userId}`);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-neutral-200 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 transition-all"
                  >
                    <FaEye />
                    View Full Profile
                  </button>
                </div>
              </div>

              {/* Created At */}
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-400 flex items-center gap-1">
                  <FaCalendarAlt className="w-3 h-3" />
                  Created: {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}