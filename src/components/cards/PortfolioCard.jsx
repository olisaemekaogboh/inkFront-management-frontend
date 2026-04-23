import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";

export default function PortfolioCard({ project }) {
  const { t } = useLanguage();

  if (!project) {
    return null;
  }

  return (
    <article className="card premium-card portfolio-card">
      {project.coverImageUrl ? (
        <div className="card-media">
          <img src={project.coverImageUrl} alt={project.title || "Project"} />
        </div>
      ) : null}

      <div className="card-content">
        {project.projectType ? (
          <span className="card-meta">{project.projectType}</span>
        ) : null}

        <h3>{project.title || t("states.emptyTitle")}</h3>
        <p>{project.summary || ""}</p>

        {project.slug ? (
          <Link to={`/portfolio/${project.slug}`} className="text-link">
            {t("common.viewDetails")}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
