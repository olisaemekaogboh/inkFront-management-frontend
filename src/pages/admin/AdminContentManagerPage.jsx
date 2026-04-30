import { useEffect, useMemo, useState } from "react";
import { adminContentService } from "../../services/adminContentService";

const templates = {
  services: {
    language: "EN",
    title: "",
    slug: "",
    summary: "",
    description: "",
    icon: "",
    imageUrl: "",
    featured: true,
    active: true,
    sortOrder: 1,
  },
  portfolio: {
    language: "EN",
    title: "",
    slug: "",
    summary: "",
    description: "",
    clientName: "",
    projectUrl: "",
    imageUrl: "",
    featured: true,
    active: true,
    sortOrder: 1,
  },
  products: {
    language: "EN",
    title: "",
    slug: "",
    summary: "",
    description: "",
    priceLabel: "",
    imageUrl: "",
    featured: true,
    active: true,
    sortOrder: 1,
  },
  testimonials: {
    language: "EN",
    clientName: "",
    clientRole: "",
    companyName: "",
    quote: "",
    avatarUrl: "",
    featured: true,
    active: true,
    sortOrder: 1,
  },
  "client-logos": {
    language: "EN",
    name: "",
    logoUrl: "",
    websiteUrl: "",
    featured: true,
    active: true,
    sortOrder: 1,
  },
  "hero-sections": {
    language: "EN",
    placement: "HOME",
    title: "",
    subtitle: "",
    description: "",
    primaryButtonLabel: "Start a project",
    primaryButtonUrl: "/contact",
    secondaryButtonLabel: "View services",
    secondaryButtonUrl: "/services",
    imageUrl: "",
    featured: true,
    active: true,
    sortOrder: 1,
  },
  "homepage-sections": {
    language: "EN",
    sectionKey: "",
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    featured: true,
    active: true,
    sortOrder: 1,
  },
};

const endpointMap = {
  services: "/admin/services",
  portfolio: "/admin/projects",
  products: "/admin/product-blueprints",
  testimonials: "/admin/testimonials",
  "client-logos": "/admin/client-logos",
  "hero-sections": "/admin/hero-sections",
  "homepage-sections": "/admin/homepage-sections",
};

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

export default function AdminContentManagerPage({ type, title, description }) {
  const endpoint = endpointMap[type];
  const template = useMemo(() => templates[type] || {}, [type]);

  const [items, setItems] = useState([]);
  const [jsonText, setJsonText] = useState(prettyJson(template));
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");

  const resetFormOnly = () => {
    setEditingItem(null);
    setJsonText(prettyJson(template));
  };

  const loadItems = async () => {
    if (!endpoint) {
      setError(`Invalid admin content type: ${type}`);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await adminContentService.list(endpoint);
      setItems(normalizeList(data));
    } catch (err) {
      setError(err.message || "Failed to load content.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    resetFormOnly();
    setFeedback("");
    setError("");
    loadItems();
  }, [endpoint, template]);

  const handleNew = () => {
    resetFormOnly();
    setFeedback("");
    setError("");
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setJsonText(prettyJson(item));
    setFeedback("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!endpoint) {
      setError(`Invalid admin content type: ${type}`);
      return;
    }

    setSaving(true);
    setFeedback("");
    setError("");

    try {
      const payload = JSON.parse(jsonText);

      if (editingItem?.id) {
        await adminContentService.update(endpoint, editingItem.id, payload);
        resetFormOnly();
        setFeedback("Content updated successfully.");
      } else {
        await adminContentService.create(endpoint, payload);
        resetFormOnly();
        setFeedback("Content created successfully.");
      }

      await loadItems();
    } catch (err) {
      setError(err.message || "Save failed. Check your JSON and DTO fields.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title || item.name || item.clientName || "this item"}"?`,
    );

    if (!confirmed) return;

    setError("");
    setFeedback("");

    try {
      await adminContentService.remove(endpoint, item.id);
      setFeedback("Content deleted successfully.");
      await loadItems();
    } catch (err) {
      setError(err.message || "Delete failed.");
    }
  };

  return (
    <section className="admin-content p-4 sm:p-6 lg:p-8">
      <div className="admin-section-header">
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <button type="button" className="btn btn-secondary" onClick={handleNew}>
          New
        </button>
      </div>

      <form onSubmit={handleSubmit} className="content-panel mb-6">
        <div className="admin-modal-header">
          <h3>{editingItem ? "Edit content" : "Create content"}</h3>
        </div>

        <label className="admin-form-field">
          <span>DTO JSON</span>
          <textarea
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            rows={16}
            spellCheck="false"
            className="font-mono text-sm"
          />
        </label>

        {error ? <p className="error-state mt-4">{error}</p> : null}
        {feedback ? <p className="form-feedback mt-4">{feedback}</p> : null}

        <div className="admin-modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleNew}
          >
            Reset
          </button>

          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : editingItem ? "Update" : "Create"}
          </button>
        </div>
      </form>

      <div className="admin-table-shell">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title / Name</th>
                <th>Language</th>
                <th>Featured</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Loading...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6">No content yet.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <strong>
                        {item.title ||
                          item.name ||
                          item.clientName ||
                          item.sectionKey ||
                          "Untitled"}
                      </strong>
                      <br />
                      <small>
                        {item.slug || item.summary || item.quote || ""}
                      </small>
                    </td>
                    <td>{item.language || "EN"}</td>
                    <td>{String(Boolean(item.featured))}</td>
                    <td>{String(item.active !== false)}</td>
                    <td>
                      <div className="admin-table-actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
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
