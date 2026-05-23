import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
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

// Map portfolio project slugs to your images based on actual database slugs
const portfolioImageMap = {
  // Education
  "edubridge-school-platform": "/images/portfolio/school.jpg",

  // Logistics
  "quickship-logistics-dashboard": "/images/portfolio/logistics.png",

  // E-commerce / Marketplace
  "halamart-marketplace": "/images/portfolio/market.png",

  // Fintech
  "payswift-bill-payments": "/images/portfolio/banking.png",
  "savewise-investment-platform": "/images/portfolio/invest.png",

  // Real Estate
  "propertyfinder-real-estate": "/images/portfolio/realEstate2.png",

  // Entertainment / Music
  "bloommusic-streaming": "/images/portfolio/music.png",

  // Healthcare
  "medicare-facility-management": "/images/portfolio/health.png",

  // Agriculture
  "farmconnect-agritech-marketplace": "/images/portfolio/agric.png",

  // Education Technology
  "skillbridge-learning-platform": "/images/portfolio/learn.png",

  // Events / Ticketing
  "eventwave-ticketing-platform": "/images/portfolio/ticket.png",

  // Faith & Community
  "churchflow-ministry-platform": "/images/portfolio/realEstate.png",

  // Business / Enterprise (default)
  "business-management": "/images/portfolio/business.png",
};

// Default fallback images
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

function getPortfolioImage(project, index) {
  // First, try to get image from the project data
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

  // Use local image based on slug
  if (project.slug && portfolioImageMap[project.slug]) {
    return portfolioImageMap[project.slug];
  }

  // Try to match by category/industry
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

  // Default fallback based on index
  return defaultImages[index % defaultImages.length];
}

// Enhanced image component with error handling
function PortfolioImage({ src, alt, className }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) return null;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(event) => {
        console.warn(`Failed to load portfolio image: ${src}`);
        setImageError(true);
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

export default function PortfolioListPage() {
  const { language, t } = useLanguage();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="premium-public-page">
      <section className="premium-hero premium-compact-hero">
        <div className="premium-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="premium-page-intro"
          >
            <span className="premium-eyebrow">
              {t("nav.portfolio", "Portfolio")}
            </span>

            <h1>
              {t("portfolioPage.title", "Selected work and case studies")}
            </h1>

            <p>
              {t(
                "portfolioPage.description",
                "Explore websites, platforms, dashboards, and business systems built to help brands grow online.",
              )}
            </p>
          </motion.div>
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
                  // REMOVED the language filter - now shows ALL languages!
                  // The API already filters by language, so we don't need to filter again

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
                      transition={{ duration: 0.5, delay: index * 0.04 }}
                      viewport={{ once: true }}
                    >
                      <Link to={to} className="premium-work-card">
                        <div className="premium-work-card__images">
                          {imageUrl ? (
                            <PortfolioImage
                              src={imageUrl}
                              alt={title}
                              className="premium-work-card__img"
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
