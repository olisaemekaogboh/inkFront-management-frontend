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
By accessing, browsing, requesting, purchasing, subscribing to, or using any InkFront website, consultation, design service, software service, digital product, admin system, dashboard, hosting support, maintenance plan, or related business service, you agree to be legally bound by these Terms and Conditions.

If you are using InkFront services on behalf of a company, organization, school, agency, or business, you confirm that you have the authority to bind that entity to these Terms. If you do not agree with any part of these Terms, you must not use our services.
      `,
    },
    {
      title: "2. About InkFront",
      body: `
InkFront provides business websites, product landing pages, booking systems, client portals, admin dashboards, CRM tools, blogs, newsletters, e-commerce platforms, school management systems, branding support, workflow automation, and custom software solutions.

InkFront may deliver services through its internal team, technical partners, contractors, designers, developers, consultants, or third-party providers where necessary for project completion.
      `,
    },
    {
      title: "3. Client Responsibilities",
      body: `
Clients must provide accurate information, business requirements, written approvals, content, brand assets, images, login credentials, product details, pricing, policies, feedback, and any materials required to complete the project.

The client is responsible for ensuring that all supplied text, images, logos, videos, documents, data, and brand materials are lawful, accurate, authorized, and do not infringe any third-party rights.

Project delays caused by late feedback, incomplete content, unavailable stakeholders, payment delays, or changing instructions may extend timelines and may attract additional fees.
      `,
    },
    {
      title: "4. Project Scope, Proposals & Deliverables",
      body: `
All services are delivered according to the agreed proposal, invoice, quotation, contract, written message, or approved project scope.

Any feature, page, integration, dashboard, workflow, content, automation, or design request not clearly included in the approved scope will be treated as additional work and may require a separate quotation, new timeline, or written approval.

InkFront is not obligated to provide unlimited work, unlimited revisions, extra integrations, new features, or support outside the agreed scope unless separately agreed in writing.
      `,
    },
    {
      title: "5. Payments, Deposits & Billing",
      body: `
Project fees, deposits, retainers, subscriptions, maintenance fees, milestone payments, and renewal charges must be paid according to the agreed schedule.

Unless otherwise agreed in writing, work may not begin until the required deposit or first payment is received. InkFront may pause work, restrict access, withhold deliverables, suspend support, or delay launch where payment is overdue.

All paid deposits, strategy fees, design fees, setup fees, consultation fees, and milestone payments are non-refundable once work has started, resources have been allocated, or deliverables have been prepared.
      `,
    },
    {
      title: "6. Late Payments & Suspension",
      body: `
If payment is overdue, InkFront may suspend development, hosting support, maintenance, admin access, deployment, updates, or handover until outstanding amounts are paid.

The client remains responsible for all agreed fees even if work is paused due to non-payment. InkFront is not liable for losses, delays, downtime, missed opportunities, or business interruption caused by suspension due to unpaid invoices.
      `,
    },
    {
      title: "7. Revisions & Change Requests",
      body: `
Reasonable revisions may be included only where stated in the project agreement. Revisions must relate to the approved scope and original direction.

A revision is not a full redesign, new concept, new feature, new page, new system, new integration, new content structure, or change in business direction.

Major changes, repeated redesign requests, additional features, or changes after approval may attract extra charges and extend the timeline.
      `,
    },
    {
      title: "8. Client Approvals",
      body: `
When a client approves a design, feature, page, content section, workflow, or milestone, InkFront may proceed based on that approval.

Changes requested after approval may be treated as additional work. Written approval may include email, dashboard approval, WhatsApp message, signed document, payment confirmation, or any clear written confirmation from the client or authorized representative.
      `,
    },
    {
      title: "9. Intellectual Property",
      body: `
After full payment, the client receives ownership of final paid deliverables specifically created for the client, excluding InkFront’s pre-existing tools, reusable code, templates, libraries, frameworks, components, internal systems, processes, know-how, concepts, automation patterns, and general technical methods.

InkFront retains the right to reuse general knowledge, technical methods, non-client-specific components, development patterns, and internal tools in future projects.

No ownership transfer occurs until all outstanding payments connected to the project have been fully settled.
      `,
    },
    {
      title: "10. Portfolio Rights",
      body: `
Unless the client requests confidentiality in writing before project launch, InkFront may display completed work, project screenshots, client name, brand logo, project description, and general results in its portfolio, proposals, social media, case studies, and marketing materials.

InkFront will not intentionally disclose private credentials, confidential business data, sensitive customer data, or protected internal information.
      `,
    },
    {
      title: "11. Confidentiality",
      body: `
Both parties agree to treat confidential business, technical, financial, customer, operational, login, and project information responsibly.

InkFront will take reasonable steps to protect client information. However, clients must avoid sending unnecessary sensitive information and must promptly change credentials after handover where appropriate.
      `,
    },
    {
      title: "12. Hosting, Domains & Third-Party Services",
      body: `
Projects may depend on third-party services such as hosting providers, domain registrars, payment gateways, email providers, analytics tools, APIs, SMS providers, cloud storage, databases, plugins, libraries, and external platforms.

The client is responsible for third-party charges unless otherwise agreed. InkFront is not responsible for downtime, pricing changes, account bans, API changes, policy changes, service failures, or restrictions caused by third-party providers.
      `,
    },
    {
      title: "13. Security & Access",
      body: `
InkFront will use reasonable technical measures to build secure systems, but no website, software, hosting environment, or internet-connected platform can be guaranteed to be completely free from vulnerabilities, attacks, data loss, or unauthorized access.

The client is responsible for protecting admin passwords, staff accounts, hosting credentials, email accounts, payment accounts, and device security after handover.
      `,
    },
    {
      title: "14. Content & Legal Compliance",
      body: `
The client is solely responsible for ensuring that its website content, products, services, claims, pricing, media, privacy notices, business operations, and customer communications comply with applicable laws and regulations.

InkFront does not provide legal, tax, financial, medical, or regulatory advice. Any sample policies, website text, terms, or content provided by InkFront should be reviewed by the client’s professional adviser before use.
      `,
    },
    {
      title: "15. Acceptable Use",
      body: `
Clients must not use InkFront services for fraud, scams, impersonation, illegal trading, copyright infringement, spam, malware, phishing, hate content, harassment, adult exploitation, unlawful financial activity, or any activity that harms users, third parties, or InkFront’s reputation.

InkFront may refuse, suspend, or terminate services where unlawful, abusive, harmful, or suspicious activity is detected.
      `,
    },
    {
      title: "16. Service Availability",
      body: `
InkFront aims to provide reliable services, but does not guarantee uninterrupted access, error-free operation, permanent uptime, or continuous availability.

Temporary interruptions may occur because of maintenance, hosting issues, internet failures, cyberattacks, third-party outages, payment issues, technical upgrades, or circumstances beyond InkFront’s reasonable control.
      `,
    },
    {
      title: "17. Support & Maintenance",
      body: `
Support, updates, bug fixes, backups, monitoring, content updates, feature improvements, and technical maintenance are only included where stated in the project agreement or active maintenance plan.

After project handover, additional support may require a maintenance subscription, hourly billing, or separate quotation.
      `,
    },
    {
      title: "18. Limitation of Liability",
      body: `
To the maximum extent permitted by law, InkFront will not be liable for indirect, incidental, special, punitive, or consequential losses, including loss of profit, loss of revenue, loss of data, loss of customers, reputational damage, business interruption, or missed opportunities.

InkFront’s total liability for any claim shall not exceed the amount actually paid by the client to InkFront for the specific service giving rise to the claim.
      `,
    },
    {
      title: "19. Indemnity",
      body: `
The client agrees to indemnify and hold InkFront harmless from claims, damages, penalties, losses, liabilities, costs, and expenses arising from client-provided materials, unlawful business activity, misuse of the delivered platform, breach of these Terms, infringement of third-party rights, or failure to comply with applicable laws.
      `,
    },
    {
      title: "20. Cancellation & Termination",
      body: `
Either party may terminate a project according to the agreed contract or written arrangement. If a client cancels a project after work has started, the client remains responsible for work already completed, resources allocated, third-party costs incurred, and any non-refundable fees.

InkFront may terminate or suspend services if the client violates these Terms, fails to pay, acts abusively, provides unlawful materials, or uses the service in a harmful or illegal manner.
      `,
    },
    {
      title: "21. Force Majeure",
      body: `
InkFront will not be liable for delay or failure caused by events beyond reasonable control, including power failure, internet disruption, natural disaster, government action, strike, war, civil unrest, illness, platform outage, cyberattack, payment provider failure, or third-party service disruption.
      `,
    },
    {
      title: "22. Governing Law",
      body: `
These Terms shall be interpreted according to the applicable laws of the Federal Republic of Nigeria, unless a separate written agreement states otherwise.

Where disputes arise, both parties agree to first attempt good-faith resolution through communication before pursuing formal legal remedies.
      `,
    },
    {
      title: "23. Updates to Terms",
      body: `
InkFront may update these Terms from time to time to reflect changes in services, laws, business operations, pricing, technology, or security requirements.

Continued use of InkFront services after updates means you accept the revised Terms.
      `,
    },
    {
      title: "24. Contact",
      body: `
For questions, complaints, project clarification, billing matters, or legal notices relating to these Terms, please contact InkFront through the official contact page or any verified communication channel provided by InkFront.
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
              These Terms govern your use of InkFront services, websites,
              consultations, digital products, software systems, and support
              plans. Please read them carefully before starting a project.
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
              These Terms are intended to protect both InkFront and our clients
              by setting clear rules for project scope, payment, ownership,
              support, acceptable use, and service responsibilities.
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
                transition={{ delay: index * 0.025, duration: 0.45 }}
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
          <span className="premium-eyebrow premium-eyebrow--light">
            Need Clarification?
          </span>
          <h2>Questions about our terms?</h2>
          <p>
            Contact InkFront before starting your project if you need
            clarification about scope, payment, ownership, support, or
            deliverables.
          </p>

          <div className="premium-actions premium-actions-center">
            <Link to="/contact" className="premium-btn premium-btn-light">
              Contact InkFront
            </Link>

            <Link to="/" className="premium-btn premium-btn-ghost">
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
