import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicApi } from "../../services/publicApi";

export default function PortfolioListPage() {
  const [page, setPage] = useState({
    content: [],
    totalPages: 0,
    page: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await publicApi.getPortfolioProjects({
          page: 0,
          size: 12,
        });
        if (active) {
          setPage(response);
        }
      } catch {
        if (active) {
          setPage({ content: [], totalPages: 0, page: 0 });
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const projects = Array.isArray(page.content) ? page.content : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
        Selected work, case studies, and launches from our recent engagements.
      </p>

      {loading ? (
        <div className="mt-10 text-sm text-slate-500">Loading portfolio...</div>
      ) : projects.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-slate-700">
          No portfolio projects available yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.id ?? project.slug ?? index}
              className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-800"
            >
              <h2 className="text-xl font-semibold">
                {project.title ?? project.name ?? "Untitled Project"}
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {project.summary ??
                  project.shortDescription ??
                  project.description ??
                  "Project summary unavailable."}
              </p>

              {project.slug ? (
                <Link
                  to={`/portfolio/${project.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-blue-600"
                >
                  View project
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
