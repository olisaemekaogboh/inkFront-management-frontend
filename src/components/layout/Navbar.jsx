import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import SimpleThemeToggle from "../common/SimpleThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

import "../../styles/publicPremium.css";

function InkFrontLogo() {
  return (
    <span className="inkfront-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="currentColor">
        <path d="M10 8h28a2 2 0 0 1 2 2v6H17v7h18v6H17v11h-7V8Z" />
        <path d="M25 23h13v17h-7V29h-6v-6Z" opacity="0.7" />
      </svg>
    </span>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = auth?.user || null;
  const isAuthenticated = Boolean(auth?.isAuthenticated);
  const logout = auth?.logout;

  const roles = Array.isArray(user?.roles) ? user.roles : [];

  const userIsAdmin =
    Boolean(auth?.isAdmin) ||
    roles.includes("ADMIN") ||
    roles.includes("ROLE_ADMIN") ||
    roles.includes("SUPER_ADMIN") ||
    roles.includes("ROLE_SUPER_ADMIN");

  const displayName =
    user?.displayName ||
    user?.firstName ||
    user?.email ||
    t("nav.account", "Account");

  const navLinks = [
    { to: "/", label: t("nav.home", "Home"), end: true },
    { to: "/about", label: t("nav.about", "About") },
    { to: "/services", label: t("nav.services", "Services") },
    { to: "/portfolio", label: t("nav.portfolio", "Portfolio") },
    { to: "/products", label: t("nav.products", "Products") },
    { to: "/blog", label: t("nav.blog", "Blog") },
    { to: "/clients", label: t("nav.clients", "Clients") },
    { to: "/contact", label: t("nav.contact", "Contact") },
  ];

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 12);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [menuOpen]);

  async function handleLogout() {
    if (typeof logout === "function") {
      await logout();
    }

    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const menuLinkClass = ({ isActive }) =>
    isActive
      ? "premium-menu-drawer__link premium-menu-drawer__link--active"
      : "premium-menu-drawer__link";

  return (
    <header
      className={`premium-navbar premium-navbar--final ${scrolled ? "premium-navbar--scrolled" : ""}`}
    >
      <div className="premium-navbar__inner premium-navbar__inner--final">
        <Link to="/" className="premium-navbar__brand" onClick={closeMenu}>
          <InkFrontLogo />
          <span className="premium-navbar__brand-name">InkFront</span>
        </Link>

        <button
          type="button"
          className="premium-navbar__menu-button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-label={
            menuOpen
              ? t("nav.closeMenu", "Close menu")
              : t("nav.openMenu", "Open menu")
          }
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <strong>{menuOpen ? "✕" : "☰"}</strong>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              className="premium-menu-overlay"
              onClick={closeMenu}
              aria-label={t("nav.closeMenu", "Close menu")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
            />

            <motion.aside
              className="premium-menu-drawer"
              initial={{ x: "105%", opacity: 0.92 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "105%", opacity: 0.92 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="premium-menu-drawer__header">
                <Link
                  to="/"
                  className="premium-navbar__brand"
                  onClick={closeMenu}
                >
                  <InkFrontLogo />
                  <span className="premium-navbar__brand-name">InkFront</span>
                </Link>

                <button
                  type="button"
                  className="premium-menu-drawer__close"
                  onClick={closeMenu}
                  aria-label={t("nav.closeMenu", "Close menu")}
                >
                  ✕
                </button>
              </div>

              <nav className="premium-menu-drawer__links">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMenu}
                    className={menuLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}

                {isAuthenticated && userIsAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={closeMenu}
                    className={menuLinkClass}
                  >
                    {t("nav.dashboard", "Dashboard")}
                  </NavLink>
                )}
              </nav>

              <div className="premium-menu-drawer__controls">
                <LanguageSwitcher id="drawer-language-switcher" />
                <SimpleThemeToggle />
              </div>

              <div className="premium-menu-drawer__account">
                {isAuthenticated ? (
                  <>
                    <span title={user?.email || displayName}>
                      {displayName}
                    </span>

                    {userIsAdmin && (
                      <Link
                        to="/admin"
                        className="premium-btn premium-btn-ghost"
                        onClick={closeMenu}
                      >
                        {t("nav.admin", "Admin")}
                      </Link>
                    )}

                    <button
                      type="button"
                      className="premium-btn premium-btn-primary"
                      onClick={handleLogout}
                    >
                      {t("nav.logout", "Logout")}
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="premium-btn premium-btn-primary"
                    onClick={closeMenu}
                  >
                    {t("nav.login", "Login")}
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
