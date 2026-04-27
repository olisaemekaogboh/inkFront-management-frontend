import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

function normalizeList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data?.content)) return response.data.content;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

export default function ProductsPage() {
  const { language, t } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);

        const response = await publicApi.getProductBlueprints({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 24,
        });

        if (active) setProducts(normalizeList(response));
      } catch {
        if (active) setProducts([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [language]);

  return (
    <main className="premium-public-page">
      <section className="premium-hero premium-compact-hero">
        <div className="premium-container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="premium-page-intro"
          >
            <span className="premium-eyebrow">
              {t("nav.products", "Products")}
            </span>

            <h1>
              {t(
                "productsPage.title",
                "Product blueprints for serious businesses",
              )}
            </h1>

            <p>
              {t(
                "productsPage.description",
                "Explore ready-to-build digital product structures for websites, booking systems, portals, schools, e-commerce, and business dashboards.",
              )}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container">
          {loading ? (
            <div className="premium-loading">
              {t("states.loadingPage", "Loading products...")}
            </div>
          ) : products.length === 0 ? (
            <div className="premium-empty-card">
              <strong>
                {t("productsPage.empty", "No products available yet.")}
              </strong>
            </div>
          ) : (
            <div className="premium-product-grid">
              {products.map((product, index) => {
                const title = text(
                  product.title,
                  product.name,
                  t("productsPage.untitled", "Untitled Product"),
                );

                const summary = text(
                  product.summary,
                  product.solutionOverview,
                  t("productsPage.noSummary", "Product summary unavailable."),
                );

                const imageUrl = text(
                  product.heroImageUrl,
                  product.imageUrl,
                  product.coverImageUrl,
                );

                return (
                  <motion.article
                    key={product.id ?? product.slug ?? index}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: index * 0.04 }}
                    viewport={{ once: true }}
                    className="premium-product-card"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={title}
                        className="premium-product-image"
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="premium-product-image premium-fallback-media">
                        <span>🧩</span>
                      </div>
                    )}

                    <div className="premium-product-body">
                      <span className="premium-mini-badge">
                        {t("productsPage.blueprint", "Blueprint")}{" "}
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h3>{title}</h3>
                      <p>{summary}</p>

                      {product.slug ? (
                        <Link
                          to={`/products/${product.slug}`}
                          className="premium-text-link"
                        >
                          {t("productsPage.viewBlueprint", "View blueprint")} →
                        </Link>
                      ) : null}
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
