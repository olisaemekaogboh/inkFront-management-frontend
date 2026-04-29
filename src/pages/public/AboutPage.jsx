import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { testimonialService } from "../../services/testimonialService";
import { faqService } from "../../services/faqService";
import { siteSettingService } from "../../services/siteSettingService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import CTASection from "../../components/sections/CTASection";
import "../../styles/publicPremium.css";

function normalizeList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
}

function normalizeSettings(value) {
  if (!value) return {};

  if (!Array.isArray(value) && typeof value === "object") {
    if (
      value.data &&
      typeof value.data === "object" &&
      !Array.isArray(value.data)
    ) {
      return normalizeSettings(value.data);
    }

    if (!value.content && !value.items) return value;
  }

  const list = normalizeList(value);

  return list.reduce((acc, item) => {
    const key = item?.settingKey || item?.key;
    const settingValue = item?.settingValue || item?.value;

    if (key) acc[key] = settingValue;

    return acc;
  }, {});
}

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

function getImageUrl(item, settings = {}) {
  return text(
    item?.imageUrl,
    item?.coverImageUrl,
    item?.featuredImageUrl,
    item?.thumbnailUrl,
    item?.backgroundImageUrl,
    item?.bannerImageUrl,
    item?.mediaUrl,
    item?.image,
    item?.coverImage,
    item?.featuredImage,
    settings.imageUrl,
    settings["about.imageUrl"],
    settings.coverImageUrl,
    settings["about.coverImageUrl"],
    settings.featuredImageUrl,
    settings["about.featuredImageUrl"],
    settings.heroImageUrl,
    settings["about.heroImageUrl"],
  );
}

function buildFallbackTestimonials(t) {
  return [
    {
      id: "t1",
      clientName: "Chioma E.",
      clientRole: t("pages.about.fallbackTestimonials.t1.role", "Founder"),
      organization: "EduBridge Academy",
      quote: t(
        "pages.about.fallbackTestimonials.t1.quote",
        "InkFront built our school management platform exactly how we described it. Clean design, solid backend. Our teachers and parents love using it.",
      ),
      avatarUrl: "",
    },
    {
      id: "t2",
      clientName: "Tunde A.",
      clientRole: t("pages.about.fallbackTestimonials.t2.role", "CEO"),
      organization: "QuickShip Logistics",
      quote: t(
        "pages.about.fallbackTestimonials.t2.quote",
        "We needed a dispatch system fast. The team delivered a working logistics dashboard in under 5 weeks. It's now core to our daily operations.",
      ),
      avatarUrl: "",
    },
    {
      id: "t3",
      clientName: "Fatima B.",
      clientRole: t(
        "pages.about.fallbackTestimonials.t3.role",
        "Managing Director",
      ),
      organization: "HalaMart",
      quote: t(
        "pages.about.fallbackTestimonials.t3.quote",
        "Our marketplace was just an idea. InkFront turned it into a live multi-vendor platform with escrow, catalog management, and clean admin tools.",
      ),
      avatarUrl: "",
    },
    {
      id: "t4",
      clientName: "Emeka O.",
      clientRole: t("pages.about.fallbackTestimonials.t4.role", "CTO"),
      organization: "PaySwift Fintech",
      quote: t(
        "pages.about.fallbackTestimonials.t4.quote",
        "Professional API architecture and clean frontend work. They understand business logic, not just code. We've been working together for over a year.",
      ),
      avatarUrl: "",
    },
  ];
}

function buildFallbackFaqs(t) {
  return [
    {
      id: "f1",
      question: t(
        "pages.about.fallbackFaqs.f1.question",
        "What kind of businesses do you work with?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f1.answer",
        "We work with startups, SMEs, agencies, schools, fintechs, logistics companies, and service-based businesses that need a strong digital presence and operational systems.",
      ),
    },
    {
      id: "f2",
      question: t(
        "pages.about.fallbackFaqs.f2.question",
        "How long does it take to complete a project?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f2.answer",
        "Timelines depend on the scope — a business website takes 2–4 weeks, while a full custom platform can take 8–16 weeks. We give clear estimates during the strategy phase.",
      ),
    },
    {
      id: "f3",
      question: t(
        "pages.about.fallbackFaqs.f3.question",
        "Do you offer post-launch support?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f3.answer",
        "Yes. Every project includes a warranty period and we offer ongoing maintenance plans to keep your platform updated, secure, and performing well.",
      ),
    },
    {
      id: "f4",
      question: t(
        "pages.about.fallbackFaqs.f4.question",
        "Can you work with my existing team or tools?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f4.answer",
        "Absolutely. We integrate with your current workflows, APIs, databases, and third-party tools. We build on top of what you already have, not replace everything.",
      ),
    },
    {
      id: "f5",
      question: t(
        "pages.about.fallbackFaqs.f5.question",
        "How much does a typical project cost?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f5.answer",
        "Our MVP packages start at $2,500 for a complete business website. Custom platforms range from $5,000–$25,000+ depending on complexity. Every project gets a fixed-price proposal upfront.",
      ),
    },
    {
      id: "f6",
      question: t(
        "pages.about.fallbackFaqs.f6.question",
        "What technologies do you use?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f6.answer",
        "We build with React, Spring Boot, PostgreSQL, Docker, and modern cloud infrastructure. For mobile apps, we use React Native or Flutter. We choose the right stack for your needs.",
      ),
    },
  ];
}

function buildWorkSteps(t) {
  return [
    {
      number: "01",
      title: t(
        "pages.about.workSteps.understand.title",
        "Understand the business",
      ),
      body: t(
        "pages.about.workSteps.understand.body",
        "We clarify the offer, audience, pages, workflows, and business goal before building.",
      ),
    },
    {
      number: "02",
      title: t("pages.about.workSteps.design.title", "Design the experience"),
      body: t(
        "pages.about.workSteps.design.body",
        "We shape the layout, content flow, and user journey so the platform feels premium and easy to use.",
      ),
    },
    {
      number: "03",
      title: t("pages.about.workSteps.build.title", "Build with clean systems"),
      body: t(
        "pages.about.workSteps.build.body",
        "We connect frontend, backend, DTOs, services, APIs, admin tools, and published public content.",
      ),
    },
  ];
}

export default function AboutPage() {
  const { language, t } = useLanguage();

  const hero = useFetchOnMount(
    () =>
      heroService.getHeroSections({
        language,
        placement: "ABOUT",
        featuredOnly: true,
      }),
    [language],
  );

  const settings = useFetchOnMount(
    () => siteSettingService.getPublicSettings({ language, group: "ABOUT" }),
    [language],
  );

  const testimonials = useFetchOnMount(
    () =>
      testimonialService.getTestimonials({
        language,
        featuredOnly: true,
        page: 0,
        size: 4,
      }),
    [language],
  );

  const faqs = useFetchOnMount(
    () =>
      faqService.getFaqItems({
        language,
        pageKey: "ABOUT",
        page: 0,
        size: 8,
      }),
    [language],
  );

  if (
    hero.loading ||
    settings.loading ||
    testimonials.loading ||
    faqs.loading
  ) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  if (hero.error || settings.error || testimonials.error || faqs.error) {
    return (
      <ErrorState
        message={
          hero.error || settings.error || testimonials.error || faqs.error
        }
      />
    );
  }

  const heroItem = normalizeList(hero.data)[0] || null;
  const siteSettings = normalizeSettings(settings.data);

  const fallbackTestimonials = buildFallbackTestimonials(t);
  const fallbackFaqs = buildFallbackFaqs(t);
  const workSteps = buildWorkSteps(t);

  const testimonialItems =
    normalizeList(testimonials.data).length > 0
      ? normalizeList(testimonials.data)
      : fallbackTestimonials;

  const faqItems =
    normalizeList(faqs.data).length > 0
      ? normalizeList(faqs.data)
      : fallbackFaqs;

  const getSetting = (key, fallback = "") =>
    text(siteSettings[key], siteSettings[`about.${key}`], fallback);

  const heroTitle = text(
    heroItem?.title,
    getSetting("heroTitle"),
    t("pages.about.title", "We build digital systems for modern businesses"),
  );

  const heroSubtitle = text(
    heroItem?.subtitle,
    heroItem?.description,
    getSetting("heroSubtitle"),
    t(
      "pages.about.subtitle",
      "InkFront helps businesses launch premium websites, product pages, dashboards, portals, and backend-connected digital platforms.",
    ),
  );

  const imageUrl = getImageUrl(heroItem, siteSettings);

  const story = getSetting(
    "story",
    t(
      "pages.about.storyFallback",
      "InkFront exists to help businesses move from scattered ideas and weak online presence to polished, trusted, and scalable digital platforms.",
    ),
  );

  const missionTitle = getSetting(
    "missionTitle",
    t("pages.about.missionTitle", "Our mission"),
  );

  const mission = getSetting(
    "missionText",
    getSetting(
      "mission",
      t(
        "pages.about.missionFallback",
        "To design and build practical digital systems that help businesses communicate clearly, operate better, and grow with confidence.",
      ),
    ),
  );

  const visionTitle = getSetting(
    "visionTitle",
    t("pages.about.visionTitle", "Our vision"),
  );

  const vision = getSetting(
    "visionText",
    getSetting(
      "vision",
      t(
        "pages.about.visionFallback",
        "To become a trusted technology partner for businesses that want clean design, solid backend systems, and long-term digital growth.",
      ),
    ),
  );

  const values = getSetting(
    "values",
    t(
      "pages.about.valuesFallback",
      "We value clarity, reliability, business impact, clean execution, and honest communication.",
    ),
  );

  return (
    <main className="premium-public-page">
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
              {t("pages.about.eyebrow", "About InkFront")}
            </span>

            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>

            <div className="premium-stats premium-about-stats">
              <div>
                <strong>7+</strong>
                <span>{t("home.statsServices", "Core services")}</span>
              </div>

              <div>
                <strong>100%</strong>
                <span>{t("home.statsBusiness", "Business focused")}</span>
              </div>

              <div>
                <strong>{language}</strong>
                <span>
                  {t("pages.about.multilingualReady", "Multilingual ready")}
                </span>
              </div>
            </div>
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
        <div className="premium-container premium-about-grid">
          <article className="premium-about-story">
            <span className="premium-eyebrow">
              {t("pages.about.storyEyebrow", "Our story")}
            </span>

            <h2>{t("pages.about.storyTitle", "Why InkFront exists")}</h2>
            <p>{story}</p>
          </article>

          <div className="premium-about-panels">
            <article className="premium-info-panel">
              <span>01</span>
              <h2>{missionTitle}</h2>
              <p>{mission}</p>
            </article>

            <article className="premium-info-panel">
              <span>02</span>
              <h2>{visionTitle}</h2>
              <p>{vision}</p>
            </article>

            <article className="premium-info-panel">
              <span>03</span>
              <h2>{t("pages.about.valuesTitle", "Our values")}</h2>
              <p>{values}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="premium-section premium-section-dark">
        <div className="premium-container premium-split">
          <div>
            <span className="premium-eyebrow premium-eyebrow--light">
              {t("pages.about.howWeWorkEyebrow", "How we work")}
            </span>

            <h2>
              {t(
                "pages.about.howWeWorkTitle",
                "We turn business goals into clear digital systems.",
              )}
            </h2>
          </div>

          <div className="premium-blueprint-panel">
            {workSteps.map((item) => (
              <article key={item.number} className="premium-blueprint-item">
                <strong>{item.number}</strong>

                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-section premium-testimonial-section">
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">
              {t("sections.testimonials.eyebrow", "Testimonials")}
            </span>

            <h2>{t("sections.testimonials.title", "What clients say")}</h2>

            <p>
              {t(
                "sections.testimonials.description",
                "Proof from people and businesses that trust InkFront.",
              )}
            </p>
          </div>

          <div className="premium-testimonial-grid premium-testimonial-grid-large">
            {testimonialItems.map((item, index) => {
              const quote = text(
                item.quote,
                item.message,
                item.content,
                item.text,
                t(
                  "sections.testimonials.emptyQuote",
                  "No testimonial text available.",
                ),
              );

              const name = text(
                item.clientName,
                item.name,
                item.author,
                t("sections.testimonials.anonymous", "Anonymous Client"),
              );

              const roleLine = [item.clientRole, item.role, item.organization]
                .filter(Boolean)
                .join(" • ");

              const avatarUrl = text(
                item.avatarUrl,
                item.imageUrl,
                item.photoUrl,
              );

              return (
                <motion.article
                  key={item.id ?? index}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="premium-testimonial-card"
                >
                  <div
                    className="premium-quote-mark"
                    aria-label={t("sections.testimonials.quoteMark", "Quote")}
                  >
                    "
                  </div>

                  <p>"{quote}"</p>

                  <div className="premium-person">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={name}
                        className="premium-avatar"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="premium-avatar premium-avatar-fallback">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <strong>{name}</strong>
                      <span>
                        {roleLine ||
                          t("sections.testimonials.client", "Client")}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">
              {t("sections.faq.eyebrow", "FAQ")}
            </span>

            <h2>{t("sections.faq.title", "Questions people ask")}</h2>

            <p>
              {t(
                "sections.faq.description",
                "Answers about how we work, what we build, and how to start.",
              )}
            </p>
          </div>

          <div className="premium-faq-grid">
            {faqItems.map((item, index) => (
              <motion.article
                key={item.id ?? index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                viewport={{ once: true }}
                className="premium-info-panel"
              >
                <h3>
                  {text(
                    item.question,
                    t("sections.faq.defaultQuestion", "Question"),
                  )}
                </h3>

                <p>
                  {text(
                    item.answer,
                    t("sections.faq.defaultAnswer", "Answer unavailable."),
                  )}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={t("cta.about.title", "Ready to build your digital platform?")}
        description={t(
          "cta.about.description",
          "Let's create a professional website, product page, portal, or custom business system for your brand.",
        )}
        primaryLabel={t("common.contactUs", "Contact us")}
        primaryTo="/contact"
        secondaryLabel={t("nav.portfolio", "Portfolio")}
        secondaryTo="/portfolio"
      />
    </main>
  );
}
