import { useEffect, useMemo, useState, useRef } from "react";
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

// Portfolio image mapping based on project slugs and categories
const portfolioImageMap = {
  "edubridge-school-platform": "/images/portfolio/school.jpg",
  "skillbridge-learning-platform": "/images/portfolio/learn.png",
  "school-management-system": "/images/portfolio/school.jpg",
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

const defaultImages = [
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
  "/images/portfolio/school.jpg",
];

function getPortfolioImage(project, index) {
  const projectImage = getImage(project);

  if (
    projectImage &&
    !projectImage.includes("pollinations") &&
    projectImage.includes("/")
  ) {
    return projectImage;
  }

  if (project.slug && portfolioImageMap[project.slug]) {
    return portfolioImageMap[project.slug];
  }

  const category = (
    project.clientIndustry ||
    project.category ||
    project.projectType ||
    ""
  ).toLowerCase();
  const title = (project.title || project.name || "").toLowerCase();

  if (
    category.includes("agric") ||
    title.includes("farm") ||
    title.includes("agric")
  ) {
    return "/images/portfolio/agric.png";
  }
  if (
    category.includes("fintech") ||
    title.includes("bank") ||
    title.includes("pay") ||
    title.includes("finance")
  ) {
    return "/images/portfolio/banking.png";
  }
  if (
    category.includes("ecommerce") ||
    title.includes("market") ||
    title.includes("shop") ||
    title.includes("store")
  ) {
    return "/images/portfolio/market.png";
  }
  if (
    category.includes("logistics") ||
    title.includes("ship") ||
    title.includes("delivery")
  ) {
    return "/images/portfolio/logistics.png";
  }
  if (
    category.includes("health") ||
    title.includes("medical") ||
    title.includes("hospital")
  ) {
    return "/images/portfolio/health.png";
  }
  if (
    category.includes("education") ||
    title.includes("learn") ||
    title.includes("course") ||
    title.includes("school")
  ) {
    return "/images/portfolio/learn.png";
  }
  if (
    category.includes("entertainment") ||
    title.includes("music") ||
    title.includes("stream")
  ) {
    return "/images/portfolio/music.png";
  }
  if (
    category.includes("estate") ||
    title.includes("property") ||
    title.includes("real estate")
  ) {
    return "/images/portfolio/realEstate2.png";
  }
  if (
    category.includes("event") ||
    title.includes("ticket") ||
    title.includes("booking")
  ) {
    return "/images/portfolio/ticket.png";
  }

  return defaultImages[index % defaultImages.length];
}

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
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) return null;

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={(event) => {
        console.warn(`Failed to load image: ${src}`);
        setImageError(true);
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

const fallbackProjects = (t) => [
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

const fallbackProducts = (t) => [
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

const fallbackTestimonials = (t) => [
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

const processSteps = (t) => [
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

const fallbackLogoItems = (t) => [
  t("pages.home.logoFallback.websites", "Websites"),
  t("pages.home.logoFallback.portals", "Portals"),
  t("pages.home.logoFallback.bookings", "Bookings"),
  t("pages.home.logoFallback.dashboards", "Dashboards"),
  t("pages.home.logoFallback.stores", "Stores"),
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

  const title = getText(post.title, t("common.untitled", "Untitled article"));
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
          {t("common.readArticle", "Read article")} →
        </Link>
      </div>
    </article>
  );
};

const TestimonialCarousel = ({ testimonials, t }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying && testimonials.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 6000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, testimonials.length]);

  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      if (isPlaying && testimonials.length > 1) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 6000);
      }
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

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
              <motion.div
                key={testimonial.id || name + index}
                className={`premium-carousel-slide ${
                  index === currentIndex ? "active" : ""
                }`}
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
                    “
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
                      <div className="premium-avatar premium-avatar-fallback">
                        {name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <strong>{name}</strong>
                      <span>{role}</span>
                    </div>
                  </div>
                </article>
              </motion.div>
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
              className={`premium-carousel-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function HomePage() {
  const { language, t } = useLanguage();
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [blogLoading, setBlogLoading] = useState(true);

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
        console.error("Failed to load featured posts.", error);
        if (active) setFeaturedPosts([]);
      } finally {
        if (active) setBlogLoading(false);
      }
    };

    loadFeaturedPosts();

    return () => {
      active = false;
    };
  }, [language]);

  const heroItem = useMemo(() => {
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

  const heroTitle = heroItem?.title || t("pages.home.heroTitle");
  const heroSubtitle =
    heroItem?.subtitle || heroItem?.description || t("pages.home.heroSubtitle");
  const heroImage =
    heroItem?.backgroundImageUrl || heroItem?.imageUrl || getImage(heroItem);

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
              {t("pages.home.eyebrow")}
            </motion.span>

            <motion.h1 variants={fadeUp}>{heroTitle}</motion.h1>

            <motion.p variants={fadeUp} className="premium-hero-text">
              {heroSubtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="premium-actions">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                {t("common.contactUs", "Contact us")}
              </Link>
              <Link to="/services" className="premium-btn premium-btn-ghost">
                {t("nav.services", "Services")}
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="premium-stats">
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
              <span>
                {t("pages.home.heroPanelEyebrow", "Built for growth")}
              </span>
              <h2>
                {t(
                  "pages.home.heroPanelTitle",
                  "Websites, dashboards, portals, and launch-ready systems.",
                )}
              </h2>
              <div className="premium-dashboard-list">
                <div>
                  <span>{t("pages.home.heroPanelItem1", "Frontend")}</span>
                  <strong>{t("pages.home.heroPanelStatus", "Great")}</strong>
                </div>
                <div>
                  <span>{t("pages.home.heroPanelItem2", "Backend")}</span>
                  <strong>{t("pages.home.heroPanelStatus", "Great")}</strong>
                </div>
                <div>
                  <span>{t("pages.home.heroPanelItem3", "Content")}</span>
                  <strong>{t("pages.home.heroPanelStatus", "Great")}</strong>
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
            {t("common.loading", "Loading...")}
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
          <span>{t("pages.home.trustedBy", "Trusted by growing brands")}</span>

          {finalLogos.length > 0 ? (
            <div className="premium-logo-grid">
              {finalLogos.slice(0, 10).map((logo, index) => {
                const name = getText(
                  logo.name,
                  logo.clientName,
                  `${t("pages.home.client", "Client")} ${index + 1}`,
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
            <span className="premium-eyebrow">{t("pages.home.whatWeDo")}</span>
            <h2>{t("sections.services.title", "Services")}</h2>
            <p>
              {t(
                "sections.services.description",
                "Core service capabilities for modern software delivery.",
              )}
            </p>
          </div>

          <div className="premium-card-grid">
            {finalServices.slice(0, 6).map((service, index) => {
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
                    <h3>{title}</h3>
                    <p>{summary}</p>

                    {(service.timeline || service.highlights) && (
                      <div className="premium-service-highlights">
                        {service.timeline && (
                          <div className="premium-service-highlights__timeline">
                            {t("common.timeline", "Timeline")}:{" "}
                            {service.timeline}
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
              <span className="premium-eyebrow">
                {t("pages.home.selectedWork")}
              </span>
              <h2>{t("sections.portfolio.title", "Portfolio")}</h2>
            </div>
            <Link to="/portfolio" className="premium-btn premium-btn-ghost">
              {t("common.viewAll", "View all")}
            </Link>
          </div>

          <div className="premium-work-grid">
            {finalProjects.slice(0, 6).map((project, index) => {
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

              return (
                <Link
                  key={project.id || title}
                  to={
                    project.slug ? `/portfolio/${project.slug}` : "/portfolio"
                  }
                  className="premium-work-card"
                >
                  <div className="premium-work-card__images">
                    {image ? (
                      <img
                        src={image}
                        alt={title}
                        className="premium-work-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="premium-work-image premium-fallback-media">
                        <span aria-hidden="true">✦</span>
                      </div>
                    )}
                  </div>

                  <div className="premium-work-card__content">
                    <h3>{title}</h3>
                    <p>
                      {summary && summary.length > 100
                        ? summary.substring(0, 100) + "..."
                        : summary}
                    </p>
                    <strong>{t("common.viewDetails", "View details")} →</strong>
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
            {finalProducts.slice(0, 3).map((product, index) => {
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
                  {t("common.latestInsights", "Latest insights")}
                </span>
                <h2>{t("common.fromOurBlog", "From our blog")}</h2>
              </div>
              <Link to="/blog" className="premium-btn premium-btn-ghost">
                {t("common.viewAll", "View all")} →
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
              {t("pages.home.clientConfidence")}
            </span>
            <h2>{t("sections.testimonials.title", "What clients say")}</h2>
            <p>{t("pages.home.testimonialSubtitle")}</p>
          </div>

          <TestimonialCarousel testimonials={finalTestimonials} t={t} />
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
            <Link to="/services" className="premium-btn premium-btn-light">
              {t("nav.services", "Services")}
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
