import useLanguage from "../../hooks/useLanguage";

export default function LoadingSpinner({ label }) {
  const { t } = useLanguage();

  return <div className="loading">{label || t("common.loading")}</div>;
}
