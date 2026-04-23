import { Link } from "react-router-dom";
import Container from "../common/Container";
import useLanguage from "../../hooks/useLanguage";

export default function HeroSection({ hero }) {
  const { t } = useLanguage();

  return (
    <section className="hero-section">
      <Container>
        <div className="hero-layout">
          <div className="hero-copy">
            <span className="section-eyebrow">
              {hero?.eyebrow || t("sections.hero.eyebrow")}
            </span>

            <h1>{hero?.title || t("pages.home.fallbackHeroTitle")}</h1>
            <p>{hero?.subtitle || t("pages.home.fallbackHeroSubtitle")}</p>

            <div className="hero-actions">
              <Link to="/contact" className="btn btn-primary">
                {t("common.contactUs")}
              </Link>
              <Link to="/services" className="btn btn-secondary">
                {t("common.learnMore")}
              </Link>
            </div>
          </div>

          {hero?.imageUrl ? (
            <div className="hero-media">
              <img src={hero.imageUrl} alt={hero.title} />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
