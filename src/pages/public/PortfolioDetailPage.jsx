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

// Map portfolio project slugs to your images (same as list page)
const portfolioImageMap = {
  "edubridge-school-platform": "/images/portfolio/school.jpg",
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
};

function getPortfolioDetailImage(project) {
  // Skip AI-generated images, use local instead
  if (project.slug && portfolioImageMap[project.slug]) {
    return portfolioImageMap[project.slug];
  }

  // Try to match by category
  const category = (
    project.clientIndustry ||
    project.category ||
    ""
  ).toLowerCase();
  const title = (project.title || "").toLowerCase();

  if (category.includes("agric") || title.includes("farm")) {
    return "/images/portfolio/agric.png";
  }
  if (
    category.includes("fintech") ||
    title.includes("bank") ||
    title.includes("finance")
  ) {
    return "/images/portfolio/banking.png";
  }
  if (category.includes("ecommerce") || title.includes("market")) {
    return "/images/portfolio/market.png";
  }
  if (category.includes("logistics")) {
    return "/images/portfolio/logistics.png";
  }
  if (category.includes("health")) {
    return "/images/portfolio/health.png";
  }
  if (category.includes("education")) {
    return "/images/portfolio/learn.png";
  }
  if (category.includes("entertainment") || title.includes("music")) {
    return "/images/portfolio/music.png";
  }
  if (category.includes("estate") || title.includes("property")) {
    return "/images/portfolio/realEstate2.png";
  }
  if (category.includes("event") || title.includes("ticket")) {
    return "/images/portfolio/ticket.png";
  }

  return "/images/portfolio/business.png";
}

function PortfolioDetailImage({ src, alt }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className="premium-detail-placeholder">
        <span>📁</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      style={{ width: "100%", height: "auto", borderRadius: "16px" }}
      onError={(event) => {
        console.warn(`Failed to load detail image: ${src}`);
        setImageError(true);
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

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

  if (loading)
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div className="premium-loading">
              {t("states.loadingPage", "Loading project...")}
            </div>
          </div>
        </section>
      </main>
    );

  if (!project)
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div className="premium-empty-card">
              <strong>{t("portfolio.notFound", "Project not found")}</strong>
              <Link to="/portfolio" style={{ display: "block", marginTop: 16 }}>
                ← {t("common.backToList", "Back to portfolio")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );

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
            <PortfolioDetailImage src={imageUrl} alt={title} />
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
