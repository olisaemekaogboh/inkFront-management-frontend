import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo } from "react";
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

// Preload image function
function preloadImage(url) {
  if (!url) return;
  const img = new Image();
  img.src = url;
}

// Optimized image component with priority support and placeholder
function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
  placeholder = true,
  objectFit = "cover",
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || imageError) return null;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {placeholder && !isLoaded && (
        <div
          className="image-placeholder"
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1,
            borderRadius: "inherit",
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
          objectFit: objectFit,
        }}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={(event) => {
          console.warn(`Failed to load image: ${src}`);
          setImageError(true);
          event.currentTarget.style.display = "none";
        }}
      />
    </div>
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
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Memoize hero data to avoid recalculations
  const heroData = useMemo(() => {
    const heroItem = normalizeList(hero.data)[0] || null;
    return {
      item: heroItem,
      title: text(
        heroItem?.title,
        t("productsPage.title", "Product blueprints for serious businesses"),
      ),
      subtitle: text(
        heroItem?.subtitle,
        heroItem?.description,
        t(
          "productsPage.description",
          "Explore ready-to-build digital product structures for websites, booking systems, portals, schools, e-commerce, and business dashboards.",
        ),
      ),
      imageUrl: getImageUrl(heroItem),
    };
  }, [hero.data, t]);

  // Memoize processed products data
  const processedProducts = useMemo(() => {
    return products.map((product, index) => ({
      ...product,
      processedTitle: text(
        product.title,
        product.name,
        t("productsPage.untitled", "Untitled Product"),
      ),
      processedSummary: text(
        product.summary,
        product.shortDescription,
        product.solutionOverview,
        product.description,
        t("productsPage.noSummary", "Product summary unavailable."),
      ),
      processedImageUrl: text(
        product.heroImageUrl,
        product.imageUrl,
        product.coverImageUrl,
        product.thumbnailUrl,
      ),
      processedLink: product.slug ? `/products/${product.slug}` : "#",
      blueprintNumber: String(index + 1).padStart(2, "0"),
    }));
  }, [products, t]);

  // Preload hero image when URL is available
  useEffect(() => {
    if (heroData.imageUrl) {
      preloadImage(heroData.imageUrl);
    }
  }, [heroData.imageUrl]);

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

  const { title: heroTitle, subtitle: heroSubtitle, imageUrl } = heroData;

  return (
    <main className="premium-public-page">
      {/* Hero section - optimized with priority loading */}
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
              style={{
                position: "relative",
                overflow: "hidden",
                minHeight: "200px",
              }}
            >
              <OptimizedImage
                src={imageUrl}
                alt={heroTitle}
                className="premium-detail-media__img"
                priority={true}
                onLoad={() => setHeroImageLoaded(true)}
                placeholder={true}
                objectFit="cover"
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
              {processedProducts.map((product) => {
                const {
                  id,
                  slug,
                  processedTitle: title,
                  processedSummary: summary,
                  processedImageUrl: imageUrl,
                  processedLink: to,
                  blueprintNumber,
                } = product;

                return (
                  <motion.article
                    key={id ?? slug ?? blueprintNumber}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: Math.min(
                        (parseInt(blueprintNumber) - 1) * 0.04,
                        0.5,
                      ),
                    }}
                    viewport={{ once: true }}
                    className="premium-product-card"
                  >
                    {imageUrl ? (
                      <div
                        className="premium-product-image-wrapper"
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "200px",
                        }}
                      >
                        <OptimizedImage
                          src={imageUrl}
                          alt={title}
                          className="premium-product-image"
                          priority={false}
                          placeholder={true}
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="premium-product-image premium-fallback-media">
                        <span>{t("productsPage.icon", "🧩")}</span>
                      </div>
                    )}

                    <div className="premium-product-body">
                      <span className="premium-mini-badge">
                        {t("productsPage.blueprint", "Blueprint")}{" "}
                        {blueprintNumber}
                      </span>

                      <h3>{title}</h3>
                      <p>{summary}</p>

                      {slug ? (
                        <Link to={to} className="premium-text-link">
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
