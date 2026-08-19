import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

// ==================== IMAGE MAP ====================

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

// ==================== IMAGE UTILITY ====================

function getPortfolioDetailImage(project) {
  // 1. First check if we have a mapped image for this slug
  if (project.slug && PORTFOLIO_IMAGE_MAP[project.slug]) {
    return PORTFOLIO_IMAGE_MAP[project.slug];
  }

  // 2. Check if project has a cover image that's not from AI
  const projectImage = text(
    project.coverImageUrl,
    project.imageUrl,
    project.heroImageUrl,
    project.featuredImageUrl,
    project.thumbnailUrl,
  );

  if (projectImage && !projectImage.includes("pollinations")) {
    return projectImage;
  }

  // 3. Try to match by category or title
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
    title.includes("finance") ||
    title.includes("pay")
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

  // 4. Default fallback
  return "/images/portfolio/business.png";
}

// ==================== OPTIMIZED IMAGE COMPONENT ====================

function PortfolioDetailImage({ src, alt, priority = false }) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If there's an error or no src, show placeholder
  if (!src || imageError) {
    return (
      <div className="premium-detail-placeholder" style={{ minHeight: 300 }}>
        <span style={{ fontSize: "4rem" }}>📁</span>
        <p style={{ marginTop: 8, color: "#666" }}>No image available</p>
      </div>
    );
  }

  return (
    <div
      className="premium-detail-media-wrapper"
      style={{ position: "relative", minHeight: 300 }}
    >
      {!isLoaded && (
        <div
          className="image-loading-placeholder"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <span style={{ fontSize: "2rem" }}>🔄</span>
        </div>
      )}
      <img
        src={src}
        alt={alt || "Project image"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "16px",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
          display: "block",
        }}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          console.warn(`Failed to load image: ${src}`);
          setImageError(true);
          e.currentTarget.style.display = "none";
          // Try to load a fallback after error
          const fallback = "/images/portfolio/business.png";
          if (src !== fallback) {
            e.currentTarget.src = fallback;
          }
        }}
      />
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadProject() {
      try {
        setLoading(true);
        const data = await publicApi.getPortfolioProjectBySlug(slug, {
          language: language || "EN",
        });
        if (active) setProject(data);
      } catch (err) {
        console.error("Failed to load project:", err);
        if (active) setProject(null);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProject();
    return () => {
      active = false;
    };
  }, [slug, language]);

  if (loading) {
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div
              className="premium-loading"
              style={{ textAlign: "center", padding: "4rem 0" }}
            >
              <span style={{ fontSize: "2rem" }}>⏳</span>
              <p>{t("states.loadingPage", "Loading project...")}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div
              className="premium-empty-card"
              style={{ textAlign: "center", padding: "4rem 0" }}
            >
              <strong>{t("portfolio.notFound", "Project not found")}</strong>
              <Link
                to="/portfolio"
                style={{ display: "inline-block", marginTop: 16 }}
              >
                ← {t("common.backToList", "Back to portfolio")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const title = text(
    project.title,
    project.name,
    t("portfolio.untitled", "Untitled Project"),
  );

  const description = text(
    project.description,
    project.summary,
    t("portfolio.noDescription", "No project description available."),
  );

  const imageUrl = getPortfolioDetailImage(project);
  const tag = text(
    project.projectType,
    project.clientIndustry,
    t("portfolio.caseStudy", "Case Study"),
  );

  // Debug log to see what image is being used
  console.log(`📸 Project: ${title}, Image URL: ${imageUrl}`);

  return (
    <main className="premium-public-page">
      <section className="premium-detail-hero">
        <div className="premium-container premium-detail-grid">
          <div>
            <span className="premium-eyebrow">{tag}</span>
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="premium-actions">
              <Link to="/portfolio" className="premium-btn premium-btn-ghost">
                ← {t("common.backToList", "Back to portfolio")}
              </Link>
            </div>
          </div>
          <div className="premium-detail-media">
            <PortfolioDetailImage src={imageUrl} alt={title} priority={true} />
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container premium-detail-content">
          <article className="premium-info-panel">
            <span>01</span>
            <h2>{t("portfolio.overviewTitle", "Project Overview")}</h2>
            <p>{description}</p>
          </article>
          {project.clientIndustry && (
            <article className="premium-info-panel">
              <span>02</span>
              <h2>{t("portfolio.clientIndustry", "Industry")}</h2>
              <p>{project.clientIndustry}</p>
            </article>
          )}
          {project.projectType && (
            <article className="premium-info-panel">
              <span>03</span>
              <h2>{t("portfolio.projectType", "Project Type")}</h2>
              <p>{project.projectType}</p>
            </article>
          )}
        </div>
      </section>

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            {t("portfolio.ctaEyebrow", "Your project next")}
          </span>
          <h2>
            {t(
              "portfolio.ctaTitle",
              "Want a platform built with this level of polish?",
            )}
          </h2>
          <p>
            {t(
              "portfolio.ctaDescription",
              "Let's design and build a business website or system that helps your brand stand out.",
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
