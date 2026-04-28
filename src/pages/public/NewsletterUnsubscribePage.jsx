import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Container from "../../components/common/Container";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import useLanguage from "../../hooks/useLanguage";
import newsletterService from "../../services/newsletterService";

export default function NewsletterUnsubscribePage() {
  const { token } = useParams();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function unsubscribe() {
      setLoading(true);

      try {
        await newsletterService.unsubscribe(token);

        if (!ignore) {
          setSuccess(true);
          setMessage(
            t(
              "newsletter.unsubscribeSuccess",
              "You have been unsubscribed successfully.",
            ),
          );
        }
      } catch (err) {
        if (!ignore) {
          setSuccess(false);
          setMessage(
            err?.response?.data?.message ||
              err?.message ||
              t(
                "newsletter.unsubscribeFailed",
                "Could not unsubscribe this email.",
              ),
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    unsubscribe();

    return () => {
      ignore = true;
    };
  }, [token, t]);

  if (loading) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  return (
    <main className="page-section">
      <Container>
        <div className="state-card">
          <h1>
            {success
              ? t("newsletter.unsubscribedTitle", "Unsubscribed")
              : t("newsletter.unsubscribeErrorTitle", "Unable to unsubscribe")}
          </h1>

          <p>{message}</p>

          <Link to="/" className="premium-btn premium-btn-primary">
            {t("common.backHome", "Back home")}
          </Link>
        </div>
      </Container>
    </main>
  );
}
