import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { serviceCatalogService } from "../../services/serviceCatalogService";
import { portfolioService } from "../../services/portfolioService";
import { productBlueprintService } from "../../services/productBlueprintService";
import { testimonialService } from "../../services/testimonialService";
import { clientLogoService } from "../../services/clientLogoService";
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

const PremiumImage = ({ src, alt, className }) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt || "InkFront visual"}
      className={className}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut" },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export default function HomePage() {
  const { language, t } = useLanguage();

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
          title: "Website Development",
          summary:
            "Fast, responsive, SEO-ready websites built to help your business look trusted.",
        },
        {
          id: "software",
          title: "Custom Software",
          summary:
            "Dashboards, booking systems, portals, and internal tools for real operations.",
        },
        {
          id: "strategy",
          title: "Digital Strategy",
          summary:
            "Clear product direction, conversion flow, and launch planning for your brand.",
        },
      ];

  const finalProjects = projectItems.length
    ? projectItems
    : [
        {
          id: "agency-site",
          title: "Agency Website Platform",
          summary:
            "A polished company website with service pages and lead capture.",
          slug: "agency-website-platform",
        },
        {
          id: "booking-system",
          title: "Booking Management System",
          summary: "A clean booking flow for service-based businesses.",
          slug: "booking-management-system",
        },
        {
          id: "client-portal",
          title: "Client Portal",
          summary: "A secure dashboard experience for clients and admins.",
          slug: "client-portal",
        },
      ];

  const finalProducts = productItems.length
    ? productItems
    : [
        {
          id: "blueprint",
          title: "Product Blueprint",
          summary:
            "Map your idea, revenue model, user journey, and build roadmap before development.",
          slug: "product-blueprint",
        },
      ];

  const finalTestimonials = testimonialItems.length
    ? testimonialItems
    : [
        {
          id: "one",
          clientName: "InkFront Client",
          role: "Business Owner",
          quote:
            "The platform gave our brand a professional online presence and made inquiries easier to manage.",
        },
        {
          id: "two",
          clientName: "Growth Client",
          role: "Founder",
          quote:
            "Clean design, fast delivery, and a system that can grow with our business.",
        },
      ];

  const finalLogos = logoItems.length ? logoItems : [];

  const heroTitle =
    heroItem?.title || "Build a premium digital presence for your business";

  const heroSubtitle =
    heroItem?.subtitle ||
    heroItem?.description ||
    "InkFront designs and builds websites, product pages, portals, and business platforms that help your brand look trusted, convert leads, and scale online.";

  const heroImage = getImage(heroItem);

  const loading =
    hero.loading ||
    services.loading ||
    portfolio.loading ||
    products.loading ||
    testimonials.loading;

  return (
    <main className="premium-public-page">
      <section className="premium-hero">
        <div className="premium-container premium-hero-grid">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="premium-hero-copy"
          >
            <motion.span variants={fadeUp} className="premium-eyebrow">
              InkFront Digital Systems
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
                <strong>20+</strong>
                <span>Projects</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Core services</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Business focused</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="premium-hero-visual"
          >
            <PremiumImage
              src={heroImage}
              alt={heroTitle}
              className="premium-hero-img"
            />

            <div className="premium-dashboard-card">
              <span>Live business system</span>
              <h2>Websites. Portals. Products.</h2>
              <div className="premium-dashboard-list">
                {["Services", "Portfolio", "Products", "Clients"].map(
                  (item) => (
                    <div key={item}>
                      <span>{item}</span>
                      <strong>Managed</strong>
                    </div>
                  ),
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {loading && (
        <section className="premium-container">
          <div className="premium-loading">
            Loading latest InkFront content...
          </div>
        </section>
      )}

      <section className="premium-section">
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">What we do</span>
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
              const title = getText(service.title, service.name, "Service");
              const summary = getText(
                service.summary,
                service.shortDescription,
                service.description,
                "A professional service designed to support your business.",
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
                      Learn more →
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="premium-section premium-section-dark">
        <div className="premium-container premium-split">
          <div>
            <span className="premium-eyebrow">Product direction</span>
            <h2>Turn your idea into a clear buildable business system.</h2>
          </div>

          <div className="premium-blueprint-panel">
            {finalProducts.slice(0, 3).map((product, index) => {
              const title = getText(
                product.title,
                product.name,
                "Product Blueprint",
              );
              const summary = getText(
                product.summary,
                product.description,
                "Plan the offer, pages, features, and customer journey before development starts.",
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
      </section>

      <section className="premium-section">
        <div className="premium-container">
          <div className="premium-section-head premium-section-head-row">
            <div>
              <span className="premium-eyebrow">Selected work</span>
              <h2>
                {t("sections.portfolio.title", "Recent project direction")}
              </h2>
            </div>
            <Link to="/portfolio" className="premium-btn premium-btn-ghost">
              View portfolio
            </Link>
          </div>

          <div className="premium-work-grid">
            {finalProjects.slice(0, 6).map((project) => {
              const title = getText(
                project.title,
                project.name,
                "Portfolio project",
              );
              const summary = getText(
                project.summary,
                project.description,
                "A clean digital project built for business impact.",
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
                    <span>View case study →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="premium-section premium-testimonial-section">
        <div className="premium-container">
          <div className="premium-section-head">
            <span className="premium-eyebrow">Client confidence</span>
            <h2>{t("sections.testimonials.title", "What our clients say")}</h2>
            <p>
              Clear communication, modern design, and systems that make your
              business easier to manage.
            </p>
          </div>

          <div className="premium-testimonial-grid">
            {finalTestimonials.slice(0, 4).map((testimonial) => {
              const name = getText(
                testimonial.clientName,
                testimonial.name,
                testimonial.author,
                "Client",
              );
              const quote = getText(
                testimonial.quote,
                testimonial.content,
                testimonial.message,
                "A polished platform that helps the business look more professional online.",
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
                      <span>{testimonial.role || "Happy Client"}</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {finalLogos.length > 0 && (
        <section className="premium-logo-strip">
          <div className="premium-container">
            <span>Trusted by growing brands</span>
            <div className="premium-logo-grid">
              {finalLogos.slice(0, 10).map((logo, index) => {
                const name = getText(
                  logo.name,
                  logo.clientName,
                  `Client ${index + 1}`,
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
        </section>
      )}

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow">Ready when you are</span>
          <h2>{t("cta.home.title", "Ready to build something premium?")}</h2>
          <p>
            {t(
              "cta.home.description",
              "Let’s turn your business idea into a polished digital platform that looks trusted and works smoothly.",
            )}
          </p>
          <div className="premium-actions premium-actions-center">
            <Link to="/contact" className="premium-btn premium-btn-primary">
              Start a project
            </Link>
            <Link to="/services" className="premium-btn premium-btn-light">
              Explore services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
