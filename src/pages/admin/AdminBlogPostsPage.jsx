import { useEffect, useMemo, useState } from "react";
import blogService from "../../services/blogService";
import useLanguage from "../../hooks/useLanguage";
import "./AdminBlogPostsPage.css";

const LANGUAGES = ["EN", "HA", "IG", "YO"];
const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const MEDIA_TYPES = ["IMAGE", "VIDEO"];

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImageUrl: "",
  videoUrl: "",
  embedVideoUrl: "",
  authorName: "",
  category: "",
  tagsText: "",
  language: "EN",
  status: "DRAFT",
  featured: false,
  displayOrder: 0,
  media: [],
};

function getPageContent(pageData) {
  if (!pageData) return [];
  if (Array.isArray(pageData)) return pageData;
  if (Array.isArray(pageData.content)) return pageData.content;
  if (Array.isArray(pageData.data)) return pageData.data;
  return [];
}

function getPageMeta(pageData) {
  if (!pageData || Array.isArray(pageData)) {
    return { page: 0, totalPages: 1, first: true, last: true };
  }

  return {
    page: pageData.number ?? pageData.page ?? 0,
    totalPages: pageData.totalPages ?? 1,
    first: Boolean(pageData.first ?? true),
    last: Boolean(pageData.last ?? true),
  };
}

function formatDate(value) {
  if (!value) return "—";

  try {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "—";
  }
}

function toForm(post) {
  if (!post) return emptyForm;

  return {
    title: post.title || "",
    slug: post.slug || "",
    excerpt: post.excerpt || "",
    content: post.content || "",
    featuredImageUrl: post.featuredImageUrl || "",
    videoUrl: post.videoUrl || "",
    embedVideoUrl: post.embedVideoUrl || "",
    authorName: post.authorName || "",
    category: post.category || "",
    tagsText: Array.isArray(post.tags) ? post.tags.join(", ") : "",
    language: post.language || "EN",
    status: post.status || "DRAFT",
    featured: Boolean(post.featured),
    displayOrder: post.displayOrder ?? 0,
    media: Array.isArray(post.media)
      ? post.media.map((item, index) => ({
          mediaType: item.mediaType || "IMAGE",
          mediaUrl: item.mediaUrl || "",
          displayOrder: item.displayOrder ?? index,
        }))
      : [],
  };
}

function toPayload(form) {
  return {
    title: form.title?.trim(),
    slug: form.slug?.trim() || null,
    excerpt: form.excerpt?.trim() || null,
    content: form.content || null,
    featuredImageUrl: form.featuredImageUrl?.trim() || null,
    videoUrl: form.videoUrl?.trim() || null,
    embedVideoUrl: form.embedVideoUrl?.trim() || null,
    authorName: form.authorName?.trim() || null,
    category: form.category?.trim() || null,
    tags: String(form.tagsText || "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    language: form.language || "EN",
    status: form.status || "DRAFT",
    featured: Boolean(form.featured),
    displayOrder: Number(form.displayOrder) || 0,
    media: Array.isArray(form.media)
      ? form.media
          .filter((item) => item?.mediaUrl?.trim())
          .map((item, index) => ({
            mediaType: item.mediaType || "IMAGE",
            mediaUrl: item.mediaUrl.trim(),
            displayOrder: Number(item.displayOrder) || index,
          }))
      : [],
  };
}

export default function AdminBlogPostsPage() {
  const { t } = useLanguage();

  const [postsData, setPostsData] = useState(null);
  const posts = useMemo(() => getPageContent(postsData), [postsData]);
  const pageMeta = useMemo(() => getPageMeta(postsData), [postsData]);

  const [filters, setFilters] = useState({
    language: "",
    status: "",
    search: "",
    page: 0,
    size: 10,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.language, filters.status, filters.page, filters.size]);

  async function loadPosts(customFilters = filters) {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: customFilters.page,
        size: customFilters.size,
      };

      if (customFilters.language) params.language = customFilters.language;
      if (customFilters.status) params.status = customFilters.status;
      if (customFilters.search?.trim()) {
        params.search = customFilters.search.trim();
      }

      const data = await blogService.getAdminPosts(params);
      setPostsData(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.blog.failedToLoad", "Failed to load blog posts"),
      );
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingPost(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function openEditModal(post) {
    setEditingPost(post);
    setForm(toForm(post));
    setError("");
    setNotice("");
    setModalOpen(true);
  }

  function closeModal() {
    if (actionLoading) return;
    setModalOpen(false);
    setEditingPost(null);
    setForm(emptyForm);
  }

  function updateForm(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function addMediaRow(type = "IMAGE") {
    setForm((current) => ({
      ...current,
      media: [
        ...(current.media || []),
        {
          mediaType: type,
          mediaUrl: "",
          displayOrder: current.media?.length || 0,
        },
      ],
    }));
  }

  function updateMediaRow(index, field, value) {
    setForm((current) => ({
      ...current,
      media: current.media.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function removeMediaRow(index) {
    setForm((current) => ({
      ...current,
      media: current.media.filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError(t("admin.blog.titleRequired", "Title is required"));
      return;
    }

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      const payload = toPayload(form);

      if (editingPost?.id) {
        await blogService.updatePost(editingPost.id, payload);
        setNotice(t("admin.blog.updated", "Blog post updated successfully"));
      } else {
        await blogService.createPost(payload);
        setNotice(t("admin.blog.created", "Blog post created successfully"));
      }

      setModalOpen(false);
      setEditingPost(null);
      setForm(emptyForm);
      await loadPosts();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.blog.saveFailed", "Failed to save blog post"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(post) {
    const confirmed = window.confirm(
      t(
        "admin.blog.deleteConfirm",
        `Delete "${post.title}"? This action cannot be undone.`,
      ),
    );

    if (!confirmed) return;

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      await blogService.deletePost(post.id);
      setNotice(t("admin.blog.deleted", "Blog post deleted successfully"));
      await loadPosts();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.blog.deleteFailed", "Failed to delete blog post"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handlePublishToggle(post) {
    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      if (post.status === "PUBLISHED") {
        await blogService.unpublishPost(post.id);
        setNotice(t("admin.blog.unpublished", "Blog post unpublished"));
      } else {
        await blogService.publishPost(post.id);
        setNotice(t("admin.blog.published", "Blog post published"));
      }

      await loadPosts();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.blog.statusFailed", "Failed to update status"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleArchive(post) {
    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      await blogService.archivePost(post.id);
      setNotice(t("admin.blog.archived", "Blog post archived"));
      await loadPosts();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.blog.archiveFailed", "Failed to archive blog post"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const nextFilters = {
      ...filters,
      page: 0,
    };

    setFilters(nextFilters);
    loadPosts(nextFilters);
  }

  function changeFilter(name, value) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      page: 0,
    }));
  }

  function goToPage(page) {
    setFilters((current) => ({
      ...current,
      page: Math.max(0, page),
    }));
  }

  return (
    <main className="admin-blog-page">
      <section className="admin-blog-hero">
        <div>
          <span className="admin-blog-eyebrow">
            {t("admin.blog.eyebrow", "Content manager")}
          </span>

          <h1>{t("admin.blog.title", "Blog posts")}</h1>

          <p>
            {t(
              "admin.blog.subtitle",
              "Create, edit, publish, and organize multilingual articles for the public website.",
            )}
          </p>
        </div>

        <button
          type="button"
          className="admin-blog-primary-btn"
          onClick={openCreateModal}
        >
          + {t("admin.blog.newPost", "New post")}
        </button>
      </section>

      {notice ? <div className="admin-blog-notice">{notice}</div> : null}
      {error ? <div className="admin-blog-error">{error}</div> : null}

      <section className="admin-blog-toolbar">
        <form className="admin-blog-search" onSubmit={handleSearchSubmit}>
          <input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            placeholder={t(
              "admin.blog.searchPlaceholder",
              "Search title, category, excerpt, author...",
            )}
          />

          <button type="submit">{t("admin.blog.search", "Search")}</button>
        </form>

        <div className="admin-blog-filters">
          <select
            value={filters.language}
            onChange={(event) => changeFilter("language", event.target.value)}
          >
            <option value="">
              {t("admin.blog.allLanguages", "All languages")}
            </option>
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(event) => changeFilter("status", event.target.value)}
          >
            <option value="">
              {t("admin.blog.allStatuses", "All statuses")}
            </option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="admin-blog-card">
        {loading ? (
          <div className="admin-blog-state">
            {t("states.loading", "Loading...")}
          </div>
        ) : posts.length === 0 ? (
          <div className="admin-blog-state">
            <h3>{t("admin.blog.emptyTitle", "No blog posts yet")}</h3>
            <p>
              {t(
                "admin.blog.emptyText",
                "Create your first article to start publishing insights.",
              )}
            </p>
            <button
              type="button"
              className="admin-blog-primary-btn"
              onClick={openCreateModal}
            >
              + {t("admin.blog.newPost", "New post")}
            </button>
          </div>
        ) : (
          <>
            <div className="admin-blog-table-wrap">
              <table className="admin-blog-table">
                <thead>
                  <tr>
                    <th>{t("admin.blog.tablePost", "Post")}</th>
                    <th>{t("admin.blog.tableLanguage", "Language")}</th>
                    <th>{t("admin.blog.tableStatus", "Status")}</th>
                    <th>{t("admin.blog.tableFeatured", "Featured")}</th>
                    <th>{t("admin.blog.tablePublished", "Published")}</th>
                    <th>{t("admin.blog.tableActions", "Actions")}</th>
                  </tr>
                </thead>

                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <div className="admin-blog-post-cell">
                          <div className="admin-blog-thumb">
                            {post.featuredImageUrl ? (
                              <img
                                src={post.featuredImageUrl}
                                alt={post.title}
                              />
                            ) : (
                              <span>IF</span>
                            )}
                          </div>

                          <div>
                            <strong>{post.title}</strong>
                            <small>
                              /blog/{post.slug}
                              {post.category ? ` · ${post.category}` : ""}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-blog-pill">{post.language}</span>
                      </td>

                      <td>
                        <span
                          className={`admin-blog-status admin-blog-status--${String(
                            post.status || "DRAFT",
                          ).toLowerCase()}`}
                        >
                          {post.status}
                        </span>
                      </td>

                      <td>{post.featured ? "Yes" : "No"}</td>

                      <td>{formatDate(post.publishedAt)}</td>

                      <td>
                        <div className="admin-blog-actions">
                          <button
                            type="button"
                            onClick={() => openEditModal(post)}
                            disabled={actionLoading}
                          >
                            {t("admin.blog.edit", "Edit")}
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePublishToggle(post)}
                            disabled={actionLoading}
                          >
                            {post.status === "PUBLISHED"
                              ? t("admin.blog.unpublish", "Unpublish")
                              : t("admin.blog.publish", "Publish")}
                          </button>

                          {post.status !== "ARCHIVED" ? (
                            <button
                              type="button"
                              onClick={() => handleArchive(post)}
                              disabled={actionLoading}
                            >
                              {t("admin.blog.archive", "Archive")}
                            </button>
                          ) : null}

                          <button
                            type="button"
                            className="admin-blog-danger-btn"
                            onClick={() => handleDelete(post)}
                            disabled={actionLoading}
                          >
                            {t("admin.blog.delete", "Delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageMeta.totalPages > 1 ? (
              <div className="admin-blog-pagination">
                <button
                  type="button"
                  disabled={pageMeta.first || pageMeta.page <= 0}
                  onClick={() => goToPage(pageMeta.page - 1)}
                >
                  {t("pagination.previous", "Previous")}
                </button>

                <span>
                  {t("pagination.page", "Page")} {pageMeta.page + 1}{" "}
                  {t("pagination.of", "of")} {pageMeta.totalPages}
                </span>

                <button
                  type="button"
                  disabled={
                    pageMeta.last || pageMeta.page + 1 >= pageMeta.totalPages
                  }
                  onClick={() => goToPage(pageMeta.page + 1)}
                >
                  {t("pagination.next", "Next")}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>

      {modalOpen ? (
        <div className="admin-blog-modal-backdrop" role="presentation">
          <div className="admin-blog-modal" role="dialog" aria-modal="true">
            <div className="admin-blog-modal__header">
              <div>
                <span className="admin-blog-eyebrow">
                  {editingPost
                    ? t("admin.blog.editPost", "Edit post")
                    : t("admin.blog.createPost", "Create post")}
                </span>

                <h2>
                  {editingPost
                    ? t("admin.blog.editTitle", "Update article")
                    : t("admin.blog.createTitle", "New article")}
                </h2>
              </div>

              <button
                type="button"
                className="admin-blog-close-btn"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form className="admin-blog-form" onSubmit={handleSubmit}>
              <div className="admin-blog-form-grid">
                <label className="admin-blog-field admin-blog-field--wide">
                  <span>{t("admin.blog.formTitle", "Title")}</span>
                  <input
                    value={form.title}
                    onChange={(event) =>
                      updateForm("title", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="admin-blog-field">
                  <span>{t("admin.blog.formSlug", "Slug")}</span>
                  <input
                    value={form.slug}
                    onChange={(event) => updateForm("slug", event.target.value)}
                    placeholder="leave empty to auto-generate"
                  />
                </label>

                <label className="admin-blog-field">
                  <span>{t("admin.blog.formAuthor", "Author")}</span>
                  <input
                    value={form.authorName}
                    onChange={(event) =>
                      updateForm("authorName", event.target.value)
                    }
                  />
                </label>

                <label className="admin-blog-field">
                  <span>{t("admin.blog.formLanguage", "Language")}</span>
                  <select
                    value={form.language}
                    onChange={(event) =>
                      updateForm("language", event.target.value)
                    }
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-blog-field">
                  <span>{t("admin.blog.formStatus", "Status")}</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm("status", event.target.value)
                    }
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-blog-field">
                  <span>{t("admin.blog.formCategory", "Category")}</span>
                  <input
                    value={form.category}
                    onChange={(event) =>
                      updateForm("category", event.target.value)
                    }
                  />
                </label>

                <label className="admin-blog-field">
                  <span>{t("admin.blog.formOrder", "Display order")}</span>
                  <input
                    type="number"
                    value={form.displayOrder}
                    onChange={(event) =>
                      updateForm("displayOrder", event.target.value)
                    }
                  />
                </label>

                <label className="admin-blog-field admin-blog-field--wide">
                  <span>{t("admin.blog.formExcerpt", "Excerpt")}</span>
                  <textarea
                    rows={3}
                    value={form.excerpt}
                    onChange={(event) =>
                      updateForm("excerpt", event.target.value)
                    }
                  />
                </label>

                <label className="admin-blog-field admin-blog-field--wide">
                  <span>
                    {t("admin.blog.formContent", "Rich text content")}
                  </span>
                  <textarea
                    rows={12}
                    value={form.content}
                    onChange={(event) =>
                      updateForm("content", event.target.value)
                    }
                    placeholder="<p>Write article content here...</p>"
                  />
                </label>

                <label className="admin-blog-field admin-blog-field--wide">
                  <span>
                    {t("admin.blog.formFeaturedImage", "Featured image URL")}
                  </span>
                  <input
                    value={form.featuredImageUrl}
                    onChange={(event) =>
                      updateForm("featuredImageUrl", event.target.value)
                    }
                  />
                </label>

                <label className="admin-blog-field">
                  <span>{t("admin.blog.formVideoUrl", "Video URL")}</span>
                  <input
                    value={form.videoUrl}
                    onChange={(event) =>
                      updateForm("videoUrl", event.target.value)
                    }
                  />
                </label>

                <label className="admin-blog-field">
                  <span>
                    {t("admin.blog.formEmbedVideoUrl", "Embed video URL")}
                  </span>
                  <input
                    value={form.embedVideoUrl}
                    onChange={(event) =>
                      updateForm("embedVideoUrl", event.target.value)
                    }
                  />
                </label>

                <label className="admin-blog-field admin-blog-field--wide">
                  <span>{t("admin.blog.formTags", "Tags")}</span>
                  <input
                    value={form.tagsText}
                    onChange={(event) =>
                      updateForm("tagsText", event.target.value)
                    }
                    placeholder="web design, automation, business"
                  />
                </label>

                <label className="admin-blog-checkbox admin-blog-field--wide">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) =>
                      updateForm("featured", event.target.checked)
                    }
                  />
                  <span>
                    {t("admin.blog.formFeatured", "Mark as featured post")}
                  </span>
                </label>
              </div>

              <div className="admin-blog-media-section">
                <div className="admin-blog-media-header">
                  <div>
                    <h3>{t("admin.blog.mediaTitle", "Media gallery")}</h3>
                    <p>
                      {t(
                        "admin.blog.mediaSubtitle",
                        "Add extra image or video URLs for this article.",
                      )}
                    </p>
                  </div>

                  <div className="admin-blog-media-buttons">
                    <button type="button" onClick={() => addMediaRow("IMAGE")}>
                      + {t("admin.blog.addImage", "Image")}
                    </button>
                    <button type="button" onClick={() => addMediaRow("VIDEO")}>
                      + {t("admin.blog.addVideo", "Video")}
                    </button>
                  </div>
                </div>

                {form.media.length === 0 ? (
                  <div className="admin-blog-media-empty">
                    {t("admin.blog.noMedia", "No extra media added.")}
                  </div>
                ) : (
                  <div className="admin-blog-media-list">
                    {form.media.map((item, index) => (
                      <div className="admin-blog-media-row" key={index}>
                        <select
                          value={item.mediaType}
                          onChange={(event) =>
                            updateMediaRow(
                              index,
                              "mediaType",
                              event.target.value,
                            )
                          }
                        >
                          {MEDIA_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>

                        <input
                          value={item.mediaUrl}
                          onChange={(event) =>
                            updateMediaRow(
                              index,
                              "mediaUrl",
                              event.target.value,
                            )
                          }
                          placeholder="https://..."
                        />

                        <input
                          type="number"
                          value={item.displayOrder}
                          onChange={(event) =>
                            updateMediaRow(
                              index,
                              "displayOrder",
                              event.target.value,
                            )
                          }
                        />

                        <button
                          type="button"
                          className="admin-blog-danger-btn"
                          onClick={() => removeMediaRow(index)}
                        >
                          {t("admin.blog.remove", "Remove")}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-blog-modal__footer">
                <button
                  type="button"
                  className="admin-blog-secondary-btn"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  {t("common.cancel", "Cancel")}
                </button>

                <button
                  type="submit"
                  className="admin-blog-primary-btn"
                  disabled={actionLoading}
                >
                  {actionLoading
                    ? t("states.saving", "Saving...")
                    : t("common.save", "Save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </main>
  );
}
