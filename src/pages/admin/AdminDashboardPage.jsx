import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./AdminDashboardPage.css";

const stats = [
  {
    label: "Content Modules",
    value: "11",
    change: "+4 active modules",
    icon: "🧩",
  },
  {
    label: "Leads & Subscribers",
    value: "24",
    change: "CRM + Newsletter",
    icon: "📩",
  },
  {
    label: "Published Content",
    value: "18",
    change: "Blog + public pages",
    icon: "🚀",
  },
  {
    label: "Languages",
    value: "4",
    change: "EN / IG / HA / YO",
    icon: "🌍",
  },
];

const weeklyActivity = [
  { label: "Mon", posts: 3, leads: 6, newsletter: 2 },
  { label: "Tue", posts: 5, leads: 8, newsletter: 4 },
  { label: "Wed", posts: 4, leads: 7, newsletter: 3 },
  { label: "Thu", posts: 7, leads: 10, newsletter: 5 },
  { label: "Fri", posts: 8, leads: 14, newsletter: 7 },
  { label: "Sat", posts: 5, leads: 9, newsletter: 4 },
  { label: "Sun", posts: 6, leads: 12, newsletter: 6 },
];

const contentBreakdown = [
  { label: "Blog", value: 35 },
  { label: "Services", value: 25 },
  { label: "Portfolio", value: 20 },
  { label: "Newsletter", value: 20 },
];

const modules = [
  {
    name: "Contact Messages",
    description: "Track leads and customer project requests.",
    records: 12,
    status: "Active",
    route: "/admin/contact-messages",
  },
  {
    name: "Blog Posts",
    description: "Create, publish, and manage blog articles.",
    records: 10,
    status: "Active",
    route: "/admin/blog-posts",
  },
  {
    name: "Newsletter",
    description: "Manage subscribers and email campaigns.",
    records: 14,
    status: "Active",
    route: "/admin/newsletter",
  },
  {
    name: "Services",
    description: "Manage public services shown on the website.",
    records: 6,
    status: "Active",
    route: "/admin/services",
  },
  {
    name: "Portfolio",
    description: "Control case studies and selected works.",
    records: 6,
    status: "Active",
    route: "/admin/portfolio",
  },
];

const recentActivity = [
  {
    title: "Newsletter campaign tested",
    type: "Newsletter",
    status: "Needs SMTP",
    time: "Today",
  },
  {
    title: "Blog module connected",
    type: "Blog",
    status: "Live",
    time: "Today",
  },
  {
    title: "Contact CRM active",
    type: "CRM",
    status: "Live",
    time: "Recent",
  },
  {
    title: "Public pages backend-driven",
    type: "Website",
    status: "Live",
    time: "Recent",
  },
];

const quickActions = [
  { label: "Create Blog Post", to: "/admin/blog-posts", icon: "📝" },
  { label: "Send Newsletter", to: "/admin/newsletter", icon: "📬" },
  { label: "Review Leads", to: "/admin/contact-messages", icon: "📩" },
  { label: "Update Services", to: "/admin/services", icon: "⚙️" },
];

const maxWeeklyValue = Math.max(
  ...weeklyActivity.flatMap((item) => [
    item.posts,
    item.leads,
    item.newsletter,
  ]),
);

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard__hero">
        <div>
          <span className="admin-dashboard__eyebrow">Admin Overview</span>
          <h1>InkFront management dashboard</h1>
          <p>
            Manage your public website content, blog posts, subscribers,
            campaigns, leads, services, products, portfolio, and client trust
            sections from one clear dashboard.
          </p>
        </div>

        <div className="admin-dashboard__hero-actions">
          <Link to="/admin/blog-posts" className="admin-dashboard__primary-btn">
            New Blog Post
          </Link>
          <Link to="/admin/newsletter" className="admin-dashboard__ghost-btn">
            Newsletter
          </Link>
        </div>
      </section>

      <section className="admin-dashboard__stats">
        {stats.map((item, index) => (
          <motion.article
            key={item.label}
            className="admin-dashboard__stat"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="admin-dashboard__stat-icon">{item.icon}</span>
            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <small>{item.change}</small>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="admin-dashboard__grid">
        <article className="admin-dashboard__panel admin-dashboard__panel--wide">
          <div className="admin-dashboard__panel-head">
            <div>
              <span className="admin-dashboard__eyebrow">Weekly Activity</span>
              <h2>Posts, leads, and newsletter activity</h2>
            </div>
            <span className="admin-dashboard__badge">Live style chart</span>
          </div>

          <div className="admin-dashboard__chart-legend">
            <span>
              <i className="admin-dashboard__legend-dot admin-dashboard__legend-dot--posts" />
              Blog posts
            </span>
            <span>
              <i className="admin-dashboard__legend-dot admin-dashboard__legend-dot--leads" />
              Leads
            </span>
            <span>
              <i className="admin-dashboard__legend-dot admin-dashboard__legend-dot--newsletter" />
              Newsletter
            </span>
          </div>

          <div className="admin-dashboard__multi-chart">
            {weeklyActivity.map((day) => (
              <div key={day.label} className="admin-dashboard__chart-day">
                <div className="admin-dashboard__bars">
                  <span
                    className="admin-dashboard__bar admin-dashboard__bar--posts"
                    style={{
                      height: `${Math.max(
                        8,
                        (day.posts / maxWeeklyValue) * 100,
                      )}%`,
                    }}
                    title={`Posts: ${day.posts}`}
                  />
                  <span
                    className="admin-dashboard__bar admin-dashboard__bar--leads"
                    style={{
                      height: `${Math.max(
                        8,
                        (day.leads / maxWeeklyValue) * 100,
                      )}%`,
                    }}
                    title={`Leads: ${day.leads}`}
                  />
                  <span
                    className="admin-dashboard__bar admin-dashboard__bar--newsletter"
                    style={{
                      height: `${Math.max(
                        8,
                        (day.newsletter / maxWeeklyValue) * 100,
                      )}%`,
                    }}
                    title={`Newsletter: ${day.newsletter}`}
                  />
                </div>
                <strong>{day.label}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-head">
            <div>
              <span className="admin-dashboard__eyebrow">Breakdown</span>
              <h2>Content mix</h2>
            </div>
          </div>

          <div className="admin-dashboard__donut-wrap">
            <div className="admin-dashboard__donut">
              <div>
                <strong>100%</strong>
                <span>Modules</span>
              </div>
            </div>

            <div className="admin-dashboard__donut-list">
              {contentBreakdown.map((item) => (
                <div key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="admin-dashboard__grid admin-dashboard__grid--bottom">
        <article className="admin-dashboard__panel admin-dashboard__panel--wide">
          <div className="admin-dashboard__panel-head">
            <div>
              <span className="admin-dashboard__eyebrow">Live Table</span>
              <h2>Management modules</h2>
            </div>
          </div>

          <div className="admin-dashboard__table-wrap">
            <table className="admin-dashboard__table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>Description</th>
                  <th>Records</th>
                  <th>Status</th>
                  <th>Open</th>
                </tr>
              </thead>

              <tbody>
                {modules.map((module) => (
                  <tr key={module.name}>
                    <td>
                      <strong>{module.name}</strong>
                    </td>
                    <td>{module.description}</td>
                    <td>{module.records}</td>
                    <td>
                      <span className="admin-dashboard__status">
                        {module.status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={module.route}
                        className="admin-dashboard__table-link"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-head">
            <div>
              <span className="admin-dashboard__eyebrow">Actions</span>
              <h2>Quick actions</h2>
            </div>
          </div>

          <div className="admin-dashboard__quick-actions">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="admin-dashboard__quick-action"
              >
                <span>{action.icon}</span>
                <strong>{action.label}</strong>
              </Link>
            ))}
          </div>
        </article>
      </section>

      <section className="admin-dashboard__panel">
        <div className="admin-dashboard__panel-head">
          <div>
            <span className="admin-dashboard__eyebrow">Recent Activity</span>
            <h2>Latest admin events</h2>
          </div>
        </div>

        <div className="admin-dashboard__activity-table-wrap">
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Type</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>

            <tbody>
              {recentActivity.map((activity) => (
                <tr key={activity.title}>
                  <td>
                    <strong>{activity.title}</strong>
                  </td>
                  <td>{activity.type}</td>
                  <td>
                    <span className="admin-dashboard__status">
                      {activity.status}
                    </span>
                  </td>
                  <td>{activity.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
