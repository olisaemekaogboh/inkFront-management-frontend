import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import EmptyState from "../common/EmptyState";

export default function FAQSection({ title, description, faqs = [] }) {
  return (
    <section className="page-section">
      <Container>
        <SectionHeading title={title} description={description} />

        {faqs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.id} className="faq-item">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
