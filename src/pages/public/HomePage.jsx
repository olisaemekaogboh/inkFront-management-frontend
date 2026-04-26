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

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.content)) return value.content;
  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.items)) return value.items;
  return [];
};
const MotionLink = motion.create(Link);
const fallbackServices = [
  {
    id: "web-dev",
    title: "Website Development",
    name: "Website Development",
    summary:
      "Fast, responsive, SEO-ready websites for businesses, creators, and agencies.",
    description:
      "Fast, responsive, SEO-ready websites for businesses, creators, and agencies.",
    icon: "🚀",
  },
  {
    id: "software",
    title: "Custom Software",
    name: "Custom Software",
    summary:
      "Business dashboards, booking systems, portals, and internal tools.",
    description:
      "Business dashboards, booking systems, portals, and internal tools.",
    icon: "⚙️",
  },
  {
    id: "branding",
    title: "Digital Strategy",
    name: "Digital Strategy",
    summary:
      "Position your business online with strong messaging, funnels, and conversion flow.",
    description:
      "Position your business online with strong messaging, funnels, and conversion flow.",
    icon: "📊",
  },
];

const fallbackProjects = [
  {
    id: "agency-site",
    title: "Agency Website Platform",
    name: "Agency Website Platform",
    summary: "A polished company website with service pages and lead capture.",
    slug: "agency-website-platform",
  },
  {
    id: "booking-system",
    title: "Booking Management System",
    name: "Booking Management System",
    summary: "A modern booking flow for service-based businesses.",
    slug: "booking-management-system",
  },
  {
    id: "client-portal",
    title: "Client Portal",
    name: "Client Portal",
    summary: "Secure dashboard experience for clients and admins.",
    slug: "client-portal",
  },
];

const fallbackProducts = [
  {
    id: "starter",
    title: "Business Starter Website",
    name: "Business Starter Website",
    summary: "A clean launch package for small businesses.",
    slug: "business-starter-website",
  },
  {
    id: "growth",
    title: "Growth Website System",
    name: "Growth Website System",
    summary: "Pages, content structure, and conversion sections for growth.",
    slug: "growth-website-system",
  },
  {
    id: "portal",
    title: "Admin Portal Blueprint",
    name: "Admin Portal Blueprint",
    summary: "A secure admin system for managing business operations.",
    slug: "admin-portal-blueprint",
  },
];

const fallbackTestimonials = [
  {
    id: "one",
    clientName: "Sarah Johnson",
    name: "Sarah Johnson",
    quote:
      "The platform gave our brand a professional online presence and made inquiries easier to manage.",
    content:
      "The platform gave our brand a professional online presence and made inquiries easier to manage.",
    role: "CEO, TechStart",
  },
  {
    id: "two",
    clientName: "Michael Chen",
    name: "Michael Chen",
    quote:
      "Clean design, fast delivery, and a system that can grow with our business.",
    content:
      "Clean design, fast delivery, and a system that can grow with our business.",
    role: "Founder, InnovateLab",
  },
];

const fallbackLogos = [
  { id: "logo-1", name: "Acme Corp", icon: "🏢" },
  { id: "logo-2", name: "TechStart", icon: "⚡" },
  { id: "logo-3", name: "InnovateLab", icon: "🔬" },
  { id: "logo-4", name: "GrowthHub", icon: "📈" },
  { id: "logo-5", name: "CreativeMinds", icon: "🎨" },
  { id: "logo-6", name: "FutureStack", icon: "💻" },
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
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
        size: 6,
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

  const heroItem = useMemo(() => {
    const heroList = normalizeList(hero.data);
    return heroList[0] || null;
  }, [hero.data]);

  const serviceItems = normalizeList(services.data);
  const projectItems = normalizeList(portfolio.data);
  const productItems = normalizeList(products.data);
  const testimonialItems = normalizeList(testimonials.data);
  const logoItems = normalizeList(clientLogos.data);

  const finalServices = serviceItems.length ? serviceItems : fallbackServices;
  const finalProjects = projectItems.length ? projectItems : fallbackProjects;
  const finalProducts = productItems.length ? productItems : fallbackProducts;
  const finalTestimonials = testimonialItems.length
    ? testimonialItems
    : fallbackTestimonials;
  const finalLogos = logoItems.length ? logoItems : fallbackLogos;

  const heroTitle =
    heroItem?.title || "Build a premium digital presence for your business";

  const heroSubtitle =
    heroItem?.subtitle ||
    heroItem?.description ||
    "We design and build modern websites, product pages, portals, and business platforms that help your brand look trusted, convert leads, and scale online.";

  return (
    <div className="page">
      <main className="page__main">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero__container">
            <div className="hero__grid">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInLeft}
                className="hero__content"
              >
                <motion.span
                  className="hero__badge"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  ✨ Digital Agency Platform
                </motion.span>

                <motion.h1
                  className="hero__title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {heroTitle}
                </motion.h1>

                <motion.p
                  className="hero__description"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  {heroSubtitle}
                </motion.p>

                <motion.div
                  className="hero__actions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  <Link to="/contact" className="btn btn--primary btn--lg">
                    🚀 {t("common.contactUs", "Start a project")}
                  </Link>
                  <Link to="/services" className="btn btn--outline btn--lg">
                    {t("nav.services", "Explore services")} →
                  </Link>
                </motion.div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-3 gap-4 mt-16"
                >
                  {[
                    { value: "20+", label: "Projects Completed", icon: "🎯" },
                    { value: "4", label: "Core Services", icon: "⚡" },
                    { value: "100%", label: "Client Satisfaction", icon: "💯" },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      variants={scaleIn}
                      className="card p-6 text-center"
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    >
                      <div className="text-4xl mb-3 animate-float">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted mt-2">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInRight}
                className="hero__media"
              >
                <div className="card card--glow p-8 animate-float">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                    <div className="d-flex gap-2 mb-8">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <div
                        className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="w-3 h-3 rounded-full bg-green-500 animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>

                    <div className="bg-surface/50 rounded-xl p-6 mb-6 backdrop-blur-sm">
                      <p className="text-sm text-muted mb-2">
                        Agency Dashboard
                      </p>
                      <h3 className="text-xl font-bold">
                        Manage content, clients, portfolio, and products.
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {["Services", "Portfolio", "Products", "Clients"].map(
                        (item, idx) => (
                          <motion.div
                            key={item}
                            className="bg-surface/30 rounded-xl p-4 hover:bg-surface/50 transition-all cursor-pointer"
                            whileHover={{ scale: 1.05, x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full mb-3" />
                            <p className="font-semibold">{item}</p>
                            <p className="text-xs text-muted mt-1">
                              Ready to manage
                            </p>
                          </motion.div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="page-section">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="hero__badge">💡 What we do</span>
              <h2 className="text-4xl font-bold mt-4 mb-4">
                {t(
                  "sections.services.title",
                  "Services built for business growth",
                )}
              </h2>
              <p className="text-lg text-muted">
                {t(
                  "sections.services.description",
                  "From websites to custom portals, we create digital systems that help your business look professional and convert better.",
                )}
              </p>
            </motion.div>

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
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="card card--glow"
                >
                  <div className="card__content">
                    <div className="text-6xl mb-4 animate-float">
                      {service.icon ||
                        ["🚀", "⚙️", "📊", "🎨", "💎", "🎯"][index]}
                    </div>
                    <h3 className="card__title">
                      {service.title || service.name || "Service"}
                    </h3>
                    <p className="card__description">
                      {service.summary ||
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

        {/* Portfolio Section */}
        <section className="page-section bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="hero__badge">🏆 Selected work</span>
              <h2 className="text-4xl font-bold mt-4 mb-4">
                {t("sections.portfolio.title", "Recent project direction")}
              </h2>
              <p className="text-lg text-muted">
                {t(
                  "sections.portfolio.description",
                  "A preview of the kind of platforms, websites, and systems this agency can deliver.",
                )}
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-3 gap-6"
            >
              {finalProjects.slice(0, 6).map((project, index) => (
                <motion.div
                  key={project.id || project.slug || index}
                  variants={scaleIn}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                >
                  <Link
                    to={
                      project.slug ? `/portfolio/${project.slug}` : "/portfolio"
                    }
                    className="card text-decoration-none d-block"
                  >
                    <div className="card__media">
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-6xl opacity-50">
                          {["🎨", "💻", "📱", "🖥️", "🎯", "⚡"][index]}
                        </span>
                      </div>
                    </div>
                    <div className="card__content">
                      <h3 className="card__title">
                        {project.title || project.name || "Portfolio project"}
                      </h3>
                      <p className="card__description">
                        {project.summary ||
                          project.description ||
                          "A clean digital project built for business impact."}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/portfolio" className="btn btn--outline btn--lg">
                View all projects →
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="page-section">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="hero__badge">⭐ Testimonials</span>
              <h2 className="text-4xl font-bold mt-4 mb-4">
                {t("sections.testimonials.title", "What our clients say")}
              </h2>
              <p className="text-lg text-muted">
                {t(
                  "sections.testimonials.description",
                  "Clear communication, modern design, and systems that make your business easier to manage.",
                )}
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-2 gap-6"
            >
              {finalTestimonials.slice(0, 4).map((testimonial, index) => (
                <motion.article
                  key={testimonial.id || index}
                  variants={scaleIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="card p-8"
                >
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
                      {testimonial.role || "Happy Client"}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="page-section bg-surface">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="hero__badge">🤝 Trusted by teams</span>
              <h2 className="text-4xl font-bold mt-4 mb-4">
                {t("sections.trust.title", "Built to earn client confidence")}
              </h2>
              <p className="text-lg text-muted">
                {t(
                  "sections.trust.description",
                  "A professional platform gives your business stronger credibility from the first visit.",
                )}
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="grid grid-cols-4 gap-6"
            >
              {finalLogos.slice(0, 8).map((logo, index) => (
                <motion.div
                  key={logo.id || index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  className="card p-6 text-center"
                >
                  <div className="text-5xl mb-3">{logo.icon || "🏢"}</div>
                  <div className="font-semibold text-muted">
                    {logo.name || logo.clientName || `Client ${index + 1}`}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="page-section">
          <div className="container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={scaleIn}
              className="card p-16 text-center"
              style={{
                background: "var(--gradient-primary)",
                color: "white",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="text-6xl mb-6"
              >
                🚀
              </motion.div>
              <h2 className="text-4xl font-bold mb-4">
                {t("cta.home.title", "Ready to build something premium?")}
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                {t(
                  "cta.home.description",
                  "Let's turn your business idea into a polished digital platform that looks trusted and works smoothly.",
                )}
              </p>
              <motion.div
                className="d-flex gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <MotionLink
                  to="/contact"
                  className="btn btn--lg"
                  style={{
                    background: "white",
                    color: "var(--color-primary)",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  Start a project →
                </MotionLink>
                <Link
                  to="/services"
                  className="btn btn--outline btn--lg"
                  style={{
                    borderColor: "white",
                    color: "white",
                  }}
                >
                  Explore services
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
