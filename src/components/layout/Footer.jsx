import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function InkFrontLogo() {
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

  const footerLinks = {
    explore: [
      { to: "/services", label: "Services" },
      { to: "/portfolio", label: "Portfolio" },
      { to: "/products", label: "Products" },
      { to: "/blog", label: "Blog" },
      { to: "/clients", label: "Clients" },
    ],
    company: [
      { to: "/about", label: "About InkFront" },
      { to: "/contact", label: "Contact" },
      { to: "/login", label: "Login" },
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/cookies", label: "Cookies Policy" },
    ],
  };

  return (
    <footer className="premium-footer">
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
              InkFront builds premium websites, booking systems, dashboards,
              blogs, newsletters, portals, and custom software tools for modern
              businesses.
            </p>

            <div className="premium-footer__chips">
              <span>Websites</span>
              <span>Portals</span>
              <span>Blogs</span>
              <span>Automation</span>
              <span>Growth</span>
            </div>
          </motion.div>

          <motion.div
            className="premium-footer__column"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            viewport={{ once: true }}
          >
            <h3>Explore</h3>
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
            <h3>Company</h3>
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
            <h3>Start with InkFront</h3>
            <p>
              Ready to upgrade your business online? Let InkFront build a clean,
              modern digital system for your brand.
            </p>

            <Link to="/contact" className="premium-btn premium-btn-light">
              Contact InkFront →
            </Link>

            <div className="premium-footer__meta">
              <span>📧 @inkfront.com</span>
              <span>🌍 +2349030175230</span>
              <span>4 Basden street fegge,Onitsha,AN</span>
            </div>
          </motion.div>
        </div>

        <div className="premium-footer__bottom">
          <p>© {currentYear} InkFront. All rights reserved.</p>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
