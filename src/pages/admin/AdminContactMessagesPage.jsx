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
  const [pageInfo, setPageInfo] = useState({ totalElements: 0, totalPages: 1 });
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
      const [messagesPage, statsData] = await Promise.all([
        adminContactMessageApi.getMessages(activeParams),
        adminContactMessageApi.getStats(),
      ]);
      setMessages(messagesPage?.content || []);
      setPageInfo({
        totalElements: messagesPage?.totalElements || 0,
        totalPages: messagesPage?.totalPages || 1,
      });
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
    setError("");
    setSuccess("");
  }

  function closeMessage() {
    setSelectedMessage(null);
    setError("");
    setSuccess("");
  }

  async function handleUpdate() {
    if (!selectedMessage?.id) return;
    try {
      setSaving(true);
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
      setSuccess("Reply sent successfully.");
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
      await adminContactMessageApi.deleteMessage(message.id);
      if (selectedMessage?.id === message.id) setSelectedMessage(null);
      setSuccess("Message deleted successfully.");
      await loadMessages();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete message."));
    } finally {
      setSaving(false);
    }
  }

  const metricCards = [
    { label: "New", value: stats?.newMessages ?? 0, icon: "📩", color: "blue" },
    {
      label: "Contacted",
      value: stats?.contacted ?? 0,
      icon: "🤝",
      color: "green",
    },
    {
      label: "In Progress",
      value: stats?.inProgress ?? 0,
      icon: "⚙️",
      color: "amber",
    },
    {
      label: "Resolved",
      value: stats?.resolved ?? 0,
      icon: "✅",
      color: "purple",
    },
  ];

  return (
    <div className="crm-page">
      {/* Header */}
      <div className="crm-header">
        <div>
          <h1>Contact Messages</h1>
          <p>View and manage leads from the contact form.</p>
        </div>
        <button
          className="crm-btn crm-btn-primary"
          onClick={loadMessages}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* Stats */}
      <div className="crm-stats">
        {metricCards.map((item) => (
          <div key={item.label} className={`crm-stat crm-stat--${item.color}`}>
            <span className="crm-stat-icon">{item.icon}</span>
            <div>
              <div className="crm-stat-value">{item.value}</div>
              <div className="crm-stat-label">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="crm-filters">
        <div className="crm-search">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </div>
        <select
          className="crm-filter-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(0);
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {statusLabel(opt)}
            </option>
          ))}
        </select>
      </div>

      {/* Messages Table */}
      <div className="crm-table-container">
        {error && <div className="crm-error">{error}</div>}
        {success && <div className="crm-success">{success}</div>}

        {loading ? (
          <div className="crm-loading">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="crm-empty">No messages found.</div>
        ) : (
          <>
            <table className="crm-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Subject / Message</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Received</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg.id}>
                    <td>
                      <div className="crm-client">
                        <div className="crm-avatar">
                          {(msg.fullName || msg.email || "?")
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="crm-client-name">
                            {msg.fullName || "Unknown"}
                          </div>
                          <div className="crm-client-email">{msg.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="crm-subject">
                        {msg.subject || "No subject"}
                      </div>
                      {msg.serviceInterest && (
                        <div className="crm-service">{msg.serviceInterest}</div>
                      )}
                    </td>
                    <td>
                      <span
                        className={`crm-badge crm-badge--${getStatusClass(msg.status)}`}
                      >
                        {statusLabel(msg.status)}
                      </span>
                    </td>
                    <td>{msg.assignedTo || "Unassigned"}</td>
                    <td>{formatDate(msg.createdAt)}</td>
                    <td>
                      <div className="crm-actions">
                        <button
                          className="crm-btn-sm"
                          onClick={() => openMessage(msg)}
                        >
                          View
                        </button>
                        <button
                          className="crm-btn-sm crm-btn-danger"
                          onClick={() => handleDelete(msg)}
                          disabled={saving}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pageInfo.totalPages > 1 && (
              <div className="crm-pagination">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span>
                  Page {page + 1} of {pageInfo.totalPages}
                </span>
                <button
                  disabled={page + 1 >= pageInfo.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Drawer Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            className="crm-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.aside
              className="crm-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="crm-drawer-header">
                <div>
                  <h2>{selectedMessage.subject || "Client Message"}</h2>
                  <p>
                    {selectedMessage.fullName} • {selectedMessage.email}
                  </p>
                </div>
                <button className="crm-close" onClick={closeMessage}>
                  ×
                </button>
              </div>

              <div className="crm-drawer-body">
                {/* Message Content */}
                <div className="crm-section">
                  <h3>Message</h3>
                  <p>{selectedMessage.message}</p>
                  <div className="crm-details">
                    <span>📞 {selectedMessage.phone || "N/A"}</span>
                    <span>🏢 {selectedMessage.company || "N/A"}</span>
                    <span>🔧 {selectedMessage.serviceInterest || "N/A"}</span>
                    <span>🌐 {selectedMessage.preferredLanguage || "EN"}</span>
                  </div>
                </div>

                {/* Update Form */}
                <div className="crm-section">
                  <h3>Update Message</h3>
                  <div className="crm-form-row">
                    <label>
                      Status
                      <select
                        value={editForm.status}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                      >
                        {STATUS_OPTIONS.filter((o) => o !== "ALL").map(
                          (opt) => (
                            <option key={opt} value={opt}>
                              {statusLabel(opt)}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                    <label>
                      Assign To
                      <input
                        type="text"
                        value={editForm.assignedTo}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            assignedTo: e.target.value,
                          })
                        }
                        placeholder="Staff name"
                      />
                    </label>
                  </div>
                  <label>
                    Admin Note
                    <textarea
                      rows={3}
                      value={editForm.adminNote}
                      onChange={(e) =>
                        setEditForm({ ...editForm, adminNote: e.target.value })
                      }
                      placeholder="Internal notes..."
                    />
                  </label>
                  <button
                    className="crm-btn-primary"
                    onClick={handleUpdate}
                    disabled={saving}
                  >
                    Save Changes
                  </button>
                </div>

                {/* Reply Form */}
                <div className="crm-section">
                  <h3>Reply to Client</h3>
                  <form onSubmit={handleReply}>
                    <label>
                      Subject
                      <input
                        type="text"
                        value={replyForm.subject}
                        onChange={(e) =>
                          setReplyForm({
                            ...replyForm,
                            subject: e.target.value,
                          })
                        }
                        required
                      />
                    </label>
                    <label>
                      Message
                      <textarea
                        rows={5}
                        value={replyForm.message}
                        onChange={(e) =>
                          setReplyForm({
                            ...replyForm,
                            message: e.target.value,
                          })
                        }
                        required
                        placeholder="Write your reply..."
                      />
                    </label>
                    <button
                      type="submit"
                      className="crm-btn-primary"
                      disabled={saving}
                    >
                      Send Reply
                    </button>
                  </form>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
