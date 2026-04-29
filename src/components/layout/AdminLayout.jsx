import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import useAuth from "../../hooks/useAuth";
import SimpleThemeToggle from "../common/SimpleThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import "./AdminLayout.css";

// InkFront Logo Component
function InkFrontLogo() {
  return (
    <svg
      className="admin-shell__brand-svg"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 8h28a2 2 0 0 1 2 2v6H17v7h18v6H17v11h-7V8Z"
        fill="currentColor"
      />
      <path d="M25 23h13v17h-7V29h-6v-6Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

const navItems = [
  { label: "Dashboard", to: "/admin", icon: "📊", end: true },
  { label: "Contact", to: "/admin/contact-messages", icon: "📩" },
  { label: "Blog", to: "/admin/blog-posts", icon: "📝" },
  { label: "Newsletter", to: "/admin/newsletter", icon: "📬" },
  { label: "Services", to: "/admin/services", icon: "⚙️" },
  { label: "Portfolio", to: "/admin/portfolio", icon: "🎨" },
  { label: "Products", to: "/admin/products", icon: "📦" },
  { label: "Testimonials", to: "/admin/testimonials", icon: "⭐" },
  { label: "Clients", to: "/admin/client-logos", icon: "👥" },
  { label: "Hero", to: "/admin/hero-sections", icon: "🏠" },
  { label: "Homepage", to: "/admin/homepage-sections", icon: "🧩" },
];

function getPrimaryRole(roles = []) {
  const safeRoles = Array.isArray(roles) ? roles : [];
  if (safeRoles.includes("ROLE_SUPER_ADMIN")) return "Super Admin";
  if (safeRoles.includes("SUPER_ADMIN")) return "Super Admin";
  if (safeRoles.includes("ROLE_ADMIN")) return "Admin";
  if (safeRoles.includes("ADMIN")) return "Admin";
  if (safeRoles.includes("ROLE_USER")) return "User";
  if (safeRoles.includes("USER")) return "User";
  return "User";
}

// Helper to get first name from email
function getFirstName(user) {
  if (user?.firstName) return user.firstName;
  if (user?.displayName) return user.displayName.split(" ")[0];
  if (user?.email) {
    const emailName = user.email.split("@")[0];
    const cleanName = emailName.replace(/[._]/g, " ").split(" ")[0];
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  }
  return "Admin";
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarVisible, setDesktopSidebarVisible] = useState(false);

  useEffect(() => {
    function handleResize() {
      setDesktopSidebarVisible(window.innerWidth >= 1100);
      if (window.innerWidth >= 1100) setMobileSidebarOpen(false);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const firstName = useMemo(() => getFirstName(user), [user]);
  const userRole = useMemo(() => getPrimaryRole(user?.roles), [user?.roles]);

  const handleLogout = async () => {
    if (typeof logout === "function") await logout();
    navigate("/login", { replace: true });
  };

  const closeMobileSidebar = () => setMobileSidebarOpen(false);
  const sidebarShouldShow = desktopSidebarVisible || mobileSidebarOpen;

  return (
    <div className="admin-shell">
      <button
        type="button"
        className="admin-shell__mobile-toggle"
        onClick={() => setMobileSidebarOpen((prev) => !prev)}
        aria-label={mobileSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        ☰
      </button>

      <AnimatePresence>
        {sidebarShouldShow && (
          <motion.aside
            className="admin-shell__sidebar"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="admin-shell__brand">
              <Link
                to="/admin"
                className="admin-shell__brand-link"
                onClick={closeMobileSidebar}
              >
                <span className="admin-shell__brand-mark">
                  <InkFrontLogo />
                </span>
                <span className="admin-shell__brand-name">InkFront</span>
              </Link>
            </div>

            <nav className="admin-shell__nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    isActive
                      ? "admin-shell__nav-link admin-shell__nav-link--active"
                      : "admin-shell__nav-link"
                  }
                  onClick={closeMobileSidebar}
                >
                  <span className="admin-shell__nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="admin-shell__sidebar-footer">
              <SimpleThemeToggle />
              <LanguageSwitcher id="admin-language-switcher" />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {mobileSidebarOpen && (
        <button
          className="admin-shell__overlay"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        />
      )}

      <div className="admin-shell__main">
        <header className="admin-shell__topbar">
          <div className="admin-shell__topbar-copy">
            <h1>{firstName}</h1>
            <p>{userRole}</p>
          </div>

          <div className="admin-shell__topbar-actions">
            <div className="admin-shell__desktop-control">
              <SimpleThemeToggle />
            </div>
            <div className="admin-shell__desktop-control">
              <LanguageSwitcher id="admin-topbar-switcher" />
            </div>
            <Link
              to="/"
              className="admin-shell__button admin-shell__button--ghost"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="admin-shell__button admin-shell__button--danger"
            >
              Logout
            </button>
          </div>
        </header>

        <motion.main
          className="admin-shell__content"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
