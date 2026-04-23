import { useParams } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { productBlueprintService } from "../../services/productBlueprintService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Container from "../../components/common/Container";
import CTASection from "../../components/sections/CTASection";

export default function ProductBlueprintPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const blueprint = useFetchOnMount(
    () => productBlueprintService.getProductBlueprintBySlug(slug, { language }),
    [slug, language],
  );

  if (blueprint.loading) {
    return <LoadingSpinner label={t("states.loadingPage")} />;
  }

  if (blueprint.error) {
    return <ErrorState message={blueprint.error} />;
  }

  const data = blueprint.data || {};
  const features = data.features || data.productFeatures || [];

  return (
    <>
      <section className="page-section">
        <Container>
          <article className="detail-shell">
            <header className="detail-hero">
              <div className="detail-hero-copy">
                <span className="detail-meta">
                  {t("pages.products.detailLabel")}
                </span>
                <h1>{data.title}</h1>
                <p>{data.summary}</p>
              </div>

              {data.heroImageUrl ? (
                <div className="detail-media-card">
                  <img src={data.heroImageUrl} alt={data.title} />
                </div>
              ) : null}
            </header>

            <div className="detail-stack">
              <section className="content-panel">
                <h2>{t("pages.blueprint.challenge")}</h2>
                <p>{data.challengeStatement || t("states.emptyGeneric")}</p>
              </section>

              <section className="content-panel">
                <h2>{t("pages.blueprint.solution")}</h2>
                <p>{data.solutionOverview || t("states.emptyGeneric")}</p>
              </section>

              <section className="content-panel">
                <h2>{t("pages.blueprint.features")}</h2>
                {features.length > 0 ? (
                  <ul className="feature-list">
                    {features.map((feature) => (
                      <li key={feature.id || feature.title}>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{data.featureHighlights || t("states.emptyGeneric")}</p>
                )}
              </section>
            </div>
          </article>
        </Container>
      </section>

      <CTASection
        title={t("cta.products.title")}
        description={t("cta.products.description")}
        primaryLabel={t("common.contactUs")}
        primaryTo="/contact"
        secondaryLabel={t("common.backToList")}
        secondaryTo="/products"
      />
    </>
  );
}
