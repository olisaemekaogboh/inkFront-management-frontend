import { useState } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  serviceInterest: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const { t } = useLanguage();

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);
      setSuccess("");
      setError("");

      await publicApi.submitContactMessage(form);

      setForm(initialForm);
      setSuccess("Message sent successfully. We’ll get back to you soon.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
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
                "Send your project details directly to the InkFront admin team.",
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
              Tell us what you want to build. Your message will be saved for the
              admin team to review.
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
                    placeholder="Your full name"
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
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  Phone
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+234..."
                  />
                </label>

                <label>
                  Company
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company name"
                  />
                </label>
              </div>

              <label>
                Service interest
                <select
                  name="serviceInterest"
                  value={form.serviceInterest}
                  onChange={handleChange}
                >
                  <option value="">Select service</option>
                  <option value="Website Development">
                    Website Development
                  </option>
                  <option value="Business Automation">
                    Business Automation
                  </option>
                  <option value="Product Blueprint">Product Blueprint</option>
                  <option value="E-Commerce Platform">
                    E-Commerce Platform
                  </option>
                  <option value="Custom Software">Custom Software</option>
                </select>
              </label>

              <label>
                Subject *
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
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
                  rows={7}
                  placeholder="Describe your project, timeline, budget range, and goals..."
                />
              </label>

              <button
                type="submit"
                className="premium-btn premium-btn-primary"
                disabled={submitting}
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
                Your message goes to the admin dashboard where it can be
                reviewed, tracked, and followed up.
              </p>
            </div>

            <div className="premium-info-panel">
              <span>02</span>
              <h2>Best details to include</h2>
              <p>
                Tell us your business type, project goal, required features,
                timeline, and budget range.
              </p>
            </div>

            <div className="premium-info-panel">
              <span>03</span>
              <h2>Response style</h2>
              <p>
                We reply with a practical recommendation, possible timeline, and
                next step.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
