import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleThemeToggle from "../common/SimpleThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

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
    { to: "/clients", label: t("nav.clients", "Clients") },
    { to: "/contact", label: t("nav.contact", "Contact") },
  ];

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
    isActive ? "navbar__link navbar__link--active" : "navbar__link";

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? "mobile-menu__link mobile-menu__link--active"
      : "mobile-menu__link";

  return (
    <header className="navbar">
      <div className="container app-container">
        <div className="navbar__container">
          <Link to="/" className="navbar__brand" onClick={closeMobileMenu}>
            <span>{t("common.appName", "INKFRONT")}</span>
          </Link>

          <nav className="navbar__links nav-links-desktop">
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

          <div className="navbar__actions nav-actions-desktop">
            <LanguageSwitcher id="navbar-language-switcher" />
            <SimpleThemeToggle />

            {isAuthenticated ? (
              <>
                <span
                  className="navbar__user"
                  title={user?.email || displayName}
                >
                  {displayName}
                </span>

                {userIsAdmin ? (
                  <Link to="/admin" className="btn btn--outline btn--sm">
                    {t("nav.admin", "Admin")}
                  </Link>
                ) : null}

                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={handleLogout}
                >
                  {t("nav.logout", "Logout")}
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn--primary btn--sm">
                {t("nav.login", "Login")}
              </Link>
            )}
          </div>

          <button
            type="button"
            className="navbar__mobile-toggle"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen
                ? t("nav.closeMenu", "Close menu")
                : t("nav.openMenu", "Open menu")
            }
          >
            <span className="sr-only">
              {mobileMenuOpen
                ? t("nav.closeMenu", "Close menu")
                : t("nav.openMenu", "Open menu")}
            </span>

            <svg
              className="navbar__mobile-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <div className="container app-container">
              <div className="mobile-menu__inner">
                <nav className="mobile-menu__links">
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

                <div className="mobile-menu__actions">
                  <LanguageSwitcher id="mobile-language-switcher" />
                  <SimpleThemeToggle />

                  {isAuthenticated ? (
                    <>
                      <span
                        className="navbar__user"
                        title={user?.email || displayName}
                      >
                        {displayName}
                      </span>

                      {userIsAdmin ? (
                        <Link
                          to="/admin"
                          className="btn btn--outline btn--sm"
                          onClick={closeMobileMenu}
                        >
                          {t("nav.admin", "Admin")}
                        </Link>
                      ) : null}

                      <button
                        type="button"
                        className="btn btn--primary btn--sm"
                        onClick={handleLogout}
                      >
                        {t("nav.logout", "Logout")}
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="btn btn--primary btn--sm"
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
