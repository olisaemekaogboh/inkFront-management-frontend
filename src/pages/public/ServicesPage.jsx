import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

/* ============================================ */
/* Hardcoded service highlights */
/* ============================================ */
const SERVICE_HIGHLIGHTS = {
  "website-development": {
    headline: "Your website is your hardest-working salesperson",
    body: "We build fast, beautiful websites that load in under 2 seconds, rank on Google, and turn visitors into customers. Every site includes a CMS so you can update content without writing code.",
    timeline: "2–4 weeks",
  },
  "business-automation": {
    headline: "Stop doing work a machine can handle",
    body: "We design automation workflows that handle bookings, invoices, reminders, and reports while your team focuses on growth. Most clients save 20+ hours per week after deployment.",
    timeline: "3–6 weeks",
  },
  "brand-and-product-strategy": {
    headline: "Clarity sells more than clever copy",
    body: "We help you define exactly what you offer, who it's for, and why they should care. The output is a clear strategy document your whole team can execute against.",
    timeline: "1–3 weeks",
  },
  "ecommerce-platforms": {
    headline: "Sell online like you mean it",
    body: "From single-product stores to multi-vendor marketplaces, we build e-commerce platforms that are fast, secure, and optimized for conversion.",
    timeline: "4–8 weeks",
  },
  "seo-and-content-systems": {
    headline: "Get found by the people searching for you",
    body: "We build content systems that rank. Every page is structured for search engines, every blog post is designed to capture traffic, and every landing page is optimized to convert.",
    timeline: "Ongoing (results in 60–90 days)",
  },
  "custom-software-solutions": {
    headline: "Software built exactly for your workflow",
    body: "Off-the-shelf tools force you to change how you work. We build custom software that fits your existing processes.",
    timeline: "6–16 weeks",
  },
  "mobile-app-development": {
    headline: "Put your business in your customers' pockets",
    body: "We build native and cross-platform mobile apps that are fast, intuitive, and built to scale. From fintech to social platforms, we handle design, development, and App Store deployment.",
    timeline: "8–16 weeks",
  },
};

/* ============================================ */
/* Animation variants */
/* ============================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fallbackIcons = ["🚀", "⚙️", "📊", "🎨", "💻", "📱", "🔧", "💡"];

const iconMap = {
  code: "💻",
  workflow: "⚙️",
  target: "🎯",
  "shopping-cart": "🛒",
  search: "🔎",
  layers: "🧩",
  smartphone: "📱",
};

/* ============================================ */
/* Helpers */
/* ============================================ */
function normalizeList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data?.content)) return response.data.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

function imageOf(item) {
  return text(
    item?.imageUrl,
    item?.image_url,
    item?.coverImageUrl,
    item?.cover_image_url,
    item?.thumbnailUrl,
  );
}

function PremiumImage({ src, alt, className }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

/* ============================================ */
/* Component */
/* ============================================ */
export default function ServicesPage() {
  const { language, t } = useLanguage();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const response = await publicApi.getServices({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 12,
        });

        if (active) setServices(normalizeList(response));
      } catch (err) {
        if (active) {
          setServices([]);
          setError(err?.message || "Failed to load services");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadServices();
    return () => {
      active = false;
    };
  }, [language]);

  const getServiceIcon = (service, index) => {
    const key = service?.iconKey || service?.icon_key || service?.icon || "";
    return iconMap[key] || fallbackIcons[index % fallbackIcons.length];
  };

  return (
    <main className="premium-public-page">
      {/* ========== HERO ========== */}
      <section className="premium-hero premium-compact-hero">
        <div className="premium-container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="premium-page-intro"
          >
            <span className="premium-eyebrow">
              {t("nav.services", "Services")}
            </span>

            <h1>
              {t("servicesPage.title", "Services that grow your business")}
            </h1>

            <p>
              {t(
                "servicesPage.description",
                "From custom websites to full automation systems, we build digital products that help you work smarter, sell more, and scale faster.",
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== AFFORDABLE SERVICES BANNER ========== */}
      <section className="premium-section" style={{ paddingBottom: 0 }}>
        <div className="premium-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="premium-services-banner"
          >
            <span className="premium-services-banner__icon">💡</span>
            <h2 className="premium-services-banner__title">
              Affordable services for every product we build
            </h2>
            <p className="premium-services-banner__text">
              Every product blueprint on our platform can be built as a full
              service. We offer flexible pricing — from MVP launches starting at{" "}
              <strong>$2,500</strong> to full enterprise platforms. You only pay
              for what your business truly needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== SERVICES GRID ========== */}
      <section className="premium-section">
        <div className="premium-container">
          {loading ? (
            <div className="premium-loading">
              {t("states.loadingPage", "Loading services...")}
            </div>
          ) : error ? (
            <div className="premium-empty-card">
              <strong>{t("states.error", "Something went wrong")}</strong>
              <p>{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="premium-empty-card">
              <strong>
                {t("servicesPage.empty", "No services available yet.")}
              </strong>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="premium-product-grid"
            >
              {services.map((service, index) => {
                const title = text(
                  service.name,
                  service.title,
                  "Untitled Service",
                );
                const description = text(
                  service.shortDescription,
                  service.short_description,
                  service.summary,
                  "Service details will appear here.",
                );
                const imageUrl = imageOf(service);
                const highlights = SERVICE_HIGHLIGHTS[service.slug];

                return (
                  <motion.article
                    key={service.id ?? service.slug ?? index}
                    variants={fadeUp}
                    className="premium-product-card"
                  >
                    {imageUrl ? (
                      <PremiumImage
                        src={imageUrl}
                        alt={title}
                        className="premium-product-image"
                      />
                    ) : (
                      <div className="premium-product-image premium-fallback-media">
                        <span>{getServiceIcon(service, index)}</span>
                      </div>
                    )}

                    <div className="premium-product-body">
                      <span className="premium-mini-badge">
                        {service.category || t("nav.services", "Service")}
                      </span>

                      <h3>{title}</h3>
                      <p>{description}</p>

                      {highlights && (
                        <div className="premium-service-highlights">
                          <p className="premium-service-highlights__timeline">
                            ⏱ {highlights.timeline}
                          </p>
                          <p className="premium-service-highlights__preview">
                            {highlights.body.slice(0, 120)}...
                          </p>
                        </div>
                      )}

                      {service.slug && (
                        <Link
                          to={`/services/${service.slug}`}
                          className="premium-text-link"
                        >
                          View service details →
                        </Link>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            Ready to start?
          </span>
          <h2>Tell us what you need built</h2>
          <p>
            We'll match you with the right service package and give you a clear
            timeline and price — no hidden fees.
          </p>
          <Link to="/contact" className="premium-btn premium-btn-light">
            Get a free consultation →
          </Link>
        </div>
      </section>
    </main>
  );
}
