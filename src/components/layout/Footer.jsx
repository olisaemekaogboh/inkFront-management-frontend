import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { useTheme } from "../../contexts/ThemeContext";

function InkFrontLogo() {
  const { theme } = useTheme();

  return (
    <span className="inkfront-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48">
        <path d="M10 8h28a2 2 0 0 1 2 2v6H17v7h18v6H17v11h-7V8Z" />
        <path d="M25 23h13v17h-7V29h-6v-6Z" />
      </svg>
    </span>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();
  const { theme, isDarkMode } = useTheme();

  const footerLinks = {
    explore: [
      { to: "/services", label: t("nav.services", "Services") },
      { to: "/portfolio", label: t("nav.portfolio", "Portfolio") },
      { to: "/products", label: t("nav.products", "Products") },
      { to: "/blog", label: t("nav.blog", "Blog") },
      { to: "/clients", label: t("nav.clients", "Clients") },
    ],
    company: [
      { to: "/", label: t("nav.home", "Home") },
      { to: "/about", label: t("nav.about", "About InkFront") },
      { to: "/contact", label: t("nav.contact", "Contact") },
    ],
  };

  const googleMapsUrl =
    "https://maps.google.com/?q=4+Basden+Street+Fegge+Onitsha+Anambra+Nigeria";

  return (
    <footer
      className="premium-footer"
      data-theme={theme}
      data-dark-mode={isDarkMode}
    >
      <div className="premium-container">
        <div className="premium-footer__top">
          <motion.div
            className="premium-footer__brand"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="premium-footer__logo">
              <InkFrontLogo />
              <strong>InkFront</strong>
            </Link>

            <p>
              {t(
                "footer.description",
                "InkFront builds premium websites, booking systems, dashboards, blogs, newsletters, portals, and custom software tools for modern businesses.",
              )}
            </p>

            <div className="premium-footer__social">
              <a
                href="https://wa.me/2349030175230"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              <a
                href="https://facebook.com/inkfront"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://x.com/inkfront"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://instagram.com/inkfront"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.75 2C4.574 2 2 4.574 2 7.75v8.5C2 19.426 4.574 22 7.75 22h8.5C19.426 22 22 19.426 22 16.25v-8.5C22 4.574 19.426 2 16.25 2h-8.5zm0 1.8h8.5a3.95 3.95 0 0 1 3.95 3.95v8.5a3.95 3.95 0 0 1-3.95 3.95h-8.5a3.95 3.95 0 0 1-3.95-3.95v-8.5A3.95 3.95 0 0 1 7.75 3.8zm8.95 1.35a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1zM12 6.5A5.5 5.5 0 1 0 17.5 12 5.506 5.506 0 0 0 12 6.5zm0 1.8A3.7 3.7 0 1 1 8.3 12 3.704 3.704 0 0 1 12 8.3z" />
                </svg>
              </a>

              <a
                href="https://youtube.com/@inkfront"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </motion.div>

          <motion.div
            className="premium-footer__column"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            viewport={{ once: true }}
          >
            <h3>{t("footer.explore", "Explore")}</h3>

            {footerLinks.explore.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </motion.div>

          <motion.div
            className="premium-footer__column"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            viewport={{ once: true }}
          >
            <h3>{t("footer.company", "Company")}</h3>

            {footerLinks.company.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </motion.div>

          <motion.div
            className="premium-footer__contact"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            viewport={{ once: true }}
          >
            <h3
              style={{
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {t("footer.startTitle", "Start with InkFront")}
            </h3>
            <p>
              {t(
                "footer.startText",
                "Ready to upgrade your business online? Let InkFront build a clean, modern digital system for your brand.",
              )}
            </p>

            <Link to="/contact" className="premium-btn premium-btn-light">
              {t("footer.contactButton", "Contact InkFront")} →
            </Link>

            <div className="premium-footer__meta">
              <span>📞 {t("footer.phone", "+234 903 017 5230")}</span>
              <span>✉️ {t("footer.email", "info@inkfront.com")}</span>
              <span>
                {t(
                  "footer.address",
                  "4 Garden Street, Fegge, Onitsha, Anambra, Nigeria",
                )}
              </span>
              {/* <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="premium-footer__map-link"
              >
                🗺️ {t("footer.viewMap", "View on Google Maps")} →
              </a> */}
            </div>
          </motion.div>
        </div>

        <div className="premium-footer__bottom">
          <p>
            © {currentYear} InkFront.{" "}
            {t("footer.rights", "All rights reserved.")}
          </p>

          <div className="premium-footer__bottom-links">
            <Link to="/terms">{t("footer.terms", "Terms")}</Link>
            <Link to="/privacy">{t("footer.privacy", "Privacy")}</Link>
            <Link to="/contact">{t("footer.contact", "Contact")}</Link>
            <Link to="/cookies">{t("footer.cookies", "Cookies")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
