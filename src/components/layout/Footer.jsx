import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { to: "/services", label: "Services" },
      { to: "/portfolio", label: "Portfolio" },
      { to: "/products", label: "Products" },
      { to: "/clients", label: "Clients" },
    ],
    company: [
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms of Service" },
    ],
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              InFront Agency
            </h3>
            <p className="text-sm text-muted mb-4">
              We build digital products, service websites, and scalable business
              tools that help brands grow online.
            </p>
            <div className="d-flex gap-2">
              <span className="text-2xl">🚀</span>
              <span className="text-2xl">💻</span>
              <span className="text-2xl">🎨</span>
              <span className="text-2xl">📈</span>
            </div>
          </motion.div>

          {/* Explore Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Explore</h3>
            <div className="d-flex flex-column gap-2">
              {footerLinks.explore.map((link) => (
                <Link key={link.to} to={link.to} className="footer__link">
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Company Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <div className="d-flex flex-column gap-2">
              {footerLinks.company.map((link) => (
                <Link key={link.to} to={link.to} className="footer__link">
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <p className="text-sm text-muted mb-4">
              Ready to work together? Let's build something amazing.
            </p>
            <Link to="/contact" className="btn btn--primary btn--sm">
              Get in touch →
            </Link>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted">📧 hello@infrontagency.com</p>
              <p className="text-xs text-muted mt-1">📞 +1 (555) 123-4567</p>
            </div>
          </motion.div>
        </div>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-border mt-8 pt-8 text-center"
        >
          <p className="text-xs text-muted">
            © {currentYear} InFront Agency. All rights reserved. Built with 🚀
            for modern businesses.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
