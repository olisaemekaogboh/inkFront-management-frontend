import { useParams } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { portfolioService } from "../../services/portfolioService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import Container from "../../components/common/Container";
import CTASection from "../../components/sections/CTASection";

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const project = useFetchOnMount(
    () => portfolioService.getProjectBySlug(slug, { language }),
    [slug, language],
  );

  if (project.loading) {
    return <LoadingSpinner label={t("states.loadingPage")} />;
  }

  if (project.error) {
    return <ErrorState message={project.error} />;
  }

  const data = project.data || {};

  return (
    <>
      <section className="page-section">
        <Container>
          <article className="detail-shell">
            <header className="detail-hero">
              <div className="detail-hero-copy">
                <span className="detail-meta">
                  {data.projectType || t("pages.portfolio.detailLabel")}
                </span>
                <h1>{data.title}</h1>
                <p>{data.summary}</p>
              </div>

              {data.coverImageUrl ? (
                <div className="detail-media-card">
                  <img src={data.coverImageUrl} alt={data.title} />
                </div>
              ) : null}
            </header>

            <div className="detail-content-grid">
              <section className="content-panel">
                <h2>{t("pages.portfolio.overviewTitle")}</h2>
                <p>{data.description || t("states.emptyGeneric")}</p>
              </section>

              <aside className="content-panel">
                <h2>{t("pages.portfolio.projectInfoTitle")}</h2>
                <dl className="detail-meta-list">
                  <div>
                    <dt>{t("pages.portfolio.clientIndustry")}</dt>
                    <dd>{data.clientIndustry || t("states.notAvailable")}</dd>
                  </div>
                  <div>
                    <dt>{t("pages.portfolio.projectType")}</dt>
                    <dd>{data.projectType || t("states.notAvailable")}</dd>
                  </div>
                </dl>

                {data.liveUrl ? (
                  <a
                    className="btn btn-primary"
                    href={data.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("pages.portfolio.visitProject")}
                  </a>
                ) : null}
              </aside>
            </div>
          </article>
        </Container>
      </section>

      <CTASection
        title={t("cta.portfolio.title")}
        description={t("cta.portfolio.description")}
        primaryLabel={t("common.contactUs")}
        primaryTo="/contact"
        secondaryLabel={t("common.backToList")}
        secondaryTo="/portfolio"
      />
    </>
  );
}
