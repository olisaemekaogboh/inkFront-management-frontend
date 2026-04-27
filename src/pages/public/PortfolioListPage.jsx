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
              {projects.map((project, index) => {
                const title = text(
                  project.title,
                  project.name,
                  t("portfolioPage.untitled", "Untitled Project"),
                );

                const summary = text(
                  project.summary,
                  project.shortDescription,
                  project.description,
                  t("portfolioPage.noSummary", "Project summary unavailable."),
                );

                const imageUrl = text(
                  project.coverImageUrl,
                  project.imageUrl,
                  project.thumbnailUrl,
                  project.heroImageUrl,
                );

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
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          loading="lazy"
                          className="premium-work-image"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="premium-work-image premium-fallback-media">
                          <span>💼</span>
                        </div>
                      )}

                      <div>
                        <span className="premium-mini-badge">{tag}</span>
                        <h3>{title}</h3>
                        <p>{summary}</p>
                        <strong>
                          {t("common.viewProject", "View project")} →
                        </strong>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
