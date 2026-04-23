import Container from "./Container";
import Button from "./Button";
import useLanguage from "../../hooks/useLanguage";

export default function ErrorState({ message }) {
  const { t } = useLanguage();

  const safeMessage =
    typeof message === "string"
      ? message
      : message?.message || t("states.errorGeneric");

  return (
    <section className="page-section">
      <Container>
        <div className="error-state-card">
          <h2>{t("states.errorTitle")}</h2>
          <p>{safeMessage}</p>
          <Button onClick={() => window.location.reload()}>
            {t("common.retry")}
          </Button>
        </div>
      </Container>
    </section>
  );
}