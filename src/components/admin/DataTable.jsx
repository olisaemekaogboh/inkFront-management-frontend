import Button from "../common/Button";
import StatusPill from "./StatusPill";
import useLanguage from "../../hooks/useLanguage";

function renderCell(row, column) {
  const value = row?.[column.key];

  if (column.type === "boolean") {
    return <StatusPill value={value} />;
  }

  if (value === undefined || value === null || value === "") {
    return "—";
  }

  return String(value);
}

export default function DataTable({
  columns,
  rows,
  page,
  totalPages,
  onPrevious,
  onNext,
  onEdit,
  onDelete,
}) {
  const { t } = useLanguage();

  return (
    <div className="admin-table-shell">
      <div className="admin-table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{t(column.labelKey)}</th>
              ))}
              <th>{t("admin.columns.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>{renderCell(row, column)}</td>
                ))}

                <td className="admin-table-actions">
                  {onEdit ? (
                    <Button variant="secondary" onClick={() => onEdit(row)}>
                      {t("admin.actions.edit")}
                    </Button>
                  ) : null}

                  {onDelete ? (
                    <Button variant="secondary" onClick={() => onDelete(row)}>
                      {t("admin.actions.delete")}
                    </Button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-table-footer">
        <Button variant="secondary" onClick={onPrevious} disabled={page <= 0}>
          {t("admin.pagination.previous")}
        </Button>

        <span>
          {t("admin.pagination.page")} {page + 1} / {Math.max(totalPages, 1)}
        </span>

        <Button
          variant="secondary"
          onClick={onNext}
          disabled={page + 1 >= totalPages}
        >
          {t("admin.pagination.next")}
        </Button>
      </div>
    </div>
  );
}
