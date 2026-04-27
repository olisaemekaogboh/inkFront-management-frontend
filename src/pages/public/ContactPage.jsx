import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
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
    "Ikpo Okwu Azụmahịa E-Commerce",
    "Sọftụwia Pụrụ Iche",
    "Ọnụ Ụzọ Ndị Ahịa",
    "Usoro Nlekọta Ụlọ Akwụkwọ",
    "Mepụta Ngwa Mkpanaka",
    "SEO na Sistemụ Ọdịnaya",
  ],
  HA: [
    "Ƙirƙirar Yanar Gizo",
    "Sarrafa Kasuwanci ta Atomatik",
    "Tsarin Samfuri",
    "Dandalin Kasuwancin E-Commerce",
    "Software na Musamman",
    "Ƙofar Abokin Ciniki",
    "Tsarin Gudanar da Makarantu",
    "Ƙirƙirar Manhajar Wayar Salula",
    "SEO da Tsarin Abun Ciki",
  ],
  YO: [
    "Ìdàgbàsókè Ojúlé Wẹ́ẹ̀bù",
    "Àdánidá Iṣẹ́ Òwò",
    "Àpẹẹrẹ Ọjà",
    "Ibi Ìtajà E-Commerce",
    "Sọfụ́wíà Àkànṣe",
    "Ẹnubọ̀dè Alábàrá",
    "Ètò Ìṣàkóso Ilé-Ẹ̀kọ́",
    "Ìdàgbàsókè Àwọn Ohun Èlò Alágbèéká",
    "SEO àti Ètò Àkóónú",
  ],
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
        preferredLanguage: language || "EN",
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

  const getServiceOptions = () => {
    const langMap = { EN: "EN", IG: "IG", HA: "HA", YO: "YO" };
    return SERVICE_OPTIONS[langMap[language] || "EN"];
  };

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
                "Send your project details directly to the InkFront admin team. Your inquiry will be saved, tracked, and followed up from the admin CRM.",
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container premium-contact-grid">
          <article className="premium-contact-panel">
            <span className="premium-eyebrow">
              {t("pages.contact.inquiry", "Project inquiry")}
            </span>

            <h2>{t("pages.contact.sendMessage", "Send us a message")}</h2>

            <p>
              {t(
                "pages.contact.description",
                "Tell us what you want to build. Include your project goal, preferred timeline, required features, and budget range if you already have one.",
              )}
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
                  {t("forms.contact.fullName", "Full name")} *
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder={t(
                      "forms.contact.fullNamePlaceholder",
                      "Your full name",
                    )}
                    autoComplete="name"
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
                    maxLength={180}
                    placeholder={t(
                      "forms.contact.emailPlaceholder",
                      "you@example.com",
                    )}
                    autoComplete="email"
                  />
                </label>

                <label>
                  {t("forms.contact.phoneNumber", "Phone")}
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={50}
                    placeholder={t("forms.contact.phonePlaceholder", "+234...")}
                    autoComplete="tel"
                  />
                </label>

                <label>
                  {t("forms.contact.companyName", "Company / Brand")}
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    maxLength={150}
                    placeholder={t(
                      "forms.contact.companyPlaceholder",
                      "Company or brand name",
                    )}
                    autoComplete="organization"
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
                    {getServiceOptions().map((option) => (
                      <option value={option} key={option}>
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
                    <option value="EN">{t("language.name", "English")}</option>
                    <option value="IG">{t("language.name", "Igbo")}</option>
                    <option value="HA">{t("language.name", "Hausa")}</option>
                    <option value="YO">{t("language.name", "Yoruba")}</option>
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
                  maxLength={200}
                  placeholder={t(
                    "forms.contact.subjectPlaceholder",
                    "What do you need?",
                  )}
                />
              </label>

              <label>
                {t("forms.contact.message", "Message")} *
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  maxLength={5000}
                  rows={7}
                  placeholder={t(
                    "forms.contact.messagePlaceholder",
                    "Describe your project, timeline, budget range, required pages/features, and what problem you want to solve...",
                  )}
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
              <span>01</span>
              <h2>
                {t("pages.contact.nextSteps.title", "What happens next?")}
              </h2>
              <p>
                {t(
                  "pages.contact.nextSteps.description",
                  "Your message is saved inside the admin Contact CRM, where the team can review it, assign it, update status, and follow up.",
                )}
              </p>
            </div>

            <div className="premium-info-panel">
              <span>02</span>
              <h2>
                {t(
                  "pages.contact.detailsToInclude.title",
                  "Best details to include",
                )}
              </h2>
              <p>
                {t(
                  "pages.contact.detailsToInclude.description",
                  "Include your business type, project goal, required features, timeline, budget range, and any reference websites you like.",
                )}
              </p>
            </div>

            <div className="premium-info-panel">
              <span>03</span>
              <h2>{t("pages.contact.howWeRespond.title", "How we respond")}</h2>
              <p>
                {t(
                  "pages.contact.howWeRespond.description",
                  "We review the request and reply with a practical recommendation, possible scope, timeline, and next step.",
                )}
              </p>
            </div>

            <div className="premium-info-panel">
              <span>04</span>
              <h2>{t("pages.contact.storedSafely.title", "Stored safely")}</h2>
              <p>
                {t(
                  "pages.contact.storedSafely.description",
                  "Every inquiry is stored as a CRM message so no lead gets lost in email, chat, or manual notes.",
                )}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
