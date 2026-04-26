import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";

export default function ProductsPage() {
  const { language } = useLanguage();

  const [page, setPage] = useState({
    content: [],
    totalPages: 0,
    page: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);

        const response = await publicApi.getProductBlueprints({
          language: language || "EN",
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
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [language]);

  const products = Array.isArray(page.content) ? page.content : [];

  return (
    <div className="page">
      <main className="page__main">
        <section className="page-section bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <span className="hero__badge">Products</span>
              <h1 className="text-3xl font-bold mt-16 mb-12">Products</h1>
              <p className="text-md text-soft">
                Reusable product blueprints and solution packages for growing
                teams.
              </p>
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="container">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="empty-state">No products available yet.</div>
            ) : (
              <div className="grid grid-cols-3 gap-24">
                {products.map((product, index) => (
                  <article
                    key={product.id ?? product.slug ?? index}
                    className="card"
                  >
                    {product.heroImageUrl ? (
                      <div className="card__media">
                        <img
                          src={product.heroImageUrl}
                          alt={product.title || "Product"}
                          loading="lazy"
                        />
                      </div>
                    ) : null}

                    <div className="card__content">
                      <h3 className="card__title">
                        {product.title ?? "Untitled Product"}
                      </h3>

                      <p className="card__description">
                        {product.summary ??
                          product.solutionOverview ??
                          "Product summary unavailable."}
                      </p>

                      {product.slug ? (
                        <Link
                          to={`/products/${product.slug}`}
                          className="btn btn--outline btn--sm mt-16"
                        >
                          View product →
                        </Link>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
