import { useEffect, useState, useCallback, useMemo, memo } from "react";
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

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const STAGGER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
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

function optimizeImageUrl(url) {
  if (!url) return url;

  if (url.includes("images.unsplash.com")) {
    const hasParams = url.includes("?");
    return `${url}${hasParams ? "&" : "?"}auto=format&fit=crop&w=1200&q=80`;
  }

  if (url.includes("cloudinary.com")) {
    return url;
  }

  return url;
}

function getProcessedQuote(item, t) {
  return text(
    item.quote,
    item.message,
    item.content,
    item.text,
    t("clientsPage.defaultQuote", "No testimonial text."),
  );
}

function getProcessedName(item, t) {
  return text(
    item.clientName,
    item.name,
    item.author,
    t("clientsPage.anonymous", "Anonymous Client"),
  );
}

function getProcessedRoleLine(item) {
  return [item.clientRole, item.role, item.organization]
    .filter(Boolean)
    .join(" • ");
}

function getProcessedAvatarUrl(item) {
  return text(item.avatarUrl, item.imageUrl, item.photoUrl);
}

function getProcessedLogoName(logo, t, index) {
  return text(
    logo.name,
    logo.clientName,
    `${t("clientsPage.client", "Client")} ${index + 1}`,
  );
}

function getProcessedLogoUrl(logo) {
  return text(logo.logoUrl, logo.imageUrl);
}

function getDelay(index) {
  return Math.min(index * 0.04, 0.5);
}

// ==================== OPTIMIZED IMAGE COMPONENT ====================

const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
  placeholder = true,
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

const ClientsHero = memo(function ClientsHero({ title, subtitle, imageUrl }) {
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
          <span className="premium-eyebrow">{t("nav.clients", "Clients")}</span>
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
            />
          </m.div>
        )}
      </div>
    </section>
  );
});

ClientsHero.displayName = "ClientsHero";

const TestimonialCard = memo(function TestimonialCard({ testimonial, t }) {
  const {
    id,
    processedQuote: quote,
    processedName: name,
    processedRoleLine: roleLine,
    processedAvatarUrl: avatarUrl,
    processedDelay: delay,
  } = testimonial;

  return (
    <m.article
      key={id ?? quote.slice(0, 20)}
      variants={FADE_UP_VARIANTS}
      custom={delay}
      className="premium-testimonial-card"
      role="article"
      aria-label={`Testimonial from ${name}`}
    >
      <div className="premium-quote-mark" aria-hidden="true">
        "
      </div>

      <p>"{quote}"</p>

      <div className="premium-person">
        {avatarUrl ? (
          <div className="premium-avatar-wrapper">
            <OptimizedImage
              src={avatarUrl}
              alt={name}
              className="premium-avatar"
              priority={false}
              placeholder={false}
            />
          </div>
        ) : (
          <div
            className="premium-avatar premium-avatar-fallback"
            aria-hidden="true"
          >
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <strong>{name}</strong>
          <span>{roleLine || t("clientsPage.client", "Client")}</span>
        </div>
      </div>
    </m.article>
  );
});

TestimonialCard.displayName = "TestimonialCard";

const TestimonialsSection = memo(function TestimonialsSection({
  testimonials,
  loading,
  error,
  t,
}) {
  const processedTestimonials = useMemo(() => {
    return testimonials.map((item, index) => ({
      ...item,
      processedQuote: getProcessedQuote(item, t),
      processedName: getProcessedName(item, t),
      processedRoleLine: getProcessedRoleLine(item),
      processedAvatarUrl: getProcessedAvatarUrl(item),
      processedDelay: getDelay(index),
    }));
  }, [testimonials, t]);

  if (loading) {
    return (
      <div className="premium-testimonial-grid premium-testimonial-grid-large">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="premium-testimonial-card skeleton-card">
            <div className="skeleton-quote" />
            <div className="skeleton-text skeleton-text-long" />
            <div className="skeleton-text skeleton-text-medium" />
            <div className="skeleton-person">
              <div className="skeleton-avatar" />
              <div>
                <div className="skeleton-text skeleton-title" />
                <div className="skeleton-text skeleton-description" />
              </div>
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

  if (testimonials.length === 0) {
    return (
      <div className="premium-empty-card">
        <strong>
          {t("clientsPage.noTestimonials", "No testimonials available yet.")}
        </strong>
      </div>
    );
  }

  return (
    <m.div
      variants={STAGGER_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="premium-testimonial-grid premium-testimonial-grid-large"
    >
      {processedTestimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id ?? testimonial.processedQuote.slice(0, 20)}
          testimonial={testimonial}
          t={t}
        />
      ))}
    </m.div>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

const ClientLogoCard = memo(function ClientLogoCard({ logo, t }) {
  const { id, processedName: name, processedLogoUrl: logoUrl } = logo;

  if (logoUrl) {
    return (
      <div
        className="premium-logo-card"
        role="img"
        aria-label={`Logo for ${name}`}
      >
        <div className="premium-logo-wrapper">
          <OptimizedImage
            src={logoUrl}
            alt={name}
            className="premium-logo-img"
            priority={false}
            placeholder={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="premium-logo-card premium-logo-text">
      <strong>{name}</strong>
    </div>
  );
});

ClientLogoCard.displayName = "ClientLogoCard";

const ClientLogoSection = memo(function ClientLogoSection({
  logos,
  loading,
  error,
  t,
}) {
  const processedLogos = useMemo(() => {
    return logos.map((logo, index) => ({
      ...logo,
      processedName: getProcessedLogoName(logo, t, index),
      processedLogoUrl: getProcessedLogoUrl(logo),
    }));
  }, [logos, t]);

  if (loading) {
    return (
      <div className="premium-logo-grid">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="premium-logo-card skeleton-logo" />
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

  if (logos.length === 0) {
    return (
      <div className="premium-empty-card">
        <strong>
          {t("clientsPage.noLogos", "No client logos available yet.")}
        </strong>
      </div>
    );
  }

  return (
    <div className="premium-logo-grid">
      {processedLogos.map((logo) => (
        <ClientLogoCard key={logo.id ?? logo.processedName} logo={logo} t={t} />
      ))}
    </div>
  );
});

ClientLogoSection.displayName = "ClientLogoSection";

const CTASection = memo(function CTASection() {
  const { t } = useLanguage();

  return (
    <section className="premium-cta">
      <div className="premium-container premium-cta-inner">
        <span className="premium-eyebrow premium-eyebrow--light">
          {t("clientsPage.ctaEyebrow", "Join the next success story")}
        </span>
        <h2>
          {t(
            "clientsPage.ctaTitle",
            "Let's build a professional platform for your brand.",
          )}
        </h2>
        <p>
          {t(
            "clientsPage.ctaDescription",
            "Your website should communicate trust, show proof, and turn visitors into real conversations.",
          )}
        </p>
        <Link to="/contact" className="premium-btn premium-btn-light">
          {t("common.contactUs", "Start a project")} →
        </Link>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

// ==================== MAIN COMPONENT ====================

export default function TestimonialsClientsPage() {
  const { language, t } = useLanguage();

  // ==================== DATA FETCHING ====================

  const fetchHero = useCallback(
    () =>
      heroService.getHeroSections({
        language,
        placement: "CLIENTS",
        featuredOnly: true,
      }),
    [language],
  );

  const hero = useFetchOnMount(fetchHero, [language]);

  const [testimonials, setTestimonials] = useState([]);
  const [clientLogos, setClientLogos] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [loadingLogos, setLoadingLogos] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState("");
  const [logosError, setLogosError] = useState("");

  // ==================== MEMOIZED DATA ====================

  const heroData = useMemo(() => {
    const heroItem = normalizeList(hero.data)[0] || null;
    return {
      item: heroItem,
      title: text(
        heroItem?.title,
        t(
          "clientsPage.title",
          "Client stories, trust signals, and business proof",
        ),
      ),
      subtitle: text(
        heroItem?.subtitle,
        heroItem?.description,
        t(
          "clientsPage.description",
          "Feedback from client engagements and organizations supported with websites, digital products, and business systems.",
        ),
      ),
      imageUrl: getImageUrl(heroItem),
    };
  }, [hero.data, t]);

  // ==================== SIDE EFFECTS ====================

  useEffect(() => {
    let active = true;

    async function loadTestimonials() {
      try {
        setLoadingTestimonials(true);
        setTestimonialsError("");

        const response = await publicApi.getTestimonials({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 12,
        });

        if (active) {
          setTestimonials(normalizeList(response));
        }
      } catch (err) {
        if (active) {
          setTestimonials([]);
          const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            t("states.failedToLoadTestimonials", "Failed to load testimonials");
          setTestimonialsError(errorMessage);
        }
      } finally {
        if (active) {
          setLoadingTestimonials(false);
        }
      }
    }

    async function loadLogos() {
      try {
        setLoadingLogos(true);
        setLogosError("");

        const response = await publicApi.getClientLogos({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 12,
        });

        if (active) {
          setClientLogos(normalizeList(response));
        }
      } catch (err) {
        if (active) {
          setClientLogos([]);
          const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            t("states.failedToLoadLogos", "Failed to load client logos");
          setLogosError(errorMessage);
        }
      } finally {
        if (active) {
          setLoadingLogos(false);
        }
      }
    }

    loadTestimonials();
    loadLogos();

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
        <ClientsHero
          title={heroData.title}
          subtitle={heroData.subtitle}
          imageUrl={heroData.imageUrl}
        />

        <section className="premium-section premium-testimonial-section">
          <div className="premium-container">
            <div className="premium-section-head">
              <span className="premium-eyebrow">
                {t("clientsPage.testimonialsEyebrow", "Testimonials")}
              </span>
              <h2>
                {t(
                  "clientsPage.testimonialsTitle",
                  "What clients say about working with InkFront",
                )}
              </h2>
              <p>
                {t(
                  "clientsPage.testimonialsDescription",
                  "Real feedback should help future clients understand the quality, clarity, and professionalism of your work.",
                )}
              </p>
            </div>

            <TestimonialsSection
              testimonials={testimonials}
              loading={loadingTestimonials}
              error={testimonialsError}
              t={t}
            />
          </div>
        </section>

        <section className="premium-logo-strip premium-logo-strip-spacious">
          <div className="premium-container">
            <span>
              {t(
                "clientsPage.logosTitle",
                "Trusted organizations and client brands",
              )}
            </span>

            <ClientLogoSection
              logos={clientLogos}
              loading={loadingLogos}
              error={logosError}
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
    padding: 2rem;
  }

  .skeleton-quote {
    width: 60px;
    height: 24px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .skeleton-text {
    height: 14px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .skeleton-text-long {
    width: 95%;
  }

  .skeleton-text-medium {
    width: 75%;
  }

  .skeleton-title {
    height: 18px;
    width: 60%;
  }

  .skeleton-description {
    width: 80%;
    height: 12px;
  }

  .skeleton-person {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .skeleton-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-logo {
    height: 60px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 8px;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .premium-avatar-wrapper {
    position: relative;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
  }

  .premium-logo-wrapper {
    position: relative;
    width: 100%;
    height: 60px;
  }

  .premium-logo-text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .premium-testimonial-grid-large {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }
*/
