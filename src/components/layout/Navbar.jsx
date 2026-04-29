import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleThemeToggle from "../common/SimpleThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import "./Navbar.css";

function InkFrontLogo() {
  return (
    <span className="inkfront-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10 8h28a2 2 0 0 1 2 2v6H17v7h18v6H17v11h-7V8Z"
          fill="#2563eb"
        />
        <path d="M25 23h13v17h-7V29h-6v-6Z" fill="#3b82f6" opacity="0.7" />
      </svg>
    </span>
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimeout = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

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
    { to: "/", label: t("nav.home", "Home") },
    { to: "/about", label: t("nav.about", "About") },
    { to: "/services", label: t("nav.services", "Services") },
    { to: "/portfolio", label: t("nav.portfolio", "Portfolio") },
    { to: "/products", label: t("nav.products", "Products") },
    { to: "/blog", label: t("nav.blog", "Blog") },
    { to: "/clients", label: t("nav.clients", "Clients") },
    { to: "/contact", label: t("nav.contact", "Contact") },
  ];

  const openMenu = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    closeTimeout.current = setTimeout(() => setMenuOpen(false), 300);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  async function handleLogout() {
    if (typeof logout === "function") await logout();
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <header className="premium-navbar premium-navbar--seamless">
      <div className="premium-navbar__inner">
        <Link to="/" className="premium-navbar__logo">
          <InkFrontLogo />
          <span className="premium-navbar__logo-text">InkFront</span>
        </Link>

        <div className="premium-navbar__right">
          <div className="premium-navbar__controls premium-navbar__controls--desktop">
            <SimpleThemeToggle />
            <LanguageSwitcher id="navbar-language-switcher" />
          </div>

          <div
            className="premium-menu-container"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <button
              ref={buttonRef}
              className={`premium-menu-btn ${menuOpen ? "premium-menu-btn--active" : ""}`}
              onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
              aria-expanded={menuOpen}
            >
              <span className="premium-menu-btn__text">Menu</span>
              <svg
                className={`premium-menu-btn__arrow ${menuOpen ? "premium-menu-btn__arrow--open" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  ref={menuRef}
                  className="premium-dropdown"
                  initial={{ opacity: 0, y: -12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                >
                  <div className="premium-dropdown__links">
                    {navLinks.map((link) => (
                      <button
                        key={link.to}
                        className="premium-dropdown__link"
                        onClick={() => handleNavigation(link.to)}
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>

                  {isAuthenticated && userIsAdmin && (
                    <>
                      <div className="premium-dropdown__divider" />
                      <button
                        className="premium-dropdown__link premium-dropdown__link--admin"
                        onClick={() => handleNavigation("/admin")}
                      >
                        📊 Dashboard
                      </button>
                    </>
                  )}

                  <div className="premium-dropdown__divider" />

                  {isAuthenticated ? (
                    <>
                      <div className="premium-dropdown__user">
                        <div className="premium-dropdown__user-name">
                          {displayName}
                        </div>
                        <div className="premium-dropdown__user-email">
                          {user?.email}
                        </div>
                      </div>
                      <button
                        className="premium-dropdown__logout"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      className="premium-dropdown__login"
                      onClick={() => handleNavigation("/login")}
                    >
                      Login
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
