import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import "../../styles/publicPremium.css";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
          objectFit: "cover",
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

export default function TestimonialsClientsPage() {
  const { language, t } = useLanguage();

  // Fetch hero data - matching all other pages
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
  const [loading, setLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Memoize hero data to avoid recalculations
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

  // Memoize processed testimonials
  const processedTestimonials = useMemo(() => {
    return testimonials.map((item, index) => ({
      ...item,
      processedQuote: text(
        item.quote,
        item.message,
        item.content,
        item.text,
        t("clientsPage.defaultQuote", "No testimonial text."),
      ),
      processedName: text(
        item.clientName,
        item.name,
        item.author,
        t("clientsPage.anonymous", "Anonymous Client"),
      ),
      processedRoleLine: [item.clientRole, item.role, item.organization]
        .filter(Boolean)
        .join(" • "),
      processedAvatarUrl: text(item.avatarUrl, item.imageUrl, item.photoUrl),
      processedDelay: Math.min(index * 0.04, 0.5),
    }));
  }, [testimonials, t]);

  // Memoize processed client logos
  const processedClientLogos = useMemo(() => {
    return clientLogos.map((logo, index) => ({
      ...logo,
      processedName: text(
        logo.name,
        logo.clientName,
        `${t("clientsPage.client", "Client")} ${index + 1}`,
      ),
      processedLogoUrl: text(logo.logoUrl, logo.imageUrl),
    }));
  }, [clientLogos, t]);

  // Preload hero image when URL is available
  useEffect(() => {
    if (heroData.imageUrl) {
      preloadImage(heroData.imageUrl);
    }
  }, [heroData.imageUrl]);

  useEffect(() => {
    let active = true;

    async function loadClientContent() {
      try {
        setLoading(true);

        const [testimonialData, logoData] = await Promise.all([
          publicApi.getTestimonials({
            language: language || "EN",
            featuredOnly: false,
            page: 0,
            size: 12,
          }),
          publicApi.getClientLogos({
            language: language || "EN",
            featuredOnly: false,
            page: 0,
            size: 12,
          }),
        ]);

        if (active) {
          setTestimonials(normalizeList(testimonialData));
          setClientLogos(normalizeList(logoData));
        }
      } catch {
        if (active) {
          setTestimonials([]);
          setClientLogos([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadClientContent();

    return () => {
      active = false;
    };
  }, [language]);

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
              {t("nav.clients", "Clients")}
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
              />
            </motion.div>
          ) : null}
        </div>
      </section>

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

          {loading ? (
            <div className="premium-loading">
              {t("states.loadingTestimonials", "Loading client content...")}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="premium-empty-card">
              <strong>
                {t(
                  "clientsPage.noTestimonials",
                  "No testimonials available yet.",
                )}
              </strong>
            </div>
          ) : (
            <div className="premium-testimonial-grid premium-testimonial-grid-large">
              {processedTestimonials.map((item) => {
                const {
                  id,
                  processedQuote: quote,
                  processedName: name,
                  processedRoleLine: roleLine,
                  processedAvatarUrl: avatarUrl,
                  processedDelay: delay,
                } = item;

                return (
                  <motion.article
                    key={id ?? quote.slice(0, 20)}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay }}
                    viewport={{ once: true }}
                    className="premium-testimonial-card"
                  >
                    <div className="premium-quote-mark">"</div>

                    <p>"{quote}"</p>

                    <div className="premium-person">
                      {avatarUrl ? (
                        <div
                          style={{
                            position: "relative",
                            width: "48px",
                            height: "48px",
                            flexShrink: 0,
                          }}
                        >
                          <OptimizedImage
                            src={avatarUrl}
                            alt={name}
                            className="premium-avatar"
                            priority={false}
                            placeholder={false}
                          />
                        </div>
                      ) : (
                        <div className="premium-avatar premium-avatar-fallback">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <strong>{name}</strong>
                        <span>
                          {roleLine || t("clientsPage.client", "Client")}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
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

          {loading ? null : clientLogos.length === 0 ? (
            <div className="premium-empty-card">
              <strong>
                {t("clientsPage.noLogos", "No client logos available yet.")}
              </strong>
            </div>
          ) : (
            <div className="premium-logo-grid">
              {processedClientLogos.map((logo) => {
                const {
                  id,
                  processedName: name,
                  processedLogoUrl: logoUrl,
                } = logo;

                const content = logoUrl ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "60px",
                    }}
                  >
                    <OptimizedImage
                      src={logoUrl}
                      alt={name}
                      className="premium-logo-img"
                      priority={false}
                      placeholder={false}
                    />
                  </div>
                ) : (
                  <strong>{name}</strong>
                );

                return (
                  <div key={id ?? name} className="premium-logo-card">
                    {content}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

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
    </main>
  );
}
