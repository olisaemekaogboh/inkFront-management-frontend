import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

// ==================== PRODUCT IMAGE MAP ====================

const PRODUCT_IMAGE_MAP = {
  // Map product slugs to local images
  "school-management-system": "/images/products/school.png",
  "church-management-platform": "/images/products/church.png",
  "e-commerce-store": "/images/products/ecommerce.png",
  "real-estate-platform": "/images/products/realestate.png",
  "logistics-dashboard": "/images/products/logistics.png",
  "healthcare-management": "/images/products/healthcare.png",
  "learning-management-system": "/images/products/lms.png",
  "event-ticketing-platform": "/images/products/ticketing.png",
  "fintech-payment-system": "/images/products/fintech.png",
  "agritech-marketplace": "/images/products/agritech.png",
  "edubridge-school-platform": "/images/products/school.png",
  "edubridge-school": "/images/products/school.png",
};

// ==================== UTILITY FUNCTIONS ====================

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

function getImage(product) {
  // 1. Check if we have a mapped local image for this slug
  if (product?.slug && PRODUCT_IMAGE_MAP[product.slug]) {
    return PRODUCT_IMAGE_MAP[product.slug];
  }

  // 2. Check for database image that is VALID and NOT from AI
  const dbImage = text(
    product?.heroImageUrl,
    product?.imageUrl,
    product?.coverImageUrl,
    product?.thumbnailUrl,
    product?.featuredImageUrl,
  );

  // Only use database image if it's valid and not from AI
  if (
    dbImage &&
    !dbImage.includes("pollinations") &&
    !dbImage.includes("ai-generated") &&
    !dbImage.includes("placeholder") &&
    (dbImage.startsWith("http") || dbImage.startsWith("/"))
  ) {
    return dbImage;
  }

  // 3. Try to match by title/category keywords
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

  // 4. Default fallback
  return "/images/products/default.png";
}

function formatBulletList(textString) {
  if (!textString) return null;
  return textString.split("\n").filter((line) => line.trim());
}

// Preload image function
function preloadImage(url) {
  if (!url) return;
  const img = new Image();
  img.src = url;
}

// ==================== OPTIMIZED IMAGE COMPONENT ====================

function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  onLoad,
  placeholder = true,
  objectFit = "cover",
}) {
  const FALLBACK_IMAGE = "/images/products/default.png";

  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoaded(false);
  }, [src]);

  if (!imageSrc) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {placeholder && !isLoaded && (
        <div
          className="image-placeholder"
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            position: "absolute",
            inset: 0,
            zIndex: 1,
            borderRadius: "inherit",
          }}
        />
      )}

      <img
        src={imageSrc}
        alt={alt || "Product image"}
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
          objectFit,
        }}
        onLoad={() => {
          setIsLoaded(true);

          if (onLoad) {
            onLoad();
          }
        }}
        onError={() => {
          console.warn(`Failed to load image: ${imageSrc}`);

          if (imageSrc !== FALLBACK_IMAGE) {
            setIsLoaded(false);
            setImageSrc(FALLBACK_IMAGE);
          }
        }}
      />
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function ProductBlueprintPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  // Memoize product data to avoid recalculations
  const productData = useMemo(() => {
    if (!product) return null;

    return {
      title: text(
        product.title,
        product.name,
        t("products.untitled", "Untitled Product"),
      ),
      summary: text(
        product.summary,
        t("products.noSummary", "No product summary available."),
      ),
      imageUrl: getImage(product),
      benefitsList: formatBulletList(product.keyBenefits),
      useCasesList: formatBulletList(product.useCases),
    };
  }, [product, t]);

  // Preload hero image when URL is available
  useEffect(() => {
    if (productData?.imageUrl) {
      preloadImage(productData.imageUrl);
    }
  }, [productData?.imageUrl]);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);

        const data = await publicApi.getProductBlueprintBySlug(slug, {
          language: language || "EN",
        });

        if (active) setProduct(data);
      } catch {
        if (active) setProduct(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug, language]);

  if (loading) {
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div className="premium-loading">
              {t("states.loadingPage", "Loading product...")}
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="premium-public-page">
        <section className="premium-section">
          <div className="premium-container">
            <div className="premium-empty-card">
              <strong>{t("products.notFound", "Product not found.")}</strong>
              <Link to="/products" style={{ display: "block", marginTop: 16 }}>
                ← {t("common.backToList", "Back to products")}
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const { title, summary, imageUrl, benefitsList, useCasesList } = productData;

  return (
    <main className="premium-public-page">
      {/* Hero Section - optimized with priority loading */}
      <section className="premium-detail-hero">
        <div className="premium-container premium-detail-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="premium-eyebrow">
              {t("products.eyebrow", "Product Blueprint")}
            </span>

            <h1>{title}</h1>
            <p>{summary}</p>

            <div className="premium-actions">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                {t("common.contactUs", "Start a project")}
              </Link>

              <Link to="/products" className="premium-btn premium-btn-ghost">
                ← {t("common.backToList", "Back to products")}
              </Link>
            </div>
          </motion.div>

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
            {imageUrl ? (
              <OptimizedImage
                src={imageUrl}
                alt={title}
                className="premium-detail-media__img"
                priority={true}
                onLoad={() => setHeroImageLoaded(true)}
                placeholder={true}
                objectFit="cover"
              />
            ) : (
              <div className="premium-detail-placeholder">
                {t("products.placeholderIcon", "🧩")}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Core Content: Challenge, Solution, Features */}
      <section className="premium-section">
        <div className="premium-container premium-detail-content">
          {product.challengeStatement ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="premium-info-panel"
            >
              <span>01</span>
              <h2>{t("products.challenge", "Challenge")}</h2>
              <p>{product.challengeStatement}</p>
            </motion.article>
          ) : null}

          {product.solutionOverview ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="premium-info-panel"
            >
              <span>02</span>
              <h2>{t("products.solution", "Solution")}</h2>
              <p>{product.solutionOverview}</p>
            </motion.article>
          ) : null}

          {product.featureHighlights ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="premium-info-panel"
            >
              <span>03</span>
              <h2>{t("products.features", "Feature Highlights")}</h2>
              <p>{product.featureHighlights}</p>
            </motion.article>
          ) : null}
        </div>
      </section>

      {/* Enhanced Content: Benefits, Use Cases, Tech Stack, Timeline */}
      <section className="premium-section premium-section-alt">
        <div className="premium-container premium-detail-content">
          {benefitsList && benefitsList.length > 0 ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="premium-info-panel premium-benefits-panel"
            >
              <span>04</span>
              <h2>{t("products.keyBenefits", "Key Benefits")}</h2>
              <ul className="premium-bullet-list">
                {benefitsList.map((benefit, index) => (
                  <li key={index}>{benefit.replace(/^[•\-]\s*/, "")}</li>
                ))}
              </ul>
            </motion.article>
          ) : null}

          {useCasesList && useCasesList.length > 0 ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="premium-info-panel"
            >
              <span>05</span>
              <h2>{t("products.useCases", "Use Cases")}</h2>
              <ul className="premium-bullet-list">
                {useCasesList.map((useCase, index) => (
                  <li key={index}>{useCase.replace(/^[•\-]\s*/, "")}</li>
                ))}
              </ul>
            </motion.article>
          ) : null}

          {product.targetUsers ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="premium-info-panel"
            >
              <span>06</span>
              <h2>{t("products.targetUsers", "Target Users")}</h2>
              <p>{product.targetUsers}</p>
            </motion.article>
          ) : null}

          {product.techStack ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="premium-info-panel"
            >
              <span>07</span>
              <h2>{t("products.techStack", "Technology Stack")}</h2>
              <p className="premium-tech-stack">{product.techStack}</p>
            </motion.article>
          ) : null}

          {product.timeline ? (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="premium-info-panel"
            >
              <span>08</span>
              <h2>{t("products.timeline", "Estimated Timeline")}</h2>
              <p>{product.timeline}</p>
            </motion.article>
          ) : null}
        </div>
      </section>

      {/* CTA Section */}
      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow premium-eyebrow--light">
            {t("products.ctaEyebrow", "Build with clarity")}
          </span>
          <h2>
            {t(
              "products.ctaTitle",
              "Ready to turn this blueprint into a real product?",
            )}
          </h2>
          <p>
            {t(
              "products.ctaDescription",
              "Let Inkfront help you convert your idea into a polished business platform.",
            )}
          </p>
          <Link to="/contact" className="premium-btn premium-btn-light">
            {t("common.contactUs", "Talk to us")}
          </Link>
        </div>
      </section>
    </main>
  );
}
