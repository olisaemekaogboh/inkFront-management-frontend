import { useEffect, useMemo, useState } from "react";
import { adminContentService } from "../../../services/adminContentService";
import "./AdminCrudPage.css";

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeItemForForm(item, initialValues) {
  return {
    ...initialValues,
    ...item,
    title: item?.title ?? item?.name ?? initialValues.title ?? "",
    summary:
      item?.summary ?? item?.shortDescription ?? initialValues.summary ?? "",
    description:
      item?.description ??
      item?.fullDescription ??
      initialValues.description ??
      "",
    icon: item?.icon ?? item?.iconKey ?? initialValues.icon ?? "",
    sortOrder:
      item?.sortOrder ?? item?.displayOrder ?? initialValues.sortOrder ?? 0,
    status: item?.status ?? (item?.active ? "PUBLISHED" : "DRAFT"),
  };
}

function buildPayload(form) {
  return {
    ...form,
    name: form.name || form.title,
    shortDescription: form.shortDescription || form.summary,
    fullDescription: form.fullDescription || form.description,
    iconKey: form.iconKey || form.icon,
    displayOrder: Number(form.displayOrder ?? form.sortOrder ?? 0),
    sortOrder: Number(form.sortOrder ?? form.displayOrder ?? 0),
    featured: Boolean(form.featured),
    active: form.status === "PUBLISHED",
  };
}

export default function AdminCrudPage({ config }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(config.initialValues);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const fields = useMemo(() => config.fields || [], [config.fields]);

  const loadItems = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await adminContentService.list(config.endpoint);
      setItems(normalizeList(data));
    } catch (err) {
      setError(err.message || "Failed to load content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setForm(config.initialValues);
    setEditingItem(null);
    loadItems();
  }, [config]);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field.name]: field.type === "number" ? Number(value) : value,
    }));
  };

  const handleCheckbox = (field, checked) => {
    setForm((current) => ({
      ...current,
      [field.name]: checked,
    }));
  };

  const resetForm = () => {
    setForm(config.initialValues);
    setEditingItem(null);
    setNotice("");
    setError("");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setForm(normalizeItemForForm(item, config.initialValues));
    setNotice("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    setError("");

    try {
      const payload = buildPayload(form);

      if (editingItem?.id) {
        await adminContentService.update(
          config.endpoint,
          editingItem.id,
          payload,
        );
        setNotice("Content updated successfully.");
      } else {
        await adminContentService.create(config.endpoint, payload);
        setNotice("Content created successfully.");
      }

      resetForm();
      await loadItems();
    } catch (err) {
      setError(err.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const label =
      item?.title ||
      item?.name ||
      item?.clientName ||
      item?.placement ||
      "this item";

    if (!window.confirm(`Delete "${label}"?`)) return;

    setNotice("");
    setError("");

    try {
      await adminContentService.remove(config.endpoint, item.id);
      setNotice("Content deleted successfully.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  };

  const handleQuickStatus = async (item, status) => {
    try {
      const payload = buildPayload({
        ...normalizeItemForForm(item, config.initialValues),
        status,
      });

      await adminContentService.update(config.endpoint, item.id, payload);
      setNotice(`Content marked as ${status}.`);
      await loadItems();
    } catch (err) {
      setError(err.message || "Status update failed.");
    }
  };

  return (
    <section className="admin-crud-page">
      <div className="admin-crud-hero">
        <div>
          <span className="admin-crud-eyebrow">{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>

        <button
          type="button"
          className="admin-crud-primary-btn"
          onClick={resetForm}
        >
          New
        </button>
      </div>

      {notice ? <div className="admin-crud-notice">{notice}</div> : null}
      {error ? <div className="admin-crud-error">{error}</div> : null}

      <div className="admin-crud-card">
        <div className="admin-crud-card-header">
          <div>
            <span className="admin-crud-eyebrow">
              {editingItem ? "Update" : "Create"}
            </span>
            <h2>{editingItem ? "Edit content" : "Create new content"}</h2>
          </div>
        </div>

        <form className="admin-crud-form" onSubmit={handleSubmit}>
          <div className="admin-crud-form-grid">
            {fields.map((field) => (
              <label
                key={field.name}
                className={
                  field.type === "textarea" || field.name === "description"
                    ? "admin-crud-field admin-crud-field--wide"
                    : "admin-crud-field"
                }
              >
                <span>
                  {field.label}
                  {field.required ? " *" : ""}
                </span>

                {field.type === "select" ? (
                  <select
                    value={form[field.name] ?? ""}
                    required={field.required}
                    onChange={(event) =>
                      handleChange(field, event.target.value)
                    }
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={form[field.name] ?? ""}
                    required={field.required}
                    onChange={(event) =>
                      handleChange(field, event.target.value)
                    }
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.name])}
                    onChange={(event) =>
                      handleCheckbox(field, event.target.checked)
                    }
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    value={form[field.name] ?? ""}
                    required={field.required}
                    onChange={(event) =>
                      handleChange(field, event.target.value)
                    }
                  />
                )}
              </label>
            ))}
          </div>

          <div className="admin-crud-form-actions">
            <button
              type="button"
              className="admin-crud-secondary-btn"
              onClick={resetForm}
            >
              Reset
            </button>

            <button
              type="submit"
              className="admin-crud-primary-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : editingItem ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-crud-card">
        <div className="admin-crud-table-wrap">
          <table className="admin-crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Content</th>
                <th>Language</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7">Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="7">No content yet.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <div className="admin-crud-title-cell">
                        <strong>
                          {item.title ||
                            item.name ||
                            item.clientName ||
                            item.placement ||
                            "Untitled"}
                        </strong>
                        <small>
                          {item.slug ||
                            item.summary ||
                            item.quote ||
                            item.logoUrl ||
                            ""}
                        </small>
                      </div>
                    </td>
                    <td>{item.language || "EN"}</td>
                    <td>
                      <span
                        className={`admin-crud-status admin-crud-status--${(
                          item.status || (item.active ? "PUBLISHED" : "DRAFT")
                        ).toLowerCase()}`}
                      >
                        {item.status || (item.active ? "PUBLISHED" : "DRAFT")}
                      </span>
                    </td>
                    <td>{String(Boolean(item.featured))}</td>
                    <td>{item.sortOrder ?? item.displayOrder ?? 0}</td>
                    <td>
                      <div className="admin-crud-actions">
                        <button type="button" onClick={() => handleEdit(item)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(item, "PUBLISHED")}
                        >
                          Publish
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatus(item, "DRAFT")}
                        >
                          Draft
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
