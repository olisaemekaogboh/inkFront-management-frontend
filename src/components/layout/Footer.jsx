import Container from "../common/Container";
import useLanguage from "../../hooks/useLanguage";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <Container>
        <p>
          {t("footer.copyright", {
            year: new Date().getFullYear(),
            appName: t("common.appName"),
          })}
        </p>
      </Container>
    </footer>
  );
}
