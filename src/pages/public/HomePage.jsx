import { useEffect, useMemo, useState } from "react";
import { motion, animate } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import NewsletterSection from "../../components/sections/NewsletterSection";
import { heroService } from "../../services/heroService";
import { serviceCatalogService } from "../../services/serviceCatalogService";
import { portfolioService } from "../../services/portfolioService";
import { productBlueprintService } from "../../services/productBlueprintService";
import { testimonialService } from "../../services/testimonialService";
import { clientLogoService } from "../../services/clientLogoService";
import blogService from "../../services/blogService";
import "../../styles/publicPremium.css";

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const getText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const getImage = (item) =>
  getText(
    item?.imageUrl,
    item?.heroImageUrl,
    item?.backgroundImageUrl,
    item?.desktopImageUrl,
    item?.mobileImageUrl,
    item?.coverImageUrl,
    item?.featuredImageUrl,
    item?.thumbnailUrl,
    item?.mediaUrl,
    item?.fileUrl,
    item?.url,
    item?.logoUrl,
    item?.avatarUrl,
  );

function formatDate(value, language = "EN") {
  if (!value) return "";

  const localeMap = {
    EN: "en",
    HA: "ha",
    IG: "ig",
    YO: "yo",
  };

  try {
    return new Intl.DateTimeFormat(localeMap[language] || "en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function CountUpNumber({ value, suffix = "", duration = 1.4 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });

    return () => controls.stop();
  }, [value, duration]);

  return (
    <>
      {displayValue}
      {suffix}
    </>
  );
}

const PremiumImage = ({ src, alt, className, eager = false }) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
    },
  },
};

const sectionReveal = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const fallbackServices = (t) => [
  {
    id: "web-dev",
    title: t("home.fallbackServices.webDev"),
    summary: t("home.fallbackServices.webDevSummary"),
    timeline: t("home.fallbackServices.webDevTimeline", "7–21 days"),
    highlights: t(
      "home.fallbackServices.webDevHighlights",
      "Landing pages, company websites, SEO structure, contact flow",
    ),
  },
  {
    id: "software",
    title: t("home.fallbackServices.software"),
    summary: t("home.fallbackServices.softwareSummary"),
    timeline: t("home.fallbackServices.softwareTimeline", "3–8 weeks"),
    highlights: t(
      "home.fallbackServices.softwareHighlights",
      "Admin panels, portals, booking flows, reporting dashboards",
    ),
  },
  {
    id: "strategy",
    title: t("home.fallbackServices.strategy"),
    summary: t("home.fallbackServices.strategySummary"),
    timeline: t("home.fallbackServices.strategyTimeline", "3–10 days"),
    highlights: t(
      "home.fallbackServices.strategyHighlights",
      "Offer structure, funnel planning, page mapping, launch plan",
    ),
  },
  {
    id: "ecommerce",
    title: t("home.fallbackServices.ecommerce", "E-commerce Systems"),
    summary: t(
      "home.fallbackServices.ecommerceSummary",
      "Online stores, product catalogues, order flows, and payment-ready shopping experiences.",
    ),
    timeline: t("home.fallbackServices.ecommerceTimeline", "2–6 weeks"),
    highlights: t(
      "home.fallbackServices.ecommerceHighlights",
      "Products, carts, checkout, order management",
    ),
  },
  {
    id: "booking",
    title: t("home.fallbackServices.booking", "Booking Platforms"),
    summary: t(
      "home.fallbackServices.bookingSummary",
      "Appointment, service, transport, and reservation systems with smooth user experience.",
    ),
    timeline: t("home.fallbackServices.bookingTimeline", "2–5 weeks"),
    highlights: t(
      "home.fallbackServices.bookingHighlights",
      "Scheduling, forms, admin management, notifications",
    ),
  },
  {
    id: "training",
    title: t("home.fallbackServices.training", "Coding & Tech Training"),
    summary: t(
      "home.fallbackServices.trainingSummary",
      "Practical training for teams, students, and founders who want to understand modern software.",
    ),
    timeline: t("home.fallbackServices.trainingTimeline", "Flexible"),
    highlights: t(
      "home.fallbackServices.trainingHighlights",
      "React, Spring Boot, web development, project-based learning",
    ),
  },
];

const fallbackProjects = (t) => [
  {
    id: "agency-site",
    title: t("home.fallbackProjects.agencySite"),
    summary: t("home.fallbackProjects.agencySiteSummary"),
    slug: "agency-website-platform",
  },
  {
    id: "booking-system",
    title: t("home.fallbackProjects.bookingSystem"),
    summary: t("home.fallbackProjects.bookingSystemSummary"),
    slug: "booking-management-system",
  },
  {
    id: "client-portal",
    title: t("home.fallbackProjects.clientPortal"),
    summary: t("home.fallbackProjects.clientPortalSummary"),
    slug: "client-portal",
  },
];

const fallbackProducts = (t) => [
  {
    id: "blueprint",
    title: t("home.fallbackProducts.blueprint"),
    summary: t("home.fallbackProducts.blueprintSummary"),
    slug: "product-blueprint",
  },
  {
    id: "business-site",
    title: t("home.fallbackProducts.businessSite", "Business Website Kit"),
    summary: t(
      "home.fallbackProducts.businessSiteSummary",
      "A premium website structure for brands that need credibility, pages, and lead capture.",
    ),
    slug: "business-website-kit",
  },
  {
    id: "portal-kit",
    title: t("home.fallbackProducts.portalKit", "Client Portal Kit"),
    summary: t(
      "home.fallbackProducts.portalKitSummary",
      "A secure customer portal foundation for dashboards, profiles, requests, and admin workflows.",
    ),
    slug: "client-portal-kit",
  },
];

const fallbackTestimonials = (t) => [
  {
    id: "one",
    clientName: t("home.fallbackTestimonials.client1.name"),
    role: t("home.fallbackTestimonials.client1.role"),
    quote: t("home.fallbackTestimonials.client1.quote"),
  },
  {
    id: "two",
    clientName: t("home.fallbackTestimonials.client2.name"),
    role: t("home.fallbackTestimonials.client2.role"),
    quote: t("home.fallbackTestimonials.client2.quote"),
  },
  {
    id: "three",
    clientName: t("home.fallbackTestimonials.client3.name", "Digital Client"),
    role: t("home.fallbackTestimonials.client3.role", "Operations Lead"),
    quote: t(
      "home.fallbackTestimonials.client3.quote",
      "InkFront helped us move from manual work to a cleaner, more organized digital flow.",
    ),
  },
  {
    id: "four",
    clientName: t("home.fallbackTestimonials.client4.name", "Startup Client"),
    role: t("home.fallbackTestimonials.client4.role", "Founder"),
    quote: t(
      "home.fallbackTestimonials.client4.quote",
      "The structure, pages, and admin control made the whole business feel more serious.",
    ),
  },
];

const processSteps = (t) => [
  {
    title: t("home.processSteps.discover.title", "Discover"),
    text: t(
      "home.processSteps.discover.text",
      "We clarify your business goals, audience, services, and the type of system you need.",
    ),
  },
  {
    title: t("home.processSteps.structure.title", "Structure"),
    text: t(
      "home.processSteps.structure.text",
      "We map the pages, content flow, admin needs, user journey, and backend data model.",
    ),
  },
  {
    title: t("home.processSteps.build.title", "Build"),
    text: t(
      "home.processSteps.build.text",
      "We develop the frontend, backend, content management, authentication, and integrations.",
    ),
  },
  {
    title: t("home.processSteps.launch.title", "Launch"),
    text: t(
      "home.processSteps.launch.text",
      "We polish responsiveness, performance, SEO basics, testing, and deployment readiness.",
    ),
  },
];

const fallbackLogoItems = (t) => [
  t("home.logoFallback.websites", "Websites"),
  t("home.logoFallback.portals", "Portals"),
  t("home.logoFallback.bookings", "Bookings"),
  t("home.logoFallback.dashboards", "Dashboards"),
  t("home.logoFallback.stores", "Stores"),
];

const BlogCard = ({ post, t, language }) => {
  const formattedDate = formatDate(
    post.publishedAt || post.createdAt,
    language,
  );
  const image = getText(
    post.featuredImageUrl,
    post.imageUrl,
    post.coverImageUrl,
  );

  const title = getText(post.title, t("blog.untitled", "Untitled article"));
  const excerpt = getText(post.excerpt, post.summary, post.description);

  return (
    <article className="premium-blog-card">
      {image && (
        <Link to={`/blog/${post.slug}`} className="premium-blog-card__image">
          <img src={image} alt={title} loading="lazy" />
        </Link>
      )}

      <div className="premium-blog-card__content">
        <div className="premium-blog-card__meta">
          {post.category && (
            <span className="premium-blog-card__category">{post.category}</span>
          )}
          {formattedDate && (
            <span className="premium-blog-card__date">{formattedDate}</span>
          )}
        </div>

        <h3 className="premium-blog-card__title">
          <Link to={`/blog/${post.slug}`}>{title}</Link>
        </h3>

        {excerpt && (
          <p className="premium-blog-card__excerpt">
            {excerpt.length > 120 ? `${excerpt.substring(0, 120)}...` : excerpt}
          </p>
        )}

        <Link to={`/blog/${post.slug}`} className="premium-blog-card__link">
          {t("blog.readArticle", "Read article")} →
        </Link>
      </div>
    </article>
  );
};

export default function HomePage() {
  const { language, t } = useLanguage();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);

  const hero = useFetchOnMount(
    () =>
      heroService.getHeroSections({
        language,
        placement: "HOME",
        featuredOnly: true,
      }),
    [language],
  );

  const services = useFetchOnMount(
    () =>
      serviceCatalogService.getServices({
        language,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [language],
  );

  const portfolio = useFetchOnMount(
    () =>
      portfolioService.getProjects({
        language,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [language],
  );

  const products = useFetchOnMount(
    () =>
      productBlueprintService.getProductBlueprints({
        language,
        featuredOnly: true,
        page: 0,
        size: 3,
      }),
    [language],
  );

  const testimonials = useFetchOnMount(
    () =>
      testimonialService.getTestimonials({
        language,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [language],
  );

  const clientLogos = useFetchOnMount(
    () =>
      clientLogoService.getClientLogos({
        language,
        featuredOnly: true,
        page: 0,
        size: 12,
      }),
    [language],
  );

  useEffect(() => {
    let active = true;

    const loadFeaturedPosts = async () => {
      try {
        setBlogLoading(true);
        const data = await blogService.getFeaturedPosts({ language });
        const list = normalizeList(data);

        if (active) {
          setFeaturedPosts(list.slice(0, 3));
        }
      } catch (error) {
        console.error(
          t("blog.loadError", "Failed to load featured posts."),
          error,
        );
        if (active) setFeaturedPosts([]);
      } finally {
        if (active) setBlogLoading(false);
      }
    };

    loadFeaturedPosts();

    return () => {
      active = false;
    };
  }, [language, t]);

  const heroItem = useMemo(
    () => normalizeList(hero.data)[0] || null,
    [hero.data],
  );

  const serviceItems = normalizeList(services.data);
  const projectItems = normalizeList(portfolio.data);
  const productItems = normalizeList(products.data);
  const testimonialItems = normalizeList(testimonials.data);
  const logoItems = normalizeList(clientLogos.data);

  const finalServices = serviceItems.length
    ? serviceItems
    : fallbackServices(t);
  const finalProjects = projectItems.length
    ? projectItems
    : fallbackProjects(t);
  const finalProducts = productItems.length
    ? productItems
    : fallbackProducts(t);
  const finalTestimonials = testimonialItems.length
    ? testimonialItems
    : fallbackTestimonials(t);
  const finalLogos = logoItems.length ? logoItems : [];

  const heroTitle = heroItem?.title || t("home.heroTitle");

  const heroSubtitle =
    heroItem?.subtitle || heroItem?.description || t("home.heroSubtitle");

  const heroImage = getImage(heroItem);

  const loading =
    hero.loading ||
    services.loading ||
    portfolio.loading ||
    products.loading ||
    testimonials.loading;

  return (
    <main className="premium-public-page premium-home-page">
      <section className="premium-hero premium-home-hero">
        <div className="premium-container premium-hero-grid">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="premium-hero-copy"
          >
            <motion.span variants={fadeUp} className="premium-eyebrow">
              {t("home.eyebrow")}
            </motion.span>

            <motion.h1 variants={fadeUp}>{heroTitle}</motion.h1>

            <motion.p variants={fadeUp} className="premium-hero-text">
              {heroSubtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="premium-actions">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                {t("common.contactUs")}
              </Link>

              <Link to="/services" className="premium-btn premium-btn-ghost">
                {t("nav.services")}
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="premium-stats">
              <div>
                <strong>
                  <CountUpNumber value={50} suffix="+" />
                </strong>
                <span>{t("home.statsProjects")}</span>
              </div>

              <div>
                <strong>
                  <CountUpNumber value={7} />
                </strong>
                <span>{t("home.statsServices")}</span>
              </div>

              <div>
                <strong>
                  <CountUpNumber value={100} suffix="%" />
                </strong>
                <span>{t("home.statsBusiness")}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className={`premium-hero-visual ${
              !heroImage ? "premium-hero-visual--empty" : ""
            }`}
          >
            {heroImage && (
              <PremiumImage
                src={heroImage}
                alt={heroTitle}
                className="premium-hero-img"
                eager
              />
            )}

            <div className="premium-dashboard-card">
              <span>{t("home.heroPanelEyebrow", "Built for growth")}</span>
              <h2>
                {t(
                  "home.heroPanelTitle",
                  "Websites, dashboards, portals, and launch-ready systems.",
                )}
              </h2>

              <div className="premium-dashboard-list">
                <div>
                  <span>{t("home.heroPanelItem1", "Frontend")}</span>
                  <strong>{t("home.heroPanelStatus", "Great")}</strong>
                </div>
                <div>
                  <span>{t("home.heroPanelItem2", "Backend")}</span>
                  <strong>{t("home.heroPanelStatus", "Great")}</strong>
                </div>
                <div>
                  <span>{t("home.heroPanelItem3", "Content")}</span>
                  <strong>{t("home.heroPanelStatus", "Great")}</strong>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {loading && (
        <section className="premium-container">
          <div className="premium-loading premium-loading-modern">
            <span className="premium-loading-dot" />
            {t("common.loading")}
          </div>
        </section>
      )}

      <motion.section
        className="premium-logo-strip"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container">
          <span>
            {t(
              "home.trustIntro",
              "Built for brands that need more than a basic website",
            )}
          </span>

          {finalLogos.length > 0 ? (
            <div className="premium-logo-grid">
              {finalLogos.slice(0, 10).map((logo, index) => {
                const name = getText(
                  logo.name,
                  logo.clientName,
                  `${t("home.client")} ${index + 1}`,
                );
                const image = getImage(logo);

                return (
                  <div key={logo.id || name} className="premium-logo-card">
                    <PremiumImage
                      src={image}
                      alt={name}
                      className="premium-logo-img"
                    />
                    {!image && <strong>{name}</strong>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="premium-logo-grid">
              {fallbackLogoItems(t).map((item) => (
                <div key={item} className="premium-logo-card">
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        className="premium-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">{t("home.whatWeDo")}</span>
            <h2>{t("sections.services.title")}</h2>
            <p>{t("sections.services.description")}</p>
          </div>

          <div className="premium-card-grid">
            {finalServices.slice(0, 6).map((service, index) => {
              const title = getText(
                service.title,
                service.name,
                t("home.service"),
              );
              const summary = getText(
                service.summary,
                service.shortDescription,
                service.description,
                t("home.serviceDescription"),
              );
              const image = getImage(service);

              return (
                <motion.article
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  key={service.id || title}
                  className="premium-service-card"
                >
                  <PremiumImage
                    src={image}
                    alt={title}
                    className="premium-card-image"
                  />

                  <div className="premium-card-body">
                    <div className="premium-icon">
                      {(() => {
                        const iconMap = {
                          code: "💻",
                          workflow: "⚙️",
                          target: "🎯",
                          "shopping-cart": "🛒",
                          search: "🔎",
                          layers: "🧩",
                          smartphone: "📱",
                        };
                        const key =
                          service.iconKey ||
                          service.icon_key ||
                          service.icon ||
                          "";
                        return (
                          iconMap[key] ||
                          ["🚀", "⚙️", "📊", "🎨", "💻", "📱"][index % 6]
                        );
                      })()}
                    </div>
                    <h3>{title}</h3>
                    <p>{summary}</p>

                    {(service.timeline || service.highlights) && (
                      <div className="premium-service-highlights">
                        {service.timeline && (
                          <div className="premium-service-highlights__timeline">
                            {t("services.timeline")}: {service.timeline}
                          </div>
                        )}
                        {service.highlights && (
                          <div className="premium-service-highlights__preview">
                            {service.highlights}
                          </div>
                        )}
                      </div>
                    )}

                    <Link to="/services" className="premium-text-link">
                      {t("common.learnMore")} →
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="premium-section premium-section-dark"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container premium-split">
          <div>
            <span className="premium-eyebrow premium-eyebrow--light">
              {t("home.processEyebrow", "How we build")}
            </span>
            <h2>
              {t(
                "home.processTitle",
                "A clear process from idea to launch-ready system.",
              )}
            </h2>
            <p>
              {t(
                "home.processDescription",
                "We do not just design screens. We structure the business flow, content, backend data, admin management, and user experience together.",
              )}
            </p>
          </div>

          <div className="premium-blueprint-panel">
            {processSteps(t).map((step, index) => (
              <div key={step.title} className="premium-blueprint-item">
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="premium-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container">
          <div className="premium-section-head premium-section-head-row">
            <div>
              <span className="premium-eyebrow">{t("home.selectedWork")}</span>
              <h2>{t("sections.portfolio.title")}</h2>
            </div>

            <Link to="/portfolio" className="premium-btn premium-btn-ghost">
              {t("common.viewAll")}
            </Link>
          </div>

          <div className="premium-work-grid">
            {finalProjects.slice(0, 6).map((project) => {
              const title = getText(
                project.title,
                project.name,
                t("home.portfolioProject"),
              );
              const summary = getText(
                project.summary,
                project.description,
                t("home.portfolioSummary"),
              );
              const image = getImage(project);

              return (
                <Link
                  key={project.id || title}
                  to={
                    project.slug ? `/portfolio/${project.slug}` : "/portfolio"
                  }
                  className="premium-work-card"
                >
                  <PremiumImage
                    src={image}
                    alt={title}
                    className="premium-work-image"
                  />

                  {!image && (
                    <div className="premium-work-image premium-fallback-media">
                      <span aria-hidden="true">✦</span>
                    </div>
                  )}

                  <div>
                    <h3>{title}</h3>
                    <p>{summary}</p>
                    <span>{t("common.viewDetails")} →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="premium-section premium-section-dark"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container premium-split">
          <div>
            <span className="premium-eyebrow premium-eyebrow--light">
              {t("home.productDirection")}
            </span>
            <h2>{t("home.productTitle")}</h2>
            <p>
              {t(
                "home.productSubtitle",
                "Use InkFront product blueprints to define the pages, features, content, admin flow, and launch direction before development begins.",
              )}
            </p>
          </div>

          <div className="premium-blueprint-panel">
            {finalProducts.slice(0, 3).map((product, index) => {
              const title = getText(
                product.title,
                product.name,
                t("home.productBlueprint"),
              );
              const summary = getText(
                product.summary,
                product.description,
                t("home.productBlueprintSummary"),
              );

              return (
                <Link
                  key={product.id || title}
                  to={product.slug ? `/products/${product.slug}` : "/products"}
                  className="premium-blueprint-item"
                >
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                  <div>
                    <h3>{title}</h3>
                    <p>{summary}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.section>

      {!blogLoading && featuredPosts.length > 0 && (
        <motion.section
          className="premium-section"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container">
            <div className="premium-section-head premium-section-head-row">
              <div>
                <span className="premium-eyebrow">
                  {t("blog.latest", "Latest insights")}
                </span>
                <h2>{t("blog.fromOurBlog", "From our blog")}</h2>
              </div>

              <Link to="/blog" className="premium-btn premium-btn-ghost">
                {t("common.viewAll")} →
              </Link>
            </div>

            <div className="premium-blog-grid">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post.id || post.slug || index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <BlogCard post={post} t={t} language={language} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      <motion.section
        className="premium-section premium-testimonial-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">
              {t("home.clientConfidence")}
            </span>
            <h2>{t("sections.testimonials.title")}</h2>
            <p>{t("home.testimonialSubtitle")}</p>
          </div>

          <div className="premium-testimonial-grid">
            {finalTestimonials.slice(0, 4).map((testimonial) => {
              const name = getText(
                testimonial.clientName,
                testimonial.name,
                testimonial.author,
                t("home.client"),
              );
              const quote = getText(
                testimonial.quote,
                testimonial.content,
                testimonial.message,
                t("home.defaultQuote"),
              );
              const image = getImage(testimonial);

              return (
                <article
                  key={testimonial.id || name}
                  className="premium-testimonial-card"
                >
                  <div className="premium-quote-mark" aria-hidden="true">
                    “
                  </div>
                  <p>{quote}</p>
                  <div className="premium-person">
                    {image ? (
                      <PremiumImage
                        src={image}
                        alt={name}
                        className="premium-avatar"
                      />
                    ) : (
                      <div className="premium-avatar premium-avatar-fallback">
                        {name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <strong>{name}</strong>
                      <span>
                        {testimonial.role ||
                          testimonial.position ||
                          t("home.happyClient")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="premium-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container">
          <div className="premium-services-banner">
            <span className="premium-services-banner__icon" aria-hidden="true">
              ⚡
            </span>
            <h2 className="premium-services-banner__title">
              {t(
                "home.bannerTitle",
                "Need a website, portal, booking system, or full business platform?",
              )}
            </h2>
            <p className="premium-services-banner__text">
              {t(
                "home.bannerText",
                "InkFront can help you move from scattered ideas to a polished system with pages, content, backend data, authentication, admin tools, and responsive public experience.",
              )}
            </p>

            <div className="premium-actions premium-actions-center">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                {t("common.contactUs")}
              </Link>
              <Link to="/products" className="premium-btn premium-btn-ghost">
                {t("nav.products")}
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="premium-cta"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            {t("home.ready")}
          </span>
          <h2>{t("cta.home.title")}</h2>
          <p>{t("cta.home.description")}</p>
          <div className="premium-actions premium-actions-center">
            <Link to="/contact" className="premium-btn premium-btn-primary">
              {t("common.contactUs")}
            </Link>
            <Link to="/services" className="premium-btn premium-btn-light">
              {t("nav.services")}
            </Link>
          </div>
        </div>

        <div className="premium-container">
          <NewsletterSection />
        </div>
      </motion.section>
    </main>
  );
}
