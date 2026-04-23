import { useEffect, useState } from "react";
import Container from "../../components/common/Container";
import useLanguage from "../../hooks/useLanguage";
import { adminDashboardService } from "../../services/admin/adminResourceService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: {
      metrics: [],
    },
  });

  useEffect(() => {
    let active = true;

    async function load() {
      setState({
        loading: true,
        error: "",
        data: { metrics: [] },
      });

      try {
        const data = await adminDashboardService.getOverview();

        if (active) {
          setState({
            loading: false,
            error: "",
            data,
          });
        }
      } catch (error) {
        if (active) {
          setState({
            loading: false,
            error: error.message,
            data: { metrics: [] },
          });
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  if (state.loading) {
    return <LoadingSpinner label={t("admin.dashboard.loading")} />;
  }

  if (state.error) {
    return <ErrorState message={state.error} />;
  }

  return (
    <Container className="page-section">
      <div className="admin-dashboard-header">
        <h2>{t("admin.dashboard.title")}</h2>
        <p>{t("admin.dashboard.description")}</p>
      </div>

      <div className="admin-metric-grid">
        {(state.data.metrics || []).map((metric) => (
          <article key={metric.key} className="admin-metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>
    </Container>
  );
}
