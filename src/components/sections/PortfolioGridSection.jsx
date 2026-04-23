import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import EmptyState from "../common/EmptyState";
import PortfolioCard from "../cards/PortfolioCard";

export default function PortfolioGridSection({
  title,
  description,
  projects = [],
  ctaLabel,
  ctaTo,
}) {
  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <section className="page-section">
      <Container>
        <div className="section-header-row">
          <SectionHeading title={title} description={description} />
          {ctaLabel && ctaTo ? (
            <Link to={ctaTo} className="text-link">
              {ctaLabel}
            </Link>
          ) : null}
        </div>

        {safeProjects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-3">
            {safeProjects.map((project) => (
              <PortfolioCard
                key={project?.id || project?.slug || Math.random()}
                project={project}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
