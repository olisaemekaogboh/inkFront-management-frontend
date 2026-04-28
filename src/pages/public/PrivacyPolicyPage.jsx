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

export default function PrivacyPolicyPage() {
  const updatedDate = "April 28, 2026";

  const sections = [
    {
      title: "1. Information We Collect",
      body: "InkFront may collect your name, email address, phone number, company name, project details, newsletter subscription details, and messages submitted through our website forms.",
    },
    {
      title: "2. How We Use Your Information",
      body: "We use your information to respond to inquiries, manage project requests, send newsletters, improve our services, provide support, and communicate with you about InkFront services.",
    },
    {
      title: "3. Newsletter Subscriptions",
      body: "When you subscribe to our newsletter, we store your email address, name, language preference, subscription status, and unsubscribe token. You may unsubscribe at any time.",
    },
    {
      title: "4. Cookies and Authentication",
      body: "InkFront may use secure cookies for authentication, login sessions, admin dashboard access, and basic website functionality.",
    },
    {
      title: "5. Data Security",
      body: "We take reasonable steps to protect your information from unauthorized access, misuse, loss, or disclosure.",
    },
    {
      title: "6. Third-Party Services",
      body: "We may use third-party services such as email providers, hosting platforms, analytics tools, OAuth login providers, and communication tools. These services may process data under their own privacy policies.",
    },
    {
      title: "7. Data Retention",
      body: "We retain information only as long as needed for business, legal, security, or operational purposes.",
    },
    {
      title: "8. Your Rights",
      body: "You may request access, correction, deletion, or restriction of your personal information by contacting InkFront.",
    },
    {
      title: "9. Changes to This Policy",
      body: "InkFront may update this Privacy Policy from time to time. The latest version will always be available on this page.",
    },
    {
      title: "10. Contact",
      body: "For privacy questions, contact InkFront through the contact page.",
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
            <span className="premium-eyebrow">Privacy</span>
            <h1>Privacy Policy</h1>
            <p>
              This policy explains how InkFront collects, uses, protects, and
              manages your personal information.
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
              Your privacy matters to InkFront. We only collect information
              needed to provide and improve our services.
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
          <span className="premium-eyebrow">Questions?</span>
          <h2>Need help with your privacy request?</h2>
          <p>
            Contact InkFront if you want to update, correct, or remove your
            personal information.
          </p>

          <div className="premium-actions premium-actions-center">
            <Link to="/contact" className="premium-btn premium-btn-primary">
              Contact InkFront
            </Link>

            <Link to="/terms" className="premium-btn premium-btn-light">
              View Terms
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
