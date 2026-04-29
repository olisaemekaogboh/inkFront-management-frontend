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

  return normalizeList(value).reduce((acc, item) => {
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
    settings.imageUrl,
    settings["about.imageUrl"],
    settings.coverImageUrl,
    settings["about.coverImageUrl"],
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
        "InkFront built our school management platform with clean design, strong backend logic, and a user experience our teachers and parents could understand quickly.",
      ),
    },
    {
      id: "t2",
      clientName: "Tunde A.",
      clientRole: t("pages.about.fallbackTestimonials.t2.role", "CEO"),
      organization: "QuickShip Logistics",
      quote: t(
        "pages.about.fallbackTestimonials.t2.quote",
        "The team understood our dispatch workflow before writing code. That business-first approach made the final logistics dashboard practical and easy to use.",
      ),
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
        "InkFront helped us turn a marketplace idea into a working digital product with vendor tools, product management, and a polished customer experience.",
      ),
    },
    {
      id: "t4",
      clientName: "Emeka O.",
      clientRole: t("pages.about.fallbackTestimonials.t4.role", "CTO"),
      organization: "PaySwift Fintech",
      quote: t(
        "pages.about.fallbackTestimonials.t4.quote",
        "They understand both software architecture and business logic. That combination is rare and valuable when building serious platforms.",
      ),
    },
  ];
}

function buildFallbackFaqs(t) {
  return [
    {
      id: "f1",
      question: t(
        "pages.about.fallbackFaqs.f1.question",
        "Who is behind InkFront?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f1.answer",
        "InkFront is backed by a flexible team of 5 to 15 software engineers, product thinkers, and digital builders with strong experience in business logic, frontend experience, backend systems, and scalable platform delivery.",
      ),
    },
    {
      id: "f2",
      question: t(
        "pages.about.fallbackFaqs.f2.question",
        "How experienced is the team?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f2.answer",
        "Our team brings 10+ years of combined practical experience building websites, dashboards, portals, e-commerce systems, school systems, booking platforms, and custom software for real business use cases.",
      ),
    },
    {
      id: "f3",
      question: t(
        "pages.about.fallbackFaqs.f3.question",
        "Do you only serve businesses in Nigeria?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f3.answer",
        "Nigeria is our foundation and Africa is our focus. We build for businesses across Nigeria and design systems that can scale into wider African markets.",
      ),
    },
    {
      id: "f4",
      question: t(
        "pages.about.fallbackFaqs.f4.question",
        "What makes your approach different?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f4.answer",
        "We do not just design screens. We study how the business works, map the user journey, structure the backend properly, and build digital systems that feel simple for users and useful for business owners.",
      ),
    },
    {
      id: "f5",
      question: t(
        "pages.about.fallbackFaqs.f5.question",
        "Can you work with existing projects?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f5.answer",
        "Yes. We can improve existing React, Spring Boot, PostgreSQL, and admin-dashboard projects without starting from scratch. We fix broken flows, improve design, connect APIs, and preserve working features.",
      ),
    },
    {
      id: "f6",
      question: t(
        "pages.about.fallbackFaqs.f6.question",
        "What kind of platforms do you build?",
      ),
      answer: t(
        "pages.about.fallbackFaqs.f6.answer",
        "We build business websites, product landing pages, client portals, admin dashboards, booking systems, e-commerce platforms, school management systems, CRM tools, and custom workflow software.",
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
        "Understand the business logic",
      ),
      body: t(
        "pages.about.workSteps.understand.body",
        "We study how your business earns, serves customers, manages operations, and handles data before we design or build anything.",
      ),
    },
    {
      number: "02",
      title: t("pages.about.workSteps.design.title", "Design for real users"),
      body: t(
        "pages.about.workSteps.design.body",
        "We create clean journeys, strong layouts, and user-friendly interfaces that make your platform easy for customers, staff, and admins.",
      ),
    },
    {
      number: "03",
      title: t("pages.about.workSteps.build.title", "Build scalable systems"),
      body: t(
        "pages.about.workSteps.build.body",
        "We connect frontend, backend, DTOs, APIs, admin tools, database models, authentication, and content management into one reliable system.",
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
    t(
      "pages.about.title",
      "African-driven software engineering for serious business growth",
    ),
  );

  const heroSubtitle = text(
    heroItem?.subtitle,
    heroItem?.description,
    getSetting("heroSubtitle"),
    t(
      "pages.about.subtitle",
      "InkFront is backed by a team of 5 to 15 software engineers with 10+ years of experience building business websites, dashboards, portals, and custom platforms that combine strong business logic with excellent user experience across Nigeria and Africa.",
    ),
  );

  const imageUrl = getImageUrl(heroItem, siteSettings);

  const story = getSetting(
    "story",
    t(
      "pages.about.storyFallback",
      "InkFront exists because many African businesses do not just need a website — they need digital systems that understand how their business actually works. Our team combines software engineering, business thinking, product structure, and user experience design to help companies move from scattered manual processes to polished platforms that customers can trust and teams can manage with confidence.",
    ),
  );

  const missionTitle = getSetting(
    "missionTitle",
    t("pages.about.missionTitle", "Our African-driven mission"),
  );

  const mission = getSetting(
    "missionText",
    getSetting(
      "mission",
      t(
        "pages.about.missionFallback",
        "Our mission is to build practical, reliable, and beautiful digital systems for African businesses that want to compete with confidence. We help founders, schools, logistics companies, agencies, creators, and service businesses turn local knowledge into world-class digital experiences. We believe African businesses deserve platforms that are fast, clear, secure, easy to manage, and designed around real customer behavior.",
      ),
    ),
  );

  const visionTitle = getSetting(
    "visionTitle",
    t("pages.about.visionTitle", "Our African technology vision"),
  );

  const vision = getSetting(
    "visionText",
    getSetting(
      "vision",
      t(
        "pages.about.visionFallback",
        "Our vision is to become one of Africa’s most trusted digital product partners — a team known for building platforms that make businesses easier to run, easier to understand, and easier to scale. We see a future where African companies no longer depend on weak templates or disconnected tools, but own clean, scalable software systems built for their market, their customers, and their growth.",
      ),
    ),
  );

  const values = getSetting(
    "values",
    t(
      "pages.about.valuesFallback",
      "We value clear thinking, honest communication, business-first engineering, user-friendly design, reliability, speed, documentation, and long-term partnership. Every project should solve a real problem, reduce confusion, improve customer trust, and give the business owner more control.",
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
                <strong>5–15</strong>
                <span>Software engineers</span>
              </div>

              <div>
                <strong>10+</strong>
                <span>Years experience</span>
              </div>

              <div>
                <strong>NG</strong>
                <span>Africa focused</span>
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

            <h2>
              {t(
                "pages.about.storyTitle",
                "Built for business logic, not just design",
              )}
            </h2>
            <p>{story}</p>

            <ul className="premium-detail-list" style={{ marginTop: 24 }}>
              <li>Backed by a flexible team of 5 to 15 software engineers.</li>
              <li>
                Strong understanding of business logic and user experience.
              </li>
              <li>
                10+ years of practical experience across web and software
                systems.
              </li>
              <li>Focused on Nigeria first, with an African growth mindset.</li>
            </ul>
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
              Engineering depth
            </span>

            <h2>We combine software skill with business understanding.</h2>

            <p>
              Our work is not only about code. We think through how a business
              receives leads, manages customers, presents services, controls
              content, handles data, and creates a smooth experience for users.
            </p>
          </div>

          <div className="premium-blueprint-panel">
            {[
              {
                number: "01",
                title: "Business logic first",
                body: "Before building, we understand your operations, users, services, workflows, and revenue model.",
              },
              {
                number: "02",
                title: "Clean user experience",
                body: "We design pages, dashboards, forms, and flows that feel simple, premium, and easy to use.",
              },
              {
                number: "03",
                title: "Reliable engineering",
                body: "We build with clean frontend structure, backend services, DTOs, APIs, authentication, and database logic.",
              },
              {
                number: "04",
                title: "African market awareness",
                body: "We build with awareness of Nigerian and African business realities: trust, speed, mobile use, clarity, and affordability.",
              },
            ].map((item) => (
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

      <section className="premium-section">
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">How we work</span>
            <h2>From idea to polished digital system.</h2>
            <p>
              Every project follows a clear process so the final platform is not
              just beautiful, but useful, maintainable, and aligned with the way
              your business works.
            </p>
          </div>

          <div className="premium-card-grid">
            {workSteps.map((item) => (
              <article key={item.number} className="premium-service-card">
                <div className="premium-card-body">
                  <div className="premium-icon">{item.number}</div>
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
                  <div className="premium-quote-mark">"</div>

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
                <h3>{text(item.question, "Question")}</h3>
                <p>{text(item.answer, "Answer unavailable.")}</p>
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
