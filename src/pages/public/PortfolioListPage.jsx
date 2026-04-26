import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";

export default function PortfolioListPage() {
  const { language } = useLanguage();

  const [page, setPage] = useState({
    content: [],
    totalPages: 0,
    page: 0,
  });

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
          setPage(response);
        }
      } catch {
        if (active) {
          setPage({ content: [], totalPages: 0, page: 0 });
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

  const projects = Array.isArray(page.content) ? page.content : [];

  return (
    <div className="page">
      <main className="page__main">
        <section className="page-section bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <span className="hero__badge">Portfolio</span>
              <h1 className="text-3xl font-bold mt-16 mb-12">Portfolio</h1>
              <p className="text-md text-soft">
                Selected work, case studies, and launches from our recent
                engagements.
              </p>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            {loading ? (
              <div className="loading">Loading portfolio...</div>
            ) : projects.length === 0 ? (
              <div className="empty-state">
                No portfolio projects available yet.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-24">
                {projects.map((project, index) => (
                  <article
                    key={project.id ?? project.slug ?? index}
                    className="card"
                  >
                    {project.coverImageUrl ? (
                      <div className="card__media">
                        <img
                          src={project.coverImageUrl}
                          alt={project.title || "Project"}
                          loading="lazy"
                        />
                      </div>
                    ) : null}

                    <div className="card__content">
                      <div className="text-xs font-semibold uppercase tracking-wide text-primary mb-8">
                        {project.projectType ||
                          project.clientIndustry ||
                          "Project"}
                      </div>

                      <h3 className="card__title">
                        {project.title ?? "Untitled Project"}
                      </h3>

                      <p className="card__description">
                        {project.summary ??
                          project.description ??
                          "Project summary unavailable."}
                      </p>

                      {project.slug ? (
                        <Link
                          to={`/portfolio/${project.slug}`}
                          className="btn btn--outline btn--sm mt-16"
                        >
                          View project →
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
