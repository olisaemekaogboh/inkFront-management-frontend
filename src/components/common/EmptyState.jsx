import useLanguage from "../../hooks/useLanguage";

export default function EmptyState({ title }) {
  const { t } = useLanguage();

  return (
    <div className="empty-state">{title || t("common.noContentFound")}</div>
  );
}
