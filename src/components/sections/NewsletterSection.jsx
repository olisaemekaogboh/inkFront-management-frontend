import Container from "../common/Container";
import NewsletterForm from "./NewsletterForm";
import useLanguage from "../../hooks/useLanguage";

export default function NewsletterSection() {
  const { t } = useLanguage();

  return (
    <section className="page-section">
      <Container>
        <div className="cta-banner">
          <div className="cta-banner-copy">
            <h2>{t("sections.newsletter.title")}</h2>
            <p>{t("sections.newsletter.description")}</p>
          </div>

          <div className="cta-banner-form">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
