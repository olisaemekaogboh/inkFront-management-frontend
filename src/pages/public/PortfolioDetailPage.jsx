import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

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

        if (active) {
          setProject(data);
        }
      } catch {
        if (active) {
          setProject(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [slug, language]);

  if (loading) {
    return (
      <div className="page">
        <main className="page__main">
          <div className="container text-center py-48">
            <div className="loading">Loading project...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="page">
        <main className="page__main">
          <div className="container">
            <div className="error-state-card">Project not found.</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="page__main">
        <div
          className="container py-48"
          style={{ maxWidth: "1024px", margin: "0 auto" }}
        >
          {project.coverImageUrl ? (
            <img
              src={project.coverImageUrl}
              alt={project.title || "Project"}
              className="mb-32 w-full rounded-xl object-cover"
              style={{ height: "320px" }}
            />
          ) : null}

          <div className="d-flex flex-wrap gap-8 mb-16 text-sm text-primary">
            {project.projectType ? <span>{project.projectType}</span> : null}
            {project.clientIndustry ? (
              <span>{project.clientIndustry}</span>
            ) : null}
          </div>

          <h1 className="text-3xl font-bold mb-16">
            {project.title ?? "Untitled Project"}
          </h1>

          <p className="text-base leading-relaxed text-soft mb-32">
            {project.description ??
              project.summary ??
              "No project description available."}
          </p>

          {project.liveUrl && project.liveUrl !== "#" ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn--primary mb-40"
            >
              Visit project
            </a>
          ) : null}

          <div className="mt-40">
            <Link to="/portfolio" className="btn btn--outline">
              ← Back to portfolio
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
