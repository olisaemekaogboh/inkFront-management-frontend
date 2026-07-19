import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleThemeToggle from "../common/SimpleThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import "./Navbar.css";

// ============================================
// INKFRONT LOGO WITH STRETCHING EFFECT
// ============================================

const InkFrontLogo = memo(
  ({ showName = false, userName = "", isScrolled = false }) => {
    return (
      <div className={`inkfront-logo-wrapper ${showName ? "is-expanded" : ""}`}>
        <span className="inkfront-brand-mark" aria-hidden="true">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 8h28a2 2 0 0 1 2 2v6H17v7h18v6H17v11h-7V8Z"
              fill="blue"
            />
            <path d="M25 23h13v17h-7V29h-6v-6Z" fill="blue" opacity="0.7" />
          </svg>
        </span>

        <span
          className={`premium-navbar__logo-text ${isScrolled ? "premium-navbar__logo-text--scrolled" : ""}`}
        >
          InkFront
        </span>

        <span className="inkfront-logo-user">{userName}</span>
      </div>
    );
  },
);

InkFrontLogo.displayName = "InkFrontLogo";

// ============================================
// ENHANCED HAMBURGER ICON
// ============================================

const HamburgerIcon = memo(
  ({
    isOpen,
    size = "md",
    className = "",
    strokeWidth = 2,
    color = "currentColor",
  }) => {
    const sizeMap = {
      sm: { width: 18, height: 18 },
      md: { width: 24, height: 24 },
      lg: { width: 28, height: 28 },
      xl: { width: 32, height: 32 },
    };

    const { width, height } = sizeMap[size] || sizeMap.md;

    return (
      <svg
        className={`hamburger-icon ${isOpen ? "hamburger-icon--open" : ""} ${className}`}
        viewBox="0 0 24 24"
        width={width}
        height={height}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
        role="img"
      >
        {isOpen ? (
          <>
            <motion.line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </>
        ) : (
          <>
            <motion.line
              x1="3"
              y1="6"
              x2="21"
              y2="6"
              className="hamburger-line hamburger-line--top"
              initial={{ rotate: 0, translateY: 0 }}
              animate={{ rotate: 0, translateY: 0 }}
              exit={{ rotate: -45, translateY: 6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
            <motion.line
              x1="3"
              y1="12"
              x2="21"
              y2="12"
              className="hamburger-line hamburger-line--middle"
              initial={{ opacity: 1, scaleX: 1 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            />
            <motion.line
              x1="3"
              y1="18"
              x2="21"
              y2="18"
              className="hamburger-line hamburger-line--bottom"
              initial={{ rotate: 0, translateY: 0 }}
              animate={{ rotate: 0, translateY: 0 }}
              exit={{ rotate: 45, translateY: -6 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </>
        )}
      </svg>
    );
  },
);

HamburgerIcon.displayName = "HamburgerIcon";

// ============================================
// NAVBAR COMPONENT
// ============================================

export default function Navbar() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserName, setShowUserName] = useState(false);
  const [userName, setUserName] = useState("");
  const hoverTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const userNameTimeoutRef = useRef(null);
  const hasShownNameRef = useRef(false);

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

  // Clean timeouts
  const clearHoverTimeout = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const clearUserNameTimeout = useCallback(() => {
    if (userNameTimeoutRef.current) {
      clearTimeout(userNameTimeoutRef.current);
      userNameTimeoutRef.current = null;
    }
  }, []);

  // Handle user name display - ONE TIME STRETCHING EXPANSION
  useEffect(() => {
    if (isAuthenticated && displayName && !hasShownNameRef.current) {
      setUserName(displayName);

      clearUserNameTimeout();
      userNameTimeoutRef.current = setTimeout(() => {
        setShowUserName(true);
        hasShownNameRef.current = true;

        // Shrink back after 2.5 seconds
        setTimeout(() => {
          setShowUserName(false);
        }, 2500);
      }, 500);
    } else if (!isAuthenticated) {
      setShowUserName(false);
      setUserName("");
      hasShownNameRef.current = false;
    }

    return () => {
      clearUserNameTimeout();
    };
  }, [isAuthenticated, displayName, clearUserNameTimeout]);

  // Open menu - immediate
  const openMenu = useCallback(() => {
    clearHoverTimeout();
    setMenuOpen(true);
  }, [clearHoverTimeout]);

  // Close menu with delay
  const closeMenu = useCallback(() => {
    clearHoverTimeout();
    hoverTimeoutRef.current = setTimeout(() => {
      setMenuOpen(false);
    }, 200);
  }, [clearHoverTimeout]);

  // Toggle menu
  const toggleMenu = useCallback(() => {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [menuOpen, openMenu, closeMenu]);

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearHoverTimeout();
      clearUserNameTimeout();
    };
  }, [clearHoverTimeout, clearUserNameTimeout]);

  const handleNavigation = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  async function handleLogout() {
    setShowUserName(false);
    hasShownNameRef.current = false;
    if (typeof logout === "function") await logout();
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <header
      className={`premium-navbar premium-navbar--seamless ${isScrolled ? "premium-navbar--scrolled" : ""}`}
      role="banner"
    >
      <div className="premium-navbar__inner">
        <Link
          to="/"
          className="premium-navbar__logo"
          aria-label={t("nav.home", "Home")}
        >
          <InkFrontLogo
            showName={showUserName}
            userName={userName}
            isScrolled={isScrolled}
          />
        </Link>

        <div className="premium-navbar__right">
          <div
            ref={containerRef}
            className="premium-menu-container"
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
          >
            <button
              ref={buttonRef}
              className={`premium-menu-btn ${menuOpen ? "premium-menu-btn--active" : ""}`}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-label={
                menuOpen
                  ? t("nav.closeMenu", "Close menu")
                  : t("nav.openMenu", "Open menu")
              }
              aria-controls="premium-dropdown-menu"
              type="button"
            >
              <HamburgerIcon isOpen={menuOpen} size="md" strokeWidth={2.5} />
              <span className="premium-menu-btn__label">
                {menuOpen ? t("nav.close", "Close") : t("nav.menu", "Menu")}
              </span>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  ref={menuRef}
                  id="premium-dropdown-menu"
                  className="premium-dropdown"
                  initial={{ opacity: 0, y: -12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenu}
                  role="menu"
                  aria-label={t("nav.mainMenu", "Main menu")}
                >
                  {/* Theme Toggle & Language Switcher inside dropdown */}
                  <div className="premium-dropdown__controls">
                    <SimpleThemeToggle />
                    <LanguageSwitcher id="navbar-language-switcher-mobile" />
                  </div>

                  <div className="premium-dropdown__divider" role="separator" />

                  <div className="premium-dropdown__links">
                    {navLinks.map((link) => (
                      <button
                        key={link.to}
                        className="premium-dropdown__link"
                        onClick={() => handleNavigation(link.to)}
                        role="menuitem"
                      >
                        {link.label}
                      </button>
                    ))}
                  </div>

                  {isAuthenticated && userIsAdmin && (
                    <>
                      <div
                        className="premium-dropdown__divider"
                        role="separator"
                      />
                      <button
                        className="premium-dropdown__link premium-dropdown__link--admin"
                        onClick={() => handleNavigation("/admin")}
                        role="menuitem"
                      >
                        {t("nav.dashboard", "📊 Dashboard")}
                      </button>
                    </>
                  )}

                  <div className="premium-dropdown__divider" role="separator" />

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
                        role="menuitem"
                      >
                        {t("nav.logout", "Logout")}
                      </button>
                    </>
                  ) : (
                    <button
                      className="premium-dropdown__login"
                      onClick={() => handleNavigation("/login")}
                      role="menuitem"
                    >
                      {t("nav.login", "Login")}
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
