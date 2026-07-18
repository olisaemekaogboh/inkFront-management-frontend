import { useEffect, useMemo, useState, useCallback } from "react";
import { memo } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import NewsletterSection from "../../components/sections/NewsletterSection";
import "../../styles/publicPremium.css";

// ==================== CONSTANTS ====================

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

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  company: "",
  serviceInterest: "",
  preferredLanguage: "EN",
  subject: "",
  message: "",
};

// ==================== UTILITY FUNCTIONS ====================

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

function optimizeImageUrl(url) {
  if (!url) return url;

  // Unsplash optimization
  if (url.includes("images.unsplash.com")) {
    const hasParams = url.includes("?");
    return `${url}${hasParams ? "&" : "?"}auto=format&fit=crop&w=1600&q=80`;
  }

  // Cloudinary - preserve existing transformations
  if (url.includes("cloudinary.com")) {
    return url;
  }

  // Other CDNs - leave unchanged
  return url;
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

function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

// ==================== OPTIMIZED IMAGE COMPONENT ====================

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
  objectFit = "cover",
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const optimizedSrc = useMemo(() => optimizeImageUrl(src), [src]);

  if (!src || imageError) return null;

  return (
    <div className="optimized-image-wrapper">
      {!isLoaded && <div className="image-placeholder" />}
      <img
        src={optimizedSrc}
        alt={alt || ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={() => {
          setImageError(true);
        }}
      />
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// ==================== MEMOIZED CHILD COMPONENTS ====================

const ContactHero = memo(function ContactHero({ title, subtitle, imageUrl }) {
  return (
    <section className="premium-detail-hero">
      <div
        className={
          imageUrl
            ? "premium-container premium-detail-grid"
            : "premium-container premium-page-intro"
        }
      >
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="premium-eyebrow">
            <TranslationWrapper>nav.contact</TranslationWrapper>
          </span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </m.div>

        {imageUrl && (
          <m.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="premium-detail-media"
          >
            <OptimizedImage
              src={imageUrl}
              alt={title}
              className="premium-detail-media__img"
              priority={true}
              objectFit="cover"
            />
          </m.div>
        )}
      </div>
    </section>
  );
});

ContactHero.displayName = "ContactHero";

const ContactForm = memo(function ContactForm({
  form,
  onChange,
  onSubmit,
  submitting,
  success,
  error,
  serviceOptions,
  activeLanguage,
  canSubmit,
  t,
}) {
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      onChange(name, value);
    },
    [onChange],
  );

  return (
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

      <form className="premium-contact-form" onSubmit={onSubmit} noValidate>
        <div className="premium-form-grid">
          <FormField
            label={t("forms.contact.fullName", "Full name")}
            required
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder={t(
              "forms.contact.fullNamePlaceholder",
              "Your full name",
            )}
          />

          <FormField
            label={t("forms.contact.email", "Email")}
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t("forms.contact.emailPlaceholder", "you@example.com")}
            autoComplete="email"
          />

          <FormField
            label={t("forms.contact.phoneNumber", "Phone")}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder={t("forms.contact.phonePlaceholder", "+234...")}
            autoComplete="tel"
          />

          <FormField
            label={t("forms.contact.companyName", "Company / Brand")}
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder={t(
              "forms.contact.companyPlaceholder",
              "Company or brand name",
            )}
            autoComplete="organization"
          />
        </div>

        <div className="premium-form-grid">
          <FormSelect
            label={t("forms.contact.serviceInterest", "Service interest")}
            name="serviceInterest"
            value={form.serviceInterest}
            onChange={handleChange}
            options={serviceOptions}
            placeholder={t("forms.contact.selectService", "Select service")}
          />

          <FormSelect
            label={t("forms.contact.preferredLanguage", "Preferred language")}
            name="preferredLanguage"
            value={form.preferredLanguage}
            onChange={handleChange}
            options={Object.entries(LANGUAGE_LABELS).map(([code, label]) => ({
              value: code,
              label,
            }))}
          />
        </div>

        <FormField
          label={t("forms.contact.subject", "Subject")}
          required
          name="subject"
          value={form.subject}
          onChange={handleChange}
          placeholder={t(
            "forms.contact.subjectPlaceholder",
            "What do you need?",
          )}
        />

        <FormField
          label={t("forms.contact.message", "Message")}
          required
          as="textarea"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder={t(
            "forms.contact.messagePlaceholder",
            "Describe your project, timeline, budget range, required pages/features, and what problem you want to solve...",
          )}
          rows={7}
        />

        <button
          type="submit"
          className="premium-btn premium-btn-primary"
          disabled={submitting || !canSubmit}
          aria-disabled={submitting || !canSubmit}
        >
          {submitting
            ? t("forms.contact.sending", "Sending...")
            : t("forms.contact.submit", "Send message →")}
        </button>
      </form>
    </article>
  );
});

ContactForm.displayName = "ContactForm";

const FormField = memo(function FormField({
  label,
  required,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  as = "input",
  rows,
  autoComplete,
}) {
  const fieldId = `field-${name}`;
  const Component = as;

  return (
    <label htmlFor={fieldId}>
      {label} {required && "*"}
      <Component
        id={fieldId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        autoComplete={autoComplete}
        aria-required={required}
      />
    </label>
  );
});

FormField.displayName = "FormField";

const FormSelect = memo(function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}) {
  const fieldId = `field-${name}`;

  return (
    <label htmlFor={fieldId}>
      {label}
      <select id={fieldId} name={name} value={value} onChange={onChange}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
    </label>
  );
});

FormSelect.displayName = "FormSelect";

const ContactSidebar = memo(function ContactSidebar({ t }) {
  const sidebarItems = useMemo(
    () => [
      {
        title: "pages.contact.inquiry",
        description: "pages.contact.description",
      },
      {
        title: "pages.contact.nextSteps.title",
        description: "pages.contact.nextSteps.description",
      },
      {
        title: "pages.contact.detailsToInclude.title",
        description: "pages.contact.detailsToInclude.description",
      },
      {
        title: "pages.contact.howWeRespond.title",
        description: "pages.contact.howWeRespond.description",
      },
      {
        title: "pages.contact.storedSafely.title",
        description: "pages.contact.storedSafely.description",
      },
    ],
    [],
  );

  return (
    <aside className="premium-contact-sidebar">
      {sidebarItems.map((item, index) => (
        <div key={index} className="premium-info-panel">
          <h2>{t(item.title)}</h2>
          <p>{t(item.description)}</p>
        </div>
      ))}
    </aside>
  );
});

ContactSidebar.displayName = "ContactSidebar";

// ==================== TRANSLATION WRAPPER ====================

const TranslationWrapper = memo(function TranslationWrapper({ children }) {
  const { t } = useLanguage();
  return <>{t(children)}</>;
});

TranslationWrapper.displayName = "TranslationWrapper";

// ==================== MAIN COMPONENT ====================

export default function ContactPage() {
  const { language, t } = useLanguage();

  // ==================== DATA FETCHING ====================

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

  // ==================== STATE ====================

  const activeLanguage = useMemo(() => {
    const code = `${language || "EN"}`.toUpperCase();
    return SERVICE_OPTIONS[code] ? code : "EN";
  }, [language]);

  const [form, setForm] = useState({
    ...INITIAL_FORM,
    preferredLanguage: activeLanguage,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==================== MEMOIZED DATA ====================

  const heroData = useMemo(() => {
    const heroItem = normalizeList(hero.data)[0] || null;
    return {
      item: heroItem,
      title: text(
        heroItem?.title,
        t("pages.contact.title", "Let's build your next digital system"),
      ),
      subtitle: text(
        heroItem?.subtitle,
        heroItem?.description,
        t(
          "pages.contact.subtitle",
          "Send your project details directly to the InkFront admin team. Your inquiry will be saved, tracked, and followed up from the admin CRM.",
        ),
      ),
      imageUrl: getImageUrl(heroItem),
    };
  }, [hero.data, t]);

  const serviceOptions = useMemo(
    () => SERVICE_OPTIONS[activeLanguage] || SERVICE_OPTIONS.EN,
    [activeLanguage],
  );

  const canSubmit = useMemo(() => {
    return (
      form.fullName.trim() !== "" &&
      validateEmail(form.email) &&
      form.subject.trim() !== "" &&
      form.message.trim() !== ""
    );
  }, [form.fullName, form.email, form.subject, form.message]);

  const cleanedPayload = useMemo(() => cleanPayload(form), [form]);

  // ==================== SIDE EFFECTS ====================

  useEffect(() => {
    setForm((current) => ({
      ...current,
      preferredLanguage: activeLanguage,
    }));
  }, [activeLanguage]);

  // ==================== HANDLERS ====================

  const handleChange = useCallback((name, value) => {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setSuccess("");
    setError("");
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
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

        await publicApi.submitContactMessage(cleanedPayload);

        setForm({
          ...INITIAL_FORM,
          preferredLanguage: activeLanguage,
        });

        setSuccess(
          t(
            "forms.contact.success",
            "Message sent successfully. The InkFront admin team will review it and get back to you soon.",
          ),
        );
      } catch (err) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          t("forms.contact.error", "Failed to send message. Please try again.");
        setError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
    [canSubmit, cleanedPayload, activeLanguage, t],
  );

  // ==================== LOADING & ERROR STATES ====================

  if (hero.loading) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  if (hero.error) {
    return <ErrorState message={hero.error} />;
  }

  // ==================== RENDER ====================

  return (
    <LazyMotion features={domAnimation}>
      <main className="premium-public-page">
        <ContactHero
          title={heroData.title}
          subtitle={heroData.subtitle}
          imageUrl={heroData.imageUrl}
        />

        <section className="premium-section">
          <div className="premium-container premium-contact-grid">
            <ContactForm
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              submitting={submitting}
              success={success}
              error={error}
              serviceOptions={serviceOptions}
              activeLanguage={activeLanguage}
              canSubmit={canSubmit}
              t={t}
            />

            <ContactSidebar t={t} />
          </div>
        </section>

        <div className="premium-container">
          <NewsletterSection />
        </div>
      </main>
    </LazyMotion>
  );
}
