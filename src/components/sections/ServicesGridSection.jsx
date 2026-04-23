import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import EmptyState from "../common/EmptyState";
import ServiceCard from "../cards/ServiceCard";

export default function ServicesGridSection({
  title,
  description,
  services = [],
  ctaLabel,
  ctaTo,
}) {
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

        {services.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-3">
            {services.map((service) => (
              <ServiceCard key={service.id || service.slug} service={service} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
