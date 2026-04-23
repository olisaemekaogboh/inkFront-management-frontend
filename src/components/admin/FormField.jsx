import useLanguage from "../../hooks/useLanguage";

export default function FormField({ field, value, onChange }) {
  const { t } = useLanguage();

  if (field.type === "checkbox") {
    return (
      <label className="admin-form-checkbox">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.name, event.target.checked)}
        />
        <span>{t(field.labelKey)}</span>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="admin-form-field">
        <span>{t(field.labelKey)}</span>
        <textarea
          rows="5"
          value={value ?? ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          required={field.required}
        />
      </label>
    );
  }

  return (
    <label className="admin-form-field">
      <span>{t(field.labelKey)}</span>
      <input
        type={field.type || "text"}
        value={value ?? ""}
        onChange={(event) =>
          onChange(
            field.name,
            field.type === "number"
              ? Number(event.target.value)
              : event.target.value,
          )
        }
        required={field.required}
      />
    </label>
  );
}
