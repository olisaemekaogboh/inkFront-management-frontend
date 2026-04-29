import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import "./AdminDashboardPage.css";

// Mock data - replace with real API calls
const fetchDashboardStats = async () => {
  return {
    totalLeads: 128,
    totalSubscribers: 456,
    publishedPosts: 24,
    activeServices: 8,
    weeklyData: [
      { name: "Mon", leads: 12, subscribers: 8, posts: 3 },
      { name: "Tue", leads: 18, subscribers: 12, posts: 5 },
      { name: "Wed", leads: 15, subscribers: 10, posts: 4 },
      { name: "Thu", leads: 22, subscribers: 15, posts: 7 },
      { name: "Fri", leads: 28, subscribers: 20, posts: 8 },
      { name: "Sat", leads: 14, subscribers: 9, posts: 5 },
      { name: "Sun", leads: 10, subscribers: 6, posts: 3 },
    ],
    contentDistribution: [
      { name: "Blog", value: 35, color: "#6366f1" },
      { name: "Services", value: 25, color: "#10b981" },
      { name: "Portfolio", value: 20, color: "#f59e0b" },
      { name: "Products", value: 20, color: "#8b5cf6" },
    ],
    recentMessages: [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        status: "new",
        date: "2024-01-15",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com",
        status: "read",
        date: "2024-01-14",
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike@example.com",
        status: "new",
        date: "2024-01-14",
      },
      {
        id: 4,
        name: "Sarah Williams",
        email: "sarah@example.com",
        status: "responded",
        date: "2024-01-13",
      },
    ],
  };
};

const statCards = [
  {
    key: "totalLeads",
    label: "Leads",
    icon: "📩",
    color: "#6366f1",
    bgGradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
  },
  {
    key: "totalSubscribers",
    label: "Subscribers",
    icon: "📬",
    color: "#10b981",
    bgGradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
  },
  {
    key: "publishedPosts",
    label: "Blog Posts",
    icon: "📝",
    color: "#f59e0b",
    bgGradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
  },
  {
    key: "activeServices",
    label: "Services",
    icon: "⚙️",
    color: "#8b5cf6",
    bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
  },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">
          <div className="admin-dashboard__spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Stats Grid */}
      <div className="admin-dashboard__stats">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.key}
            className="admin-dashboard__stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            style={{ background: card.bgGradient }}
          >
            <div className="admin-dashboard__stat-icon">{card.icon}</div>
            <div className="admin-dashboard__stat-content">
              <span className="admin-dashboard__stat-label">{card.label}</span>
              <strong className="admin-dashboard__stat-value">
                {stats[card.key]}
              </strong>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="admin-dashboard__charts">
        {/* Area Chart - Weekly Activity */}
        <motion.div
          className="admin-dashboard__chart-card admin-dashboard__chart-card--large"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="admin-dashboard__chart-header">
            <h3>Weekly Activity</h3>
            <span className="admin-dashboard__chart-badge">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stats.weeklyData}>
              <defs>
                <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient
                  id="subscribersGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="leads"
                stroke="#6366f1"
                fill="url(#leadsGradient)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="subscribers"
                stroke="#10b981"
                fill="url(#subscribersGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="admin-dashboard__chart-legend">
            <span>
              <i
                className="admin-dashboard__legend-dot"
                style={{ background: "#6366f1" }}
              ></i>
              Leads
            </span>
            <span>
              <i
                className="admin-dashboard__legend-dot"
                style={{ background: "#10b981" }}
              ></i>
              Subscribers
            </span>
          </div>
        </motion.div>

        {/* Pie Chart - Content Distribution */}
        <motion.div
          className="admin-dashboard__chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="admin-dashboard__chart-header">
            <h3>Content Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.contentDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.contentDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="admin-dashboard__pie-labels">
            {stats.contentDistribution.map((item, idx) => (
              <div key={idx} className="admin-dashboard__pie-label">
                <i
                  className="admin-dashboard__pie-dot"
                  style={{ background: item.color }}
                ></i>
                <span>{item.name}</span>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mini Bar Chart - Posts */}
        <motion.div
          className="admin-dashboard__chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="admin-dashboard__chart-header">
            <h3>Weekly Posts</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.weeklyData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="posts" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Messages Table */}
      <motion.div
        className="admin-dashboard__table-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="admin-dashboard__table-header">
          <h3>Recent Messages</h3>
          <Link
            to="/admin/contact-messages"
            className="admin-dashboard__table-link"
          >
            View all →
          </Link>
        </div>
        <div className="admin-dashboard__table-wrap">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentMessages.map((message) => (
                <tr key={message.id}>
                  <td>
                    <strong>{message.name}</strong>
                  </td>
                  <td>{message.email}</td>
                  <td>
                    <span
                      className={`admin-dashboard__status admin-dashboard__status--${message.status}`}
                    >
                      {message.status}
                    </span>
                  </td>
                  <td>{message.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="admin-dashboard__actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <Link to="/admin/blog-posts" className="admin-dashboard__action-btn">
          <span>✍️</span> Write Post
        </Link>
        <Link to="/admin/newsletter" className="admin-dashboard__action-btn">
          <span>📧</span> Send Newsletter
        </Link>
        <Link
          to="/admin/contact-messages"
          className="admin-dashboard__action-btn"
        >
          <span>💬</span> View Leads
        </Link>
        <Link to="/admin/services" className="admin-dashboard__action-btn">
          <span>⚙️</span> Manage Services
        </Link>
      </motion.div>
    </div>
  );
}
