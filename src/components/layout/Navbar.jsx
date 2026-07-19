import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleThemeToggle from "../common/SimpleThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import "./Navbar.css";

// ============================================
// ANIMATED LOGO - DYNAMIC ISLAND INSPIRED
// ============================================

const AnimatedLogo = memo(({ userName = "", isAuthenticated = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowUser, setShouldShowUser] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const timeoutRef = useRef(null);

  // Handle the expansion animation sequence
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (isAuthenticated && userName && !hasShownOnce) {
      // Step 1: Start expansion
      setIsExpanded(true);
      setHasShownOnce(true);

      // Step 2: After 40% of expansion time (300ms), show username
      timeoutRef.current = setTimeout(() => {
        setShouldShowUser(true);
      }, 300);

      // Step 3: Hold for 2.5 seconds then collapse
      timeoutRef.current = setTimeout(() => {
        setShouldShowUser(false);

        // Step 4: Wait for username fade out before collapsing
        timeoutRef.current = setTimeout(() => {
          setIsExpanded(false);

          // Reset for next login
          timeoutRef.current = setTimeout(() => {
            setHasShownOnce(false);
          }, 500);
        }, 400);
      }, 2800);
    } else if (!isAuthenticated) {
      // Reset when logged out
      setIsExpanded(false);
      setShouldShowUser(false);
      setHasShownOnce(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isAuthenticated, userName, hasShownOnce]);

  return (
    <motion.div
      className="animated-logo"
      layout
      transition={{
        layout: {
          type: "spring",
          stiffness: 260,
          damping: 26,
          mass: 0.8,
        },
      }}
    >
      <motion.div
        className="logo-container"
        layout
        transition={{
          layout: {
            type: "spring",
            stiffness: 260,
            damping: 26,
            mass: 0.8,
          },
        }}
      >
        {/* Logo Icon - Always visible */}
        <motion.span className="logo-icon" layout="position" aria-hidden="true">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 8h28a2 2 0 0 1 2 2v6H17v7h18v6H17v11h-7V8Z"
              fill="#2563eb"
            />
            <path d="M25 23h13v17h-7V29h-6v-6Z" fill="#2563eb" opacity="0.7" />
          </svg>
        </motion.span>

        {/* Username - Animates independently */}
        <AnimatePresence mode="wait">
          {shouldShowUser && (
            <motion.span
              className="animated-user"
              initial={{
                opacity: 0,
                x: 12,
                scale: 0.95,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                x: 0,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                x: -12,
                scale: 0.95,
                filter: "blur(4px)",
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 22,
                mass: 0.7,
              }}
            >
              <span className="animated-user__text">{userName}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

AnimatedLogo.displayName = "AnimatedLogo";

// ============================================
// HAMBURGER ICON
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
  const hoverTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);

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
    };
  }, [clearHoverTimeout]);

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
          <AnimatedLogo
            userName={displayName}
            isAuthenticated={isAuthenticated}
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
