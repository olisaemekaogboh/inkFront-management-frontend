import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimpleThemeToggle from "../common/SimpleThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";
import "./Navbar.css";

// ============================================
// INKFRONT LOGO WITH CONTINUOUS ROTATION
// ============================================

const InkFrontLogo = memo(
  ({
    showUserInfo = false,
    userName = "",
    userLocation = "",
    isScrolled = false,
  }) => {
    const [currentDisplay, setCurrentDisplay] = useState("brand");
    const [displayText, setDisplayText] = useState("");
    const intervalRef = useRef(null);

    // Set up the rotation interval when user info is available
    useEffect(() => {
      if (showUserInfo && userName) {
        // Start with user name
        setCurrentDisplay("name");
        setDisplayText(userName);

        // Clear any existing interval
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }

        // Set up rotation every 3 seconds
        intervalRef.current = setInterval(() => {
          setCurrentDisplay((prev) => {
            if (prev === "name") {
              setDisplayText(userLocation || "Unknown Location");
              return "location";
            } else {
              setDisplayText(userName);
              return "name";
            }
          });
        }, 3000);

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        };
      } else {
        // Reset to brand when not authenticated
        setCurrentDisplay("brand");
        setDisplayText("");
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, [showUserInfo, userName, userLocation]);

    // Get the appropriate text to display
    const getDisplayText = () => {
      if (!showUserInfo || !userName) {
        return "InkFront";
      }
      return displayText || userName;
    };

    const textToShow = getDisplayText();
    const isUserMode = showUserInfo && userName;

    return (
      <div className="inkfront-logo-wrapper">
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

        <AnimatePresence mode="wait">
          <motion.span
            key={isUserMode ? `${currentDisplay}-${displayText}` : "brand"}
            className={`premium-navbar__logo-text ${isScrolled ? "premium-navbar__logo-text--scrolled" : ""} ${isUserMode ? "premium-navbar__logo-text--user" : ""}`}
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.5,
                ease: [0.34, 1.56, 0.64, 1],
              },
            }}
            exit={{
              opacity: 0,
              y: 10,
              scale: 0.8,
              transition: {
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
            style={{ overflow: "visible" }}
          >
            {isUserMode && currentDisplay === "name" && (
              <span className="user-display-label">Welcome, </span>
            )}
            {isUserMode && currentDisplay === "location" && (
              <span className="user-display-label">📍 </span>
            )}
            {textToShow}
          </motion.span>
        </AnimatePresence>
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
// HELPER: Get First Name
// ============================================

const getFirstName = (fullName) => {
  if (!fullName) return "";
  const parts = fullName.trim().split(/\s+/);
  return parts[0];
};

// ============================================
// HELPER: Get Location from IP Address (State & Country only)
// ============================================

const getUserLocationFromIP = async () => {
  try {
    // Use multiple free IP geolocation APIs with fallback
    const apis = [
      // ip-api.com - Returns region (state) and country
      {
        url: "https://ip-api.com/json/",
        parser: (data) => {
          if (data.status === "success") {
            const state = data.regionName || "";
            const country = data.country || "";
            // Return only state and country
            if (state && country) {
              return `${state}, ${country}`;
            } else if (country) {
              return country;
            } else if (state) {
              return state;
            }
          }
          return "";
        },
      },
      // ipapi.co - Returns region and country_name
      {
        url: "https://ipapi.co/json/",
        parser: (data) => {
          const state = data.region || "";
          const country = data.country_name || "";
          if (state && country) {
            return `${state}, ${country}`;
          } else if (country) {
            return country;
          } else if (state) {
            return state;
          }
          return "";
        },
      },
      // geoplugin.net - Returns region and countryName
      {
        url: "https://geoplugin.net/json.gp",
        parser: (data) => {
          const state = data.geoplugin_region || "";
          const country = data.geoplugin_countryName || "";
          if (state && country) {
            return `${state}, ${country}`;
          } else if (country) {
            return country;
          } else if (state) {
            return state;
          }
          return "";
        },
      },
    ];

    // Try each API until one works
    for (const api of apis) {
      try {
        const response = await fetch(api.url, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) continue;

        const data = await response.json();
        const location = api.parser(data);

        if (location && location.length > 2) {
          console.log("📍 Location found via IP (State, Country):", location);
          return location;
        }
      } catch (error) {
        console.warn("IP Geolocation API failed:", api.url, error.message);
        continue;
      }
    }

    // If all APIs fail, try a simpler approach - just get country
    try {
      const response = await fetch(
        "https://ip-api.com/json/?fields=country,regionName",
      );
      const data = await response.json();
      if (data.regionName && data.country) {
        return `${data.regionName}, ${data.country}`;
      } else if (data.country) {
        return data.country;
      }
    } catch (error) {
      console.warn("Fallback geolocation failed:", error.message);
    }

    return "";
  } catch (error) {
    console.error("Error fetching location from IP:", error);
    return "";
  }
};

// ============================================
// NAVBAR COMPONENT
// ============================================

export default function Navbar() {
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const locationFetchedRef = useRef(false);

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

  // Get full display name and extract first name
  const fullDisplayName =
    user?.displayName ||
    user?.name ||
    user?.firstName ||
    user?.email ||
    t("nav.account", "Account");

  // Extract first name for the logo animation
  const firstName = getFirstName(fullDisplayName);

  // Fetch location from IP when user is authenticated
  useEffect(() => {
    const fetchLocation = async () => {
      if (
        isAuthenticated &&
        !locationFetchedRef.current &&
        !isLoadingLocation
      ) {
        setIsLoadingLocation(true);
        try {
          const location = await getUserLocationFromIP();
          if (location) {
            setUserLocation(location);
            locationFetchedRef.current = true;
          } else {
            setUserLocation("Unknown Location");
          }
        } catch (error) {
          console.error("Failed to fetch location:", error);
          setUserLocation("Unknown Location");
        } finally {
          setIsLoadingLocation(false);
        }
      }
    };

    fetchLocation();
  }, [isAuthenticated, isLoadingLocation]);

  // Handle user info display - CONTINUOUS ROTATION
  useEffect(() => {
    if (isAuthenticated && firstName) {
      setUserName(firstName);

      // Show user info with a small delay
      const timeoutId = setTimeout(() => {
        setShowUserInfo(true);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else if (!isAuthenticated) {
      setShowUserInfo(false);
      setUserName("");
      setUserLocation("");
      locationFetchedRef.current = false;
    }
  }, [isAuthenticated, firstName]);

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
    setShowUserInfo(false);
    setUserName("");
    setUserLocation("");
    locationFetchedRef.current = false;
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
            showUserInfo={showUserInfo}
            userName={userName}
            userLocation={userLocation}
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
                          {fullDisplayName}
                        </div>
                        <div className="premium-dropdown__user-email">
                          {user?.email}
                        </div>
                        {userLocation && !userLocation.includes("Unknown") && (
                          <div className="premium-dropdown__user-location">
                            📍 {userLocation}
                          </div>
                        )}
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
