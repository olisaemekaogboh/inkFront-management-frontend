import { Link } from "react-router-dom";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { publicApi } from "../../services/publicApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import "../../styles/publicPremium.css";

// ==================== CONSTANTS ====================

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const STAGGER_VARIANTS = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

// ==================== UTILITY FUNCTIONS ====================

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

function optimizeImageUrl(url) {
  if (!url) return url;

  if (url.includes("images.unsplash.com")) {
    const hasParams = url.includes("?");
    return `${url}${hasParams ? "&" : "?"}auto=format&fit=crop&w=1200&q=80`;
  }

  if (url.includes("cloudinary.com")) {
    return url;
  }

  return url;
}

function getProcessedTitle(product, t) {
  return text(
    product.title,
    product.name,
    t("productsPage.untitled", "Untitled Product"),
  );
}

function getProcessedSummary(product, t) {
  return text(
    product.summary,
    product.shortDescription,
    product.solutionOverview,
    product.description,
    t("productsPage.noSummary", "Product summary unavailable."),
  );
}

function getProcessedImageUrl(product) {
  return text(
    product.heroImageUrl,
    product.imageUrl,
    product.coverImageUrl,
    product.thumbnailUrl,
  );
}

function getBlueprintNumber(index) {
  return String(index + 1).padStart(2, "0");
}

// ==================== OPTIMIZED IMAGE COMPONENT ====================

const OptimizedImage = memo(function OptimizedImage({
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
  const optimizedSrc = useMemo(() => optimizeImageUrl(src), [src]);

  if (!src || imageError) return null;

  return (
    <div className="optimized-image-wrapper">
      {placeholder && !isLoaded && <div className="image-placeholder" />}
      <img
        src={optimizedSrc}
        alt={alt || ""}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={className}
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        onError={() => {
          setImageError(true);
        }}
      />
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

// ==================== MEMOIZED CHILD COMPONENTS ====================

const ProductsHero = memo(function ProductsHero({ title, subtitle, imageUrl }) {
  const { t } = useLanguage();

  return (
    <section className="premium-detail-hero">
      <div
        className={
          imageUrl
            ? "premium-container premium-detail-grid"
            : "premium-container premium-page-intro"
        }
      >
        <m.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="premium-eyebrow">
            {t("nav.products", "Products")}
          </span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </m.div>

        {imageUrl && (
          <m.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="premium-detail-media"
          >
            <OptimizedImage
              src={imageUrl}
              alt={title}
              className="premium-detail-media__img"
              priority={true}
              placeholder={true}
              objectFit="cover"
            />
          </m.div>
        )}
      </div>
    </section>
  );
});

ProductsHero.displayName = "ProductsHero";

const ProductCard = memo(function ProductCard({ product, index, t }) {
  const {
    id,
    slug,
    processedTitle: title,
    processedSummary: summary,
    processedImageUrl: imageUrl,
    processedLink: to,
    blueprintNumber,
  } = product;

  const delay = Math.min(index * 0.04, 0.5);

  return (
    <m.article
      variants={FADE_UP_VARIANTS}
      custom={delay}
      className="premium-product-card"
      role="article"
      aria-label={title}
    >
      {imageUrl ? (
        <div className="premium-product-image-wrapper">
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
          <span role="img" aria-hidden="true">
            {t("productsPage.icon", "🧩")}
          </span>
        </div>
      )}

      <div className="premium-product-body">
        <span className="premium-mini-badge">
          {t("productsPage.blueprint", "Blueprint")} {blueprintNumber}
        </span>

        <h3>{title}</h3>
        <p>{summary}</p>

        {slug && (
          <Link
            to={to}
            className="premium-text-link"
            aria-label={`View ${title} blueprint`}
          >
            {t("productsPage.viewBlueprint", "View blueprint")} →
          </Link>
        )}
      </div>
    </m.article>
  );
});

ProductCard.displayName = "ProductCard";

const ProductsGrid = memo(function ProductsGrid({
  products,
  loading,
  error,
  t,
}) {
  const processedProducts = useMemo(() => {
    return products.map((product, index) => ({
      ...product,
      processedTitle: getProcessedTitle(product, t),
      processedSummary: getProcessedSummary(product, t),
      processedImageUrl: getProcessedImageUrl(product),
      processedLink: product.slug ? `/products/${product.slug}` : "#",
      blueprintNumber: getBlueprintNumber(index),
    }));
  }, [products, t]);

  if (loading) {
    return <LoadingProducts />;
  }

  if (error) {
    return <EmptyProducts error={error} t={t} />;
  }

  if (products.length === 0) {
    return <EmptyProducts t={t} />;
  }

  return (
    <m.div
      variants={STAGGER_VARIANTS}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="premium-product-grid"
    >
      {processedProducts.map((product, index) => (
        <ProductCard
          key={product.id ?? product.slug ?? product.blueprintNumber}
          product={product}
          index={index}
          t={t}
        />
      ))}
    </m.div>
  );
});

ProductsGrid.displayName = "ProductsGrid";

const LoadingProducts = memo(function LoadingProducts() {
  return (
    <div className="premium-product-grid">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="premium-product-card skeleton-card">
          <div className="skeleton-image" />
          <div className="premium-product-body">
            <div className="skeleton-text skeleton-title" />
            <div className="skeleton-text skeleton-description" />
            <div className="skeleton-text skeleton-description" />
          </div>
        </div>
      ))}
    </div>
  );
});

LoadingProducts.displayName = "LoadingProducts";

const EmptyProducts = memo(function EmptyProducts({ error, t }) {
  if (error) {
    return (
      <div className="premium-empty-card">
        <strong>{t("states.error", "Something went wrong")}</strong>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="premium-empty-card">
      <strong>{t("productsPage.empty", "No products available yet.")}</strong>
    </div>
  );
});

EmptyProducts.displayName = "EmptyProducts";

// ==================== MAIN COMPONENT ====================

export default function ProductsPage() {
  const { language, t } = useLanguage();

  // ==================== DATA FETCHING ====================

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
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  // ==================== MEMOIZED DATA ====================

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

  // ==================== SIDE EFFECTS ====================

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        setLoadingProducts(true);
        setProductsError("");

        const response = await publicApi.getProductBlueprints({
          language: language || "EN",
          featuredOnly: false,
          page: 0,
          size: 24,
        });

        if (active) {
          setProducts(normalizeList(response));
        }
      } catch (err) {
        if (active) {
          setProducts([]);
          const errorMessage =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            t("productsPage.loadError", "Failed to load products.");
          setProductsError(errorMessage);
        }
      } finally {
        if (active) {
          setLoadingProducts(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [language, t]);

  // ==================== LOADING & ERROR STATES ====================

  if (hero.loading) {
    return (
      <LoadingSpinner label={t("states.loadingPage", "Loading page...")} />
    );
  }

  if (hero.error) {
    return <ErrorState message={hero.error} />;
  }

  // ==================== RENDER ====================

  return (
    <LazyMotion features={domAnimation}>
      <main className="premium-public-page">
        <ProductsHero
          title={heroData.title}
          subtitle={heroData.subtitle}
          imageUrl={heroData.imageUrl}
        />

        <section className="premium-section">
          <div className="premium-container">
            <ProductsGrid
              products={products}
              loading={loadingProducts}
              error={productsError}
              t={t}
            />
          </div>
        </section>
      </main>
    </LazyMotion>
  );
}

// ==================== CSS CLASSES NEEDED ====================
/* 
  Add these CSS classes to your stylesheet:

  .optimized-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: inherit;
    z-index: 1;
  }

  .skeleton-card {
    background: #f8f9fa;
    border-radius: 12px;
    overflow: hidden;
  }

  .skeleton-image {
    width: 100%;
    height: 200px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-text {
    height: 14px;
    background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .skeleton-title {
    height: 20px;
    width: 70%;
  }

  .skeleton-description {
    width: 90%;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .premium-product-image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .premium-product-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .premium-detail-media {
    position: relative;
    overflow: hidden;
    min-height: 200px;
  }

  .premium-product-card {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  .premium-product-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  .premium-product-body {
    padding: 1.5rem;
  }

  .premium-mini-badge {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6c63ff;
    background: rgba(108, 99, 255, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    margin-bottom: 0.75rem;
  }

  .premium-product-body h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1a1a2e;
  }

  .premium-product-body p {
    font-size: 0.875rem;
    color: #4a4a5a;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .premium-text-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c63ff;
    font-weight: 500;
    text-decoration: none;
    transition: gap 0.3s ease;
  }

  .premium-text-link:hover {
    gap: 0.75rem;
    text-decoration: underline;
  }

  .premium-product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }

  .premium-empty-card {
    text-align: center;
    padding: 4rem 2rem;
    background: #f8f9fa;
    border-radius: 12px;
    color: #4a4a5a;
  }

  .premium-empty-card strong {
    display: block;
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
    color: #1a1a2e;
  }

  .premium-fallback-media {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    background: #f0f0f5;
  }
*/
