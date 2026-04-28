import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../../styles/publicPremium.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function CookiesPolicyPage() {
  const updatedDate = "April 28, 2026";

  const sections = [
    {
      title: "1. What Are Cookies?",
      body: "Cookies are small files stored on your device to help websites remember preferences, improve security, and provide a smoother user experience.",
    },
    {
      title: "2. How InkFront Uses Cookies",
      body: "InkFront uses cookies and local storage for login sessions, authentication, language preference, theme preference, cookie consent status, and basic website functionality.",
    },
    {
      title: "3. Essential Cookies",
      body: "Essential cookies are required for secure login, admin access, authentication, and core website features. These cannot be fully disabled without affecting the platform.",
    },
    {
      title: "4. Preference Cookies",
      body: "Preference cookies help remember your selected language, dark mode or light mode, and other display choices.",
    },
    {
      title: "5. Analytics and Improvement",
      body: "InkFront may use analytics tools in the future to understand how visitors use the website and improve performance, content, and user experience.",
    },
    {
      title: "6. Third-Party Cookies",
      body: "Some features may rely on third-party services such as Google login, email tools, embedded videos, hosting providers, or analytics platforms. These providers may use their own cookies.",
    },
    {
      title: "7. Managing Cookies",
      body: "You can accept or reject non-essential cookies from the cookie banner. You can also clear cookies through your browser settings.",
    },
    {
      title: "8. Changes to This Policy",
      body: "InkFront may update this Cookies Policy as services change. The latest version will remain available on this page.",
    },
    {
      title: "9. Contact",
      body: "For questions about cookies, privacy, or data handling, please contact InkFront through the contact page.",
    },
  ];

  return (
    <main className="premium-public-page">
      <section className="premium-compact-hero">
        <div className="premium-container">
          <motion.div
            className="premium-page-intro"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <span className="premium-eyebrow">Cookies</span>
            <h1>Cookies Policy</h1>
            <p>
              This policy explains how InkFront uses cookies, local storage, and
              similar technologies.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container">
          <motion.div
            className="premium-info-panel"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <span>Last Updated</span>
            <h2>{updatedDate}</h2>
            <p>
              We use cookies carefully to support login, security, preferences,
              and a better InkFront experience.
            </p>
          </motion.div>

          <div style={{ display: "grid", gap: "18px", marginTop: "22px" }}>
            {sections.map((section, index) => (
              <motion.article
                key={section.title}
                className="premium-info-panel"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.03, duration: 0.45 }}
              >
                <h2 style={{ fontSize: "1.35rem", marginBottom: "10px" }}>
                  {section.title}
                </h2>
                <p>{section.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow">Your Choice</span>
          <h2>You control your cookie settings</h2>
          <p>
            You can clear cookies from your browser at any time or contact
            InkFront if you have privacy questions.
          </p>

          <div className="premium-actions premium-actions-center">
            <Link to="/privacy" className="premium-btn premium-btn-primary">
              Privacy Policy
            </Link>

            <Link to="/contact" className="premium-btn premium-btn-light">
              Contact InkFront
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
