import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

const SERVICE_HIGHLIGHT_KEYS = {
  "website-development": "websiteDevelopment",
  "business-automation": "businessAutomation",
  "brand-and-product-strategy": "brandProductStrategy",
  "ecommerce-platforms": "ecommercePlatforms",
  "seo-and-content-systems": "seoContentSystems",
  "custom-software-solutions": "customSoftwareSolutions",
  "mobile-app-development": "mobileAppDevelopment",
};

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

export default function ServicesPage() {
  const { language, t } = useLanguage();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const serviceHighlights = useMemo(
    () => ({
      websiteDevelopment: {
        headline: t(
          "servicesPage.highlights.websiteDevelopment.headline",
          "Your website is your hardest-working salesperson",
        ),
        body: t(
          "servicesPage.highlights.websiteDevelopment.body",
          "We build fast, beautiful websites that load quickly, rank on Google, and turn visitors into customers. Every site includes a CMS so you can update content without writing code.",
        ),
        timeline: t(
          "servicesPage.highlights.websiteDevelopment.timeline",
          "2–4 weeks",
        ),
      },
      businessAutomation: {
        headline: t(
          "servicesPage.highlights.businessAutomation.headline",
          "Stop doing work a machine can handle",
        ),
        body: t(
          "servicesPage.highlights.businessAutomation.body",
          "We design automation workflows that handle bookings, invoices, reminders, and reports while your team focuses on growth.",
        ),
        timeline: t(
          "servicesPage.highlights.businessAutomation.timeline",
          "3–6 weeks",
        ),
      },
      brandProductStrategy: {
        headline: t(
          "servicesPage.highlights.brandProductStrategy.headline",
          "Clarity sells more than clever copy",
        ),
        body: t(
          "servicesPage.highlights.brandProductStrategy.body",
          "We help you define what you offer, who it is for, and why they should care. The output is a clear strategy your team can execute.",
        ),
        timeline: t(
          "servicesPage.highlights.brandProductStrategy.timeline",
          "1–3 weeks",
        ),
      },
      ecommercePlatforms: {
        headline: t(
          "servicesPage.highlights.ecommercePlatforms.headline",
          "Sell online like you mean it",
        ),
        body: t(
          "servicesPage.highlights.ecommercePlatforms.body",
          "From single-product stores to multi-vendor marketplaces, we build e-commerce platforms that are fast, secure, and optimized for conversion.",
        ),
        timeline: t(
          "servicesPage.highlights.ecommercePlatforms.timeline",
          "4–8 weeks",
        ),
      },
      seoContentSystems: {
        headline: t(
          "servicesPage.highlights.seoContentSystems.headline",
          "Get found by the people searching for you",
        ),
        body: t(
          "servicesPage.highlights.seoContentSystems.body",
          "We build content systems structured for search engines, traffic capture, and better conversion.",
        ),
        timeline: t(
          "servicesPage.highlights.seoContentSystems.timeline",
          "Ongoing",
        ),
      },
      customSoftwareSolutions: {
        headline: t(
          "servicesPage.highlights.customSoftwareSolutions.headline",
          "Software built exactly for your workflow",
        ),
        body: t(
          "servicesPage.highlights.customSoftwareSolutions.body",
          "Off-the-shelf tools force you to change how you work. We build custom software that fits your existing process.",
        ),
        timeline: t(
          "servicesPage.highlights.customSoftwareSolutions.timeline",
          "6–16 weeks",
        ),
      },
      mobileAppDevelopment: {
        headline: t(
          "servicesPage.highlights.mobileAppDevelopment.headline",
          "Put your business in your customers' pockets",
        ),
        body: t(
          "servicesPage.highlights.mobileAppDevelopment.body",
          "We build native and cross-platform mobile apps that are fast, intuitive, and built to scale.",
        ),
        timeline: t(
          "servicesPage.highlights.mobileAppDevelopment.timeline",
          "8–16 weeks",
        ),
      },
    }),
    [t],
  );

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
          setError(
            err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              t("states.failedToLoadServices", "Failed to load services"),
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadServices();

    return () => {
      active = false;
    };
  }, [language, t]);

  const getServiceIcon = (service, index) => {
    const key = service?.iconKey || service?.icon_key || service?.icon || "";
    return iconMap[key] || fallbackIcons[index % fallbackIcons.length];
  };

  const getServiceHighlight = (slug) => {
    const key = SERVICE_HIGHLIGHT_KEYS[slug];
    return key ? serviceHighlights[key] : null;
  };

  return (
    <main className="premium-public-page">
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
              {t(
                "servicesPage.bannerTitle",
                "Affordable services for every product we build",
              )}
            </h2>

            <p className="premium-services-banner__text">
              {t(
                "servicesPage.bannerText",
                "Every product blueprint on our platform can be built as a full service. We offer flexible pricing — from MVP launches starting at",
              )}{" "}
              <strong>₦300,000</strong>{" "}
              {t(
                "servicesPage.bannerTextEnd",
                "to full enterprise platforms. You only pay for what your business truly needs.",
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container">
          {loading ? (
            <div className="premium-loading">
              {t("states.loadingServices", "Loading services...")}
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
                  t("servicesPage.untitled", "Untitled Service"),
                );

                const description = text(
                  service.shortDescription,
                  service.short_description,
                  service.summary,
                  t(
                    "servicesPage.descriptionFallback",
                    "Service details will appear here.",
                  ),
                );

                const imageUrl = imageOf(service);
                const highlights = getServiceHighlight(service.slug);

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

                      {highlights ? (
                        <div className="premium-service-highlights">
                          <p className="premium-service-highlights__timeline">
                            ⏱ {highlights.timeline}
                          </p>
                          <p className="premium-service-highlights__preview">
                            {highlights.body.slice(0, 120)}...
                          </p>
                        </div>
                      ) : null}

                      {service.slug ? (
                        <Link
                          to={`/services/${service.slug}`}
                          className="premium-text-link"
                        >
                          {t(
                            "servicesPage.viewDetails",
                            "View service details",
                          )}{" "}
                          →
                        </Link>
                      ) : null}
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            {t("servicesPage.ctaEyebrow", "Ready to start?")}
          </span>

          <h2>{t("servicesPage.ctaTitle", "Tell us what you need built")}</h2>

          <p>
            {t(
              "servicesPage.ctaDescription",
              "We'll match you with the right service package and give you a clear timeline and price — no hidden fees.",
            )}
          </p>

          <Link to="/contact" className="premium-btn premium-btn-light">
            {t("servicesPage.ctaButton", "Get a free consultation")} →
          </Link>
        </div>
      </section>
    </main>
  );
}
