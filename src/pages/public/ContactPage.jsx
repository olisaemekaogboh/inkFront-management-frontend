import useLanguage from "../../hooks/useLanguage";
import PageHeader from "../../components/common/PageHeader";
import Container from "../../components/common/Container";
import ContactForm from "../../components/sections/ContactForm";
import NewsletterSection from "../../components/sections/NewsletterSection";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        title={t("pages.contact.title")}
        subtitle={t("pages.contact.subtitle")}
      />

      <section className="page-section">
        <Container>
          <div className="content-split-grid">
            <article className="content-panel">
              <h2>{t("pages.contact.formTitle")}</h2>
              <p>{t("pages.contact.formDescription")}</p>
              <ContactForm />
            </article>

            <article className="content-panel">
              <h2>{t("pages.contact.ctaTitle")}</h2>
              <p>{t("pages.contact.ctaDescription")}</p>
            </article>
          </div>
        </Container>
      </section>

      <NewsletterSection />
    </>
  );
}
