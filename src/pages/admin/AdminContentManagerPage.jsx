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
    status: "DRAFT",
    featured: false,
    active: false,
    sortOrder: 0,
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
    status: "DRAFT",
    featured: false,
    active: false,
    sortOrder: 0,
  },
  products: {
    language: "EN",
    title: "",
    slug: "",
    summary: "",
    description: "",
    priceLabel: "",
    imageUrl: "",
    status: "DRAFT",
    featured: false,
    active: false,
    sortOrder: 0,
  },
  testimonials: {
    language: "EN",
    clientName: "",
    clientRole: "",
    companyName: "",
    quote: "",
    avatarUrl: "",
    status: "DRAFT",
    featured: false,
    active: false,
    sortOrder: 0,
  },
  "client-logos": {
    language: "EN",
    name: "",
    logoUrl: "",
    websiteUrl: "",
    status: "DRAFT",
    featured: false,
    active: false,
    sortOrder: 0,
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
    status: "DRAFT",
    featured: false,
    active: false,
    sortOrder: 0,
  },
  "homepage-sections": {
    language: "EN",
    sectionKey: "",
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    status: "DRAFT",
    featured: false,
    active: false,
    sortOrder: 0,
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

function normalizeForEdit(item = {}) {
  const status = item.status || (item.active ? "PUBLISHED" : "DRAFT");

  return {
    ...item,
    title: item.title ?? item.name ?? "",
    summary: item.summary ?? item.shortDescription ?? "",
    description: item.description ?? item.fullDescription ?? "",
    icon: item.icon ?? item.iconKey ?? "",
    imageUrl:
      item.imageUrl ??
      item.coverImageUrl ??
      item.heroImageUrl ??
      item.backgroundImageUrl ??
      "",
    sortOrder: item.sortOrder ?? item.displayOrder ?? 0,
    status,
    active: status === "PUBLISHED",
    featured: Boolean(item.featured),
  };
}

function buildPayload(payload = {}) {
  const status = payload.status || (payload.active ? "PUBLISHED" : "DRAFT");
  const sortOrder = Number(payload.sortOrder ?? payload.displayOrder ?? 0);

  return {
    ...payload,
    status,
    active: status === "PUBLISHED",
    name: payload.name || payload.title,
    shortDescription: payload.shortDescription || payload.summary,
    fullDescription: payload.fullDescription || payload.description,
    iconKey: payload.iconKey || payload.icon,
    displayOrder: sortOrder,
    sortOrder,
    featured: Boolean(payload.featured),
  };
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
    const normalized = normalizeForEdit(item);
    setEditingItem(item);
    setJsonText(prettyJson(normalized));
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
      const parsed = JSON.parse(jsonText);
      const payload = buildPayload(parsed);

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

      {error ? <p className="error-state mt-4">{error}</p> : null}
      {feedback ? <p className="form-feedback mt-4">{feedback}</p> : null}

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
                <th>Status</th>
                <th>Featured</th>
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
                items.map((item) => {
                  const status =
                    item.status || (item.active ? "PUBLISHED" : "DRAFT");

                  return (
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
                      <td>{status}</td>
                      <td>{String(Boolean(item.featured))}</td>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
