import { useEffect, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import { portfolioService } from "../../services/portfolioService";
import PageHeader from "../../components/common/PageHeader";
import Container from "../../components/common/Container";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import PortfolioGridSection from "../../components/sections/PortfolioGridSection";

export default function PortfolioListPage() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: [],
  });

  useEffect(() => {
    let active = true;

    async function loadProjects() {
      if (!language) {
        if (active) {
          setState({
            loading: false,
            error: "Language is not available",
            data: [],
          });
        }
        return;
      }

      if (active) {
        setState((current) => ({
          ...current,
          loading: true,
          error: "",
        }));
      }

      try {
        const response = await portfolioService.getProjects({
          language,
          page: 0,
          size: 24,
          search: search.trim() || undefined,
        });

        const projects = Array.isArray(response)
          ? response
          : Array.isArray(response?.content)
            ? response.content
            : [];

        if (active) {
          setState({
            loading: false,
            error: "",
            data: projects,
          });
        }
      } catch (error) {
        if (active) {
          setState({
            loading: false,
            error: error?.message || "Failed to load projects",
            data: [],
          });
        }
      }
    }

    loadProjects();

    return () => {
      active = false;
    };
  }, [language, search]);

  return (
    <>
      <PageHeader
        title={t("pages.portfolio.title")}
        subtitle={t("pages.portfolio.subtitle")}
      />

      <section className="page-section page-section-compact">
        <Container>
          <div className="toolbar-panel">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("pages.portfolio.searchPlaceholder")}
              aria-label={t("pages.portfolio.searchPlaceholder")}
            />
          </div>
        </Container>
      </section>

      {state.loading ? (
        <LoadingSpinner label={t("states.loadingPage")} />
      ) : null}

      {state.error ? <ErrorState message={state.error} /> : null}

      {!state.loading && !state.error && state.data.length === 0 ? (
        <EmptyState title={t("states.emptyPortfolio")} />
      ) : null}

      {!state.loading && !state.error && state.data.length > 0 ? (
        <PortfolioGridSection
          projects={state.data}
          title={t("sections.portfolio.title")}
          description={t("sections.portfolio.description")}
        />
      ) : null}
    </>
  );
}
