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

export default function TermsPage() {
  const updatedDate = "April 28, 2026";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      body: `
By accessing or using InkFront websites, services, consultations, software products,
or digital platforms, you agree to be bound by these Terms and Conditions.
If you do not agree, please do not use our services.
      `,
    },
    {
      title: "2. About InkFront",
      body: `
InkFront provides websites, landing pages, booking systems, dashboards,
admin portals, blogs, newsletters, branding support, and custom software solutions
for businesses and organizations.
      `,
    },
    {
      title: "3. Client Responsibilities",
      body: `
Clients agree to provide accurate project information, timely feedback,
required content, and lawful materials needed for project completion.
Delays in communication may affect delivery timelines.
      `,
    },
    {
      title: "4. Payments & Billing",
      body: `
Project fees, retainers, subscriptions, or milestone payments must be paid
as agreed before relevant work stages begin.
Late payments may pause active work or access to deliverables.
      `,
    },
    {
      title: "5. Revisions & Scope Changes",
      body: `
Reasonable revisions may be included depending on the project agreement.
Major changes outside the approved scope may require new pricing or timeline adjustments.
      `,
    },
    {
      title: "6. Intellectual Property",
      body: `
Unless otherwise agreed in writing, final paid deliverables are transferred
to the client after full payment. InkFront may retain rights to internal tools,
frameworks, reusable systems, and non-client proprietary assets.
      `,
    },
    {
      title: "7. Acceptable Use",
      body: `
You may not use InkFront services for fraud, illegal activity,
copyright infringement, spam, harassment, malware distribution,
or any activity that harms users or third parties.
      `,
    },
    {
      title: "8. Service Availability",
      body: `
We aim for reliable service, but uptime cannot be guaranteed.
Temporary interruptions may occur during maintenance, upgrades,
hosting issues, or circumstances beyond our control.
      `,
    },
    {
      title: "9. Third-Party Services",
      body: `
Projects may integrate third-party tools such as hosting providers,
payment gateways, analytics tools, email platforms, or APIs.
Their separate terms and policies may also apply.
      `,
    },
    {
      title: "10. Limitation of Liability",
      body: `
To the maximum extent permitted by law, InkFront is not liable for indirect,
incidental, special, or consequential damages arising from use of our services.
      `,
    },
    {
      title: "11. Termination",
      body: `
We may suspend or terminate service access if terms are violated,
payments remain unpaid, abuse occurs, or unlawful activity is detected.
      `,
    },
    {
      title: "12. Changes to Terms",
      body: `
InkFront may update these Terms periodically.
Continued use after updates means you accept the revised version.
      `,
    },
    {
      title: "13. Contact",
      body: `
For questions regarding these Terms, please contact InkFront through the contact page.
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
            <span className="premium-eyebrow">Legal</span>
            <h1>Terms & Conditions</h1>
            <p>
              Please read these terms carefully before using InkFront services,
              websites, or software products.
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
              These terms govern your use of InkFront services and platforms.
            </p>
          </motion.div>

          <div
            style={{
              display: "grid",
              gap: "18px",
              marginTop: "22px",
            }}
          >
            {sections.map((section, index) => (
              <motion.article
                key={section.title}
                className="premium-info-panel"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.03, duration: 0.45 }}
              >
                <h2
                  style={{
                    fontSize: "1.35rem",
                    marginBottom: "10px",
                  }}
                >
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
          <span className="premium-eyebrow">Need Clarification?</span>
          <h2>Questions about our terms?</h2>
          <p>
            Contact InkFront and we’ll help explain any section related to your
            project or service plan.
          </p>

          <div className="premium-actions premium-actions-center">
            <Link to="/contact" className="premium-btn premium-btn-primary">
              Contact InkFront
            </Link>

            <Link to="/" className="premium-btn premium-btn-light">
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
