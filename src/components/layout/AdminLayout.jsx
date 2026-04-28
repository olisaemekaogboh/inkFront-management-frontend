import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import SimpleThemeToggle from "../common/SimpleThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: "📊", end: true },
  { label: "Contact Messages", to: "/admin/contact-messages", icon: "📩" },
  { label: "Blog Posts", to: "/admin/blog-posts", icon: "📝" },
  { label: "Services", to: "/admin/services", icon: "⚙️" },
  { label: "Portfolio", to: "/admin/portfolio", icon: "🎨" },
  { label: "Products", to: "/admin/products", icon: "📦" },
  { label: "Testimonials", to: "/admin/testimonials", icon: "⭐" },
  { label: "Client Logos", to: "/admin/client-logos", icon: "👥" },
  { label: "Hero Sections", to: "/admin/hero-sections", icon: "🏠" },
  { label: "Homepage Sections", to: "/admin/homepage-sections", icon: "🧩" },
];

function getPrimaryRole(roles = []) {
  const safeRoles = Array.isArray(roles) ? roles : [];

  if (safeRoles.includes("ROLE_SUPER_ADMIN")) return "ROLE_SUPER_ADMIN";
  if (safeRoles.includes("SUPER_ADMIN")) return "SUPER_ADMIN";
  if (safeRoles.includes("ROLE_ADMIN")) return "ROLE_ADMIN";
  if (safeRoles.includes("ADMIN")) return "ADMIN";
  if (safeRoles.includes("ROLE_USER")) return "ROLE_USER";
  if (safeRoles.includes("USER")) return "USER";

  return "USER";
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(false);

  useEffect(() => {
    function handleResize() {
      setDesktopSidebarVisible(window.innerWidth >= 1024);

      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayName =
    user?.displayName || user?.firstName || user?.email || "Admin";

  const userRole = useMemo(() => getPrimaryRole(user?.roles), [user?.roles]);

  const handleLogout = async () => {
    if (typeof logout === "function") {
      await logout();
    }

    navigate("/login", { replace: true });
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const sidebarShouldShow = desktopSidebarVisible || mobileSidebarOpen;

  return (
    <div className="admin">
      <button
        type="button"
        className="admin__mobile-toggle"
        onClick={() => setMobileSidebarOpen((current) => !current)}
        aria-label={mobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={mobileSidebarOpen}
      >
        ☰
      </button>

      <AnimatePresence>
        {sidebarShouldShow ? (
          <motion.aside
            className="admin__sidebar"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="admin__sidebar-brand">
              <Link
                to="/"
                className="admin__brand-link"
                onClick={closeMobileSidebar}
              >
                <span>🚀</span>
                <strong>InFront</strong>
              </Link>

              <p className="text-xs text-muted mt-2">Admin Dashboard</p>
            </div>

            <nav className="admin__sidebar-nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive
                      ? "admin__sidebar-link admin__sidebar-link--active"
                      : "admin__sidebar-link"
                  }
                  onClick={closeMobileSidebar}
                >
                  <span className="admin__sidebar-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="admin__sidebar-footer">
              <SimpleThemeToggle />
              <LanguageSwitcher id="admin-language-switcher" />
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {mobileSidebarOpen ? (
        <button
          type="button"
          className="admin__overlay"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar overlay"
        />
      ) : null}

      <div className="admin__main">
        <header className="admin__topbar">
          <div className="admin__topbar-copy">
            <h1>Welcome back, {displayName}</h1>
            <p>
              {userRole} • {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="admin__topbar-actions">
            <div className="hide-mobile">
              <SimpleThemeToggle />
            </div>

            <div className="hide-mobile">
              <LanguageSwitcher id="admin-topbar-switcher" />
            </div>

            <Link to="/" className="btn btn--outline btn--sm">
              View Site
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn--outline btn--sm"
            >
              🚪 Logout
            </button>
          </div>
        </header>

        <motion.main
          className="admin__content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
