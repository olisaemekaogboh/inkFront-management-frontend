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

// ==================== PRODUCT IMAGE MAP ====================
// ==================== PRODUCT IMAGE MAP ====================

const PRODUCT_IMAGE_MAP = {
  "business-website-blueprint":
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",

  "service-business-blueprint":
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",

  "booking-platform-blueprint":
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1400&q=80",

  "school-management-blueprint":
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85",

  // CARD 05
  "e-commerce-blueprint":
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=80",

  "client-portal-blueprint":
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1400&q=80",
};

const DEFAULT_PRODUCT_IMAGES = [
  "/images/products/school.png",
  "/images/products/church.png",
  "/images/products/ecommerce.png",
  "/images/products/realestate.png",
  "/images/products/logistics.png",
  "/images/products/healthcare.png",
  "/images/products/lms.png",
  "/images/products/ticketing.png",
  "/images/products/fintech.png",
  "/images/products/agritech.png",
];

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
  const url = text(
    item?.imageUrl,
    item?.coverImageUrl,
    item?.featuredImageUrl,
    item?.thumbnailUrl,
    item?.backgroundImageUrl,
    item?.bannerImageUrl,
    item?.mediaUrl,
  );

  if (!url) {
    return "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85";
  }

  return url.trim();
}

function optimizeImageUrl(url) {
  if (!url || typeof url !== "string") {
    return url;
  }

  const cleanUrl = url.trim();

  // Do NOT modify Unsplash URLs.
  // They already contain their own optimization parameters.
  if (cleanUrl.includes("images.unsplash.com")) {
    return cleanUrl;
  }

  // Cloudinary URLs should also be left untouched.
  if (cleanUrl.includes("cloudinary.com")) {
    return cleanUrl;
  }

  return cleanUrl;
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

// ==================== FIXED: getProcessedImageUrl ====================

function getProcessedImageUrl(product, index) {
  const slug = product?.slug?.trim();

  // --------------------------------------------------
  // 1. ALWAYS use our controlled image for known products
  // --------------------------------------------------
  if (slug && PRODUCT_IMAGE_MAP[slug]) {
    return PRODUCT_IMAGE_MAP[slug];
  }

  // --------------------------------------------------
  // 2. Database image fallback
  // --------------------------------------------------
  const dbImage = text(
    product?.heroImageUrl,
    product?.imageUrl,
    product?.coverImageUrl,
    product?.thumbnailUrl,
    product?.featuredImageUrl,
  );

  if (
    dbImage &&
    !dbImage.includes("pollinations") &&
    !dbImage.includes("ai-generated") &&
    !dbImage.includes("placeholder") &&
    (dbImage.startsWith("http://") ||
      dbImage.startsWith("https://") ||
      dbImage.startsWith("/"))
  ) {
    return dbImage.trim();
  }

  // --------------------------------------------------
  // 3. Keyword fallback
  // --------------------------------------------------
  const title = (product?.title || "").toLowerCase();
  const category = (
    product?.category ||
    product?.clientIndustry ||
    ""
  ).toLowerCase();

  if (
    title.includes("school") ||
    title.includes("education") ||
    title.includes("learn") ||
    category.includes("education")
  ) {
    return "/images/products/school.png";
  }

  if (
    title.includes("church") ||
    title.includes("ministry") ||
    title.includes("faith")
  ) {
    return "/images/products/church.png";
  }

  if (
    title.includes("ecommerce") ||
    title.includes("e-commerce") ||
    title.includes("store") ||
    title.includes("shop") ||
    title.includes("market")
  ) {
    return "/images/products/ecommerce.png";
  }

  if (
    title.includes("estate") ||
    title.includes("property") ||
    title.includes("real")
  ) {
    return "/images/products/realestate.png";
  }

  if (
    title.includes("logistic") ||
    title.includes("ship") ||
    title.includes("delivery") ||
    title.includes("fleet")
  ) {
    return "/images/products/logistics.png";
  }

  if (
    title.includes("health") ||
    title.includes("medical") ||
    title.includes("hospital") ||
    title.includes("clinic")
  ) {
    return "/images/products/healthcare.png";
  }

  if (
    title.includes("learning") ||
    title.includes("course") ||
    title.includes("train") ||
    title.includes("lms")
  ) {
    return "/images/products/lms.png";
  }

  if (
    title.includes("ticket") ||
    title.includes("event") ||
    title.includes("booking")
  ) {
    return "/images/products/ticketing.png";
  }

  if (
    title.includes("fintech") ||
    title.includes("payment") ||
    title.includes("bank") ||
    title.includes("finance")
  ) {
    return "/images/products/fintech.png";
  }

  if (
    title.includes("agric") ||
    title.includes("farm") ||
    title.includes("crop") ||
    title.includes("agri")
  ) {
    return "/images/products/agritech.png";
  }

  // --------------------------------------------------
  // 4. Final fallback
  // --------------------------------------------------
  return DEFAULT_PRODUCT_IMAGES[index % DEFAULT_PRODUCT_IMAGES.length];
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
  objectFit = "cover",
}) {
  const FALLBACK_IMAGE = "/images/products/default.png";

  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  return (
    <img
      src={imageSrc || FALLBACK_IMAGE}
      alt={alt || "Product image"}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        objectFit,
        display: "block",
      }}
      onLoad={() => {
        if (onLoad) {
          onLoad();
        }
      }}
      onError={() => {
        if (imageSrc !== FALLBACK_IMAGE) {
          console.warn("Product image failed:", imageSrc);

          setImageSrc(FALLBACK_IMAGE);
        }
      }}
    />
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
            priority={index < 6}
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
      processedImageUrl: getProcessedImageUrl(product, index),
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
