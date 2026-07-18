import { useEffect, useMemo, useState, useCallback, memo } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import "../../styles/publicPremium.css";

// ==================== CONSTANTS ====================

const SERVICE_HIGHLIGHT_KEYS = {
  "website-development": "websiteDevelopment",
  "business-automation": "businessAutomation",
  "brand-and-product-strategy": "brandProductStrategy",
  "ecommerce-platforms": "ecommercePlatforms",
  "seo-and-content-systems": "seoContentSystems",
  "custom-software-solutions": "customSoftwareSolutions",
  "mobile-app-development": "mobileAppDevelopment",
};

const FALLBACK_ICONS = ["🚀", "⚙️", "📊", "🎨", "💻", "📱", "🔧", "💡"];

const ICON_MAP = {
  code: "💻",
  workflow: "⚙️",
  target: "🎯",
  "shopping-cart": "🛒",
  search: "🔎",
  layers: "🧩",
  smartphone: "📱",
};

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const STAGGER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ==================== UTILITY FUNCTIONS ====================

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

function optimizeImageUrl(url) {
  if (!url) return url;

  if (url.includes("images.unsplash.com")) {
    const hasParams = url.includes("?");
    return `${url}${hasParams ? "&" : "?"}auto=format&fit=crop&w=1600&q=80`;
  }

  if (url.includes("cloudinary.com")) {
    return url;
  }

  return url;
}

function getServiceIcon(service, index) {
  const key = service?.iconKey || service?.icon_key || service?.icon || "";
  return ICON_MAP[key] || FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

function getServiceHighlight(service, highlights) {
  const key = SERVICE_HIGHLIGHT_KEYS[service.slug];
  return key ? highlights[key] : null;
}

// ==================== OPTIMIZED IMAGE COMPONENT ====================

const OptimizedImage = memo(function OptimizedImage({
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
  const optimizedSrc = useMemo(() => optimizeImageUrl(src), [src]);

  if (!src || imageError) return null;

  return (
    <div className="optimized-image-wrapper">
      {placeholder && !isLoaded && <div className="image-placeholder" />}
      <img
        src={optimizedSrc}
        alt={alt || ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={() => {
          setImageError(true);
        }}
      />
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// ==================== MEMOIZED CHILD COMPONENTS ====================

const ServicesHero = memo(function ServicesHero({ title, subtitle, imageUrl }) {
  const { t } = useLanguage();

  return (
    <section className="premium-detail-hero">
      <div
        className={
          imageUrl
            ? "premium-container premium-detail-grid"
            : "premium-container premium-page-intro"
        }
      >
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="premium-eyebrow">
            {t("nav.services", "Services")}
          </span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </m.div>

        {imageUrl && (
          <m.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="premium-detail-media"
          >
            <OptimizedImage
              src={imageUrl}
              alt={title}
              className="premium-detail-media__img"
              priority={true}
              placeholder={true}
              objectFit="cover"
            />
          </m.div>
        )}
      </div>
    </section>
  );
});

ServicesHero.displayName = "ServicesHero";

const ServicesBanner = memo(function ServicesBanner() {
  const { t } = useLanguage();

  return (
    <section className="premium-section" style={{ paddingBottom: 0 }}>
      <div className="premium-container">
        <m.div
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
        </m.div>
      </div>
    </section>
  );
});

ServicesBanner.displayName = "ServicesBanner";

const ServiceCard = memo(function ServiceCard({
  service,
  index,
  highlights,
  t,
}) {
  const {
    id,
    slug,
    processedTitle: title,
    processedDescription: description,
    processedImageUrl: imageUrl,
    processedIcon: icon,
    processedCategory: category,
    processedHighlight: highlight,
    processedLink: link,
  } = service;

  return (
    <m.article variants={FADE_UP_VARIANTS} className="premium-product-card">
      {imageUrl ? (
        <div className="premium-product-image-wrapper">
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

        {highlight && (
          <div className="premium-service-highlights">
            <p className="premium-service-highlights__timeline">
              ⏱ {highlight.timeline}
            </p>
            <p className="premium-service-highlights__preview">
              {highlight.body.slice(0, 120)}...
            </p>
          </div>
        )}

        {link && (
          <Link to={link} className="premium-text-link">
            {t("servicesPage.viewDetails", "View service details")} →
          </Link>
        )}
      </div>
    </m.article>
  );
});

ServiceCard.displayName = "ServiceCard";

const ServicesGrid = memo(function ServicesGrid({
  services,
  loading,
  error,
  highlights,
  t,
}) {
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
      processedIcon: getServiceIcon(service, index),
      processedCategory: service.category || t("nav.services", "Service"),
      processedHighlight: getServiceHighlight(service, highlights),
      processedLink: service.slug ? `/services/${service.slug}` : null,
    }));
  }, [services, t, highlights]);

  if (loading) {
    return (
      <div className="premium-product-grid">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="premium-product-card skeleton-card">
            <div className="skeleton-image" />
            <div className="premium-product-body">
              <div className="skeleton-text skeleton-title" />
              <div className="skeleton-text skeleton-description" />
              <div className="skeleton-text skeleton-description" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-empty-card">
        <strong>{t("states.error", "Something went wrong")}</strong>
        <p>{error}</p>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="premium-empty-card">
        <strong>{t("servicesPage.empty", "No services available yet.")}</strong>
      </div>
    );
  }

  return (
    <m.div
      variants={STAGGER_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="premium-product-grid"
    >
      {processedServices.map((service, index) => (
        <ServiceCard
          key={service.id ?? service.slug ?? service.processedTitle}
          service={service}
          index={index}
          highlights={highlights}
          t={t}
        />
      ))}
    </m.div>
  );
});

ServicesGrid.displayName = "ServicesGrid";

const CTASection = memo(function CTASection() {
  const { t } = useLanguage();

  return (
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
  );
});

CTASection.displayName = "CTASection";

// ==================== SKELETON LOADING COMPONENT ====================

const ServicesSkeleton = memo(function ServicesSkeleton() {
  return (
    <div className="premium-product-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="premium-product-card skeleton-card">
          <div className="skeleton-image" />
          <div className="premium-product-body">
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-description" />
            <div className="skeleton-text skeleton-description" />
          </div>
        </div>
      ))}
    </div>
  );
});

ServicesSkeleton.displayName = "ServicesSkeleton";

// ==================== MAIN COMPONENT ====================

export default function ServicesPage() {
  const { language, t } = useLanguage();

  // ==================== DATA FETCHING ====================

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
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState("");

  // ==================== MEMOIZED DATA ====================

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

  // ==================== SIDE EFFECTS ====================

  useEffect(() => {
    let active = true;

    async function loadServices() {
      try {
        setLoadingServices(true);
        setServicesError("");

        const response = await publicApi.getServices({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 12,
        });

        if (active) {
          setServices(normalizeList(response));
        }
      } catch (err) {
        if (active) {
          setServices([]);
          const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            t("states.failedToLoadServices", "Failed to load services");
          setServicesError(errorMessage);
        }
      } finally {
        if (active) {
          setLoadingServices(false);
        }
      }
    }

    loadServices();

    return () => {
      active = false;
    };
  }, [language, t]);

  // ==================== LOADING & ERROR STATES ====================

  if (hero.loading) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  if (hero.error) {
    return <ErrorState message={hero.error} />;
  }

  // ==================== RENDER ====================

  return (
    <LazyMotion features={domAnimation}>
      <main className="premium-public-page">
        <ServicesHero
          title={heroData.title}
          subtitle={heroData.subtitle}
          imageUrl={heroData.imageUrl}
        />

        <ServicesBanner />

        <section className="premium-section">
          <div className="premium-container">
            <ServicesGrid
              services={services}
              loading={loadingServices}
              error={servicesError}
              highlights={serviceHighlights}
              t={t}
            />
          </div>
        </section>

        <CTASection />
      </main>
    </LazyMotion>
  );
}

// ==================== CSS CLASSES NEEDED ====================
/* 
  Add these CSS classes to your stylesheet:

  .optimized-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: inherit;
    z-index: 1;
  }

  .skeleton-card {
    background: #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
  }

  .skeleton-image {
    width: 100%;
    height: 200px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-text {
    height: 14px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .skeleton-title {
    height: 20px;
    width: 70%;
  }

  .skeleton-description {
    width: 90%;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .premium-product-image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .premium-product-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .premium-detail-media {
    position: relative;
    overflow: hidden;
    min-height: 200px;
  }
*/
