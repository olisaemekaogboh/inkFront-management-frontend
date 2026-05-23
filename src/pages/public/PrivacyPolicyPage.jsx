import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
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
  const { t } = useLanguage();

  const updatedDate = t("privacy.updatedDate", "April 28, 2026");

  const sections = [
    {
      title: t("privacy.sections.introduction.title", "1. Introduction"),
      body: t(
        "privacy.sections.introduction.body",
        "This Privacy Policy explains how InkFront collects, uses, stores, protects, and manages personal information when you visit our website, submit a contact form, request a project, subscribe to a newsletter, use our services, or communicate with our team. By using InkFront websites, software products, forms, dashboards, or services, you agree to the practices described in this Privacy Policy.",
      ),
    },
    {
      title: t(
        "privacy.sections.information.title",
        "2. Information We Collect",
      ),
      body: t(
        "privacy.sections.information.body",
        "InkFront may collect information you provide directly, including your name, email address, phone number, company or business name, project details, service interest, preferred language, budget range, message content, newsletter subscription details, and any files or materials you choose to share with us. We may also collect technical information such as IP address, device type, browser type, pages visited, time spent on pages, referral source, cookies, login activity, and general usage data where applicable.",
      ),
    },
    {
      title: t(
        "privacy.sections.usage.title",
        "3. How We Use Your Information",
      ),
      body: t(
        "privacy.sections.usage.body",
        "We use your information to respond to inquiries, evaluate project requests, prepare proposals, manage client relationships, deliver services, provide customer support, send updates, improve our website, maintain security, process newsletter subscriptions, and communicate about InkFront services. We may also use information for internal records, analytics, fraud prevention, service improvement, legal compliance, billing, dispute resolution, and business administration.",
      ),
    },
    {
      title: t(
        "privacy.sections.contactForms.title",
        "4. Contact Forms and CRM Messages",
      ),
      body: t(
        "privacy.sections.contactForms.body",
        "When you submit a contact form, your message may be saved in our internal CRM system so the InkFront team can review, assign, track, respond to, and manage your inquiry. Contact form data may include your name, email, phone number, company, service interest, preferred language, subject, message, status, internal admin notes, and communication history.",
      ),
    },
    {
      title: t("privacy.sections.email.title", "5. Email and Notifications"),
      body: t(
        "privacy.sections.email.body",
        "If you contact us, we may send email notifications to our team and may reply to you using the email address you provided. We may also send service-related messages such as project updates, proposal follow-ups, support responses, invoice reminders, maintenance updates, and important account or platform notices.",
      ),
    },
    {
      title: t(
        "privacy.sections.newsletter.title",
        "6. Newsletter Subscriptions",
      ),
      body: t(
        "privacy.sections.newsletter.body",
        "When you subscribe to our newsletter, we may store your email address, name, language preference, subscription status, unsubscribe token, subscription date, and engagement details. You may unsubscribe at any time using the unsubscribe link provided in our emails or by contacting InkFront directly.",
      ),
    },
    {
      title: t(
        "privacy.sections.cookies.title",
        "7. Cookies and Authentication",
      ),
      body: t(
        "privacy.sections.cookies.body",
        "InkFront may use cookies and similar technologies for authentication, secure login sessions, admin dashboard access, language preferences, dark mode preferences, security, analytics, and basic website functionality. Where cookie-based authentication is used, authentication cookies may be HTTP-only and designed to reduce the risk of unauthorized access from client-side scripts.",
      ),
    },
    {
      title: t(
        "privacy.sections.admin.title",
        "8. Admin Accounts and Dashboard Access",
      ),
      body: t(
        "privacy.sections.admin.body",
        "If you access an InkFront admin dashboard or client portal, we may process login details, user roles, activity logs, security events, account permissions, and session data. This information helps us protect restricted areas, manage access control, prevent abuse, and maintain reliable service operations.",
      ),
    },
    {
      title: t(
        "privacy.sections.projectData.title",
        "9. Project and Client Data",
      ),
      body: t(
        "privacy.sections.projectData.body",
        "During project delivery, clients may provide business content, logos, images, product information, pricing, customer workflows, technical requirements, API credentials, hosting access, or operational information. We use project data only as needed to plan, build, support, improve, or maintain the agreed service, unless otherwise authorized by the client.",
      ),
    },
    {
      title: t("privacy.sections.security.title", "10. Data Security"),
      body: t(
        "privacy.sections.security.body",
        "We take reasonable administrative, technical, and organizational measures to protect personal information against unauthorized access, misuse, alteration, loss, disclosure, or destruction. However, no internet-connected platform, email system, database, hosting service, or software environment can be guaranteed to be completely secure. You are responsible for keeping your own passwords, devices, accounts, and access credentials secure.",
      ),
    },
    {
      title: t("privacy.sections.thirdParty.title", "11. Third-Party Services"),
      body: t(
        "privacy.sections.thirdParty.body",
        "InkFront may use third-party services such as hosting providers, email platforms, analytics tools, payment gateways, OAuth login providers, domain registrars, cloud services, SMS providers, communication tools, and API providers. These third-party services may process information according to their own privacy policies, terms, security practices, and data retention rules. InkFront is not responsible for the independent privacy practices of third-party providers.",
      ),
    },
    {
      title: t(
        "privacy.sections.payment.title",
        "12. Payment and Billing Information",
      ),
      body: t(
        "privacy.sections.payment.body",
        "Where payments, subscriptions, retainers, or invoices are involved, we may process billing details, payment status, transaction references, invoice records, business address, tax-related information, and communication history. We do not intentionally store full payment card details unless handled by a secure third-party payment provider.",
      ),
    },
    {
      title: t(
        "privacy.sections.legalBasis.title",
        "13. Legal Basis and Legitimate Use",
      ),
      body: t(
        "privacy.sections.legalBasis.body",
        "We process personal information where necessary to respond to your request, provide services, perform a contract, protect our business, improve our platforms, comply with legal obligations, prevent fraud, or pursue legitimate business interests. Where consent is required, such as newsletter communication, you may withdraw consent by unsubscribing or contacting us.",
      ),
    },
    {
      title: t("privacy.sections.retention.title", "14. Data Retention"),
      body: t(
        "privacy.sections.retention.body",
        "We retain personal information only for as long as reasonably necessary for business, legal, accounting, security, operational, support, or project-related purposes. Contact messages, project records, invoices, support conversations, and admin notes may be retained to maintain business history, resolve disputes, provide support, and comply with legal or operational requirements.",
      ),
    },
    {
      title: t("privacy.sections.sharing.title", "15. Data Sharing"),
      body: t(
        "privacy.sections.sharing.body",
        "InkFront does not sell your personal information. We may share information only where necessary with team members, contractors, technical partners, service providers, legal advisers, payment processors, hosting providers, or authorities where required by law or necessary to protect rights, safety, security, or business operations.",
      ),
    },
    {
      title: t(
        "privacy.sections.international.title",
        "16. International Processing",
      ),
      body: t(
        "privacy.sections.international.body",
        "Because some hosting, email, analytics, cloud, or software providers may operate outside Nigeria or Africa, your information may be processed or stored in other countries. Where this happens, we take reasonable steps to work with reputable providers and protect information according to practical security standards.",
      ),
    },
    {
      title: t("privacy.sections.rights.title", "17. Your Rights"),
      body: t(
        "privacy.sections.rights.body",
        "Depending on applicable law, you may request access to your personal information, correction of inaccurate data, deletion of certain information, restriction of processing, withdrawal of consent, or clarification about how your data is used. Some requests may be limited where retention is required for legal, security, accounting, contractual, dispute, or legitimate business reasons.",
      ),
    },
    {
      title: t("privacy.sections.children.title", "18. Children's Privacy"),
      body: t(
        "privacy.sections.children.body",
        "InkFront services are intended for businesses, professionals, organizations, and adult users. We do not knowingly collect personal information from children. If we become aware that a child has submitted personal information without proper authorization, we may delete it where appropriate.",
      ),
    },
    {
      title: t("privacy.sections.links.title", "19. Links to Other Websites"),
      body: t(
        "privacy.sections.links.body",
        "Our website or delivered projects may contain links to third-party websites, platforms, payment pages, tools, or services. We are not responsible for the privacy practices, content, security, or policies of external websites. You should review their privacy policies before submitting information.",
      ),
    },
    {
      title: t(
        "privacy.sections.changes.title",
        "20. Changes to This Privacy Policy",
      ),
      body: t(
        "privacy.sections.changes.body",
        "InkFront may update this Privacy Policy from time to time to reflect changes in our services, technology, legal requirements, security practices, or business operations. The latest version will be available on this page, and continued use of our services means you accept the updated policy.",
      ),
    },
    {
      title: t("privacy.sections.contact.title", "21. Contact"),
      body: t(
        "privacy.sections.contact.body",
        "For privacy questions, data requests, correction requests, deletion requests, or concerns about how your information is handled, please contact InkFront through the official contact page or any verified communication channel provided by InkFront.",
      ),
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
            <span className="premium-eyebrow">
              {t("privacy.eyebrow", "Privacy")}
            </span>
            <h1>{t("privacy.title", "Privacy Policy")}</h1>
            <p>
              {t(
                "privacy.description",
                "This policy explains how InkFront collects, uses, protects, stores, and manages personal information across our websites, contact forms, CRM tools, newsletters, software systems, and client services.",
              )}
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
            <spans className="premium-eyebrow">
              {t("privacy.lastUpdatedLabel", "Last Updated")}
            </spans>
            <h2>{updatedDate}</h2>
            <p>
              {t(
                "privacy.lastUpdatedDescription",
                "Your privacy matters to InkFront. We collect information only where it helps us respond to you, deliver services, secure our platforms, manage projects, and improve the client experience.",
              )}
            </p>
          </motion.div>

          <div className="premium-privacy-sections">
            {sections.map((section, index) => (
              <motion.article
                key={section.title}
                className="premium-info-panel"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  delay: Math.min(index * 0.025, 0.5),
                  duration: 0.45,
                }}
              >
                <h2 style={{ fontSize: "1.35rem", marginBottom: "10px" }}>
                  {section.title}
                </h2>
                <p style={{ whiteSpace: "pre-line" }}>{section.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            {t("privacy.ctaEyebrow", "Privacy Request")}
          </span>
          <h2>
            {t("privacy.ctaTitle", "Need help with your personal information?")}
          </h2>
          <p>
            {t(
              "privacy.ctaDescription",
              "Contact InkFront if you want to access, correct, update, restrict, or request deletion of personal information connected to your inquiry, newsletter subscription, or project.",
            )}
          </p>

          <div className="premium-actions premium-actions-center">
            <Link to="/contact" className="premium-btn premium-btn-light">
              {t("privacy.contactButton", "Contact InkFront")}
            </Link>
            <Link to="/terms" className="premium-btn premium-btn-ghost">
              {t("privacy.termsButton", "View Terms")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
