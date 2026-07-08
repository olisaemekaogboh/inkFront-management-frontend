import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
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

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

function getImageUrl(item) {
  return text(
    item?.imageUrl,
    item?.coverImageUrl,
    item?.featuredImageUrl,
    item?.thumbnailUrl,
    item?.backgroundImageUrl,
    item?.bannerImageUrl,
    item?.mediaUrl,
  );
}

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

  // Memoize the fetch function to prevent recreating it on every render
  const fetchHero = useCallback(
    () =>
      heroService.getHeroSections({
        language,
        placement: "CONTACT",
        featuredOnly: true,
      }),
    [language],
  );

  const hero = useFetchOnMount(fetchHero, [language]);

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

  // Show loading state while hero is being fetched
  if (hero.loading) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  // Show error state if hero fetch fails
  if (hero.error) {
    return <ErrorState message={hero.error} />;
  }

  // Get hero data
  const heroItem = normalizeList(hero.data)[0] || null;

  const heroTitle = text(
    heroItem?.title,
    t("pages.contact.title", "Let's build your next digital system"),
  );

  const heroSubtitle = text(
    heroItem?.subtitle,
    heroItem?.description,
    t(
      "pages.contact.subtitle",
      "Send your project details directly to the InkFront admin team. Your inquiry will be saved, tracked, and followed up from the admin CRM.",
    ),
  );

  const imageUrl = getImageUrl(heroItem);

  return (
    <main className="premium-public-page">
      {/* Hero section - matching About page structure with image */}
      <section className="premium-detail-hero">
        <div
          className={
            imageUrl
              ? "premium-container premium-detail-grid"
              : "premium-container premium-page-intro"
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="premium-eyebrow">
              {t("nav.contact", "Contact")}
            </span>

            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
          </motion.div>

          {imageUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65 }}
              className="premium-detail-media"
            >
              <img
                src={imageUrl}
                alt={heroTitle}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.closest(
                    ".premium-detail-media",
                  ).style.display = "none";
                }}
              />
            </motion.div>
          ) : null}
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container premium-contact-grid">
          <article className="premium-contact-panel">
            <h2>{t("pages.contact.sendMessage", "Send us a message")}</h2>

            <p>
              {t(
                "pages.contact.description",
                "Tell us what you want to build. Include your project goal, preferred timeline, required features, and budget range if you already have one.",
              )}
            </p>

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
                    placeholder={t(
                      "forms.contact.fullNamePlaceholder",
                      "Your full name",
                    )}
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
                    placeholder={t(
                      "forms.contact.emailPlaceholder",
                      "you@example.com",
                    )}
                    required
                  />
                </label>

                <label>
                  {t("forms.contact.phoneNumber", "Phone")}
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={t("forms.contact.phonePlaceholder", "+234...")}
                  />
                </label>

                <label>
                  {t("forms.contact.companyName", "Company / Brand")}
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder={t(
                      "forms.contact.companyPlaceholder",
                      "Company or brand name",
                    )}
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
                  placeholder={t(
                    "forms.contact.subjectPlaceholder",
                    "What do you need?",
                  )}
                  required
                />
              </label>

              <label>
                {t("forms.contact.message", "Message")} *
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t(
                    "forms.contact.messagePlaceholder",
                    "Describe your project, timeline, budget range, required pages/features, and what problem you want to solve...",
                  )}
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
              <h2>{t("pages.contact.inquiry", "Project inquiry")}</h2>
              <p>
                {t(
                  "pages.contact.description",
                  "Tell us what you want to build. Include your project goal, preferred timeline, required features, and budget range if you already have one.",
                )}
              </p>
            </div>

            <div className="premium-info-panel">
              <h3>
                {t("pages.contact.nextSteps.title", "What happens next?")}
              </h3>
              <p>
                {t(
                  "pages.contact.nextSteps.description",
                  "Your message is saved inside the admin Contact CRM, where the team can review it, assign it, update status, and follow up.",
                )}
              </p>
            </div>

            <div className="premium-info-panel">
              <h3>
                {t(
                  "pages.contact.detailsToInclude.title",
                  "Best details to include",
                )}
              </h3>
              <p>
                {t(
                  "pages.contact.detailsToInclude.description",
                  "Include your business type, project goal, required features, timeline, budget range, and any reference websites you like.",
                )}
              </p>
            </div>

            <div className="premium-info-panel">
              <h3>{t("pages.contact.howWeRespond.title", "How we respond")}</h3>
              <p>
                {t(
                  "pages.contact.howWeRespond.description",
                  "We review the request and reply with a practical recommendation, possible scope, timeline, and next step.",
                )}
              </p>
            </div>

            <div className="premium-info-panel">
              <h3>{t("pages.contact.storedSafely.title", "Stored safely")}</h3>
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

      <div className="premium-container">
        <NewsletterSection />
      </div>
    </main>
  );
}
