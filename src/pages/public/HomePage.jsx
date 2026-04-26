import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { publicApi } from "../../services/publicApi";

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.data?.content)) return value.data.content;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};

const MotionLink = motion(Link);

const fallbackServices = [
  {
    id: "web-dev",
    name: "Website Development",
    shortDescription:
      "Fast, responsive, SEO-ready websites for businesses, creators, and agencies.",
    icon: "🚀",
  },
  {
    id: "software",
    name: "Custom Software",
    shortDescription:
      "Business dashboards, booking systems, portals, and internal tools.",
    icon: "⚙️",
  },
  {
    id: "strategy",
    name: "Digital Strategy",
    shortDescription:
      "Position your business online with strong messaging, funnels, and conversion flow.",
    icon: "📊",
  },
];

const fallbackProjects = [
  {
    id: "agency-site",
    title: "Agency Website Platform",
    summary: "A polished company website with service pages and lead capture.",
    slug: "agency-website-platform",
  },
  {
    id: "booking-system",
    title: "Booking Management System",
    summary: "A modern booking flow for service-based businesses.",
    slug: "booking-management-system",
  },
  {
    id: "client-portal",
    title: "Client Portal",
    summary: "Secure dashboard experience for clients and admins.",
    slug: "client-portal",
  },
];

const fallbackProducts = [
  {
    id: "starter",
    title: "Business Starter Website",
    summary: "A clean launch package for small businesses.",
    slug: "business-starter-website",
  },
  {
    id: "growth",
    title: "Growth Website System",
    summary: "Pages, content structure, and conversion sections for growth.",
    slug: "growth-website-system",
  },
  {
    id: "portal",
    title: "Admin Portal Blueprint",
    summary: "A secure admin system for managing business operations.",
    slug: "admin-portal-blueprint",
  },
];

const fallbackTestimonials = [
  {
    id: "one",
    clientName: "Sarah Johnson",
    quote:
      "The platform gave our brand a professional online presence and made inquiries easier to manage.",
    clientRole: "CEO",
    organization: "TechStart",
  },
  {
    id: "two",
    clientName: "Michael Chen",
    quote:
      "Clean design, fast delivery, and a system that can grow with our business.",
    clientRole: "Founder",
    organization: "InnovateLab",
  },
];

const fallbackLogos = [
  { id: "logo-1", name: "Acme Corp", icon: "🏢" },
  { id: "logo-2", name: "TechStart", icon: "⚡" },
  { id: "logo-3", name: "InnovateLab", icon: "🔬" },
  { id: "logo-4", name: "GrowthHub", icon: "📈" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const { language, t } = useLanguage();
  const currentLanguage = language || "EN";

  const hero = useFetchOnMount(
    () =>
      publicApi.getHeroSections({
        language: currentLanguage,
        placement: "HOME",
        featuredOnly: true,
      }),
    [currentLanguage],
  );

  const services = useFetchOnMount(
    () =>
      publicApi.getServices({
        language: currentLanguage,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [currentLanguage],
  );

  const portfolio = useFetchOnMount(
    () =>
      publicApi.getPortfolioProjects({
        language: currentLanguage,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [currentLanguage],
  );

  const products = useFetchOnMount(
    () =>
      publicApi.getProductBlueprints({
        language: currentLanguage,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [currentLanguage],
  );

  const testimonials = useFetchOnMount(
    () =>
      publicApi.getTestimonials({
        language: currentLanguage,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [currentLanguage],
  );

  const clientLogos = useFetchOnMount(
    () =>
      publicApi.getClientLogos({
        language: currentLanguage,
        featuredOnly: true,
        page: 0,
        size: 12,
      }),
    [currentLanguage],
  );

  const heroItem = useMemo(
    () => normalizeList(hero.data)[0] || null,
    [hero.data],
  );

  const finalServices = normalizeList(services.data).length
    ? normalizeList(services.data)
    : fallbackServices;

  const finalProjects = normalizeList(portfolio.data).length
    ? normalizeList(portfolio.data)
    : fallbackProjects;

  const finalProducts = normalizeList(products.data).length
    ? normalizeList(products.data)
    : fallbackProducts;

  const finalTestimonials = normalizeList(testimonials.data).length
    ? normalizeList(testimonials.data)
    : fallbackTestimonials;

  const finalLogos = normalizeList(clientLogos.data).length
    ? normalizeList(clientLogos.data)
    : fallbackLogos;

  const heroTitle =
    heroItem?.title || "Build a premium digital presence for your business";

  const heroSubtitle =
    heroItem?.subtitle ||
    heroItem?.body ||
    "We design and build modern websites, product pages, portals, and business platforms that help your brand look trusted, convert leads, and scale online.";

  return (
    <div className="page">
      <main className="page__main">
        <section className="hero">
          <div className="hero__container">
            <div className="hero__grid">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInLeft}
                className="hero__content"
              >
                <span className="hero__badge">✨ Digital Agency Platform</span>

                <h1 className="hero__title">{heroTitle}</h1>

                <p className="hero__description">{heroSubtitle}</p>

                <div className="hero__actions">
                  <Link
                    to={heroItem?.primaryButtonUrl || "/contact"}
                    className="btn btn--primary btn--lg"
                  >
                    🚀{" "}
                    {heroItem?.primaryButtonLabel ||
                      t("common.contactUs", "Start a project")}
                  </Link>

                  <Link
                    to={heroItem?.secondaryButtonUrl || "/services"}
                    className="btn btn--outline btn--lg"
                  >
                    {heroItem?.secondaryButtonLabel ||
                      t("nav.services", "Explore services")}{" "}
                    →
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-16">
                  {[
                    { value: "20+", label: "Projects Completed", icon: "🎯" },
                    { value: "4", label: "Core Services", icon: "⚡" },
                    { value: "100%", label: "Client Satisfaction", icon: "💯" },
                  ].map((stat) => (
                    <div key={stat.label} className="card p-6 text-center">
                      <div className="text-4xl mb-3">{stat.icon}</div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted mt-2">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInRight}
                className="hero__media"
              >
                {heroItem?.backgroundImageUrl ? (
                  <img
                    src={heroItem.backgroundImageUrl}
                    alt={heroTitle}
                    className="rounded-2xl"
                  />
                ) : (
                  <div className="card card--glow p-8">
                    <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                      <div className="bg-surface/50 rounded-xl p-6 mb-6">
                        <p className="text-sm text-muted mb-2">
                          Agency Dashboard
                        </p>
                        <h3 className="text-xl font-bold">
                          Manage content, clients, portfolio, and products.
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {["Services", "Portfolio", "Products", "Clients"].map(
                          (item) => (
                            <div
                              key={item}
                              className="bg-surface/30 rounded-xl p-4"
                            >
                              <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-3" />
                              <p className="font-semibold">{item}</p>
                              <p className="text-xs text-muted mt-1">
                                Ready to manage
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <SectionHeader
              badge="💡 What we do"
              title={t(
                "sections.services.title",
                "Services built for business growth",
              )}
              description={t(
                "sections.services.description",
                "From websites to custom portals, we create digital systems that help your business look professional and convert better.",
              )}
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-3 gap-6"
            >
              {finalServices.slice(0, 6).map((service, index) => (
                <motion.article
                  key={service.id || service.slug || index}
                  variants={scaleIn}
                  className="card card--glow"
                >
                  <div className="card__content">
                    <div className="text-6xl mb-4">
                      {service.iconKey ||
                        service.icon ||
                        ["🚀", "⚙️", "📊", "🎨", "💎", "🎯"][index]}
                    </div>

                    <h3 className="card__title">
                      {service.name || service.title || "Service"}
                    </h3>

                    <p className="card__description">
                      {service.shortDescription ||
                        service.fullDescription ||
                        service.description ||
                        "A professional service designed to support your business."}
                    </p>

                    <Link
                      to="/services"
                      className="btn btn--outline btn--sm mt-4"
                    >
                      Learn more →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <SectionHeader
              badge="🏆 Selected work"
              title={t("sections.portfolio.title", "Recent project direction")}
              description={t(
                "sections.portfolio.description",
                "A preview of the kind of platforms, websites, and systems this agency can deliver.",
              )}
            />

            <div className="grid grid-cols-3 gap-6">
              {finalProjects.slice(0, 6).map((project, index) => (
                <Link
                  key={project.id || project.slug || index}
                  to={
                    project.slug ? `/portfolio/${project.slug}` : "/portfolio"
                  }
                  className="card text-decoration-none d-block"
                >
                  <div className="card__media">
                    {project.coverImageUrl ? (
                      <img
                        src={project.coverImageUrl}
                        alt={project.title || "Project"}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-6xl opacity-50">
                          {["🎨", "💻", "📱", "🖥️", "🎯", "⚡"][index]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card__content">
                    <span className="card__badge">
                      {project.projectType ||
                        project.clientIndustry ||
                        "Project"}
                    </span>

                    <h3 className="card__title">
                      {project.title || "Portfolio project"}
                    </h3>

                    <p className="card__description">
                      {project.summary ||
                        project.description ||
                        "A clean digital project built for business impact."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/portfolio" className="btn btn--outline btn--lg">
                View all projects →
              </Link>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <SectionHeader
              badge="📦 Product blueprints"
              title={t("sections.products.title", "Reusable product systems")}
              description={t(
                "sections.products.description",
                "Launch faster with structured website, portal, and product blueprint packages.",
              )}
            />

            <div className="grid grid-cols-3 gap-6">
              {finalProducts.slice(0, 6).map((product, index) => (
                <Link
                  key={product.id || product.slug || index}
                  to={product.slug ? `/products/${product.slug}` : "/products"}
                  className="card text-decoration-none d-block"
                >
                  <div className="card__media">
                    {product.heroImageUrl ? (
                      <img
                        src={product.heroImageUrl}
                        alt={product.title || "Product"}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-6xl opacity-50">
                          {["📦", "🧩", "💻", "🚀", "⚙️", "🎯"][index]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="card__content">
                    <h3 className="card__title">
                      {product.title || "Product blueprint"}
                    </h3>

                    <p className="card__description">
                      {product.summary ||
                        product.solutionOverview ||
                        "A reusable product system for growing teams."}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/products" className="btn btn--outline btn--lg">
                View all products →
              </Link>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <SectionHeader
              badge="⭐ Testimonials"
              title={t("sections.testimonials.title", "What our clients say")}
              description={t(
                "sections.testimonials.description",
                "Clear communication, modern design, and systems that make your business easier to manage.",
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              {finalTestimonials.slice(0, 4).map((testimonial, index) => (
                <article key={testimonial.id || index} className="card p-8">
                  <div className="text-7xl mb-4 opacity-20 font-serif">"</div>

                  <p className="text-lg mb-6 leading-relaxed">
                    {testimonial.quote ||
                      testimonial.content ||
                      testimonial.message ||
                      "A polished platform that helps the business look more professional online."}
                  </p>

                  <div className="border-t border-border pt-4">
                    <div className="font-bold text-lg">
                      {testimonial.clientName ||
                        testimonial.name ||
                        testimonial.author ||
                        "Client"}
                    </div>

                    <div className="text-sm text-muted mt-1">
                      {[testimonial.clientRole, testimonial.organization]
                        .filter(Boolean)
                        .join(" • ") ||
                        testimonial.role ||
                        "Happy Client"}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section bg-surface">
          <div className="container">
            <SectionHeader
              badge="🤝 Trusted by teams"
              title={t(
                "sections.trust.title",
                "Built to earn client confidence",
              )}
              description={t(
                "sections.trust.description",
                "A professional platform gives your business stronger credibility from the first visit.",
              )}
            />

            <div className="grid grid-cols-4 gap-6">
              {finalLogos.slice(0, 8).map((logo, index) => (
                <div key={logo.id || index} className="card p-6 text-center">
                  {logo.logoUrl ? (
                    <img
                      src={logo.logoUrl}
                      alt={logo.name || "Client logo"}
                      className="mx-auto h-12 max-w-full object-contain mb-3"
                    />
                  ) : (
                    <div className="text-5xl mb-3">{logo.icon || "🏢"}</div>
                  )}

                  <div className="font-semibold text-muted">
                    {logo.name || logo.clientName || `Client ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            <div className="card p-16 text-center">
              <div className="text-6xl mb-6">🚀</div>

              <h2 className="text-4xl font-bold mb-4">
                {t("cta.home.title", "Ready to build something premium?")}
              </h2>

              <p className="text-xl mb-8 text-muted max-w-2xl mx-auto">
                {t(
                  "cta.home.description",
                  "Let's turn your business idea into a polished digital platform that looks trusted and works smoothly.",
                )}
              </p>

              <div className="d-flex gap-4 justify-center">
                <MotionLink to="/contact" className="btn btn--primary btn--lg">
                  Start a project →
                </MotionLink>

                <Link to="/services" className="btn btn--outline btn--lg">
                  Explore services
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionHeader({ badge, title, description }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <span className="hero__badge">{badge}</span>
      <h2 className="text-4xl font-bold mt-4 mb-4">{title}</h2>
      <p className="text-lg text-muted">{description}</p>
    </motion.div>
  );
}
