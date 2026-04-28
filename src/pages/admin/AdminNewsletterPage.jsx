import { useEffect, useMemo, useState } from "react";
import newsletterService from "../../services/newsletterService";
import useLanguage from "../../hooks/useLanguage";
import "./AdminNewsletterPage.css";

const LANGUAGES = ["EN", "HA", "IG", "YO"];
const CAMPAIGN_STATUSES = ["DRAFT", "SENT", "ARCHIVED"];
const SUBSCRIBER_STATUSES = ["ACTIVE", "UNSUBSCRIBED"];

const emptyCampaignForm = {
  subject: "",
  previewText: "",
  content: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
  language: "EN",
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

function toCampaignForm(campaign) {
  if (!campaign) return emptyCampaignForm;

  return {
    subject: campaign.subject || "",
    previewText: campaign.previewText || "",
    content: campaign.content || "",
    imageUrl: campaign.imageUrl || "",
    ctaLabel: campaign.ctaLabel || "",
    ctaUrl: campaign.ctaUrl || "",
    language: campaign.language || "EN",
  };
}

function toCampaignPayload(form) {
  return {
    subject: form.subject.trim(),
    previewText: form.previewText.trim() || null,
    content: form.content,
    imageUrl: form.imageUrl.trim() || null,
    ctaLabel: form.ctaLabel.trim() || null,
    ctaUrl: form.ctaUrl.trim() || null,
    language: form.language || "EN",
  };
}

export default function AdminNewsletterPage() {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState("campaigns");

  const [campaignsData, setCampaignsData] = useState(null);
  const [subscribersData, setSubscribersData] = useState(null);

  const campaigns = useMemo(
    () => getPageContent(campaignsData),
    [campaignsData],
  );
  const subscribers = useMemo(
    () => getPageContent(subscribersData),
    [subscribersData],
  );

  const campaignMeta = useMemo(
    () => getPageMeta(campaignsData),
    [campaignsData],
  );
  const subscriberMeta = useMemo(
    () => getPageMeta(subscribersData),
    [subscribersData],
  );

  const [campaignFilters, setCampaignFilters] = useState({
    language: "",
    status: "",
    search: "",
    page: 0,
    size: 10,
  });

  const [subscriberFilters, setSubscriberFilters] = useState({
    language: "",
    status: "",
    search: "",
    page: 0,
    size: 10,
  });

  const [campaignForm, setCampaignForm] = useState(emptyCampaignForm);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    campaignFilters.language,
    campaignFilters.status,
    campaignFilters.page,
    campaignFilters.size,
  ]);

  useEffect(() => {
    loadSubscribers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    subscriberFilters.language,
    subscriberFilters.status,
    subscriberFilters.page,
    subscriberFilters.size,
  ]);

  async function loadCampaigns(customFilters = campaignFilters) {
    setLoadingCampaigns(true);
    setError("");

    try {
      const params = {
        page: customFilters.page,
        size: customFilters.size,
      };

      if (customFilters.language) params.language = customFilters.language;
      if (customFilters.status) params.status = customFilters.status;
      if (customFilters.search.trim())
        params.search = customFilters.search.trim();

      const data = await newsletterService.getCampaigns(params);
      setCampaignsData(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.newsletter.loadCampaignsFailed", "Failed to load campaigns"),
      );
    } finally {
      setLoadingCampaigns(false);
    }
  }

  async function loadSubscribers(customFilters = subscriberFilters) {
    setLoadingSubscribers(true);
    setError("");

    try {
      const params = {
        page: customFilters.page,
        size: customFilters.size,
      };

      if (customFilters.language) params.language = customFilters.language;
      if (customFilters.status) params.status = customFilters.status;
      if (customFilters.search.trim())
        params.search = customFilters.search.trim();

      const data = await newsletterService.getSubscribers(params);
      setSubscribersData(data);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t(
            "admin.newsletter.loadSubscribersFailed",
            "Failed to load subscribers",
          ),
      );
    } finally {
      setLoadingSubscribers(false);
    }
  }

  function openCreateModal() {
    setEditingCampaign(null);
    setCampaignForm(emptyCampaignForm);
    setNotice("");
    setError("");
    setModalOpen(true);
  }

  function openEditModal(campaign) {
    setEditingCampaign(campaign);
    setCampaignForm(toCampaignForm(campaign));
    setNotice("");
    setError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (actionLoading) return;
    setModalOpen(false);
    setEditingCampaign(null);
    setCampaignForm(emptyCampaignForm);
  }

  function updateCampaignForm(name, value) {
    setCampaignForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleCampaignSubmit(event) {
    event.preventDefault();

    if (!campaignForm.subject.trim()) {
      setError(t("admin.newsletter.subjectRequired", "Subject is required"));
      return;
    }

    if (!campaignForm.content.trim()) {
      setError(t("admin.newsletter.contentRequired", "Content is required"));
      return;
    }

    setActionLoading(true);
    setError("");
    setNotice("");

    try {
      const payload = toCampaignPayload(campaignForm);

      if (editingCampaign?.id) {
        await newsletterService.updateCampaign(editingCampaign.id, payload);
        setNotice(t("admin.newsletter.updated", "Newsletter updated"));
      } else {
        await newsletterService.createCampaign(payload);
        setNotice(t("admin.newsletter.created", "Newsletter campaign created"));
      }

      setModalOpen(false);
      setEditingCampaign(null);
      setCampaignForm(emptyCampaignForm);
      await loadCampaigns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.newsletter.saveFailed", "Failed to save newsletter"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleSend(campaign) {
    const confirmed = window.confirm(
      t(
        "admin.newsletter.sendConfirm",
        `Send "${campaign.subject}" to active subscribers?`,
      ),
    );

    if (!confirmed) return;

    setActionLoading(true);
    setNotice("");
    setError("");

    try {
      const sent = await newsletterService.sendCampaign(campaign.id);
      setNotice(
        t(
          "admin.newsletter.sent",
          `Newsletter sent to ${sent?.sentCount || 0} subscribers`,
        ),
      );
      await loadCampaigns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.newsletter.sendFailed", "Failed to send newsletter"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleArchive(campaign) {
    setActionLoading(true);
    setNotice("");
    setError("");

    try {
      await newsletterService.archiveCampaign(campaign.id);
      setNotice(t("admin.newsletter.archived", "Newsletter archived"));
      await loadCampaigns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.newsletter.archiveFailed", "Failed to archive newsletter"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete(campaign) {
    const confirmed = window.confirm(
      t(
        "admin.newsletter.deleteConfirm",
        `Delete "${campaign.subject}"? This cannot be undone.`,
      ),
    );

    if (!confirmed) return;

    setActionLoading(true);
    setNotice("");
    setError("");

    try {
      await newsletterService.deleteCampaign(campaign.id);
      setNotice(t("admin.newsletter.deleted", "Newsletter deleted"));
      await loadCampaigns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          t("admin.newsletter.deleteFailed", "Failed to delete newsletter"),
      );
    } finally {
      setActionLoading(false);
    }
  }

  function submitCampaignSearch(event) {
    event.preventDefault();
    const next = { ...campaignFilters, page: 0 };
    setCampaignFilters(next);
    loadCampaigns(next);
  }

  function submitSubscriberSearch(event) {
    event.preventDefault();
    const next = { ...subscriberFilters, page: 0 };
    setSubscriberFilters(next);
    loadSubscribers(next);
  }

  function changeCampaignFilter(name, value) {
    setCampaignFilters((current) => ({
      ...current,
      [name]: value,
      page: 0,
    }));
  }

  function changeSubscriberFilter(name, value) {
    setSubscriberFilters((current) => ({
      ...current,
      [name]: value,
      page: 0,
    }));
  }

  return (
    <main className="admin-newsletter-page">
      <section className="admin-newsletter-hero">
        <div>
          <span className="admin-newsletter-eyebrow">
            {t("admin.newsletter.eyebrow", "Newsletter")}
          </span>

          <h1>{t("admin.newsletter.title", "Newsletter manager")}</h1>

          <p>
            {t(
              "admin.newsletter.subtitle",
              "Manage subscribers and send email campaigns to people who subscribed from the public website.",
            )}
          </p>
        </div>

        <button
          type="button"
          className="admin-newsletter-primary-btn"
          onClick={openCreateModal}
        >
          + {t("admin.newsletter.newCampaign", "New campaign")}
        </button>
      </section>

      {notice ? <div className="admin-newsletter-notice">{notice}</div> : null}
      {error ? <div className="admin-newsletter-error">{error}</div> : null}

      <section className="admin-newsletter-tabs">
        <button
          type="button"
          className={
            activeTab === "campaigns"
              ? "admin-newsletter-tab admin-newsletter-tab--active"
              : "admin-newsletter-tab"
          }
          onClick={() => setActiveTab("campaigns")}
        >
          {t("admin.newsletter.campaigns", "Campaigns")}
        </button>

        <button
          type="button"
          className={
            activeTab === "subscribers"
              ? "admin-newsletter-tab admin-newsletter-tab--active"
              : "admin-newsletter-tab"
          }
          onClick={() => setActiveTab("subscribers")}
        >
          {t("admin.newsletter.subscribers", "Subscribers")}
        </button>
      </section>

      {activeTab === "campaigns" ? (
        <section className="admin-newsletter-card">
          <div className="admin-newsletter-toolbar">
            <form
              className="admin-newsletter-search"
              onSubmit={submitCampaignSearch}
            >
              <input
                value={campaignFilters.search}
                onChange={(event) =>
                  setCampaignFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder={t(
                  "admin.newsletter.searchCampaigns",
                  "Search campaigns...",
                )}
              />

              <button type="submit">{t("common.search", "Search")}</button>
            </form>

            <div className="admin-newsletter-filters">
              <select
                value={campaignFilters.language}
                onChange={(event) =>
                  changeCampaignFilter("language", event.target.value)
                }
              >
                <option value="">
                  {t("admin.newsletter.allLanguages", "All languages")}
                </option>
                {LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>

              <select
                value={campaignFilters.status}
                onChange={(event) =>
                  changeCampaignFilter("status", event.target.value)
                }
              >
                <option value="">
                  {t("admin.newsletter.allStatuses", "All statuses")}
                </option>
                {CAMPAIGN_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingCampaigns ? (
            <div className="admin-newsletter-state">
              {t("states.loading", "Loading...")}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="admin-newsletter-state">
              <h3>{t("admin.newsletter.noCampaigns", "No campaigns yet")}</h3>
              <p>
                {t(
                  "admin.newsletter.noCampaignsText",
                  "Create a newsletter campaign to send updates.",
                )}
              </p>
              <button
                type="button"
                className="admin-newsletter-primary-btn"
                onClick={openCreateModal}
              >
                + {t("admin.newsletter.newCampaign", "New campaign")}
              </button>
            </div>
          ) : (
            <>
              <div className="admin-newsletter-table-wrap">
                <table className="admin-newsletter-table">
                  <thead>
                    <tr>
                      <th>{t("admin.newsletter.tableSubject", "Subject")}</th>
                      <th>{t("admin.newsletter.tableLanguage", "Language")}</th>
                      <th>{t("admin.newsletter.tableStatus", "Status")}</th>
                      <th>{t("admin.newsletter.tableSent", "Sent")}</th>
                      <th>{t("admin.newsletter.tableActions", "Actions")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td>
                          <div className="admin-newsletter-title-cell">
                            <strong>{campaign.subject}</strong>
                            <small>{campaign.previewText || "—"}</small>
                          </div>
                        </td>

                        <td>
                          <span className="admin-newsletter-pill">
                            {campaign.language}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`admin-newsletter-status admin-newsletter-status--${String(
                              campaign.status || "DRAFT",
                            ).toLowerCase()}`}
                          >
                            {campaign.status}
                          </span>
                        </td>

                        <td>
                          {campaign.status === "SENT"
                            ? `${campaign.sentCount || 0} · ${formatDate(
                                campaign.sentAt,
                              )}`
                            : "—"}
                        </td>

                        <td>
                          <div className="admin-newsletter-actions">
                            {campaign.status !== "SENT" ? (
                              <button
                                type="button"
                                onClick={() => openEditModal(campaign)}
                                disabled={actionLoading}
                              >
                                {t("common.edit", "Edit")}
                              </button>
                            ) : null}

                            {campaign.status !== "SENT" ? (
                              <button
                                type="button"
                                onClick={() => handleSend(campaign)}
                                disabled={actionLoading}
                              >
                                {t("admin.newsletter.send", "Send")}
                              </button>
                            ) : null}

                            {campaign.status !== "ARCHIVED" ? (
                              <button
                                type="button"
                                onClick={() => handleArchive(campaign)}
                                disabled={actionLoading}
                              >
                                {t("admin.newsletter.archive", "Archive")}
                              </button>
                            ) : null}

                            {campaign.status !== "SENT" ? (
                              <button
                                type="button"
                                className="admin-newsletter-danger-btn"
                                onClick={() => handleDelete(campaign)}
                                disabled={actionLoading}
                              >
                                {t("common.delete", "Delete")}
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {campaignMeta.totalPages > 1 ? (
                <div className="admin-newsletter-pagination">
                  <button
                    type="button"
                    disabled={campaignMeta.first || campaignMeta.page <= 0}
                    onClick={() =>
                      setCampaignFilters((current) => ({
                        ...current,
                        page: campaignMeta.page - 1,
                      }))
                    }
                  >
                    {t("pagination.previous", "Previous")}
                  </button>

                  <span>
                    {t("pagination.page", "Page")} {campaignMeta.page + 1}{" "}
                    {t("pagination.of", "of")} {campaignMeta.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      campaignMeta.last ||
                      campaignMeta.page + 1 >= campaignMeta.totalPages
                    }
                    onClick={() =>
                      setCampaignFilters((current) => ({
                        ...current,
                        page: campaignMeta.page + 1,
                      }))
                    }
                  >
                    {t("pagination.next", "Next")}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>
      ) : (
        <section className="admin-newsletter-card">
          <div className="admin-newsletter-toolbar">
            <form
              className="admin-newsletter-search"
              onSubmit={submitSubscriberSearch}
            >
              <input
                value={subscriberFilters.search}
                onChange={(event) =>
                  setSubscriberFilters((current) => ({
                    ...current,
                    search: event.target.value,
                  }))
                }
                placeholder={t(
                  "admin.newsletter.searchSubscribers",
                  "Search subscribers...",
                )}
              />

              <button type="submit">{t("common.search", "Search")}</button>
            </form>

            <div className="admin-newsletter-filters">
              <select
                value={subscriberFilters.language}
                onChange={(event) =>
                  changeSubscriberFilter("language", event.target.value)
                }
              >
                <option value="">
                  {t("admin.newsletter.allLanguages", "All languages")}
                </option>
                {LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>

              <select
                value={subscriberFilters.status}
                onChange={(event) =>
                  changeSubscriberFilter("status", event.target.value)
                }
              >
                <option value="">
                  {t("admin.newsletter.allStatuses", "All statuses")}
                </option>
                {SUBSCRIBER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingSubscribers ? (
            <div className="admin-newsletter-state">
              {t("states.loading", "Loading...")}
            </div>
          ) : subscribers.length === 0 ? (
            <div className="admin-newsletter-state">
              <h3>
                {t("admin.newsletter.noSubscribers", "No subscribers yet")}
              </h3>
              <p>
                {t(
                  "admin.newsletter.noSubscribersText",
                  "People who subscribe from the public website will appear here.",
                )}
              </p>
            </div>
          ) : (
            <>
              <div className="admin-newsletter-table-wrap">
                <table className="admin-newsletter-table">
                  <thead>
                    <tr>
                      <th>
                        {t("admin.newsletter.tableSubscriber", "Subscriber")}
                      </th>
                      <th>{t("admin.newsletter.tableLanguage", "Language")}</th>
                      <th>{t("admin.newsletter.tableStatus", "Status")}</th>
                      <th>
                        {t("admin.newsletter.tableSubscribed", "Subscribed")}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id}>
                        <td>
                          <div className="admin-newsletter-title-cell">
                            <strong>{subscriber.email}</strong>
                            <small>{subscriber.fullName || "—"}</small>
                          </div>
                        </td>

                        <td>
                          <span className="admin-newsletter-pill">
                            {subscriber.language}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`admin-newsletter-status admin-newsletter-status--${String(
                              subscriber.status || "ACTIVE",
                            ).toLowerCase()}`}
                          >
                            {subscriber.status}
                          </span>
                        </td>

                        <td>{formatDate(subscriber.subscribedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {subscriberMeta.totalPages > 1 ? (
                <div className="admin-newsletter-pagination">
                  <button
                    type="button"
                    disabled={subscriberMeta.first || subscriberMeta.page <= 0}
                    onClick={() =>
                      setSubscriberFilters((current) => ({
                        ...current,
                        page: subscriberMeta.page - 1,
                      }))
                    }
                  >
                    {t("pagination.previous", "Previous")}
                  </button>

                  <span>
                    {t("pagination.page", "Page")} {subscriberMeta.page + 1}{" "}
                    {t("pagination.of", "of")} {subscriberMeta.totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      subscriberMeta.last ||
                      subscriberMeta.page + 1 >= subscriberMeta.totalPages
                    }
                    onClick={() =>
                      setSubscriberFilters((current) => ({
                        ...current,
                        page: subscriberMeta.page + 1,
                      }))
                    }
                  >
                    {t("pagination.next", "Next")}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </section>
      )}

      {modalOpen ? (
        <div className="admin-newsletter-modal-backdrop" role="presentation">
          <div
            className="admin-newsletter-modal"
            role="dialog"
            aria-modal="true"
          >
            <div className="admin-newsletter-modal__header">
              <div>
                <span className="admin-newsletter-eyebrow">
                  {editingCampaign
                    ? t("admin.newsletter.editCampaign", "Edit campaign")
                    : t("admin.newsletter.createCampaign", "Create campaign")}
                </span>

                <h2>
                  {editingCampaign
                    ? t(
                        "admin.newsletter.updateNewsletter",
                        "Update newsletter",
                      )
                    : t("admin.newsletter.newNewsletter", "New newsletter")}
                </h2>
              </div>

              <button
                type="button"
                className="admin-newsletter-close-btn"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form
              className="admin-newsletter-form"
              onSubmit={handleCampaignSubmit}
            >
              <div className="admin-newsletter-form-grid">
                <label className="admin-newsletter-field admin-newsletter-field--wide">
                  <span>{t("admin.newsletter.subject", "Subject")}</span>
                  <input
                    value={campaignForm.subject}
                    onChange={(event) =>
                      updateCampaignForm("subject", event.target.value)
                    }
                    required
                  />
                </label>

                <label className="admin-newsletter-field">
                  <span>{t("admin.newsletter.language", "Language")}</span>
                  <select
                    value={campaignForm.language}
                    onChange={(event) =>
                      updateCampaignForm("language", event.target.value)
                    }
                  >
                    {LANGUAGES.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-newsletter-field">
                  <span>{t("admin.newsletter.imageUrl", "Image URL")}</span>
                  <input
                    value={campaignForm.imageUrl}
                    onChange={(event) =>
                      updateCampaignForm("imageUrl", event.target.value)
                    }
                  />
                </label>

                <label className="admin-newsletter-field admin-newsletter-field--wide">
                  <span>
                    {t("admin.newsletter.previewText", "Preview text")}
                  </span>
                  <textarea
                    rows={3}
                    value={campaignForm.previewText}
                    onChange={(event) =>
                      updateCampaignForm("previewText", event.target.value)
                    }
                  />
                </label>

                <label className="admin-newsletter-field admin-newsletter-field--wide">
                  <span>
                    {t("admin.newsletter.content", "Newsletter HTML content")}
                  </span>
                  <textarea
                    rows={12}
                    value={campaignForm.content}
                    onChange={(event) =>
                      updateCampaignForm("content", event.target.value)
                    }
                    placeholder="<p>Write newsletter content here...</p>"
                    required
                  />
                </label>

                <label className="admin-newsletter-field">
                  <span>{t("admin.newsletter.ctaLabel", "CTA label")}</span>
                  <input
                    value={campaignForm.ctaLabel}
                    onChange={(event) =>
                      updateCampaignForm("ctaLabel", event.target.value)
                    }
                    placeholder="Read more"
                  />
                </label>

                <label className="admin-newsletter-field">
                  <span>{t("admin.newsletter.ctaUrl", "CTA URL")}</span>
                  <input
                    value={campaignForm.ctaUrl}
                    onChange={(event) =>
                      updateCampaignForm("ctaUrl", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>
              </div>

              <div className="admin-newsletter-modal__footer">
                <button
                  type="button"
                  className="admin-newsletter-secondary-btn"
                  onClick={closeModal}
                  disabled={actionLoading}
                >
                  {t("common.cancel", "Cancel")}
                </button>

                <button
                  type="submit"
                  className="admin-newsletter-primary-btn"
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
