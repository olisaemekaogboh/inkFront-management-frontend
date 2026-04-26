import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { publicApi } from "../../services/publicApi";

export default function ProductsPage() {
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
        const response = await publicApi.getProductBlueprints({
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

  const products = Array.isArray(page.content) ? page.content : [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Products</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
        Reusable product blueprints and solution packages for growing teams.
      </p>

      {loading ? (
        <div className="mt-10 text-sm text-slate-500">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-slate-700">
          No products available yet.
        </div>
      ) : (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <article
              key={product.id ?? product.slug ?? index}
              className="rounded-2xl border border-slate-200 p-6 shadow-sm dark:border-slate-800"
            >
              <h2 className="text-xl font-semibold">
                {product.title ?? product.name ?? "Untitled Product"}
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {product.summary ??
                  product.shortDescription ??
                  product.description ??
                  "Product summary unavailable."}
              </p>

              {product.slug ? (
                <Link
                  to={`/products/${product.slug}`}
                  className="mt-4 inline-flex text-sm font-medium text-blue-600"
                >
                  View product
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
