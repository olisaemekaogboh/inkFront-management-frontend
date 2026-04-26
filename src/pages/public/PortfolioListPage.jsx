import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
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

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      try {
        setLoading(true);

        const response = await publicApi.getPortfolioProjects({
          language: language || "EN",
          page: 0,
          size: 12,
        });

        if (active) {
          setProjects(normalizeList(response));
        }
      } catch {
        if (active) {
          setProjects([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, [language]);

  return (
    <main className="premium-public-page">
      <section className="premium-hero premium-compact-hero">
        <div className="premium-container">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
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
            <div className="premium-loading">Loading portfolio...</div>
          ) : projects.length === 0 ? (
            <div className="premium-empty-card">
              No portfolio projects available yet.
            </div>
          ) : (
            <div className="premium-work-grid">
              {projects.map((project, index) => {
                const title = text(
                  project.title,
                  project.name,
                  "Untitled Project",
                );
                const description = text(
                  project.summary,
                  project.description,
                  "Project summary unavailable.",
                );
                const imageUrl = text(
                  project.coverImageUrl,
                  project.imageUrl,
                  project.thumbnailUrl,
                );

                return (
                  <Link
                    key={project.id ?? project.slug ?? index}
                    to={
                      project.slug ? `/portfolio/${project.slug}` : "/portfolio"
                    }
                    className="premium-work-card"
                  >
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
                      <span className="premium-mini-badge">
                        {project.projectType ||
                          project.clientIndustry ||
                          "Project"}
                      </span>

                      <h3>{title}</h3>
                      <p>{description}</p>
                      <strong>View project →</strong>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
