import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import NewsletterSection from "../../components/sections/NewsletterSection";
import "../../styles/publicPremium.css";

const SERVICE_OPTIONS = {
  EN: [
    "Website Development",
    "Business Automation",
    "Product Blueprint",
    "E-Commerce Platform",
    "Custom Software",
    "Client Portal",
    "School Management System",
    "Mobile App Development",
    "SEO and Content System",
  ],
  IG: [
    "Mepụta Webụsaịtị",
    "Akpaaka Azụmahịa",
    "Atụmatụ Ngwaahịa",
    "Ụlọ Ahịa E-Commerce",
    "Sọftụwia Pụrụ Iche",
    "Ọnụ Ụzọ Ndị Ahịa",
    "Usoro Nlekọta Ụlọ Akwụkwọ",
    "Ngwa Ekwentị",
    "SEO na Sistemụ Ọdịnaya",
  ],
  HA: [
    "Ƙirƙirar Yanar Gizo",
    "Sarrafa Kasuwanci ta Atomatik",
    "Tsarin Samfuri",
    "Dandalin E-Commerce",
    "Software na Musamman",
    "Ƙofar Abokin Ciniki",
    "Tsarin Gudanar da Makaranta",
    "Manhajar Waya",
    "SEO da Tsarin Abun Ciki",
  ],
  YO: [
    "Ìdàgbàsókè Ojúlé Wẹ́ẹ̀bù",
    "Àdánidá Iṣòwò",
    "Àpẹẹrẹ Ọjà",
    "Pẹpẹ E-Commerce",
    "Sọfitiwia Àkànṣe",
    "Ẹnubodè Oníbàárà",
    "Ètò Ìṣàkóso Ilé-Ẹ̀kọ́",
    "App Alágbèéká",
    "SEO àti Ètò Àkóónú",
  ],
};

const LANGUAGE_LABELS = {
  EN: "English",
  IG: "Igbo",
  HA: "Hausa",
  YO: "Yoruba",
};

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

  const activeLanguage = useMemo(() => {
    const code = `${language || "EN"}`.toUpperCase();
    return SERVICE_OPTIONS[code] ? code : "EN";
  }, [language]);

  const [form, setForm] = useState({
    ...initialForm,
    preferredLanguage: activeLanguage,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* FIX:
     When site language changes, sync preferredLanguage dropdown.
     Before it stayed on EN forever.
  */
  useEffect(() => {
    setForm((current) => ({
      ...current,
      preferredLanguage: activeLanguage,
    }));
  }, [activeLanguage]);

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
      setError(
        t(
          "forms.contact.validationError",
          "Please fill in your name, email, subject, and message.",
        ),
      );
      return;
    }

    try {
      setSubmitting(true);
      setSuccess("");
      setError("");

      await publicApi.submitContactMessage(cleanPayload(form));

      setForm({
        ...initialForm,
        preferredLanguage: activeLanguage,
      });

      setSuccess(
        t(
          "forms.contact.success",
          "Message sent successfully. The InkFront admin team will review it and get back to you soon.",
        ),
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          t("forms.contact.error", "Failed to send message. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const serviceOptions = useMemo(() => {
    return SERVICE_OPTIONS[activeLanguage] || SERVICE_OPTIONS.EN;
  }, [activeLanguage]);

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
              {t("pages.contact.title", "Let's build your next digital system")}
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
            <h2>{t("pages.contact.sendMessage", "Send us a message")}</h2>

            {success && (
              <div className="premium-form-alert premium-form-alert-success">
                {success}
              </div>
            )}

            {error && (
              <div className="premium-form-alert premium-form-alert-error">
                {error}
              </div>
            )}

            <form className="premium-contact-form" onSubmit={handleSubmit}>
              <div className="premium-form-grid">
                <label>
                  {t("forms.contact.fullName", "Full name")} *
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  {t("forms.contact.email", "Email")} *
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  {t("forms.contact.phoneNumber", "Phone")}
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </label>

                <label>
                  {t("forms.contact.companyName", "Company / Brand")}
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="premium-form-grid">
                <label>
                  {t("forms.contact.serviceInterest", "Service interest")}
                  <select
                    name="serviceInterest"
                    value={form.serviceInterest}
                    onChange={handleChange}
                  >
                    <option value="">
                      {t("forms.contact.selectService", "Select service")}
                    </option>

                    {serviceOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  {t("forms.contact.preferredLanguage", "Preferred language")}
                  <select
                    name="preferredLanguage"
                    value={form.preferredLanguage}
                    onChange={handleChange}
                  >
                    {Object.entries(LANGUAGE_LABELS).map(([code, label]) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                {t("forms.contact.subject", "Subject")} *
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                {t("forms.contact.message", "Message")} *
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={7}
                />
              </label>

              <button
                type="submit"
                className="premium-btn premium-btn-primary"
                disabled={submitting || !canSubmit}
              >
                {submitting
                  ? t("forms.contact.sending", "Sending...")
                  : t("forms.contact.submit", "Send message →")}
              </button>
            </form>
          </article>

          <aside className="premium-contact-sidebar">
            <div className="premium-info-panel">
              <span>🌍</span>
              <h2>{LANGUAGE_LABELS[activeLanguage]}</h2>
              <p>
                Current site language is synced correctly with service options
                and preferred language.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <div className="premium-container">
        <NewsletterSection />
      </div>
    </main>
  );
}
