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
            <div className="premium-loading">Loading project...</div>
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
              <strong>Project not found</strong>
              <Link to="/portfolio" style={{ display: "block", marginTop: 16 }}>
                ← Back to portfolio
              </Link>
            </div>
          </div>
        </section>
      </main>
    );

  const title = text(project.title, project.name, "Untitled Project");
  const description = text(
    project.description,
    project.summary,
    "No project description available.",
  );
  const imageUrl = text(
    project.coverImageUrl,
    project.imageUrl,
    project.thumbnailUrl,
  );
  const tag = text(project.projectType, project.clientIndustry, "Case Study");

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
                ← Back to portfolio
              </Link>
            </div>
          </div>
          <div className="premium-detail-media">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="premium-detail-placeholder">💼</div>
            )}
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container premium-detail-content">
          <article className="premium-info-panel">
            <span>01</span>
            <h2>Project Overview</h2>
            <p>{description}</p>
          </article>
          {project.clientIndustry && (
            <article className="premium-info-panel">
              <span>02</span>
              <h2>Industry</h2>
              <p>{project.clientIndustry}</p>
            </article>
          )}
          {project.projectType && (
            <article className="premium-info-panel">
              <span>03</span>
              <h2>Project Type</h2>
              <p>{project.projectType}</p>
            </article>
          )}
        </div>
      </section>

      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            Your project next
          </span>
          <h2>Want a platform built with this level of polish?</h2>
          <p>
            Let's design and build a business website or system that helps your
            brand stand out.
          </p>
          <Link to="/contact" className="premium-btn premium-btn-light">
            Start a project →
          </Link>
        </div>
      </section>
    </main>
  );
}
