import { useEffect, useMemo, useState } from "react";
import Button from "../common/Button";
import FormField from "./FormField";
import useLanguage from "../../hooks/useLanguage";

function buildInitialState(fields, initialValues = {}) {
  return fields.reduce((acc, field) => {
    if (initialValues[field.name] !== undefined) {
      acc[field.name] = initialValues[field.name];
    } else if (field.type === "checkbox") {
      acc[field.name] = false;
    } else if (field.type === "number") {
      acc[field.name] = 0;
    } else {
      acc[field.name] = "";
    }
    return acc;
  }, {});
}

export default function ResourceFormModal({
  open,
  titleKey,
  fields,
  initialValues,
  onClose,
  onSubmit,
  submitting = false,
}) {
  const { t } = useLanguage();
  const [form, setForm] = useState({});

  const normalizedInitialState = useMemo(
    () => buildInitialState(fields, initialValues),
    [fields, initialValues],
  );

  useEffect(() => {
    if (open) {
      setForm(normalizedInitialState);
    }
  }, [normalizedInitialState, open]);

  if (!open) {
    return null;
  }

  function handleChange(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3>{t(titleKey)}</h3>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            {t("common.close")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form-grid">
          {fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={form[field.name]}
              onChange={handleChange}
            />
          ))}

          <div className="admin-modal-actions">
            <Button variant="secondary" type="button" onClick={onClose}>
              {t("admin.actions.cancel")}
            </Button>

            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? t("admin.actions.saving") : t("admin.actions.save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
