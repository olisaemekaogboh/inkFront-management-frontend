import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../../services/publicApi";

export default function PortfolioDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await publicApi.getPortfolioProjectBySlug(slug);
        if (active) {
          setProject(data);
        }
      } catch {
        if (active) {
          setProject(null);
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
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 text-sm text-slate-500">
        Loading project...
      </section>
    );
  }

  if (!project) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-slate-700">
          Project not found.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        {project.title ?? project.name ?? "Untitled Project"}
      </h1>

      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
        {project.description ??
          project.summary ??
          project.shortDescription ??
          "No project description available."}
      </p>

      {Array.isArray(project.highlights) && project.highlights.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Highlights</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-slate-600 dark:text-slate-400">
            {project.highlights.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
