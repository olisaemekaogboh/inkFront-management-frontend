import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
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
  Area,
  AreaChart,
} from "recharts";
import { adminContactMessageApi } from "../../services/adminContantMessageApi";
import newsletterService from "../../services/newsletterService";
import blogService from "../../services/blogService";
import { serviceCatalogService } from "../../services/serviceCatalogService";
import { portfolioService } from "../../services/portfolioService";
import { productBlueprintService } from "../../services/productBlueprintService";
import "./AdminDashboardPage.css";

const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#8b5cf6"];

const statCards = [
  {
    key: "totalLeads",
    label: "Leads",
    icon: "📩",
    bgGradient: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
  },
  {
    key: "totalSubscribers",
    label: "Subscribers",
    icon: "📬",
    bgGradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
  },
  {
    key: "publishedPosts",
    label: "Blog Posts",
    icon: "📝",
    bgGradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
  },
  {
    key: "activeServices",
    label: "Services",
    icon: "⚙️",
    bgGradient: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
  },
];

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.payload)) return value.payload;
  if (Array.isArray(value?.result)) return value.result;
  return [];
};

const getTotalElements = (value) => {
  if (typeof value?.totalElements === "number") return value.totalElements;
  if (typeof value?.data?.totalElements === "number") {
    return value.data.totalElements;
  }
  if (typeof value?.total === "number") return value.total;
  if (typeof value?.data?.total === "number") return value.data.total;
  return normalizeList(value).length;
};

const normalizeStatus = (status) =>
  `${status || "new"}`.trim().toLowerCase().replaceAll("_", "-");

const getDateValue = (item) =>
  item?.createdAt ||
  item?.updatedAt ||
  item?.submittedAt ||
  item?.sentAt ||
  item?.publishedAt ||
  item?.subscribedAt ||
  item?.date ||
  "";

const formatDate = (value) => {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
};

const getMessageName = (message) =>
  message?.name ||
  message?.fullName ||
  message?.senderName ||
  `${message?.firstName || ""} ${message?.lastName || ""}`.trim() ||
  "Unknown";

const getMessageEmail = (message) =>
  message?.email || message?.senderEmail || message?.contactEmail || "—";

const getMessageStatus = (message) =>
  normalizeStatus(message?.status || message?.messageStatus || "new");

const safeRequest = async (request, fallback) => {
  try {
    return await request();
  } catch (error) {
    console.warn("Dashboard request failed:", error?.response?.data || error);
    return fallback;
  }
};

const buildWeeklyData = ({ messages = [], subscribers = [], posts = [] }) => {
  const now = new Date();

  const days = Array.from({ length: 7 }).map((_, dayIndex) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (6 - dayIndex));

    return {
      key: date.toISOString().slice(0, 10),
      name: new Intl.DateTimeFormat("en", { weekday: "short" }).format(date),
      leads: 0,
      subscribers: 0,
      posts: 0,
    };
  });

  const countIntoDay = (items, field) => {
    items.forEach((item) => {
      const rawDate = getDateValue(item);
      if (!rawDate) return;

      const parsed = new Date(rawDate);
      if (Number.isNaN(parsed.getTime())) return;

      const key = parsed.toISOString().slice(0, 10);
      const target = days.find((day) => day.key === key);

      if (target) {
        target[field] += 1;
      }
    });
  };

  countIntoDay(messages, "leads");
  countIntoDay(subscribers, "subscribers");
  countIntoDay(posts, "posts");

  return days.map(({ key, ...day }) => day);
};

const buildContentDistribution = ({ posts, services, projects, products }) => {
  const total = posts + services + projects + products;

  const toPercent = (value) => {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  };

  return [
    {
      name: "Blog",
      value: toPercent(posts),
      count: posts,
      color: CHART_COLORS[0],
    },
    {
      name: "Services",
      value: toPercent(services),
      count: services,
      color: CHART_COLORS[1],
    },
    {
      name: "Portfolio",
      value: toPercent(projects),
      count: projects,
      color: CHART_COLORS[2],
    },
    {
      name: "Products",
      value: toPercent(products),
      count: products,
      color: CHART_COLORS[3],
    },
  ];
};

const getAdminServices = () => {
  if (typeof serviceCatalogService.getAll === "function") {
    return serviceCatalogService.getAll();
  }

  if (typeof serviceCatalogService.getAdminServices === "function") {
    return serviceCatalogService.getAdminServices();
  }

  return serviceCatalogService.getServices();
};

const getAdminProjects = () => {
  if (typeof portfolioService.getAll === "function") {
    return portfolioService.getAll();
  }

  if (typeof portfolioService.getAdminProjects === "function") {
    return portfolioService.getAdminProjects();
  }

  return portfolioService.getProjects();
};

const getAdminProducts = () => {
  if (typeof productBlueprintService.getAll === "function") {
    return productBlueprintService.getAll();
  }

  if (typeof productBlueprintService.getAdminProductBlueprints === "function") {
    return productBlueprintService.getAdminProductBlueprints();
  }

  return productBlueprintService.getProductBlueprints();
};

async function fetchDashboardStats() {
  const [
    contactStats,
    messagesPage,
    subscribersPage,
    postsPage,
    servicesPage,
    projectsPage,
    productsPage,
  ] = await Promise.all([
    safeRequest(() => adminContactMessageApi.getStats(), {}),
    safeRequest(
      () => adminContactMessageApi.getMessages({ page: 0, size: 6 }),
      {},
    ),
    safeRequest(
      () => newsletterService.getSubscribers({ page: 0, size: 50 }),
      {},
    ),
    safeRequest(() => blogService.getAdminPosts({ page: 0, size: 50 }), {}),
    safeRequest(() => getAdminServices(), []),
    safeRequest(() => getAdminProjects(), []),
    safeRequest(() => getAdminProducts(), []),
  ]);

  const recentMessages = normalizeList(messagesPage).slice(0, 6);
  const subscribers = normalizeList(subscribersPage);
  const posts = normalizeList(postsPage);
  const services = normalizeList(servicesPage);
  const projects = normalizeList(projectsPage);
  const products = normalizeList(productsPage);

  const totalLeads =
    contactStats?.totalMessages ??
    contactStats?.total ??
    contactStats?.totalLeads ??
    contactStats?.data?.totalMessages ??
    contactStats?.data?.total ??
    contactStats?.data?.totalLeads ??
    getTotalElements(messagesPage);

  const totalSubscribers = getTotalElements(subscribersPage);

  const publishedPosts =
    posts.filter((post) => normalizeStatus(post?.status) === "published")
      .length || getTotalElements(postsPage);

  const activeServices =
    services.filter((service) => {
      const status = normalizeStatus(
        service?.status || service?.visibilityStatus,
      );

      return ["new", "active", "published", "visible", "enabled"].includes(
        status,
      );
    }).length || services.length;

  return {
    totalLeads,
    totalSubscribers,
    publishedPosts,
    activeServices,
    weeklyData: buildWeeklyData({
      messages: recentMessages,
      subscribers,
      posts,
    }),
    contentDistribution: buildContentDistribution({
      posts: getTotalElements(postsPage),
      services: services.length,
      projects: projects.length,
      products: products.length,
    }),
    recentMessages,
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await fetchDashboardStats();

        if (active) {
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);

        if (active) {
          setErrorMessage("Unable to load dashboard data.");
          setStats(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const hasDistributionData = useMemo(
    () => stats?.contentDistribution?.some((item) => item.count > 0),
    [stats],
  );

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">
          <div className="admin-dashboard__spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (errorMessage || !stats) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard__loading">
          <p>{errorMessage || "Unable to load dashboard data."}</p>
          <Link
            to="/admin/contact-messages"
            className="admin-dashboard__action-btn"
          >
            Open messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__stats">
        {statCards.map((card, cardIndex) => (
          <motion.div
            key={card.key}
            className="admin-dashboard__stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: cardIndex * 0.05 }}
            style={{ background: card.bgGradient }}
          >
            <div className="admin-dashboard__stat-icon">{card.icon}</div>
            <div className="admin-dashboard__stat-content">
              <span className="admin-dashboard__stat-label">{card.label}</span>
              <strong className="admin-dashboard__stat-value">
                {stats?.[card.key] ?? 0}
              </strong>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-dashboard__charts">
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
              <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
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
        </motion.div>

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
                data={hasDistributionData ? stats.contentDistribution : []}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {stats.contentDistribution.map((entry, cellIndex) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color || CHART_COLORS[cellIndex]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="admin-dashboard__pie-labels">
            {stats.contentDistribution.map((item, itemIndex) => (
              <div key={item.name} className="admin-dashboard__pie-label">
                <i
                  className="admin-dashboard__pie-dot"
                  style={{
                    background: item.color || CHART_COLORS[itemIndex],
                  }}
                />
                <span>{item.name}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </motion.div>

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
              <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="posts" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

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
              {stats.recentMessages.length > 0 ? (
                stats.recentMessages.map((message, messageIndex) => {
                  const status = getMessageStatus(message);

                  return (
                    <tr
                      key={
                        message.id ||
                        `${getMessageEmail(message)}-${getDateValue(
                          message,
                        )}-${messageIndex}`
                      }
                    >
                      <td>
                        <strong>{getMessageName(message)}</strong>
                      </td>
                      <td>{getMessageEmail(message)}</td>
                      <td>
                        <span
                          className={`admin-dashboard__status admin-dashboard__status--${status}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td>{formatDate(getDateValue(message))}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">No contact messages yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

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
          <span>📧</span> Newsletter
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
