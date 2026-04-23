import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import EmptyState from "../common/EmptyState";
import ClientLogoCard from "../cards/ClientLogoCard";

export default function ClientLogoSection({ title, description, logos = [] }) {
  return (
    <section className="page-section">
      <Container>
        <SectionHeading title={title} description={description} />

        {logos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="client-logo-grid">
            {logos.map((logo) => (
              <ClientLogoCard
                key={logo.id || logo.slug || logo.name}
                logo={logo}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
