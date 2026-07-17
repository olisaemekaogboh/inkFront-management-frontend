import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import "../../styles/publicPremium.css";

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

const portfolioImageMap = {
  "edubridge-school-platform": "/images/portfolio/school.png",
  "quickship-logistics-dashboard": "/images/portfolio/logistics.png",
  "halamart-marketplace": "/images/portfolio/market.png",
  "payswift-bill-payments": "/images/portfolio/banking.png",
  "savewise-investment-platform": "/images/portfolio/invest.png",
  "propertyfinder-real-estate": "/images/portfolio/realEstate2.png",
  "bloommusic-streaming": "/images/portfolio/music.png",
  "medicare-facility-management": "/images/portfolio/health.png",
  "farmconnect-agritech-marketplace": "/images/portfolio/agric.png",
  "skillbridge-learning-platform": "/images/portfolio/learn.png",
  "eventwave-ticketing-platform": "/images/portfolio/ticket.png",
  "churchflow-ministry-platform": "/images/portfolio/realEstate.png",
  "business-management": "/images/portfolio/business.png",
};

const defaultImages = [
  "/images/portfolio/business.png",
  "/images/portfolio/agric.png",
  "/images/portfolio/banking.png",
  "/images/portfolio/health.png",
  "/images/portfolio/invest.png",
  "/images/portfolio/learn.png",
  "/images/portfolio/logistics.png",
  "/images/portfolio/market.png",
  "/images/portfolio/music.png",
  "/images/portfolio/realEstate.png",
  "/images/portfolio/realEstate2.png",
  "/images/portfolio/ticket.png",
];

// Preload critical images
function preloadImage(url) {
  if (!url) return;
  const img = new Image();
  img.src = url;
}

function getPortfolioImage(project, index) {
  const projectImage = text(
    project.coverImageUrl,
    project.imageUrl,
    project.thumbnailUrl,
    project.heroImageUrl,
    project.featuredImageUrl,
  );

  if (projectImage && !projectImage.includes("pollinations")) {
    return projectImage;
  }

  if (project.slug && portfolioImageMap[project.slug]) {
    return portfolioImageMap[project.slug];
  }

  const category = (
    project.clientIndustry ||
    project.category ||
    ""
  ).toLowerCase();
  const title = (project.title || "").toLowerCase();

  if (
    category.includes("agric") ||
    title.includes("farm") ||
    title.includes("agric")
  ) {
    return "/images/portfolio/agric.png";
  }
  if (
    category.includes("fintech") ||
    title.includes("bank") ||
    title.includes("pay") ||
    title.includes("finance")
  ) {
    return "/images/portfolio/banking.png";
  }
  if (
    category.includes("ecommerce") ||
    title.includes("market") ||
    title.includes("shop") ||
    title.includes("store")
  ) {
    return "/images/portfolio/market.png";
  }
  if (
    category.includes("logistics") ||
    title.includes("ship") ||
    title.includes("delivery")
  ) {
    return "/images/portfolio/logistics.png";
  }
  if (
    category.includes("health") ||
    title.includes("medical") ||
    title.includes("hospital")
  ) {
    return "/images/portfolio/health.png";
  }
  if (
    category.includes("education") ||
    title.includes("learn") ||
    title.includes("course") ||
    title.includes("school")
  ) {
    return "/images/portfolio/learn.png";
  }
  if (
    category.includes("entertainment") ||
    title.includes("music") ||
    title.includes("stream")
  ) {
    return "/images/portfolio/music.png";
  }
  if (category.includes("estate") || title.includes("property")) {
    return "/images/portfolio/realEstate2.png";
  }
  if (category.includes("event") || title.includes("ticket")) {
    return "/images/portfolio/ticket.png";
  }

  return defaultImages[index % defaultImages.length];
}

// Enhanced PortfolioImage component with priority support and better error handling
function PortfolioImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
  containerClassName = "",
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || imageError) return null;

  return (
    <div
      className={containerClassName}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {!isLoaded && (
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
        fetchpriority={priority ? "high" : "auto"}
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

export default function PortfolioListPage() {
  const { language, t } = useLanguage();

  const fetchHero = useCallback(
    () =>
      heroService.getHeroSections({
        language,
        placement: "PORTFOLIO",
        featuredOnly: true,
      }),
    [language],
  );

  const hero = useFetchOnMount(fetchHero, [language]);

  const [projects, setProjects] = useState([]);
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
        t("portfolioPage.title", "Selected work and case studies"),
      ),
      subtitle: text(
        heroItem?.subtitle,
        heroItem?.description,
        t(
          "portfolioPage.description",
          "Explore websites, platforms, dashboards, and business systems built to help brands grow online.",
        ),
      ),
      imageUrl: getImageUrl(heroItem),
    };
  }, [hero.data, t]);

  // Preload hero image when URL is available
  useEffect(() => {
    if (heroData.imageUrl) {
      preloadImage(heroData.imageUrl);
    }
  }, [heroData.imageUrl]);

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const data = await publicApi.getPortfolioProjects({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 24,
        });

        if (active) setProjects(normalizeList(data));
      } catch (err) {
        console.error("Failed to load portfolio:", err);

        if (active) {
          setProjects([]);
          setError(
            err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              t("portfolioPage.loadError", "Failed to load portfolio."),
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProjects();

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

  const {
    item: heroItem,
    title: heroTitle,
    subtitle: heroSubtitle,
    imageUrl,
  } = heroData;

  return (
    <main className="premium-public-page">
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
              {t("nav.portfolio", "Portfolio")}
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
              <PortfolioImage
                src={imageUrl}
                alt={heroTitle}
                className="premium-work-card__img"
                priority={true}
                onLoad={() => setHeroImageLoaded(true)}
                containerClassName="hero-image-container"
              />
            </motion.div>
          ) : null}
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container">
          {loading ? (
            <div className="premium-loading">
              {t("states.loadingPortfolio", "Loading portfolio...")}
            </div>
          ) : error ? (
            <div className="premium-empty-card">
              <strong>{t("states.error", "Something went wrong")}</strong>
              <p>{error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="premium-empty-card">
              <strong>
                {t(
                  "portfolioPage.empty",
                  "No portfolio projects available yet.",
                )}
              </strong>
            </div>
          ) : (
            <div className="premium-work-grid">
              {projects
                .map((project, index) => {
                  const title = text(
                    project.title,
                    project.name,
                    t("portfolioPage.untitled", "Untitled Project"),
                  );

                  const summary = text(
                    project.summary,
                    project.shortDescription,
                    project.description,
                    t(
                      "portfolioPage.noSummary",
                      "Project summary unavailable.",
                    ),
                  );

                  const imageUrl = getPortfolioImage(project, index);

                  const tag = text(
                    project.projectType,
                    project.clientIndustry,
                    project.category,
                    t("portfolioPage.project", "Project"),
                  );

                  const to = project.slug
                    ? `/portfolio/${project.slug}`
                    : "/portfolio";

                  return (
                    <motion.div
                      key={project.id ?? project.slug ?? index}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: Math.min(index * 0.04, 0.5),
                      }}
                      viewport={{ once: true }}
                    >
                      <Link to={to} className="premium-work-card">
                        <div
                          className="premium-work-card__images"
                          style={{ position: "relative", overflow: "hidden" }}
                        >
                          {imageUrl ? (
                            <PortfolioImage
                              src={imageUrl}
                              alt={title}
                              className="premium-work-card__img"
                              priority={false}
                            />
                          ) : (
                            <div className="premium-work-card__placeholder">
                              <span>💼</span>
                            </div>
                          )}
                        </div>

                        <div className="premium-work-card__content">
                          <span className="premium-mini-badge">{tag}</span>
                          <h3>{title}</h3>
                          <p>
                            {summary.length > 100
                              ? summary.substring(0, 100) + "..."
                              : summary}
                          </p>
                          <strong>
                            {t("common.viewProject", "View project")} →
                          </strong>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
                .filter(Boolean)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
