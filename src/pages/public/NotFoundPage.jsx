import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import "../../styles/publicPremium.css";

export default function NotFoundPage() {
  const { t } = useLanguage();

  // Set page title for SEO
  useEffect(() => {
    document.title = t(
      "pages.notFound.seoTitle",
      "404 - Page Not Found | InkFront",
    );
  }, [t]);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <main className="premium-public-page not-found-page-modern">
      {/* Animated Background */}
      <div className="not-found-bg">
        <div className="bg-gradient"></div>
        <div className="bg-pattern"></div>
      </div>

      <div className="premium-container">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="not-found-content"
        >
          {/* 404 Number with Animation */}
          <motion.div variants={fadeUp} className="not-found-number-wrapper">
            <motion.div
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              className="not-found-number"
            >
              <span>4</span>
              <span>0</span>
              <span>4</span>
            </motion.div>
            <div className="not-found-glow"></div>
          </motion.div>

          {/* Error Message */}
          <motion.div variants={fadeUp} className="not-found-message">
            <h1 className="not-found-title">
              {t("pages.notFound.title", "Page Not Found")}
            </h1>
            <p className="not-found-description">
              {t(
                "pages.notFound.message",
                "Oops! The page you're looking for doesn't exist or has been moved.",
              )}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeUp} className="not-found-actions">
            <Link to="/" className="premium-btn premium-btn-primary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginRight: "8px" }}
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t("nav.home", "Back to Home")}
            </Link>
            <Link to="/services" className="premium-btn premium-btn-ghost">
              {t("nav.services", "Browse Services")}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ marginLeft: "8px" }}
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>

          {/* Suggested Links */}
          <motion.div variants={fadeUp} className="not-found-suggestions">
            <p className="suggestions-title">
              {t("pages.notFound.suggestions", "You might be looking for:")}
            </p>
            <div className="suggestions-links">
              <Link to="/portfolio" className="suggestion-link">
                {t("nav.portfolio", "Portfolio")}
              </Link>
              <Link to="/products" className="suggestion-link">
                {t("nav.products", "Products")}
              </Link>
              <Link to="/contact" className="suggestion-link">
                {t("nav.contact", "Contact Us")}
              </Link>
              <Link to="/blog" className="suggestion-link">
                {t("nav.blog", "Blog")}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="not-found-decoration">
        <div className="deco-circle deco-1"></div>
        <div className="deco-circle deco-2"></div>
        <div className="deco-circle deco-3"></div>
      </div>
    </main>
  );
}
