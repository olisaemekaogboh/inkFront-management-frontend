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
      body: `
Cookies are small text files stored on your device when you visit a website. They help websites remember information about your visit, such as login sessions, selected language, theme preference, security checks, and basic usage behavior.

Similar technologies may include local storage, session storage, pixels, tags, device identifiers, and browser-based preference storage.
      `,
    },
    {
      title: "2. How InkFront Uses Cookies",
      body: `
InkFront uses cookies and similar technologies to keep our website functional, secure, personalized, and easier to use.

We may use cookies for authentication, admin dashboard access, secure sessions, language preference, dark mode or light mode preference, cookie consent status, contact form protection, performance improvement, and basic website functionality.
      `,
    },
    {
      title: "3. Essential Cookies",
      body: `
Essential cookies are required for important website and platform features to work correctly. These may include login cookies, security cookies, session cookies, CSRF protection, authentication tokens, admin access controls, and cookie consent records.

Because these cookies are necessary for the website to function safely, they cannot usually be disabled through our website without affecting core features.
      `,
    },
    {
      title: "4. Authentication and Security Cookies",
      body: `
Where InkFront uses login or admin dashboard features, cookies may be used to confirm user identity, protect sessions, prevent unauthorized access, and keep users securely signed in.

Some authentication cookies may be HTTP-only, meaning they are designed so browser scripts cannot directly access them. This helps improve account security.
      `,
    },
    {
      title: "5. Preference Cookies",
      body: `
Preference cookies help remember choices you make on the website, such as language, region, layout preference, dark mode, light mode, and cookie banner choices.

These cookies improve user experience by preventing you from having to select the same options repeatedly.
      `,
    },
    {
      title: "6. Functional Storage",
      body: `
InkFront may use browser storage to support interface features, saved preferences, temporary form states, dashboard behavior, and smoother navigation.

For example, your selected theme or language preference may be stored locally so the website can load with your preferred settings on future visits.
      `,
    },
    {
      title: "7. Analytics and Service Improvement",
      body: `
InkFront may use analytics tools now or in the future to understand how visitors interact with the website, which pages are visited, how users navigate the platform, and how performance can be improved.

Analytics information is generally used to improve content, layout, speed, user experience, marketing effectiveness, and service quality.
      `,
    },
    {
      title: "8. Third-Party Cookies",
      body: `
Some website features may rely on third-party services such as Google login, hosting providers, email platforms, analytics tools, embedded videos, maps, payment gateways, customer support tools, or marketing platforms.

These third-party providers may set their own cookies or similar technologies. Their cookies are controlled by their own privacy and cookie policies, not by InkFront.
      `,
    },
    {
      title: "9. Cookies Used in Client Projects",
      body: `
If InkFront builds a website, dashboard, portal, or software platform for a client, that project may use cookies for login, customer sessions, cart behavior, payment flow, admin access, analytics, preferences, and security.

The client is responsible for ensuring that their own cookie notices, privacy policies, and legal disclosures are appropriate for their business, users, and jurisdiction.
      `,
    },
    {
      title: "10. Managing Cookies",
      body: `
You can manage cookies through your browser settings. Most browsers allow you to block cookies, delete cookies, clear site data, or receive alerts when cookies are being used.

Please note that disabling essential cookies may cause login, admin dashboard access, forms, preferences, or other core features to stop working properly.
      `,
    },
    {
      title: "11. Cookie Consent",
      body: `
Where required, InkFront may display a cookie banner or consent notice that allows users to accept or reject non-essential cookies.

Essential cookies may still be used even if non-essential cookies are rejected because they are required for security, authentication, preferences, and core website functionality.
      `,
    },
    {
      title: "12. Retention of Cookies",
      body: `
Some cookies last only for your current browser session and are deleted when you close your browser. Other cookies may remain for a longer period so the website can remember your choices.

The duration depends on the purpose of the cookie, browser settings, and whether the cookie is set by InkFront or a third-party provider.
      `,
    },
    {
      title: "13. Updates to This Cookies Policy",
      body: `
InkFront may update this Cookies Policy from time to time as our website, services, security practices, analytics tools, or legal requirements change.

The latest version will remain available on this page, and continued use of the website means you accept the updated policy.
      `,
    },
    {
      title: "14. Contact",
      body: `
For questions about cookies, privacy, tracking technologies, or data handling, please contact InkFront through the official contact page or any verified communication channel provided by InkFront.
      `,
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
              This policy explains how InkFront uses cookies, local storage,
              session storage, and similar technologies to support security,
              authentication, preferences, performance, and a better user
              experience.
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
              We use cookies carefully to support secure login, admin access,
              preferences, consent choices, analytics, and reliable InkFront
              platform behavior.
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
                transition={{ delay: index * 0.025, duration: 0.45 }}
              >
                <h2 style={{ fontSize: "1.35rem", marginBottom: "10px" }}>
                  {section.title}
                </h2>

                <p style={{ whiteSpace: "pre-line" }}>{section.body.trim()}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            Your Choice
          </span>
          <h2>You control your cookie settings</h2>
          <p>
            You can clear cookies from your browser, reject non-essential
            cookies where available, or contact InkFront if you have questions
            about privacy, cookies, or data handling.
          </p>

          <div className="premium-actions premium-actions-center">
            <Link to="/privacy" className="premium-btn premium-btn-light">
              Privacy Policy
            </Link>

            <Link to="/contact" className="premium-btn premium-btn-ghost">
              Contact InkFront
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
