import { Link, NavLink, useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import SimpleThemeToggle from "../common/SimpleThemeToggle";

import LanguageSwitcher from "../common/LanguageSwitcher";

import useAuth from "../../hooks/useAuth";

import useLanguage from "../../hooks/useLanguage";

import "../../styles/publicPremium.css";

export default function Navbar() {
  const navigate = useNavigate();

  const auth = useAuth();

  const { t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (mobileMenuOpen) {
      document.body.classList.add("mobile-menu-open");
    } else {
      document.body.classList.remove("mobile-menu-open");
    }

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [mobileMenuOpen]);

  async function handleLogout() {
    if (typeof logout === "function") {
      await logout();
    }

    setMobileMenuOpen(false);

    navigate("/", { replace: true });
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "premium-navbar__link premium-navbar__link--active"
      : "premium-navbar__link";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "premium-mobile-menu__link premium-mobile-menu__link--active"
      : "premium-mobile-menu__link";

  return (
    <header className="premium-navbar">
      <div className="premium-container">
        <div className="premium-navbar__inner">
          <Link
            to="/"
            className="premium-navbar__brand"
            onClick={closeMobileMenu}
          >
            <span className="premium-navbar__mark">IF</span>

            <span>{t("common.appName", "INKFRONT")}</span>
          </Link>

          <nav className="premium-navbar__links">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated && userIsAdmin ? (
              <NavLink to="/admin" className={navLinkClass}>
                {t("nav.dashboard", "Dashboard")}
              </NavLink>
            ) : null}
          </nav>

          <div className="premium-navbar__actions">
            <LanguageSwitcher id="navbar-language-switcher" />

            <SimpleThemeToggle />

            {isAuthenticated ? (
              <>
                <span
                  className="premium-navbar__user"
                  title={user?.email || displayName}
                >
                  {displayName}
                </span>

                {userIsAdmin ? (
                  <Link
                    to="/admin"
                    className="premium-btn premium-btn-ghost premium-btn-sm"
                  >
                    {t("nav.admin", "Admin")}
                  </Link>
                ) : null}

                <button
                  type="button"
                  className="premium-btn premium-btn-primary premium-btn-sm"
                  onClick={handleLogout}
                >
                  {t("nav.logout", "Logout")}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="premium-btn premium-btn-primary premium-btn-sm"
              >
                {t("nav.login", "Login")}
              </Link>
            )}
          </div>

          <button
            type="button"
            className="premium-navbar__toggle"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen
                ? t("nav.closeMenu", "Close menu")
                : t("nav.openMenu", "Open menu")
            }
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            className="premium-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="premium-container">
              <div className="premium-mobile-menu__inner">
                <nav className="premium-mobile-menu__links">
                  {navLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass}
                    >
                      {item.label}
                    </NavLink>
                  ))}

                  {isAuthenticated && userIsAdmin ? (
                    <NavLink
                      to="/admin"
                      onClick={closeMobileMenu}
                      className={mobileNavLinkClass}
                    >
                      {t("nav.dashboard", "Dashboard")}
                    </NavLink>
                  ) : null}
                </nav>

                <div className="premium-mobile-menu__actions">
                  <LanguageSwitcher id="mobile-language-switcher" />

                  <SimpleThemeToggle />

                  {isAuthenticated ? (
                    <>
                      <span className="premium-navbar__user">
                        {displayName}
                      </span>

                      {userIsAdmin ? (
                        <Link
                          to="/admin"
                          className="premium-btn premium-btn-ghost"
                          onClick={closeMobileMenu}
                        >
                          {t("nav.admin", "Admin")}
                        </Link>
                      ) : null}

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
                      onClick={closeMobileMenu}
                    >
                      {t("nav.login", "Login")}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
