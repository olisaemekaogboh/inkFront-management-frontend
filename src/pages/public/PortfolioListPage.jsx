import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import "../../styles/publicPremium.css";

// ==================== CONSTANTS ====================

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const STAGGER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const PORTFOLIO_IMAGE_MAP = {
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

const DEFAULT_IMAGES = [
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
    return `${url}${hasParams ? "&" : "?"}auto=format&fit=crop&w=1600&q=80`;
  }

  if (url.includes("cloudinary.com")) {
    return url;
  }

  return url;
}

function getProcessedTitle(project, t) {
  return text(
    project.title,
    project.name,
    t("portfolioPage.untitled", "Untitled Project"),
  );
}

function getProcessedSummary(project, t) {
  return text(
    project.summary,
    project.shortDescription,
    project.description,
    t("portfolioPage.noSummary", "Project summary unavailable."),
  );
}

function getProcessedTag(project, t) {
  return text(
    project.projectType,
    project.clientIndustry,
    project.category,
    t("portfolioPage.project", "Project"),
  );
}

function getProcessedLink(project) {
  return project.slug ? `/portfolio/${project.slug}` : "/portfolio";
}

function truncateSummary(summary, maxLength = 100) {
  if (!summary) return "";
  return summary.length > maxLength
    ? summary.substring(0, maxLength) + "..."
    : summary;
}

function getCategoryMatch(category, title) {
  const categoryLower = (category || "").toLowerCase();
  const titleLower = (title || "").toLowerCase();

  if (
    categoryLower.includes("agric") ||
    titleLower.includes("farm") ||
    titleLower.includes("agric")
  ) {
    return "agric";
  }
  if (
    categoryLower.includes("fintech") ||
    titleLower.includes("bank") ||
    titleLower.includes("pay") ||
    titleLower.includes("finance")
  ) {
    return "banking";
  }
  if (
    categoryLower.includes("ecommerce") ||
    titleLower.includes("market") ||
    titleLower.includes("shop") ||
    titleLower.includes("store")
  ) {
    return "market";
  }
  if (
    categoryLower.includes("logistics") ||
    titleLower.includes("ship") ||
    titleLower.includes("delivery")
  ) {
    return "logistics";
  }
  if (
    categoryLower.includes("health") ||
    titleLower.includes("medical") ||
    titleLower.includes("hospital")
  ) {
    return "health";
  }
  if (
    categoryLower.includes("education") ||
    titleLower.includes("learn") ||
    titleLower.includes("course") ||
    titleLower.includes("school")
  ) {
    return "learn";
  }
  if (
    categoryLower.includes("entertainment") ||
    titleLower.includes("music") ||
    titleLower.includes("stream")
  ) {
    return "music";
  }
  if (categoryLower.includes("estate") || titleLower.includes("property")) {
    return "realEstate2";
  }
  if (categoryLower.includes("event") || titleLower.includes("ticket")) {
    return "ticket";
  }
  return null;
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

  if (project.slug && PORTFOLIO_IMAGE_MAP[project.slug]) {
    return PORTFOLIO_IMAGE_MAP[project.slug];
  }

  const categoryMatch = getCategoryMatch(project.clientIndustry, project.title);
  if (categoryMatch) {
    const matchedKey = Object.keys(PORTFOLIO_IMAGE_MAP).find((key) =>
      key.includes(categoryMatch),
    );
    if (matchedKey) {
      return PORTFOLIO_IMAGE_MAP[matchedKey];
    }
  }

  return DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
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

const PortfolioHero = memo(function PortfolioHero({
  title,
  subtitle,
  imageUrl,
}) {
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
            {t("nav.portfolio", "Portfolio")}
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

PortfolioHero.displayName = "PortfolioHero";

const PortfolioImage = memo(function PortfolioImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
}) {
  return (
    <div className="portfolio-image-container">
      <OptimizedImage
        src={src}
        alt={alt}
        className={className}
        priority={priority}
        onLoad={onLoad}
        placeholder={true}
        objectFit="cover"
      />
    </div>
  );
});

PortfolioImage.displayName = "PortfolioImage";

const PortfolioCard = memo(function PortfolioCard({ project, index, t }) {
  const {
    id,
    slug,
    processedTitle: title,
    processedSummary: summary,
    processedImageUrl: imageUrl,
    processedTag: tag,
    processedLink: to,
  } = project;

  const truncatedSummary = useMemo(() => truncateSummary(summary), [summary]);

  return (
    <m.div variants={FADE_UP_VARIANTS} className="portfolio-card-wrapper">
      <Link
        to={to}
        className="premium-work-card"
        aria-label={`View ${title} project`}
      >
        <div className="premium-work-card__images">
          {imageUrl ? (
            <PortfolioImage
              src={imageUrl}
              alt={title}
              className="premium-work-card__img"
              priority={false}
            />
          ) : (
            <div className="premium-work-card__placeholder" aria-hidden="true">
              <span>💼</span>
            </div>
          )}
        </div>

        <div className="premium-work-card__content">
          <span className="premium-mini-badge">{tag}</span>
          <h3>{title}</h3>
          <p>{truncatedSummary}</p>
          <strong className="premium-text-link">
            {t("common.viewProject", "View project")} →
          </strong>
        </div>
      </Link>
    </m.div>
  );
});

PortfolioCard.displayName = "PortfolioCard";

const LoadingPortfolio = memo(function LoadingPortfolio() {
  return (
    <div className="premium-work-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="premium-work-card skeleton-card">
          <div className="skeleton-image" />
          <div className="premium-work-card__content">
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-description" />
            <div className="skeleton-text skeleton-description" />
          </div>
        </div>
      ))}
    </div>
  );
});

LoadingPortfolio.displayName = "LoadingPortfolio";

const EmptyPortfolio = memo(function EmptyPortfolio({ error, t }) {
  if (error) {
    return (
      <div className="premium-empty-card">
        <strong>{t("states.error", "Something went wrong")}</strong>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="premium-empty-card">
      <strong>
        {t("portfolioPage.empty", "No portfolio projects available yet.")}
      </strong>
    </div>
  );
});

EmptyPortfolio.displayName = "EmptyPortfolio";

const PortfolioGrid = memo(function PortfolioGrid({
  projects,
  loading,
  error,
  t,
}) {
  const processedProjects = useMemo(() => {
    return projects.map((project, index) => ({
      ...project,
      processedTitle: getProcessedTitle(project, t),
      processedSummary: getProcessedSummary(project, t),
      processedImageUrl: getPortfolioImage(project, index),
      processedTag: getProcessedTag(project, t),
      processedLink: getProcessedLink(project),
    }));
  }, [projects, t]);

  if (loading) {
    return <LoadingPortfolio />;
  }

  if (error || projects.length === 0) {
    return <EmptyPortfolio error={error} t={t} />;
  }

  return (
    <m.div
      variants={STAGGER_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="premium-work-grid"
    >
      {processedProjects.map((project, index) => (
        <PortfolioCard
          key={project.id ?? project.slug ?? index}
          project={project}
          index={index}
          t={t}
        />
      ))}
    </m.div>
  );
});

PortfolioGrid.displayName = "PortfolioGrid";

// ==================== MAIN COMPONENT ====================

export default function PortfolioListPage() {
  const { language, t } = useLanguage();

  // ==================== DATA FETCHING ====================

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
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  // ==================== MEMOIZED DATA ====================

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

  // ==================== SIDE EFFECTS ====================

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoadingProjects(true);
        setProjectsError("");

        const data = await publicApi.getPortfolioProjects({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 24,
        });

        if (active) {
          setProjects(normalizeList(data));
        }
      } catch (err) {
        if (active) {
          setProjects([]);
          const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            t("portfolioPage.loadError", "Failed to load portfolio.");
          setProjectsError(errorMessage);
        }
      } finally {
        if (active) {
          setLoadingProjects(false);
        }
      }
    }

    loadProjects();

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
        <PortfolioHero
          title={heroData.title}
          subtitle={heroData.subtitle}
          imageUrl={heroData.imageUrl}
        />

        <section className="premium-section">
          <div className="premium-container">
            <PortfolioGrid
              projects={projects}
              loading={loadingProjects}
              error={projectsError}
              t={t}
            />
          </div>
        </section>
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
    overflow: hidden;
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

  .portfolio-image-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .portfolio-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .portfolio-card-wrapper {
    height: 100%;
  }

  .premium-work-card {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    text-decoration: none;
    color: inherit;
  }

  .premium-work-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  .premium-work-card__images {
    position: relative;
    overflow: hidden;
    width: 100%;
    padding-top: 62.5%;
  }

  .premium-work-card__img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .premium-work-card__placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    background: #f0f0f5;
  }

  .premium-work-card__content {
    padding: 1.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .premium-work-card__content h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a1a2e;
  }

  .premium-work-card__content p {
    font-size: 0.875rem;
    color: #4a4a5a;
    line-height: 1.6;
    margin-bottom: 1rem;
    flex: 1;
  }

  .premium-text-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c63ff;
    font-weight: 500;
    text-decoration: none;
    transition: gap 0.3s ease;
  }

  .premium-text-link:hover {
    gap: 0.75rem;
    text-decoration: underline;
  }

  .premium-work-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .premium-detail-media {
    position: relative;
    overflow: hidden;
    min-height: 200px;
    border-radius: 12px;
  }

  .premium-detail-media__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
*/
