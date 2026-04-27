import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminContactMessageApi } from "../../services/adminContantMessageApi";
import "../../styles/adminContactMessages.css";

const STATUS_OPTIONS = [
  "ALL",
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "RESOLVED",
  "ARCHIVED",
];

const emptyReplyForm = {
  subject: "",
  message: "",
  replyTo: "",
};

function formatDate(value) {
  if (!value) return "N/A";

  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function statusLabel(status) {
  return String(status || "NEW").replaceAll("_", " ");
}

function getStatusClass(status) {
  return String(status || "NEW")
    .toLowerCase()
    .replaceAll("_", "-");
}

function getErrorMessage(error, fallback = "Something went wrong.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const [pageInfo, setPageInfo] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editForm, setEditForm] = useState({
    status: "NEW",
    adminNote: "",
    assignedTo: "",
  });

  const [replyForm, setReplyForm] = useState(emptyReplyForm);

  const activeParams = useMemo(
    () => ({
      page,
      size: 12,
      status: status === "ALL" ? undefined : status,
      search: search.trim() || undefined,
    }),
    [page, search, status],
  );

  async function loadMessages() {
    try {
      setLoading(true);
      setError("");

      const [messagesPage, statsData] = await Promise.all([
        adminContactMessageApi.getMessages(activeParams),
        adminContactMessageApi.getStats(),
      ]);

      setMessages(messagesPage.content || []);
      setPageInfo(messagesPage);
      setStats(statsData || null);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load contact messages."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, [activeParams]);

  function openMessage(message) {
    setSelectedMessage(message);

    setEditForm({
      status: message?.status || "NEW",
      adminNote: message?.adminNote || "",
      assignedTo: message?.assignedTo || "",
    });

    setReplyForm({
      subject: message?.subject ? `Re: ${message.subject}` : "Re: Your inquiry",
      message: "",
      replyTo: "",
    });

    setSuccess("");
    setError("");
  }

  function closeMessage() {
    setSelectedMessage(null);
    setSuccess("");
    setError("");
  }

  async function handleUpdate() {
    if (!selectedMessage?.id) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await adminContactMessageApi.updateMessage(
        selectedMessage.id,
        {
          status: editForm.status,
          adminNote: editForm.adminNote,
          assignedTo: editForm.assignedTo,
        },
      );

      setSelectedMessage(updated);
      setSuccess("Message updated successfully.");
      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update message."));
    } finally {
      setSaving(false);
    }
  }

  async function handleReply(event) {
    event.preventDefault();

    if (!selectedMessage?.id) return;

    if (!replyForm.subject.trim() || !replyForm.message.trim()) {
      setError("Reply subject and message are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await adminContactMessageApi.replyToMessage(
        selectedMessage.id,
        {
          subject: replyForm.subject.trim(),
          message: replyForm.message.trim(),
          replyTo: replyForm.replyTo.trim() || undefined,
          adminNote: editForm.adminNote,
          assignedTo: editForm.assignedTo,
        },
      );

      setSelectedMessage(updated);
      setEditForm({
        status: updated?.status || "CONTACTED",
        adminNote: updated?.adminNote || "",
        assignedTo: updated?.assignedTo || "",
      });

      setReplyForm(emptyReplyForm);
      setSuccess("Reply sent successfully. Message marked as CONTACTED.");
      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to send reply."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(message) {
    const confirmed = window.confirm(
      `Delete message from ${message?.fullName || message?.email || "client"}?`,
    );

    if (!confirmed) return;

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await adminContactMessageApi.deleteMessage(message.id);

      if (selectedMessage?.id === message.id) {
        setSelectedMessage(null);
      }

      setSuccess("Message deleted successfully.");
      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete message."));
    } finally {
      setSaving(false);
    }
  }

  const metricCards = [
    {
      label: "New Messages",
      value: stats?.newMessages ?? 0,
      icon: "📩",
      tone: "blue",
    },
    {
      label: "Contacted",
      value: stats?.contacted ?? 0,
      icon: "🤝",
      tone: "green",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: "⚙️",
      tone: "amber",
    },
    {
      label: "Resolved",
      value: stats?.resolved ?? 0,
      icon: "✅",
      tone: "purple",
    },
  ];

  return (
    <div className="crm-page">
      <section className="crm-hero">
        <div>
          <span className="crm-eyebrow">CRM Inbox</span>
          <h1>Contact Messages</h1>
          <p>
            View leads from the public contact form, assign staff, update
            status, add notes, and reply directly by email.
          </p>
        </div>

        <button
          type="button"
          className="crm-btn crm-btn-primary"
          onClick={loadMessages}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      <section className="crm-stats-grid">
        {metricCards.map((item) => (
          <article
            key={item.label}
            className={`crm-stat-card crm-stat-card-${item.tone}`}
          >
            <div className="crm-stat-icon">{item.icon}</div>
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="crm-toolbar">
        <div className="crm-search">
          <span>🔎</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(0);
            }}
            placeholder="Search by name or email..."
          />
        </div>

        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(0);
          }}
          className="crm-select"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {statusLabel(option)}
            </option>
          ))}
        </select>
      </section>

      {error ? <div className="crm-alert crm-alert-error">{error}</div> : null}
      {success ? (
        <div className="crm-alert crm-alert-success">{success}</div>
      ) : null}

      <section className="crm-card">
        <div className="crm-card-header">
          <div>
            <h2>Inbox</h2>
            <p>
              {pageInfo.totalElements || messages.length || 0} total messages
            </p>
          </div>
        </div>

        <div className="crm-table-wrap">
          <table className="crm-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Received</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="crm-table-state">
                    Loading contact messages...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="crm-table-state">
                    No contact messages found.
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <tr key={message.id}>
                    <td>
                      <div className="crm-client-cell">
                        <div className="crm-avatar">
                          {(message.fullName || message.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <strong>
                            {message.fullName || "Unknown Client"}
                          </strong>
                          <span>{message.email || "No email"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>{message.subject || "No subject"}</strong>
                      <span className="crm-muted">
                        {message.serviceInterest ||
                          message.company ||
                          "General inquiry"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`crm-status crm-status-${getStatusClass(
                          message.status,
                        )}`}
                      >
                        {statusLabel(message.status)}
                      </span>
                    </td>

                    <td>{message.assignedTo || "Unassigned"}</td>
                    <td>{formatDate(message.createdAt)}</td>

                    <td>
                      <div className="crm-row-actions">
                        <button
                          type="button"
                          className="crm-btn crm-btn-light crm-btn-sm"
                          onClick={() => openMessage(message)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="crm-btn crm-btn-danger crm-btn-sm"
                          onClick={() => handleDelete(message)}
                          disabled={saving}
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

        <div className="crm-pagination">
          <button
            type="button"
            className="crm-btn crm-btn-light crm-btn-sm"
            disabled={page <= 0 || loading}
            onClick={() => setPage((current) => Math.max(current - 1, 0))}
          >
            Previous
          </button>

          <span>
            Page {(pageInfo.page ?? page) + 1} of{" "}
            {Math.max(pageInfo.totalPages || 1, 1)}
          </span>

          <button
            type="button"
            className="crm-btn crm-btn-light crm-btn-sm"
            disabled={page + 1 >= (pageInfo.totalPages || 1) || loading}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      </section>

      <AnimatePresence>
        {selectedMessage ? (
          <motion.div
            className="crm-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              className="crm-drawer"
              initial={{ opacity: 0, x: 90 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 90 }}
              transition={{ duration: 0.25 }}
            >
              <header className="crm-drawer-header">
                <div>
                  <span className="crm-eyebrow">
                    Message #{selectedMessage.id}
                  </span>
                  <h2>{selectedMessage.subject || "Client inquiry"}</h2>
                  <p>
                    {selectedMessage.fullName} • {selectedMessage.email}
                  </p>
                </div>

                <button
                  type="button"
                  className="crm-btn crm-btn-light crm-btn-sm"
                  onClick={closeMessage}
                >
                  Close
                </button>
              </header>

              <div className="crm-drawer-body">
                {error ? (
                  <div className="crm-alert crm-alert-error">{error}</div>
                ) : null}

                {success ? (
                  <div className="crm-alert crm-alert-success">{success}</div>
                ) : null}

                <article className="crm-message-box">
                  <h3>Client Message</h3>
                  <p>{selectedMessage.message}</p>

                  <div className="crm-detail-grid">
                    <span>Phone: {selectedMessage.phone || "N/A"}</span>
                    <span>Company: {selectedMessage.company || "N/A"}</span>
                    <span>
                      Service: {selectedMessage.serviceInterest || "N/A"}
                    </span>
                    <span>
                      Language: {selectedMessage.preferredLanguage || "EN"}
                    </span>
                    <span>
                      Created: {formatDate(selectedMessage.createdAt)}
                    </span>
                    <span>
                      Last contacted:{" "}
                      {formatDate(selectedMessage.lastContactedAt)}
                    </span>
                  </div>
                </article>

                <section className="crm-form-section">
                  <h3>Manage Lead</h3>

                  <div className="crm-form-grid">
                    <label>
                      Status
                      <select
                        value={editForm.status}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            status: event.target.value,
                          }))
                        }
                      >
                        {STATUS_OPTIONS.filter(
                          (option) => option !== "ALL",
                        ).map((option) => (
                          <option key={option} value={option}>
                            {statusLabel(option)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Assign staff
                      <input
                        value={editForm.assignedTo}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            assignedTo: event.target.value,
                          }))
                        }
                        placeholder="Staff name or email"
                      />
                    </label>
                  </div>

                  <label>
                    Admin note
                    <textarea
                      value={editForm.adminNote}
                      onChange={(event) =>
                        setEditForm((current) => ({
                          ...current,
                          adminNote: event.target.value,
                        }))
                      }
                      rows={4}
                      placeholder="Internal note..."
                    />
                  </label>

                  <button
                    type="button"
                    className="crm-btn crm-btn-primary"
                    onClick={handleUpdate}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </section>

                <form onSubmit={handleReply} className="crm-form-section">
                  <h3>Reply to Client Email</h3>

                  <label>
                    Reply-to email optional
                    <input
                      value={replyForm.replyTo}
                      onChange={(event) =>
                        setReplyForm((current) => ({
                          ...current,
                          replyTo: event.target.value,
                        }))
                      }
                      placeholder="Optional reply-to email"
                    />
                  </label>

                  <label>
                    Subject
                    <input
                      value={replyForm.subject}
                      onChange={(event) =>
                        setReplyForm((current) => ({
                          ...current,
                          subject: event.target.value,
                        }))
                      }
                      placeholder="Email subject"
                    />
                  </label>

                  <label>
                    Reply message
                    <textarea
                      value={replyForm.message}
                      onChange={(event) =>
                        setReplyForm((current) => ({
                          ...current,
                          message: event.target.value,
                        }))
                      }
                      rows={7}
                      placeholder="Write your reply..."
                    />
                  </label>

                  <button
                    type="submit"
                    className="crm-btn crm-btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Sending..." : "Send Reply"}
                  </button>
                </form>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
