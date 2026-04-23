import Button from "../common/Button";
import useLanguage from "../../hooks/useLanguage";

export default function ConfirmDialog({
  open,
  titleKey = "admin.confirmDelete.title",
  descriptionKey = "admin.confirmDelete.description",
  onClose,
  onConfirm,
  confirming = false,
}) {
  const { t } = useLanguage();

  if (!open) {
    return null;
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-card admin-confirm-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3>{t(titleKey)}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>

        <p>{t(descriptionKey)}</p>

        <div className="admin-modal-actions">
          <Button variant="secondary" type="button" onClick={onClose}>
            {t("admin.actions.cancel")}
          </Button>

          <Button
            variant="primary"
            type="button"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming
              ? t("admin.actions.deleting")
              : t("admin.actions.delete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
