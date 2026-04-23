import { Link } from "react-router-dom";
import Container from "../common/Container";

export default function CTASection({
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
}) {
  return (
    <section className="page-section">
      <Container>
        <div className="cta-banner">
          <div className="cta-banner-copy">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>

          <div className="hero-actions">
            {primaryLabel && primaryTo ? (
              <Link to={primaryTo} className="btn btn-primary">
                {primaryLabel}
              </Link>
            ) : null}

            {secondaryLabel && secondaryTo ? (
              <Link to={secondaryTo} className="btn btn-secondary">
                {secondaryLabel}
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
