import { useEffect, useMemo, useState, useRef, memo, useCallback } from "react";
import { LazyMotion, domAnimation, m, animate } from "framer-motion";
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

// ==================== CONSTANTS ====================

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const STAGGER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

const SECTION_REVEAL_VARIANTS = {
  hidden: { opacity: 0, y: 34 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const PORTFOLIO_IMAGE_MAP = {
  "edubridge-school-platform": "/images/portfolio/school.png",
  "skillbridge-learning-platform": "/images/portfolio/learn.png",
  "school-management-system": "/images/portfolio/school.png",
  "quickship-logistics-dashboard": "/images/portfolio/logistics.png",
  "logistics-management": "/images/portfolio/logistics.png",
  "halamart-marketplace": "/images/portfolio/market.png",
  "ecommerce-platform": "/images/portfolio/market.png",
  "payswift-bill-payments": "/images/portfolio/banking.png",
  "savewise-investment-platform": "/images/portfolio/invest.png",
  "fintech-solution": "/images/portfolio/banking.png",
  "propertyfinder-real-estate": "/images/portfolio/realEstate2.png",
  "real-estate-platform": "/images/portfolio/realEstate2.png",
  "bloommusic-streaming": "/images/portfolio/music.png",
  "music-platform": "/images/portfolio/music.png",
  "medicare-facility-management": "/images/portfolio/health.png",
  "healthcare-system": "/images/portfolio/health.png",
  "farmconnect-agritech-marketplace": "/images/portfolio/agric.png",
  "agritech-platform": "/images/portfolio/agric.png",
  "eventwave-ticketing-platform": "/images/portfolio/ticket.png",
  "event-platform": "/images/portfolio/ticket.png",
  "churchflow-ministry-platform": "/images/portfolio/realEstate.png",
  "church-management": "/images/portfolio/realEstate.png",
  "business-management": "/images/portfolio/business.png",
  "enterprise-solution": "/images/portfolio/business.png",
  "client-portal": "/images/portfolio/business.png",
  "agency-website-platform": "/images/portfolio/business.png",
  "booking-management-system": "/images/portfolio/market.png",
};

const DEFAULT_IMAGES = [
  "/images/portfolio/business.png",
  "/images/portfolio/agric.png",
  "/images/portfolio/banking.png",
  "/images/portfolio/health.png",
  "/images/portfolio/invest.png",
  "/images/portfolio/learn.png",
  "/images/portfolio/logistics.png",
  "/images/portfolio/market.png",
  "/images/portfolio/music.png",
  "/images/portfolio/realEstate.png",
  "/images/portfolio/realEstate2.png",
  "/images/portfolio/ticket.png",
  "/images/portfolio/school.png",
];

// ==================== UTILITY FUNCTIONS ====================

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

const optimizeImageUrl = (url) => {
  if (!url) return url;

  if (url.includes("images.unsplash.com")) {
    const hasParams = url.includes("?");
    return `${url}${hasParams ? "&" : "?"}auto=format&fit=crop&w=1600&q=80`;
  }

  if (url.includes("cloudinary.com")) {
    return url;
  }

  return url;
};

const getPortfolioImage = (project, index) => {
  const projectImage = getImage(project);

  if (
    projectImage &&
    !projectImage.includes("pollinations") &&
    projectImage.includes("/")
  ) {
    return projectImage;
  }

  if (project.slug && PORTFOLIO_IMAGE_MAP[project.slug]) {
    return PORTFOLIO_IMAGE_MAP[project.slug];
  }

  const category = (
    project.clientIndustry ||
    project.category ||
    project.projectType ||
    ""
  ).toLowerCase();
  const title = (project.title || project.name || "").toLowerCase();

  const categoryMap = {
    agric: ["agric", "farm", "agric"],
    banking: ["fintech", "bank", "pay", "finance"],
    market: ["ecommerce", "market", "shop", "store"],
    logistics: ["logistics", "ship", "delivery"],
    health: ["health", "medical", "hospital"],
    learn: ["education", "learn", "course", "school"],
    music: ["entertainment", "music", "stream"],
    realEstate2: ["estate", "property", "real estate"],
    ticket: ["event", "ticket", "booking"],
  };

  for (const [key, terms] of Object.entries(categoryMap)) {
    if (terms.some((term) => category.includes(term) || title.includes(term))) {
      const matchedKey = Object.keys(PORTFOLIO_IMAGE_MAP).find((k) =>
        k.includes(key),
      );
      if (matchedKey) return PORTFOLIO_IMAGE_MAP[matchedKey];
    }
  }

  return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
};

const formatDate = (value, language = "EN") => {
  if (!value) return "";

  const localeMap = { EN: "en", HA: "ha", IG: "ig", YO: "yo" };

  try {
    return new Intl.DateTimeFormat(localeMap[language] || "en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

const truncateText = (text, maxLength = 120) => {
  if (!text) return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// ==================== FALLBACK DATA ====================

const getFallbackServices = (t) => [
  {
    id: "web-dev",
    title: t("pages.home.fallbackServices.webDev"),
    summary: t("pages.home.fallbackServices.webDevSummary"),
    timeline: t("pages.home.fallbackServices.webDevTimeline", "7–21 days"),
    highlights: t(
      "pages.home.fallbackServices.webDevHighlights",
      "Landing pages, company websites, SEO structure, contact flow",
    ),
  },
  {
    id: "software",
    title: t("pages.home.fallbackServices.software"),
    summary: t("pages.home.fallbackServices.softwareSummary"),
    timeline: t("pages.home.fallbackServices.softwareTimeline", "3–8 weeks"),
    highlights: t(
      "pages.home.fallbackServices.softwareHighlights",
      "Admin panels, portals, booking flows, reporting dashboards",
    ),
  },
  {
    id: "strategy",
    title: t("pages.home.fallbackServices.strategy"),
    summary: t("pages.home.fallbackServices.strategySummary"),
    timeline: t("pages.home.fallbackServices.strategyTimeline", "3–10 days"),
    highlights: t(
      "pages.home.fallbackServices.strategyHighlights",
      "Offer structure, funnel planning, page mapping, launch plan",
    ),
  },
  {
    id: "ecommerce",
    title: t("pages.home.fallbackServices.ecommerce", "E-commerce Systems"),
    summary: t(
      "pages.home.fallbackServices.ecommerceSummary",
      "Online stores, product catalogues, order flows, and payment-ready shopping experiences.",
    ),
    timeline: t("pages.home.fallbackServices.ecommerceTimeline", "2–6 weeks"),
    highlights: t(
      "pages.home.fallbackServices.ecommerceHighlights",
      "Products, carts, checkout, order management",
    ),
  },
  {
    id: "booking",
    title: t("pages.home.fallbackServices.booking", "Booking Platforms"),
    summary: t(
      "pages.home.fallbackServices.bookingSummary",
      "Appointment, service, transport, and reservation systems with smooth user experience.",
    ),
    timeline: t("pages.home.fallbackServices.bookingTimeline", "2–5 weeks"),
    highlights: t(
      "pages.home.fallbackServices.bookingHighlights",
      "Scheduling, forms, admin management, notifications",
    ),
  },
  {
    id: "training",
    title: t("pages.home.fallbackServices.training", "Coding & Tech Training"),
    summary: t(
      "pages.home.fallbackServices.trainingSummary",
      "Practical training for teams, students, and founders who want to understand modern software.",
    ),
    timeline: t("pages.home.fallbackServices.trainingTimeline", "Flexible"),
    highlights: t(
      "pages.home.fallbackServices.trainingHighlights",
      "React, Spring Boot, web development, project-based learning",
    ),
  },
];

const getFallbackProjects = (t) => [
  {
    id: "agency-site",
    title: t("pages.home.fallbackProjects.agencySite"),
    summary: t("pages.home.fallbackProjects.agencySiteSummary"),
    slug: "agency-website-platform",
  },
  {
    id: "booking-system",
    title: t("pages.home.fallbackProjects.bookingSystem"),
    summary: t("pages.home.fallbackProjects.bookingSystemSummary"),
    slug: "booking-management-system",
  },
  {
    id: "client-portal",
    title: t("pages.home.fallbackProjects.clientPortal"),
    summary: t("pages.home.fallbackProjects.clientPortalSummary"),
    slug: "client-portal",
  },
];

const getFallbackProducts = (t) => [
  {
    id: "blueprint",
    title: t("pages.home.fallbackProducts.blueprint"),
    summary: t("pages.home.fallbackProducts.blueprintSummary"),
    slug: "product-blueprint",
  },
  {
    id: "business-site",
    title: t(
      "pages.home.fallbackProducts.businessSite",
      "Business Website Kit",
    ),
    summary: t(
      "pages.home.fallbackProducts.businessSiteSummary",
      "A premium website structure for brands that need credibility, pages, and lead capture.",
    ),
    slug: "business-website-kit",
  },
  {
    id: "portal-kit",
    title: t("pages.home.fallbackProducts.portalKit", "Client Portal Kit"),
    summary: t(
      "pages.home.fallbackProducts.portalKitSummary",
      "A secure customer portal foundation for dashboards, profiles, requests, and admin workflows.",
    ),
    slug: "client-portal-kit",
  },
];

const getFallbackTestimonials = (t) => [
  {
    id: "one",
    clientName: t("pages.home.fallbackTestimonials.client1.name"),
    role: t("pages.home.fallbackTestimonials.client1.role"),
    quote: t("pages.home.fallbackTestimonials.client1.quote"),
  },
  {
    id: "two",
    clientName: t("pages.home.fallbackTestimonials.client2.name"),
    role: t("pages.home.fallbackTestimonials.client2.role"),
    quote: t("pages.home.fallbackTestimonials.client2.quote"),
  },
];

const getProcessSteps = (t) => [
  {
    title: t("pages.home.processSteps.discover.title", "Discover"),
    text: t(
      "pages.home.processSteps.discover.text",
      "We clarify your business goals, audience, services, and the type of system you need.",
    ),
  },
  {
    title: t("pages.home.processSteps.structure.title", "Structure"),
    text: t(
      "pages.home.processSteps.structure.text",
      "We map the pages, content flow, admin needs, user journey, and backend data model.",
    ),
  },
  {
    title: t("pages.home.processSteps.build.title", "Build"),
    text: t(
      "pages.home.processSteps.build.text",
      "We develop the frontend, backend, content management, authentication, and integrations.",
    ),
  },
  {
    title: t("pages.home.processSteps.launch.title", "Launch"),
    text: t(
      "pages.home.processSteps.launch.text",
      "We polish responsiveness, performance, SEO basics, testing, and deployment readiness.",
    ),
  },
];

const getFallbackLogoItems = (t) => [
  t("pages.home.logoFallback.websites", "Websites"),
  t("pages.home.logoFallback.portals", "Portals"),
  t("pages.home.logoFallback.bookings", "Bookings"),
  t("pages.home.logoFallback.dashboards", "Dashboards"),
  t("pages.home.logoFallback.stores", "Stores"),
];

// ==================== COUNT UP NUMBER ====================

const CountUpNumber = memo(({ value, suffix = "", duration = 4.4 }) => {
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
});

CountUpNumber.displayName = "CountUpNumber";

// ==================== PREMIUM IMAGE ====================

const PremiumImage = memo(({ src, alt, className, eager = false, onError }) => {
  const [imageError, setImageError] = useState(false);
  const optimizedSrc = useMemo(() => optimizeImageUrl(src), [src]);

  if (!src || imageError) return null;

  return (
    <img
      src={optimizedSrc}
      alt={alt || ""}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      onError={(event) => {
        setImageError(true);
        if (onError) onError(event);
      }}
    />
  );
});

PremiumImage.displayName = "PremiumImage";

// ==================== SKELETON COMPONENTS ====================

const SectionSkeleton = memo(({ type = "card", count = 3 }) => {
  if (type === "card") {
    return (
      <div className="premium-card-grid skeleton-grid">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="premium-service-card skeleton-card">
            <div className="skeleton-image" />
            <div className="premium-card-body">
              <div className="skeleton-text skeleton-title" />
              <div className="skeleton-text skeleton-description" />
              <div className="skeleton-text skeleton-description" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "work") {
    return (
      <div className="premium-work-grid skeleton-grid">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="premium-work-card skeleton-card">
            <div className="skeleton-image" />
            <div className="premium-work-card__content">
              <div className="skeleton-text skeleton-title" />
              <div className="skeleton-text skeleton-description" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "blog") {
    return (
      <div className="premium-blog-grid skeleton-grid">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="premium-blog-card skeleton-card">
            <div className="skeleton-image" />
            <div className="premium-blog-card__content">
              <div className="skeleton-text skeleton-title" />
              <div className="skeleton-text skeleton-description" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
});

SectionSkeleton.displayName = "SectionSkeleton";

// ==================== SERVICE CARD ====================

const ServiceCard = memo(({ service, t }) => {
  const title = getText(
    service.title,
    service.name,
    t("pages.home.service", "Service"),
  );
  const summary = getText(
    service.summary,
    service.shortDescription,
    service.description,
    t(
      "pages.home.serviceDescription",
      "A professional service designed to support your business.",
    ),
  );
  const image = getImage(service);

  return (
    <m.article
      variants={FADE_UP_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="premium-service-card"
    >
      <PremiumImage src={image} alt={title} className="premium-card-image" />
      <div className="premium-card-body">
        <h3>{title}</h3>
        <p>{summary}</p>

        {(service.timeline || service.highlights) && (
          <div className="premium-service-highlights">
            {service.timeline && (
              <div className="premium-service-highlights__timeline">
                {t("common.timeline", "Timeline")}: {service.timeline}
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
          {t("common.learnMore", "Learn more")} →
        </Link>
      </div>
    </m.article>
  );
});

ServiceCard.displayName = "ServiceCard";

// ==================== PORTFOLIO CARD ====================

const PortfolioCard = memo(({ project, index, t }) => {
  const title = getText(
    project.title,
    project.name,
    t("pages.home.portfolioProject", "Portfolio project"),
  );
  const summary = getText(
    project.summary,
    project.description,
    t(
      "pages.home.portfolioSummary",
      "A clean digital project built for business impact.",
    ),
  );
  const image = getPortfolioImage(project, index);
  const link = project.slug ? `/portfolio/${project.slug}` : "/portfolio";
  const truncatedSummary = useMemo(() => truncateText(summary, 100), [summary]);

  return (
    <Link key={project.id || title} to={link} className="premium-work-card">
      <div className="premium-work-card__images">
        {image ? (
          <PremiumImage
            src={image}
            alt={title}
            className="premium-work-image"
          />
        ) : (
          <div
            className="premium-work-image premium-fallback-media"
            aria-hidden="true"
          >
            <span>✦</span>
          </div>
        )}
      </div>

      <div className="premium-work-card__content">
        <h3>{title}</h3>
        <p>{truncatedSummary}</p>
        <strong>{t("common.viewDetails", "View details")} →</strong>
      </div>
    </Link>
  );
});

PortfolioCard.displayName = "PortfolioCard";

// ==================== PRODUCT BLUEPRINT CARD ====================

const ProductBlueprintCard = memo(({ product, index, t }) => {
  const title = getText(
    product.title,
    product.name,
    t("pages.home.productBlueprint", "Product Blueprint"),
  );
  const summary = getText(
    product.summary,
    product.description,
    t(
      "pages.home.productBlueprintSummary",
      "Plan the offer, pages, features, and customer journey before development starts.",
    ),
  );
  const link = product.slug ? `/products/${product.slug}` : "/products";

  return (
    <Link to={link} className="premium-blueprint-item">
      <strong>{String(index + 1).padStart(2, "0")}</strong>
      <div>
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
    </Link>
  );
});

ProductBlueprintCard.displayName = "ProductBlueprintCard";

// ==================== BLOG CARD ====================

const BlogCard = memo(({ post, t, language }) => {
  const formattedDate = useMemo(
    () => formatDate(post.publishedAt || post.createdAt, language),
    [post.publishedAt, post.createdAt, language],
  );
  const image = getText(
    post.featuredImageUrl,
    post.imageUrl,
    post.coverImageUrl,
  );
  const title = getText(post.title, t("common.untitled", "Untitled article"));
  const excerpt = getText(post.excerpt, post.summary, post.description);
  const truncatedExcerpt = useMemo(() => truncateText(excerpt, 120), [excerpt]);

  return (
    <article className="premium-blog-card">
      {image && (
        <Link to={`/blog/${post.slug}`} className="premium-blog-card__image">
          <PremiumImage src={image} alt={title} />
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

        {truncatedExcerpt && (
          <p className="premium-blog-card__excerpt">{truncatedExcerpt}</p>
        )}

        <Link to={`/blog/${post.slug}`} className="premium-blog-card__link">
          {t("common.readArticle", "Read article")} →
        </Link>
      </div>
    </article>
  );
});

BlogCard.displayName = "BlogCard";

// ==================== CLIENT LOGO ====================

const ClientLogo = memo(({ logo, index, t }) => {
  const name = getText(
    logo.name,
    logo.clientName,
    `${t("pages.home.client", "Client")} ${index + 1}`,
  );
  const image = getImage(logo);

  return (
    <div className="premium-logo-card">
      <PremiumImage src={image} alt={name} className="premium-logo-img" />
      {!image && <strong>{name}</strong>}
    </div>
  );
});

ClientLogo.displayName = "ClientLogo";

// ==================== TESTIMONIAL CAROUSEL ====================

const TestimonialCarousel = memo(({ testimonials, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  }, [testimonials.length]);

  useEffect(() => {
    if (isPlaying && testimonials.length > 1) {
      intervalRef.current = setInterval(nextSlide, 6000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, testimonials.length, nextSlide]);

  const handleMouseEnter = useCallback(() => setIsPlaying(false), []);
  const handleMouseLeave = useCallback(() => setIsPlaying(true), []);

  if (!testimonials.length) return null;

  return (
    <div
      className="premium-testimonial-carousel"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="premium-carousel-container">
        <button
          className="premium-carousel-nav premium-carousel-prev"
          onClick={prevSlide}
          aria-label="Previous testimonial"
        >
          ←
        </button>

        <div className="premium-carousel-track">
          {testimonials.map((testimonial, index) => {
            const name = getText(
              testimonial.clientName,
              testimonial.name,
              testimonial.author,
              t("pages.home.client", "Client"),
            );
            const quote = getText(
              testimonial.quote,
              testimonial.content,
              testimonial.message,
              t(
                "pages.home.defaultQuote",
                "A polished platform that helps the business look more professional online.",
              ),
            );
            const image = getImage(testimonial);
            const role =
              testimonial.role ||
              testimonial.position ||
              t("pages.home.happyClient", "Happy Client");

            return (
              <m.div
                key={testimonial.id || name + index}
                className={`premium-carousel-slide ${index === currentIndex ? "active" : ""}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: index === currentIndex ? 1 : 0,
                  x: index === currentIndex ? 0 : 100,
                  display: index === currentIndex ? "block" : "none",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <article className="premium-testimonial-card premium-carousel-card">
                  <div className="premium-quote-mark" aria-hidden="true">
                    "
                  </div>
                  <p className="premium-testimonial-quote">{quote}</p>
                  <div className="premium-person">
                    {image ? (
                      <PremiumImage
                        src={image}
                        alt={name}
                        className="premium-avatar"
                      />
                    ) : (
                      <div
                        className="premium-avatar premium-avatar-fallback"
                        aria-hidden="true"
                      >
                        {name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <strong>{name}</strong>
                      <span>{role}</span>
                    </div>
                  </div>
                </article>
              </m.div>
            );
          })}
        </div>

        <button
          className="premium-carousel-nav premium-carousel-next"
          onClick={nextSlide}
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>

      {testimonials.length > 1 && (
        <div className="premium-carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`premium-carousel-dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TestimonialCarousel.displayName = "TestimonialCarousel";

// ==================== HOME HERO ====================

const HomeHero = memo(({ heroTitle, heroSubtitle, heroImage, t }) => {
  return (
    <section className="premium-hero premium-home-hero">
      <div className="premium-container premium-hero-grid">
        <m.div
          variants={STAGGER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="premium-hero-copy"
        >
          <m.span variants={FADE_UP_VARIANTS} className="premium-eyebrow">
            {t("pages.home.eyebrow")}
          </m.span>

          <m.h1 variants={FADE_UP_VARIANTS}>{heroTitle}</m.h1>

          <m.p variants={FADE_UP_VARIANTS} className="premium-hero-text">
            {heroSubtitle}
          </m.p>

          <m.div variants={FADE_UP_VARIANTS} className="premium-actions">
            <Link to="/contact" className="premium-btn premium-btn-primary">
              {t("common.contactUs", "Contact us")}
            </Link>
            <Link to="/services" className="premium-btn premium-btn-ghost">
              {t("nav.services", "Services")}
            </Link>
          </m.div>

          <m.div variants={FADE_UP_VARIANTS} className="premium-stats">
            <div>
              <strong>
                <CountUpNumber value={50} suffix="+" />
              </strong>
              <span>{t("pages.home.statsProjects")}</span>
            </div>
            <div>
              <strong>
                <CountUpNumber value={7} />
              </strong>
              <span>{t("pages.home.statsServices")}</span>
            </div>
            <div>
              <strong>
                <CountUpNumber value={100} suffix="%" />
              </strong>
              <span>{t("pages.home.statsBusiness")}</span>
            </div>
          </m.div>
        </m.div>

        <m.div
          variants={FADE_UP_VARIANTS}
          initial="hidden"
          animate="visible"
          className={`premium-hero-visual ${!heroImage ? "premium-hero-visual--empty" : ""}`}
        >
          {heroImage && (
            <PremiumImage
              src={heroImage}
              alt={heroTitle}
              className="premium-hero-img"
              eager
            />
          )}
        </m.div>
      </div>
    </section>
  );
});

HomeHero.displayName = "HomeHero";

// ==================== MAIN COMPONENT ====================

export default function HomePage() {
  const { language, t } = useLanguage();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);
  const [blogError, setBlogError] = useState("");

  // ==================== INDEPENDENT FETCHING ====================

  const hero = useFetchOnMount(
    () =>
      heroService.getHeroSections({
        language: language || "EN",
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
        featuredOnly: false,
        page: 0,
        size: 30,
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

  // ==================== BLOG FETCHING (INDEPENDENT) ====================

  useEffect(() => {
    let active = true;

    const loadFeaturedPosts = async () => {
      try {
        setBlogLoading(true);
        setBlogError("");
        const data = await blogService.getFeaturedPosts({ language });
        const list = normalizeList(data);

        if (active) {
          setFeaturedPosts(list.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to load featured posts.", error);
        if (active) {
          setFeaturedPosts([]);
          setBlogError(
            t("states.failedToLoadBlog", "Failed to load blog posts"),
          );
        }
      } finally {
        if (active) setBlogLoading(false);
      }
    };

    loadFeaturedPosts();

    return () => {
      active = false;
    };
  }, [language, t]);

  // ==================== MEMOIZED DATA ====================

  const heroData = useMemo(() => {
    let heroList = [];

    if (hero.data?.data && Array.isArray(hero.data.data)) {
      heroList = hero.data.data;
    } else if (Array.isArray(hero.data)) {
      heroList = hero.data;
    } else if (hero.data && typeof hero.data === "object") {
      for (let key in hero.data) {
        if (Array.isArray(hero.data[key])) {
          heroList = hero.data[key];
          break;
        }
      }
    }

    const languageHeroes = heroList.filter(
      (item) =>
        item.language === language || item.language === language.toUpperCase(),
    );

    if (languageHeroes.length === 0 && heroList.length > 0) return heroList[0];
    if (languageHeroes.length === 0) return null;

    const sortedHeroes = [...languageHeroes].sort(
      (a, b) =>
        (a.displayOrder || a.display_order || 0) -
        (b.displayOrder || b.display_order || 0),
    );

    return sortedHeroes[0] || null;
  }, [hero.data, language]);

  const heroTitle = heroData?.title || t("pages.home.heroTitle");
  const heroSubtitle =
    heroData?.subtitle || heroData?.description || t("pages.home.heroSubtitle");
  const heroImage =
    heroData?.backgroundImageUrl || heroData?.imageUrl || getImage(heroData);

  const serviceItems = useMemo(
    () => normalizeList(services.data),
    [services.data],
  );
  const projectItems = useMemo(
    () => normalizeList(portfolio.data),
    [portfolio.data],
  );
  const productItems = useMemo(
    () => normalizeList(products.data),
    [products.data],
  );
  const testimonialItems = useMemo(
    () => normalizeList(testimonials.data),
    [testimonials.data],
  );
  const logoItems = useMemo(
    () => normalizeList(clientLogos.data),
    [clientLogos.data],
  );

  const finalServices = serviceItems.length
    ? serviceItems
    : getFallbackServices(t);
  const finalProjects = projectItems.length
    ? projectItems
    : getFallbackProjects(t);
  const finalProducts = productItems.length
    ? productItems
    : getFallbackProducts(t);
  const finalTestimonials = testimonialItems.length
    ? testimonialItems
    : getFallbackTestimonials(t);
  const finalLogos = logoItems.length ? logoItems : [];
  const fallbackLogos = getFallbackLogoItems(t);

  const processSteps = useMemo(() => getProcessSteps(t), [t]);

  // ==================== LOADING & ERROR STATES ====================

  if (hero.loading) {
    return (
      <main className="premium-public-page premium-home-page">
        <section className="premium-hero premium-home-hero">
          <div className="premium-container premium-hero-grid">
            <div className="premium-hero-copy">
              <div className="skeleton-text skeleton-eyebrow" />
              <div className="skeleton-text skeleton-title-large" />
              <div className="skeleton-text skeleton-description" />
              <div className="skeleton-actions" />
            </div>
            <div className="premium-hero-visual">
              <div className="skeleton-image skeleton-hero-image" />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (hero.error) {
    return <ErrorState message={hero.error} />;
  }

  // ==================== RENDER ====================

  return (
    <LazyMotion features={domAnimation}>
      <main className="premium-public-page premium-home-page">
        <HomeHero
          heroTitle={heroTitle}
          heroSubtitle={heroSubtitle}
          heroImage={heroImage}
          t={t}
        />

        {/* TRUSTED BRANDS */}
        <m.section
          className="premium-logo-strip"
          variants={SECTION_REVEAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container">
            <span>
              {t("pages.home.trustedBy", "Trusted by growing brands")}
            </span>

            <div className="premium-logo-grid">
              {finalLogos.length > 0
                ? finalLogos
                    .slice(0, 10)
                    .map((logo, index) => (
                      <ClientLogo
                        key={logo.id || index}
                        logo={logo}
                        index={index}
                        t={t}
                      />
                    ))
                : fallbackLogos.map((item) => (
                    <div key={item} className="premium-logo-card">
                      <strong>{item}</strong>
                    </div>
                  ))}
            </div>
          </div>
        </m.section>

        {/* SERVICES */}
        <m.section
          className="premium-section"
          variants={SECTION_REVEAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container">
            <div className="premium-section-head">
              <span className="premium-eyebrow">
                {t("pages.home.whatWeDo")}
              </span>
              <h2>{t("sections.services.title", "Services")}</h2>
              <p>
                {t(
                  "sections.services.description",
                  "Core service capabilities for modern software delivery.",
                )}
              </p>
            </div>

            {services.loading ? (
              <SectionSkeleton type="card" count={6} />
            ) : services.error ? (
              <div className="premium-empty-card">
                <strong>{t("states.error", "Something went wrong")}</strong>
                <p>{services.error}</p>
              </div>
            ) : (
              <div className="premium-card-grid">
                {finalServices.slice(0, 6).map((service) => (
                  <ServiceCard
                    key={service.id || getText(service.title)}
                    service={service}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </m.section>

        {/* PROCESS */}
        <m.section
          className="premium-section premium-section-dark"
          variants={SECTION_REVEAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container premium-split">
            <div>
              <span className="premium-eyebrow premium-eyebrow--light">
                {t("pages.home.processEyebrow", "How we build")}
              </span>
              <h2>
                {t(
                  "pages.home.processTitle",
                  "A clear process from idea to launch-ready system.",
                )}
              </h2>
              <p>
                {t(
                  "pages.home.processDescription",
                  "We do not just design screens. We structure the business flow, content, backend data, admin management, and user experience together.",
                )}
              </p>
            </div>

            <div className="premium-blueprint-panel">
              {processSteps.map((step, index) => (
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
        </m.section>

        {/* PORTFOLIO */}
        <m.section
          className="premium-section"
          variants={SECTION_REVEAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container">
            <div className="premium-section-head premium-section-head-row">
              <div>
                <span className="premium-eyebrow">
                  {t("pages.home.selectedWork")}
                </span>
                <h2>{t("sections.portfolio.title", "Portfolio")}</h2>
              </div>
              <Link to="/portfolio" className="premium-btn premium-btn-ghost">
                {t("common.viewAll", "View all")}
              </Link>
            </div>

            {portfolio.loading ? (
              <SectionSkeleton type="work" count={6} />
            ) : portfolio.error ? (
              <div className="premium-empty-card">
                <strong>{t("states.error", "Something went wrong")}</strong>
                <p>{portfolio.error}</p>
              </div>
            ) : (
              <div className="premium-work-grid">
                {finalProjects.slice(0, 6).map((project, index) => (
                  <PortfolioCard
                    key={project.id || index}
                    project={project}
                    index={index}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>
        </m.section>

        {/* PRODUCTS */}
        <m.section
          className="premium-section premium-section-dark"
          variants={SECTION_REVEAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container premium-split">
            <div>
              <span className="premium-eyebrow premium-eyebrow--light">
                {t("pages.home.productDirection")}
              </span>
              <h2>{t("pages.home.productTitle")}</h2>
              <p>
                {t(
                  "pages.home.productSubtitle",
                  "Use InkFront product blueprints to define the pages, features, content, admin flow, and launch direction before development begins.",
                )}
              </p>
            </div>

            <div className="premium-blueprint-panel">
              {products.loading ? (
                <div className="skeleton-blueprint-items">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="premium-blueprint-item skeleton-blueprint"
                    >
                      <div className="skeleton-text skeleton-title" />
                      <div className="skeleton-text skeleton-description" />
                    </div>
                  ))}
                </div>
              ) : products.error ? (
                <div className="premium-empty-card">
                  <strong>{t("states.error", "Something went wrong")}</strong>
                  <p>{products.error}</p>
                </div>
              ) : (
                finalProducts
                  .slice(0, 3)
                  .map((product, index) => (
                    <ProductBlueprintCard
                      key={product.id || index}
                      product={product}
                      index={index}
                      t={t}
                    />
                  ))
              )}
            </div>
          </div>
        </m.section>

        {/* BLOG */}
        {!blogLoading && !blogError && featuredPosts.length > 0 && (
          <m.section
            className="premium-section"
            variants={SECTION_REVEAL_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
          >
            <div className="premium-container">
              <div className="premium-section-head premium-section-head-row">
                <div>
                  <span className="premium-eyebrow">
                    {t("blog.latestInsights", "Latest insights")}
                  </span>
                  <h2>{t("blog.fromOurBlog", "From our blog")}</h2>
                </div>
                <Link to="/blog" className="premium-btn premium-btn-ghost">
                  {t("common.viewAll", "View all")} →
                </Link>
              </div>

              {blogLoading ? (
                <SectionSkeleton type="blog" count={3} />
              ) : (
                <div className="premium-blog-grid">
                  {featuredPosts.slice(0, 3).map((post, index) => (
                    <m.div
                      key={post.id || post.slug || index}
                      variants={FADE_UP_VARIANTS}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                    >
                      <BlogCard post={post} t={t} language={language} />
                    </m.div>
                  ))}
                </div>
              )}
            </div>
          </m.section>
        )}

        {/* TESTIMONIALS */}
        <m.section
          className="premium-section premium-testimonial-section"
          variants={SECTION_REVEAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container">
            <div className="premium-section-head">
              <span className="premium-eyebrow">
                {t("pages.home.clientConfidence")}
              </span>
              <h2>{t("sections.testimonials.title", "What clients say")}</h2>
              <p>{t("pages.home.testimonialSubtitle")}</p>
            </div>

            {testimonials.loading ? (
              <div className="testimonial-skeleton">
                <div className="skeleton-text skeleton-quote" />
                <div className="skeleton-text skeleton-description" />
                <div className="skeleton-person" />
              </div>
            ) : testimonials.error ? (
              <div className="premium-empty-card">
                <strong>{t("states.error", "Something went wrong")}</strong>
                <p>{testimonials.error}</p>
              </div>
            ) : (
              <TestimonialCarousel testimonials={finalTestimonials} t={t} />
            )}
          </div>
        </m.section>

        {/* BANNER */}
        <m.section
          className="premium-section"
          variants={SECTION_REVEAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container">
            <div className="premium-services-banner">
              <h2 className="premium-services-banner__title">
                {t(
                  "pages.home.bannerTitle",
                  "Need a website, portal, booking system, or full business platform?",
                )}
              </h2>
              <p className="premium-services-banner__text">
                {t(
                  "pages.home.bannerText",
                  "InkFront can help you move from scattered ideas to a polished system with pages, content, backend data, authentication, admin tools, and responsive public experience.",
                )}
              </p>

              <div className="premium-actions premium-actions-center">
                <Link to="/contact" className="premium-btn premium-btn-primary">
                  {t("common.contactUs", "Contact us")}
                </Link>
                <Link to="/products" className="premium-btn premium-btn-ghost">
                  {t("nav.products", "Products")}
                </Link>
              </div>
            </div>
          </div>
        </m.section>

        {/* CTA */}
        <m.section
          className="premium-cta"
          variants={SECTION_REVEAL_VARIANTS}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container premium-cta-inner">
            <span className="premium-eyebrow premium-eyebrow--light">
              {t("pages.home.ready")}
            </span>
            <h2>
              {t(
                "cta.home.title",
                "Ready to build something clear, useful, and scalable?",
              )}
            </h2>
            <p>
              {t(
                "cta.home.description",
                "Let's shape the next version of your product, platform, or digital experience.",
              )}
            </p>
            <div className="premium-actions premium-actions-center">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                {t("common.contactUs", "Contact us")}
              </Link>
              <Link to="/services" className="premium-btn premium-btn-ghost">
                {t("nav.services", "Services")}
              </Link>
            </div>
          </div>

          <div className="premium-container">
            <NewsletterSection />
          </div>
        </m.section>
      </main>
    </LazyMotion>
  );
}

// ==================== ERROR STATE ====================

import ErrorState from "../../components/common/ErrorState";

// ==================== CSS CLASSES NEEDED ====================
/*
  Add these CSS classes to your stylesheet:

  .skeleton-text {
    height: 14px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .skeleton-eyebrow {
    width: 120px;
    height: 16px;
  }

  .skeleton-title-large {
    height: 48px;
    width: 80%;
  }

  .skeleton-title {
    height: 20px;
    width: 70%;
  }

  .skeleton-description {
    width: 90%;
  }

  .skeleton-image {
    width: 100%;
    height: 200px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-hero-image {
    height: 400px;
    border-radius: 12px;
  }

  .skeleton-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .skeleton-actions > div {
    width: 120px;
    height: 44px;
    border-radius: 8px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-person {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .skeleton-person > div:first-child {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-quote {
    height: 60px;
    width: 60%;
  }

  .skeleton-grid {
    gap: 2rem;
  }

  .skeleton-card {
    background: #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
  }

  .skeleton-blueprint {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .skeleton-blueprint-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .testimonial-skeleton {
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 12px;
    max-width: 600px;
    margin: 0 auto;
  }
*/
