import useAuth from "../../hooks/useAuth";

const cards = [
  {
    title: "Services",
    value: "Manage",
    description: "Create and update agency service pages.",
  },
  {
    title: "Portfolio",
    value: "Projects",
    description: "Publish case studies and project details.",
  },
  {
    title: "Products",
    value: "Blueprints",
    description: "Manage product blueprint landing pages.",
  },
  {
    title: "Clients",
    value: "Trust",
    description: "Control testimonials and client logos.",
  },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <section>
      <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
        <p className="text-sm font-medium text-slate-300">Dashboard</p>
        <h1 className="mt-3 text-3xl font-bold">
          Welcome, {user?.firstName || user?.displayName || "Admin"}
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Your Google/cookie login is working. This dashboard is ready for the
          next phase: CRUD pages for services, portfolio, products, clients, and
          homepage content.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <h2 className="mt-3 text-2xl font-bold">{card.value}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
