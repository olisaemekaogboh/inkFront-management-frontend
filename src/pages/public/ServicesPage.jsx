import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
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

function getImageUrl(item) {
  return text(
    item?.imageUrl,
    item?.coverImageUrl,
    item?.featuredImageUrl,
    item?.thumbnailUrl,
    item?.backgroundImageUrl,
    item?.bannerImageUrl,
    item?.mediaUrl,
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

// Preload image function
function preloadImage(url) {
  if (!url) return;
  const img = new Image();
  img.src = url;
}

// Optimized image component with priority support and placeholder
function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
  placeholder = true,
  objectFit = "cover",
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || imageError) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {placeholder && !isLoaded && (
        <div
          className="image-placeholder"
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            borderRadius: "inherit",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          objectFit: objectFit,
        }}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={(event) => {
          console.warn(`Failed to load image: ${src}`);
          setImageError(true);
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
}

// Legacy PremiumImage component for backward compatibility
function PremiumImage({ src, alt, className }) {
  if (!src) return null;

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={className}
      priority={false}
      placeholder={true}
      objectFit="cover"
    />
  );
}

export default function ServicesPage() {
  const { language, t } = useLanguage();

  // Fetch hero data - same pattern as About and Contact pages
  const fetchHero = useCallback(
    () =>
      heroService.getHeroSections({
        language,
        placement: "SERVICES",
        featuredOnly: true,
      }),
    [language],
  );

  const hero = useFetchOnMount(fetchHero, [language]);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Memoize hero data to avoid recalculations
  const heroData = useMemo(() => {
    const heroItem = normalizeList(hero.data)[0] || null;
    return {
      item: heroItem,
      title: text(
        heroItem?.title,
        t("servicesPage.title", "Services that grow your business"),
      ),
      subtitle: text(
        heroItem?.subtitle,
        heroItem?.description,
        t(
          "servicesPage.description",
          "From custom websites to full automation systems, we build digital products that help you work smarter, sell more, and scale faster.",
        ),
      ),
      imageUrl: getImageUrl(heroItem),
    };
  }, [hero.data, t]);

  // Memoize service highlights
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

  // Memoize processed services data
  const processedServices = useMemo(() => {
    return services.map((service, index) => ({
      ...service,
      processedTitle: text(
        service.name,
        service.title,
        t("servicesPage.untitled", "Untitled Service"),
      ),
      processedDescription: text(
        service.shortDescription,
        service.short_description,
        service.summary,
        t(
          "servicesPage.descriptionFallback",
          "Service details will appear here.",
        ),
      ),
      processedImageUrl: imageOf(service),
      processedIcon: (() => {
        const key =
          service?.iconKey || service?.icon_key || service?.icon || "";
        return iconMap[key] || fallbackIcons[index % fallbackIcons.length];
      })(),
      processedCategory: service.category || t("nav.services", "Service"),
      processedHighlight: (() => {
        const key = SERVICE_HIGHLIGHT_KEYS[service.slug];
        return key ? serviceHighlights[key] : null;
      })(),
      processedLink: service.slug ? `/services/${service.slug}` : null,
    }));
  }, [services, t, serviceHighlights]);

  // Preload hero image when URL is available
  useEffect(() => {
    if (heroData.imageUrl) {
      preloadImage(heroData.imageUrl);
    }
  }, [heroData.imageUrl]);

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

  // Show loading state while hero is being fetched
  if (hero.loading) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  // Show error state if hero fetch fails
  if (hero.error) {
    return <ErrorState message={hero.error} />;
  }

  const { title: heroTitle, subtitle: heroSubtitle, imageUrl } = heroData;

  return (
    <main className="premium-public-page">
      {/* Hero section - optimized with priority loading */}
      <section className="premium-detail-hero">
        <div
          className={
            imageUrl
              ? "premium-container premium-detail-grid"
              : "premium-container premium-page-intro"
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="premium-eyebrow">
              {t("nav.services", "Services")}
            </span>

            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
          </motion.div>

          {imageUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65 }}
              className="premium-detail-media"
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "200px",
              }}
            >
              <OptimizedImage
                src={imageUrl}
                alt={heroTitle}
                className="premium-detail-media__img"
                priority={true}
                onLoad={() => setHeroImageLoaded(true)}
                placeholder={true}
                objectFit="cover"
              />
            </motion.div>
          ) : null}
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
              {processedServices.map((service) => {
                const {
                  id,
                  slug,
                  processedTitle: title,
                  processedDescription: description,
                  processedImageUrl: imageUrl,
                  processedIcon: icon,
                  processedCategory: category,
                  processedHighlight: highlights,
                  processedLink: link,
                } = service;

                return (
                  <motion.article
                    key={id ?? slug ?? title}
                    variants={fadeUp}
                    className="premium-product-card"
                  >
                    {imageUrl ? (
                      <div
                        className="premium-product-image-wrapper"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "200px",
                        }}
                      >
                        <OptimizedImage
                          src={imageUrl}
                          alt={title}
                          className="premium-product-image"
                          priority={false}
                          placeholder={true}
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="premium-product-image premium-fallback-media">
                        <span>{icon}</span>
                      </div>
                    )}

                    <div className="premium-product-body">
                      <span className="premium-mini-badge">{category}</span>

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

                      {link ? (
                        <Link to={link} className="premium-text-link">
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
