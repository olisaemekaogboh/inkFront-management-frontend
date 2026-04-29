import { useEffect, useMemo, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
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
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const getText = (...values) =>
  values.find((value) => typeof value === "string" && value.trim()) || "";

const getImage = (item) =>
  getText(
    item?.imageUrl,
    item?.coverImageUrl,
    item?.thumbnailUrl,
    item?.logoUrl,
    item?.avatarUrl,
  );

function formatDate(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en", {
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
      alt={alt || "InkFront visual"}
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

// Blog Card Component
const BlogCard = ({ post }) => {
  const formattedDate = formatDate(post.publishedAt || post.createdAt);

  return (
    <article className="premium-blog-card">
      {post.featuredImageUrl && (
        <Link to={`/blog/${post.slug}`} className="premium-blog-card__image">
          <img src={post.featuredImageUrl} alt={post.title} loading="lazy" />
        </Link>
      )}
      <div className="premium-blog-card__content">
        <div className="premium-blog-card__meta">
          {post.category && (
            <span className="premium-blog-card__category">{post.category}</span>
          )}
          <span className="premium-blog-card__date">{formattedDate}</span>
        </div>
        <h3 className="premium-blog-card__title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && (
          <p className="premium-blog-card__excerpt">
            {post.excerpt.substring(0, 120)}...
          </p>
        )}
        <Link to={`/blog/${post.slug}`} className="premium-blog-card__link">
          Read article →
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

  // Fetch featured blog posts
  useEffect(() => {
    let active = true;

    const loadFeaturedPosts = async () => {
      try {
        setBlogLoading(true);
        const data = await blogService.getFeaturedPosts({ language });
        if (active && Array.isArray(data)) {
          setFeaturedPosts(data.slice(0, 3));
        } else if (active && data?.content) {
          setFeaturedPosts(data.content.slice(0, 3));
        } else {
          setFeaturedPosts([]);
        }
      } catch (error) {
        console.error("Failed to load featured posts:", error);
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
    : [
        {
          id: "web-dev",
          title: t("home.fallbackServices.webDev", "Website Development"),
          summary: t(
            "home.fallbackServices.webDevSummary",
            "Fast, responsive, SEO-ready websites built to help your business look trusted.",
          ),
        },
        {
          id: "software",
          title: t("home.fallbackServices.software", "Custom Software"),
          summary: t(
            "home.fallbackServices.softwareSummary",
            "Dashboards, booking systems, portals, and internal tools for real operations.",
          ),
        },
        {
          id: "strategy",
          title: t("home.fallbackServices.strategy", "Digital Strategy"),
          summary: t(
            "home.fallbackServices.strategySummary",
            "Clear product direction, conversion flow, and launch planning for your brand.",
          ),
        },
      ];

  const finalProjects = projectItems.length
    ? projectItems
    : [
        {
          id: "agency-site",
          title: t(
            "home.fallbackProjects.agencySite",
            "Agency Website Platform",
          ),
          summary: t(
            "home.fallbackProjects.agencySiteSummary",
            "A polished company website with service pages and lead capture.",
          ),
          slug: "agency-website-platform",
        },
        {
          id: "booking-system",
          title: t(
            "home.fallbackProjects.bookingSystem",
            "Booking Management System",
          ),
          summary: t(
            "home.fallbackProjects.bookingSystemSummary",
            "A clean booking flow for service-based businesses.",
          ),
          slug: "booking-management-system",
        },
        {
          id: "client-portal",
          title: t("home.fallbackProjects.clientPortal", "Client Portal"),
          summary: t(
            "home.fallbackProjects.clientPortalSummary",
            "A secure dashboard experience for clients and admins.",
          ),
          slug: "client-portal",
        },
      ];

  const finalProducts = productItems.length
    ? productItems
    : [
        {
          id: "blueprint",
          title: t("home.fallbackProducts.blueprint", "Product Blueprint"),
          summary: t(
            "home.fallbackProducts.blueprintSummary",
            "Map your idea, revenue model, user journey, and build roadmap before development.",
          ),
          slug: "product-blueprint",
        },
      ];

  const finalTestimonials = testimonialItems.length
    ? testimonialItems
    : [
        {
          id: "one",
          clientName: t(
            "home.fallbackTestimonials.client1.name",
            "InkFront Client",
          ),
          role: t("home.fallbackTestimonials.client1.role", "Business Owner"),
          quote: t(
            "home.fallbackTestimonials.client1.quote",
            "The platform gave our brand a professional online presence and made inquiries easier to manage.",
          ),
        },
        {
          id: "two",
          clientName: t(
            "home.fallbackTestimonials.client2.name",
            "Growth Client",
          ),
          role: t("home.fallbackTestimonials.client2.role", "Founder"),
          quote: t(
            "home.fallbackTestimonials.client2.quote",
            "Clean design, fast delivery, and a system that can grow with our business.",
          ),
        },
      ];

  const finalLogos = logoItems.length ? logoItems : [];

  const heroTitle =
    heroItem?.title ||
    t("home.heroTitle", "Build a premium digital presence for your business");

  const heroSubtitle =
    heroItem?.subtitle ||
    heroItem?.description ||
    t(
      "home.heroSubtitle",
      "InkFront designs and builds websites, product pages, portals, and business platforms that help your brand look trusted, convert leads, and scale online.",
    );

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
              {t("home.eyebrow", "InkFront Digital Systems")}
            </motion.span>

            <motion.h1 variants={fadeUp}>{heroTitle}</motion.h1>

            <motion.p variants={fadeUp} className="premium-hero-text">
              {heroSubtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="premium-actions">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                {t("common.contactUs", "Start a project")}
              </Link>

              <Link to="/services" className="premium-btn premium-btn-ghost">
                {t("nav.services", "Explore services")}
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="premium-stats">
              <div>
                <strong>
                  <CountUpNumber value={50} suffix="+" />
                </strong>
                <span>{t("home.statsProjects", "Projects")}</span>
              </div>

              <div>
                <strong>
                  <CountUpNumber value={7} />
                </strong>
                <span>{t("home.statsServices", "Core services")}</span>
              </div>

              <div>
                <strong>
                  <CountUpNumber value={100} suffix="%" />
                </strong>
                <span>{t("home.statsBusiness", "Business focused")}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {loading && (
        <section className="premium-container">
          <div className="premium-loading premium-loading-modern">
            <span className="premium-loading-dot" />
            {t("common.loading", "Loading latest InkFront content...")}
          </div>
        </section>
      )}

      <motion.section
        className="premium-section"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">
              {t("home.whatWeDo", "What we do")}
            </span>
            <h2>
              {t(
                "sections.services.title",
                "Services built for business growth",
              )}
            </h2>
            <p>
              {t(
                "sections.services.description",
                "From websites to custom portals, we create digital systems that help your business look professional and convert better.",
              )}
            </p>
          </div>

          <div className="premium-card-grid">
            {finalServices.slice(0, 6).map((service, index) => {
              const title = getText(
                service.title,
                service.name,
                t("home.service", "Service"),
              );
              const summary = getText(
                service.summary,
                service.shortDescription,
                service.description,
                t(
                  "home.serviceDescription",
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
                    <div className="premium-icon">
                      {service.icon || service.iconKey || `0${index + 1}`}
                    </div>
                    <h3>{title}</h3>
                    <p>{summary}</p>
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
            <span className="premium-eyebrow">
              {t("home.productDirection", "Product direction")}
            </span>
            <h2>
              {t(
                "home.productTitle",
                "Turn your idea into a clear buildable business system.",
              )}
            </h2>
          </div>

          <div className="premium-blueprint-panel">
            {finalProducts.slice(0, 3).map((product, index) => {
              const title = getText(
                product.title,
                product.name,
                t("home.productBlueprint", "Product Blueprint"),
              );
              const summary = getText(
                product.summary,
                product.description,
                t(
                  "home.productBlueprintSummary",
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
                {t("home.selectedWork", "Selected work")}
              </span>
              <h2>
                {t("sections.portfolio.title", "Recent project direction")}
              </h2>
            </div>

            <Link to="/portfolio" className="premium-btn premium-btn-ghost">
              {t("common.viewPortfolio", "View portfolio")}
            </Link>
          </div>

          <div className="premium-work-grid">
            {finalProjects.slice(0, 6).map((project) => {
              const title = getText(
                project.title,
                project.name,
                t("home.portfolioProject", "Portfolio project"),
              );
              const summary = getText(
                project.summary,
                project.description,
                t(
                  "home.portfolioSummary",
                  "A clean digital project built for business impact.",
                ),
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
                  <div>
                    <h3>{title}</h3>
                    <p>{summary}</p>
                    <span>
                      {t("common.viewCaseStudy", "View case study")} →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Blog Section */}
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
                {t("common.viewAll", "View all")} →
              </Link>
            </div>

            <div className="premium-blog-grid">
              {featuredPosts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post.id || index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <BlogCard post={post} />
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
              {t("home.clientConfidence", "Client confidence")}
            </span>
            <h2>{t("sections.testimonials.title", "What our clients say")}</h2>
            <p>
              {t(
                "home.testimonialSubtitle",
                "Clear communication, modern design, and systems that make your business easier to manage.",
              )}
            </p>
          </div>

          <div className="premium-testimonial-grid">
            {finalTestimonials.slice(0, 4).map((testimonial) => {
              const name = getText(
                testimonial.clientName,
                testimonial.name,
                testimonial.author,
                t("home.client", "Client"),
              );
              const quote = getText(
                testimonial.quote,
                testimonial.content,
                testimonial.message,
                t(
                  "home.defaultQuote",
                  "A polished platform that helps the business look more professional online.",
                ),
              );
              const image = getImage(testimonial);

              return (
                <article
                  key={testimonial.id || name}
                  className="premium-testimonial-card"
                >
                  <p>“{quote}”</p>
                  <div className="premium-person">
                    <PremiumImage
                      src={image}
                      alt={name}
                      className="premium-avatar"
                    />
                    <div>
                      <strong>{name}</strong>
                      <span>
                        {testimonial.role ||
                          t("home.happyClient", "Happy Client")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </motion.section>

      {finalLogos.length > 0 && (
        <motion.section
          className="premium-logo-strip"
          variants={sectionReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
        >
          <div className="premium-container">
            <span>{t("home.trustedBy", "Trusted by growing brands")}</span>
            <div className="premium-logo-grid">
              {finalLogos.slice(0, 10).map((logo, index) => {
                const name = getText(
                  logo.name,
                  logo.clientName,
                  `${t("home.client", "Client")} ${index + 1}`,
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
          </div>
        </motion.section>
      )}

      <motion.section
        className="premium-cta"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.16 }}
      >
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow">
            {t("home.ready", "Ready when you are")}
          </span>
          <h2>{t("cta.home.title", "Ready to build something premium?")}</h2>
          <p>
            {t(
              "cta.home.description",
              "Let's turn your business idea into a polished digital platform that looks trusted and works smoothly.",
            )}
          </p>
          <div className="premium-actions premium-actions-center">
            <Link to="/contact" className="premium-btn premium-btn-primary">
              {t("common.contactUs", "Start a project")}
            </Link>
            <Link to="/services" className="premium-btn premium-btn-light">
              {t("nav.services", "Explore services")}
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
