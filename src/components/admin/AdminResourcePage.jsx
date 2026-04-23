import { useEffect, useMemo, useState } from "react";
import Container from "../../components/common/Container";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import AdminSectionHeader from "../../components/admin/AdminSectionHeader";
import DataTable from "../../components/admin/DataTable";
import ResourceFormModal from "../../components/admin/ResourceFormModal";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import useAdminResource from "../../hooks/useAdminResource";
import useLanguage from "../../hooks/useLanguage";
import { adminResources } from "../../config/adminResources";

export default function AdminResourcePage({ resourceKey }) {
  const { t } = useLanguage();
  const resourceConfig = adminResources[resourceKey];
  const {
    page,
    setPage,
    search,
    setSearch,
    result,
    createItem,
    updateItem,
    deleteItem,
    getItem,
  } = useAdminResource(resourceConfig);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  useEffect(() => {
    if (!modalOpen || !editingId) {
      return;
    }

    let active = true;

    async function loadItem() {
      try {
        const item = await getItem(editingId);
        if (active) {
          setInitialValues(item || {});
        }
      } catch {
        if (active) {
          setInitialValues({});
        }
      }
    }

    loadItem();

    return () => {
      active = false;
    };
  }, [editingId, getItem, modalOpen]);

  const rows = useMemo(() => result.data.content || [], [result.data.content]);

  function handleCreate() {
    setEditingId(null);
    setInitialValues({});
    setModalOpen(true);
  }

  function handleEdit(row) {
    setEditingId(row.id);
    setInitialValues(row);
    setModalOpen(true);
  }

  async function handleSubmit(payload) {
    setFormSubmitting(true);

    try {
      if (editingId) {
        await updateItem(editingId, payload);
      } else {
        await createItem(payload);
      }

      setModalOpen(false);
      setEditingId(null);
      setInitialValues({});
    } finally {
      setFormSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget?.id) {
      return;
    }

    setDeleteSubmitting(true);

    try {
      await deleteItem(deleteTarget.id);
      setDeleteTarget(null);
    } finally {
      setDeleteSubmitting(false);
    }
  }

  return (
    <Container className="page-section">
      <AdminSectionHeader
        titleKey={resourceConfig.titleKey}
        descriptionKey={resourceConfig.descriptionKey}
        onCreate={resourceConfig.createEnabled === false ? null : handleCreate}
      />

      <div className="admin-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => {
            setPage(0);
            setSearch(event.target.value);
          }}
          placeholder={t(resourceConfig.searchPlaceholderKey)}
          aria-label={t(resourceConfig.searchPlaceholderKey)}
        />
      </div>

      {result.loading ? (
        <LoadingSpinner label={t("admin.states.loading")} />
      ) : null}
      {result.error ? <ErrorState message={result.error} /> : null}
      {!result.loading && !result.error && rows.length === 0 ? (
        <EmptyState title={t("admin.states.empty")} />
      ) : null}

      {!result.loading && !result.error && rows.length > 0 ? (
        <DataTable
          columns={resourceConfig.columns}
          rows={rows}
          page={result.data.page}
          totalPages={result.data.totalPages}
          onPrevious={() => setPage((current) => Math.max(current - 1, 0))}
          onNext={() => setPage((current) => current + 1)}
          onEdit={handleEdit}
          onDelete={(row) => setDeleteTarget(row)}
        />
      ) : null}

      <ResourceFormModal
        open={modalOpen}
        titleKey={editingId ? "admin.actions.edit" : "admin.actions.create"}
        fields={resourceConfig.fields}
        initialValues={initialValues}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
          setInitialValues({});
        }}
        onSubmit={handleSubmit}
        submitting={formSubmitting}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        confirming={deleteSubmitting}
      />
    </Container>
  );
}
