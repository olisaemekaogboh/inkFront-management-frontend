import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import EmptyState from "../common/EmptyState";
import TestimonialCard from "../cards/TestimonialCard";

export default function TestimonialSection({
  title,
  description,
  testimonials = [],
  ctaLabel,
  ctaTo,
}) {
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

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

        {safeTestimonials.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-3">
            {safeTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial?.id || `testimonial-${index}`}
                testimonial={testimonial}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
