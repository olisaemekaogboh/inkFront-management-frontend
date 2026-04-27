import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

const SERVICE_HIGHLIGHTS = {
  "website-development": {
    headline: "Your website is your hardest-working salesperson",
    body: "We build fast, beautiful websites that load quickly, rank better, and turn visitors into customers. Every site is structured for trust, clarity, and conversion.",
    timeline: "2–4 weeks",
    deliverables: [
      "Premium responsive website",
      "Service and landing pages",
      "SEO-ready structure",
      "Contact and lead capture flow",
      "Backend-managed content support",
    ],
  },
  "business-automation": {
    headline: "Stop doing work a machine can handle",
    body: "We design automation workflows that handle bookings, invoices, reminders, customer records, and reports while your team focuses on growth.",
    timeline: "3–6 weeks",
    deliverables: [
      "Workflow audit",
      "Automation plan",
      "Admin dashboard",
      "Customer status tracking",
      "Notification flow",
    ],
  },
  "brand-and-product-strategy": {
    headline: "Clarity sells more than clever copy",
    body: "We help you define what you offer, who it is for, why they should care, and how your business should present itself online.",
    timeline: "1–3 weeks",
    deliverables: [
      "Offer positioning",
      "Product direction",
      "Landing page structure",
      "Messaging framework",
      "Launch roadmap",
    ],
  },
  "ecommerce-platforms": {
    headline: "Sell online like you mean it",
    body: "From single-product stores to advanced online shops, we build e-commerce platforms that are fast, secure, and optimized for conversion.",
    timeline: "4–8 weeks",
    deliverables: [
      "Product catalogue",
      "Product detail pages",
      "Cart and checkout flow",
      "Order management",
      "Admin product manager",
    ],
  },
  "seo-and-content-systems": {
    headline: "Get found by the people searching for you",
    body: "We build content systems that help your pages rank, capture traffic, and turn search visitors into real leads.",
    timeline: "Ongoing",
    deliverables: [
      "SEO page structure",
      "Content strategy",
      "Blog/content system",
      "Metadata setup",
      "Conversion-focused landing pages",
    ],
  },
  "custom-software-solutions": {
    headline: "Software built exactly for your workflow",
    body: "We build custom software that fits your real business process instead of forcing your team into generic tools.",
    timeline: "6–16 weeks",
    deliverables: [
      "Requirements planning",
      "Backend API",
      "Admin dashboard",
      "Role-based access",
      "Deployment support",
    ],
  },
  "mobile-app-development": {
    headline: "Put your business in your customers’ pockets",
    body: "We build mobile app experiences that are clean, fast, useful, and designed around your users’ real needs.",
    timeline: "8–16 weeks",
    deliverables: [
      "Mobile UI flow",
      "App screens",
      "Backend integration",
      "Authentication flow",
      "Launch support",
    ],
  },
};

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

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const [service, setService] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadService() {
      try {
        setLoading(true);

        let foundService = null;

        if (typeof publicApi.getServiceBySlug === "function") {
          foundService = await publicApi.getServiceBySlug(slug, {
            language: language || "EN",
          });
        } else {
          const response = await publicApi.getServices({
            language: language || "EN",
            featuredOnly: false,
            page: 0,
            size: 50,
          });

          const services = normalizeList(response);
          foundService = services.find((item) => item?.slug === slug) || null;

          if (active) {
            setRelatedServices(
              services.filter((item) => item?.slug !== slug).slice(0, 3),
            );
          }
        }

        if (active) {
          setService(foundService);
        }
      } catch {
        if (active) {
          setService(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadService();

    return () => {
      active = false;
    };
  }, [slug, language]);

  const highlight = useMemo(() => SERVICE_HIGHLIGHTS[slug] || null, [slug]);

  if (loading) {
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div className="premium-loading">
              {t("states.loadingPage", "Loading service...")}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div className="premium-empty-card">
              <strong>{t("services.notFound", "Service not found")}</strong>
              <p>
                {t(
                  "services.notFoundDesc",
                  "This service may not exist or may not be published yet.",
                )}
              </p>
              <Link to="/services" className="premium-text-link">
                ← {t("common.backToList", "Back to services")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const title = text(
    service.name,
    service.title,
    t("services.untitled", "Untitled Service"),
  );
  const summary = text(
    service.shortDescription,
    service.short_description,
    service.summary,
    t("services.summaryFallback", "Service details will appear here."),
  );
  const description = text(
    service.fullDescription,
    service.full_description,
    service.description,
    highlight?.body,
    summary,
  );
  const imageUrl = imageOf(service);

  return (
    <main className="premium-public-page">
      <section className="premium-detail-hero">
        <div className="premium-container premium-detail-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="premium-eyebrow">
              {service.category || t("nav.services", "Service")}
            </span>

            <h1>{title}</h1>

            <p>{highlight?.headline || summary}</p>

            <div className="premium-actions">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                {t("services.requestService", "Request this service")}
              </Link>

              <Link to="/services" className="premium-btn premium-btn-ghost">
                ← {t("common.backToList", "Back to services")}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="premium-detail-media"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="premium-detail-placeholder">🚀</div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container premium-detail-content">
          <article className="premium-info-panel">
            <span>01</span>
            <h2>{t("services.overview", "Overview")}</h2>
            <p>{description}</p>
          </article>

          <article className="premium-info-panel">
            <span>02</span>
            <h2>{t("services.timeline", "Timeline")}</h2>
            <p>
              {highlight?.timeline ||
                t(
                  "services.timelineFallback",
                  "Timeline depends on project scope.",
                )}
            </p>
          </article>

          <article className="premium-info-panel">
            <span>03</span>
            <h2>{t("services.deliverables", "What you get")}</h2>

            {highlight?.deliverables?.length ? (
              <ul className="premium-detail-list">
                {highlight.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>
                {t(
                  "services.deliverablesFallback",
                  "A clean strategy, premium design direction, backend-connected content, responsive UI, and a business-focused delivery process.",
                )}
              </p>
            )}
          </article>
        </div>
      </section>

      {relatedServices.length > 0 ? (
        <section className="premium-section premium-testimonial-section">
          <div className="premium-container">
            <div className="premium-section-head">
              <span className="premium-eyebrow">
                {t("services.moreServices", "More services")}
              </span>
              <h2>
                {t("services.otherServices", "Other ways InkFront can help")}
              </h2>
            </div>

            <div className="premium-card-grid">
              {relatedServices.map((item) => (
                <Link
                  key={item.id ?? item.slug}
                  to={`/services/${item.slug}`}
                  className="premium-work-card"
                >
                  <div>
                    <h3>
                      {text(
                        item.name,
                        item.title,
                        t("services.service", "Service"),
                      )}
                    </h3>
                    <p>
                      {text(
                        item.shortDescription,
                        item.summary,
                        t("services.viewService", "Explore this service."),
                      )}
                    </p>
                    <strong>
                      {t("services.viewService", "View service")} →
                    </strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            {t("services.ctaEyebrow", "Ready to build?")}
          </span>
          <h2>{t("services.ctaTitle", "Let's talk about your project.")}</h2>
          <p>
            {t(
              "services.ctaDescription",
              "Tell us what you need. We'll recommend the right service package, timeline, and next step.",
            )}
          </p>
          <Link to="/contact" className="premium-btn premium-btn-light">
            {t("services.ctaButton", "Get a free consultation")} →
          </Link>
        </div>
      </section>
    </main>
  );
}
