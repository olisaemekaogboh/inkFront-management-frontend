export default function StatusPill({ value }) {
  const normalized = Boolean(value);

  return (
    <span
      className={normalized ? "status-pill active" : "status-pill inactive"}
    >
      {normalized ? "Yes" : "No"}
    </span>
  );
}
