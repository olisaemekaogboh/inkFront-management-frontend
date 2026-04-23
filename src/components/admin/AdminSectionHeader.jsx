import Button from "../common/Button";
import useLanguage from "../../hooks/useLanguage";

export default function AdminSectionHeader({
  titleKey,
  descriptionKey,
  onCreate,
  createLabelKey = "admin.actions.create",
  createDisabled = false,
}) {
  const { t } = useLanguage();

  return (
    <div className="admin-section-header">
      <div>
        <h2>{t(titleKey)}</h2>
        <p>{t(descriptionKey)}</p>
      </div>

      {onCreate ? (
        <Button variant="primary" onClick={onCreate} disabled={createDisabled}>
          {t(createLabelKey)}
        </Button>
      ) : null}
    </div>
  );
}
