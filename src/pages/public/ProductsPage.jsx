import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import "../../styles/publicPremium.css";

function normalizeList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response?.data?.content)) return response.data.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
}

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

function getImageUrl(item) {
  return text(
    item?.imageUrl,
    item?.coverImageUrl,
    item?.featuredImageUrl,
    item?.thumbnailUrl,
    item?.backgroundImageUrl,
    item?.bannerImageUrl,
    item?.mediaUrl,
  );
}

export default function ProductsPage() {
  const { language, t } = useLanguage();

  // Fetch hero data - matching About, Contact, Services, and Portfolio pages
  const fetchHero = useCallback(
    () =>
      heroService.getHeroSections({
        language,
        placement: "PRODUCTS",
        featuredOnly: true,
      }),
    [language],
  );

  const hero = useFetchOnMount(fetchHero, [language]);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await publicApi.getProductBlueprints({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 24,
        });

        if (active) setProducts(normalizeList(response));
      } catch (err) {
        if (active) {
          setProducts([]);
          setError(
            err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              t("productsPage.loadError", "Failed to load products."),
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [language, t]);

  // Show loading state while hero is being fetched
  if (hero.loading) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  // Show error state if hero fetch fails
  if (hero.error) {
    return <ErrorState message={hero.error} />;
  }

  // Get hero data
  const heroItem = normalizeList(hero.data)[0] || null;

  const heroTitle = text(
    heroItem?.title,
    t("productsPage.title", "Product blueprints for serious businesses"),
  );

  const heroSubtitle = text(
    heroItem?.subtitle,
    heroItem?.description,
    t(
      "productsPage.description",
      "Explore ready-to-build digital product structures for websites, booking systems, portals, schools, e-commerce, and business dashboards.",
    ),
  );

  const imageUrl = getImageUrl(heroItem);

  return (
    <main className="premium-public-page">
      {/* Hero section - matching About, Contact, Services, and Portfolio pages */}
      <section className="premium-detail-hero">
        <div
          className={
            imageUrl
              ? "premium-container premium-detail-grid"
              : "premium-container premium-page-intro"
          }
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="premium-eyebrow">
              {t("nav.products", "Products")}
            </span>

            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
          </motion.div>

          {imageUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65 }}
              className="premium-detail-media"
            >
              <img
                src={imageUrl}
                alt={heroTitle}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.closest(
                    ".premium-detail-media",
                  ).style.display = "none";
                }}
              />
            </motion.div>
          ) : null}
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container">
          {loading ? (
            <div className="premium-loading">
              {t("states.loadingProducts", "Loading products...")}
            </div>
          ) : error ? (
            <div className="premium-empty-card">
              <strong>{t("states.error", "Something went wrong")}</strong>
              <p>{error}</p>
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
                  product.shortDescription,
                  product.solutionOverview,
                  product.description,
                  t("productsPage.noSummary", "Product summary unavailable."),
                );

                const imageUrl = text(
                  product.heroImageUrl,
                  product.imageUrl,
                  product.coverImageUrl,
                  product.thumbnailUrl,
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
                        <span>{t("productsPage.icon", "🧩")}</span>
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
