export default function AdminPlaceholderPage({ title }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        This admin section is protected and ready for CRUD implementation.
      </p>
    </section>
  );
}
