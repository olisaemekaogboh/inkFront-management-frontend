import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

const SERVICE_OPTIONS = [
  "Website Development",
  "Business Automation",
  "Product Blueprint",
  "E-Commerce Platform",
  "Custom Software",
  "Client Portal",
  "School Management System",
  "Mobile App Development",
  "SEO and Content System",
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  serviceInterest: "",
  preferredLanguage: "EN",
  subject: "",
  message: "",
};

function cleanPayload(form) {
  return {
    fullName: form.fullName.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    company: form.company.trim(),
    serviceInterest: form.serviceInterest.trim(),
    preferredLanguage: form.preferredLanguage || "EN",
    subject: form.subject.trim(),
    message: form.message.trim(),
  };
}

export default function ContactPage() {
  const { language, t } = useLanguage();

  const [form, setForm] = useState({
    ...initialForm,
    preferredLanguage: language || "EN",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim() &&
      form.email.trim() &&
      form.subject.trim() &&
      form.message.trim()
    );
  }, [form]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (success) setSuccess("");
    if (error) setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) {
      setError("Please fill in your name, email, subject, and message.");
      return;
    }

    try {
      setSubmitting(true);
      setSuccess("");
      setError("");

      await publicApi.submitContactMessage(cleanPayload(form));

      setForm({
        ...initialForm,
        preferredLanguage: language || "EN",
      });

      setSuccess(
        "Message sent successfully. The InkFront admin team will review it and get back to you soon.",
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="premium-public-page">
      <section className="premium-hero premium-compact-hero">
        <div className="premium-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="premium-page-intro"
          >
            <span className="premium-eyebrow">
              {t("nav.contact", "Contact")}
            </span>

            <h1>
              {t("pages.contact.title", "Let’s build your next digital system")}
            </h1>

            <p>
              {t(
                "pages.contact.subtitle",
                "Send your project details directly to the InkFront admin team. Your inquiry will be saved, tracked, and followed up from the admin CRM.",
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container premium-contact-grid">
          <article className="premium-contact-panel">
            <span className="premium-eyebrow">Project inquiry</span>

            <h2>Send us a message</h2>

            <p>
              Tell us what you want to build. Include your project goal,
              preferred timeline, required features, and budget range if you
              already have one.
            </p>

            {success ? (
              <div className="premium-form-alert premium-form-alert-success">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="premium-form-alert premium-form-alert-error">
                {error}
              </div>
            ) : null}

            <form className="premium-contact-form" onSubmit={handleSubmit}>
              <div className="premium-form-grid">
                <label>
                  Full name *
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </label>

                <label>
                  Email *
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    maxLength={180}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                <label>
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder="+234..."
                    autoComplete="tel"
                  />
                </label>

                <label>
                  Company / Brand
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder="Company or brand name"
                    autoComplete="organization"
                  />
                </label>
              </div>

              <div className="premium-form-grid">
                <label>
                  Service interest
                  <select
                    name="serviceInterest"
                    value={form.serviceInterest}
                    onChange={handleChange}
                  >
                    <option value="">Select service</option>
                    {SERVICE_OPTIONS.map((option) => (
                      <option value={option} key={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Preferred language
                  <select
                    name="preferredLanguage"
                    value={form.preferredLanguage}
                    onChange={handleChange}
                  >
                    <option value="EN">English</option>
                    <option value="IG">Igbo</option>
                    <option value="HA">Hausa</option>
                    <option value="YO">Yoruba</option>
                  </select>
                </label>
              </div>

              <label>
                Subject *
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  placeholder="What do you need?"
                />
              </label>

              <label>
                Message *
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  maxLength={5000}
                  rows={7}
                  placeholder="Describe your project, timeline, budget range, required pages/features, and what problem you want to solve..."
                />
              </label>

              <button
                type="submit"
                className="premium-btn premium-btn-primary"
                disabled={submitting || !canSubmit}
              >
                {submitting ? "Sending..." : "Send message →"}
              </button>
            </form>
          </article>

          <aside className="premium-contact-sidebar">
            <div className="premium-info-panel">
              <span>01</span>
              <h2>What happens next?</h2>
              <p>
                Your message is saved inside the admin Contact CRM, where the
                team can review it, assign it, update status, and follow up.
              </p>
            </div>

            <div className="premium-info-panel">
              <span>02</span>
              <h2>Best details to include</h2>
              <p>
                Include your business type, project goal, required features,
                timeline, budget range, and any reference websites you like.
              </p>
            </div>

            <div className="premium-info-panel">
              <span>03</span>
              <h2>How we respond</h2>
              <p>
                We review the request and reply with a practical recommendation,
                possible scope, timeline, and next step.
              </p>
            </div>

            <div className="premium-info-panel">
              <span>04</span>
              <h2>Stored safely</h2>
              <p>
                Every inquiry is stored as a CRM message so no lead gets lost in
                email, chat, or manual notes.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
