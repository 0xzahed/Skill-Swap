# Admin Dashboard Implementation Guide

**Document Version:** 1.0  
**Date:** November 26, 2025  
**Phase:** 6 - Admin & Management

---

## Table of Contents

1. [Dashboard Overview](#dashboard-overview)
2. [User Management](#user-management)
3. [Content Moderation](#content-moderation)
4. [Analytics & Reports](#analytics--reports)
5. [AI-Powered Insights](#ai-powered-insights)

---

## Dashboard Overview

### **Admin Routes**

```javascript
/admin
  ├── /dashboard           - Main analytics dashboard
  ├── /users              - User management
  ├── /skills             - Skill moderation
  ├── /bookings           - Booking management
  ├── /reviews            - Review moderation
  ├── /payments           - Payment transactions
  ├── /analytics          - Advanced analytics
  └── /settings           - Platform settings
```

### **Access Control**

**Route Protection:**

```jsx
// src/Components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { use } from "react";
import { AuthContext } from "../providers/AuthProvider";

const AdminRoute = ({ children }) => {
  const { user, loading } = use(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user is admin
      checkAdminStatus(user.uid).then(setIsAdmin);
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  return children;
};
```

---

## Main Dashboard

**File:** `src/Pages/Admin/Dashboard.jsx`

```jsx
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaBook,
  FaDollarSign,
  FaStar,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import api from "../../services/api";
import StatsCard from "../../Components/Admin/StatsCard";
import RevenueChart from "../../Components/Admin/RevenueChart";
import RecentBookings from "../../Components/Admin/RecentBookings";
import TopSkills from "../../Components/Admin/TopSkills";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSkills: 0,
    totalBookings: 0,
    totalRevenue: 0,
    growth: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load dashboard data");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with SkillSwap.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<FaUsers />}
            color="blue"
            growth={stats.growth.users}
          />
          <StatsCard
            title="Active Skills"
            value={stats.totalSkills}
            icon={<FaBook />}
            color="green"
            growth={stats.growth.skills}
          />
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
            icon={<FaStar />}
            color="purple"
            growth={stats.growth.bookings}
          />
          <StatsCard
            title="Revenue (MTD)"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            icon={<FaDollarSign />}
            color="yellow"
            growth={stats.growth.revenue}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <RevenueChart />
          <TopSkills />
        </div>

        {/* Recent Activity */}
        <RecentBookings />
      </div>
    </div>
  );
};

export default AdminDashboard;
```

### **Stats Card Component**

**File:** `src/Components/Admin/StatsCard.jsx`

```jsx
import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatsCard = ({ title, value, icon, color, growth }) => {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    yellow: "bg-yellow-500",
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>

          {growth && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm ${
                growth > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {growth > 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{Math.abs(growth)}% from last month</span>
            </div>
          )}
        </div>

        <div
          className={`${colors[color]} text-white p-4 rounded-full text-2xl`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
```

---

## User Management

**File:** `src/Pages/Admin/UserManagement.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { FaBan, FaCheck, FaSearch, FaUserShield } from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [filterRole]);

  const loadUsers = async () => {
    try {
      const response = await api.get(`/admin/users?role=${filterRole}`);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load users");
    }
  };

  const handleBanUser = async (userId) => {
    if (!confirm("Are you sure you want to ban this user?")) return;

    try {
      await api.post(`/admin/users/${userId}/ban`);
      toast.success("User banned successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to ban user");
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/verify`);
      toast.success("User verified successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to verify user");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      toast.success("Role updated successfully");
      loadUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>

            {/* Role Filter */}
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="provider">Providers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.uid}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={
                          user.photoURL ||
                          "https://i.postimg.cc/5y8zTvMg/default-avatar.png"
                        }
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.uid, e.target.value)
                      }
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="student">Student</option>
                      <option value="provider">Provider</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Banned"}
                    </span>
                    {user.isVerified && (
                      <FaCheck
                        className="inline ml-2 text-blue-500"
                        title="Verified"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      {!user.isVerified && (
                        <button
                          onClick={() => handleVerifyUser(user.uid)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Verify User"
                        >
                          <FaUserShield />
                        </button>
                      )}
                      {user.isActive ? (
                        <button
                          onClick={() => handleBanUser(user.uid)}
                          className="text-red-600 hover:text-red-900"
                          title="Ban User"
                        >
                          <FaBan />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user.uid)}
                          className="text-green-600 hover:text-green-900"
                          title="Unban User"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
```

---

## Content Moderation

**File:** `src/Pages/Admin/SkillModeration.jsx`

```jsx
import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import api from "../../services/api";
import toast from "react-hot-toast";

const SkillModeration = () => {
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    loadSkills();
  }, [filter]);

  const loadSkills = async () => {
    const response = await api.get(`/admin/skills?status=${filter}`);
    setSkills(response.data);
  };

  const handleApprove = async (skillId) => {
    try {
      await api.post(`/admin/skills/${skillId}/approve`);
      toast.success("Skill approved");
      loadSkills();
    } catch (error) {
      toast.error("Failed to approve skill");
    }
  };

  const handleReject = async (skillId, reason) => {
    try {
      await api.post(`/admin/skills/${skillId}/reject`, { reason });
      toast.success("Skill rejected");
      loadSkills();
    } catch (error) {
      toast.error("Failed to reject skill");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Skill Moderation</h1>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg ${
                filter === status ? "bg-[#422AD5] text-white" : "bg-white"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Skills List */}
        <div className="grid gap-4">
          {skills.map((skill) => (
            <div key={skill.skillId} className="bg-white rounded-lg shadow p-6">
              <div className="flex gap-4">
                <img
                  src={skill.image}
                  alt={skill.skillName}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{skill.skillName}</h3>
                  <p className="text-gray-600">{skill.description}</p>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Provider: {skill.providerName}</p>
                    <p>Price: ${skill.price}</p>
                    <p>Category: {skill.category}</p>
                  </div>
                </div>

                {filter === "pending" && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleApprove(skill.skillId)}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      <FaCheck className="inline mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt("Reason for rejection:");
                        if (reason) handleReject(skill.skillId, reason);
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      <FaTimes className="inline mr-2" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillModeration;
```

---

## Analytics & Reports

### **AI-Powered Analytics Dashboard**

**File:** `src/Pages/Admin/Analytics.jsx`

```jsx
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    loadAnalytics();
    loadAIInsights();
  }, [timeRange]);

  const loadAnalytics = async () => {
    const response = await api.get(`/admin/analytics?range=${timeRange}`);
    setAnalyticsData(response.data);
  };

  const loadAIInsights = async () => {
    // Use AI to generate insights from data
    const response = await api.post("/ai/analyze-platform", {
      timeRange,
    });
    setAiInsights(response.data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Analytics & Insights</h1>

        {/* AI Insights */}
        {aiInsights && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">🤖 AI-Powered Insights</h2>
            <div className="space-y-2">
              {aiInsights.insights.map((insight, index) => (
                <p key={index}>• {insight}</p>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold mb-4">Revenue Trend</h3>
            {analyticsData && <Line data={analyticsData.revenueData} />}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold mb-4">User Growth</h3>
            {analyticsData && <Bar data={analyticsData.userGrowthData} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
```

---

## Backend Admin Endpoints

**File:** `backend/functions/src/routes/admin.js`

```javascript
const express = require("express");
const router = express.Router();
const { verifyAuth, verifyAdmin } = require("../middleware/auth");
const admin = require("firebase-admin");
const db = admin.firestore();

// Get platform stats
router.get("/stats", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const stats = await getPlatformStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get("/users", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { role } = req.query;
    const usersRef = db.collection("users");
    let query = usersRef;

    if (role && role !== "all") {
      query = query.where("role", "==", role);
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ban/Unban user
router.post("/users/:id/ban", verifyAuth, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const userRef = db.collection("users").doc(id);
    const user = await userRef.get();

    await userRef.update({
      isActive: !user.data().isActive,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

**Next Document:** See `DATABASE_SCHEMA.md` and `API_DOCUMENTATION.md` for complete technical specifications.
