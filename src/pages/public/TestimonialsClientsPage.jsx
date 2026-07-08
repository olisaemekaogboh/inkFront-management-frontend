import { useEffect, useState, useCallback } from "react";
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

  // Get hero data
  const heroItem = normalizeList(hero.data)[0] || null;

  const heroTitle = text(
    heroItem?.title,
    t("clientsPage.title", "Client stories, trust signals, and business proof"),
  );

  const heroSubtitle = text(
    heroItem?.subtitle,
    heroItem?.description,
    t(
      "clientsPage.description",
      "Feedback from client engagements and organizations supported with websites, digital products, and business systems.",
    ),
  );

  const imageUrl = getImageUrl(heroItem);

  return (
    <main className="premium-public-page">
      {/* Hero section - matching all other pages */}
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
            >
              <img
                src={imageUrl}
                alt={heroTitle}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.closest(
                    ".premium-detail-media",
                  ).style.display = "none";
                }}
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
              {testimonials.map((item, index) => {
                const quote = text(
                  item.quote,
                  item.message,
                  item.content,
                  t("clientsPage.defaultQuote", "No testimonial text."),
                );

                const name = text(
                  item.clientName,
                  item.name,
                  item.author,
                  t("clientsPage.anonymous", "Anonymous Client"),
                );

                const roleLine = [item.clientRole, item.role, item.organization]
                  .filter(Boolean)
                  .join(" • ");

                const avatarUrl = text(
                  item.avatarUrl,
                  item.imageUrl,
                  item.photoUrl,
                );

                return (
                  <motion.article
                    key={item.id ?? index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: index * 0.04 }}
                    viewport={{ once: true }}
                    className="premium-testimonial-card"
                  >
                    <div className="premium-quote-mark">"</div>

                    <p>"{quote}"</p>

                    <div className="premium-person">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={name}
                          className="premium-avatar"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
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
              {clientLogos.map((logo, index) => {
                const name = text(
                  logo.name,
                  logo.clientName,
                  `${t("clientsPage.client", "Client")} ${index + 1}`,
                );
                const logoUrl = text(logo.logoUrl, logo.imageUrl);

                const content = logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={name}
                    className="premium-logo-img"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <strong>{name}</strong>
                );

                if (logo.websiteUrl) {
                  return (
                    <a
                      key={logo.id ?? index}
                      href={logo.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="premium-logo-card"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div key={logo.id ?? index} className="premium-logo-card">
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
