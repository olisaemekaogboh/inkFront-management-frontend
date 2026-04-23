import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Container from "../common/Container";
import ThemeToggle from "../common/ThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import Button from "../common/Button";
import useAuth from "../../hooks/useAuth";
import useLanguage from "../../hooks/useLanguage";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header className="navbar">
      <Container className="navbar-inner">
        <Link to="/" className="brand-mark" onClick={closeMobileMenu}>
          {t("common.appName")}
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
        >
          {mobileMenuOpen ? t("common.close") : t("common.menu")}
        </button>

        <nav className="nav-links nav-links-desktop">
          <Link to="/">{t("nav.home")}</Link>
          <Link to="/about">{t("nav.about")}</Link>
          <Link to="/services">{t("nav.services")}</Link>
          <Link to="/portfolio">{t("nav.portfolio")}</Link>
          <Link to="/products">{t("nav.products")}</Link>
          <Link to="/clients">{t("nav.clients")}</Link>
          <Link to="/contact">{t("nav.contact")}</Link>
          {isAdmin ? <Link to="/admin">{t("nav.admin")}</Link> : null}
        </nav>

        <div className="nav-actions nav-actions-desktop">
          <LanguageSwitcher id="navbar-language-switcher" />
          <ThemeToggle />

          {isAuthenticated ? (
            <>
              <span className="nav-user">{user?.firstName}</span>
              <Button variant="primary" onClick={handleLogout}>
                {t("nav.logout")}
              </Button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              {t("nav.login")}
            </Link>
          )}
        </div>
      </Container>

      {mobileMenuOpen ? (
        <div className="mobile-menu">
          <Container className="mobile-menu-inner">
            <nav className="mobile-nav-links">
              <Link to="/" onClick={closeMobileMenu}>
                {t("nav.home")}
              </Link>
              <Link to="/about" onClick={closeMobileMenu}>
                {t("nav.about")}
              </Link>
              <Link to="/services" onClick={closeMobileMenu}>
                {t("nav.services")}
              </Link>
              <Link to="/portfolio" onClick={closeMobileMenu}>
                {t("nav.portfolio")}
              </Link>
              <Link to="/products" onClick={closeMobileMenu}>
                {t("nav.products")}
              </Link>
              <Link to="/clients" onClick={closeMobileMenu}>
                {t("nav.clients")}
              </Link>
              <Link to="/contact" onClick={closeMobileMenu}>
                {t("nav.contact")}
              </Link>
              {isAdmin ? (
                <Link to="/admin" onClick={closeMobileMenu}>
                  {t("nav.admin")}
                </Link>
              ) : null}
            </nav>

            <div className="mobile-nav-actions">
              <LanguageSwitcher id="mobile-language-switcher" />
              <ThemeToggle />

              {isAuthenticated ? (
                <>
                  <span className="nav-user">{user?.firstName}</span>
                  <Button variant="primary" onClick={handleLogout}>
                    {t("nav.logout")}
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary"
                  onClick={closeMobileMenu}
                >
                  {t("nav.login")}
                </Link>
              )}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
