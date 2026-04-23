import { useEffect, useState } from "react";
import Container from "../../components/common/Container";
import { authService } from "../../services/authService";
import useLanguage from "../../hooks/useLanguage";

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [status, setStatus] = useState(t("pages.admin.statusLoading"));

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await authService.getAdminHealth();
        if (active) {
          setStatus(`${data.message || t("pages.admin.statusLoading")}`);
        }
      } catch (error) {
        if (active) {
          setStatus(error.message);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [t]);

  return (
    <Container className="page-section">
      <h1>{t("pages.admin.title")}</h1>
      <p>{t("pages.admin.subtitle")}</p>
      <p>{status}</p>
    </Container>
  );
}
