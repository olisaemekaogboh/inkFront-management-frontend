import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";
import "../../styles/publicPremium.css";

function text(...values) {
  return (
    values.find((value) => typeof value === "string" && value.trim()) || ""
  );
}

function getImage(product) {
  return text(product?.heroImageUrl, product?.imageUrl, product?.coverImageUrl);
}

function formatBulletList(textString) {
  if (!textString) return null;
  return textString.split("\n").filter((line) => line.trim());
}

export default function ProductBlueprintPage() {
  const { slug } = useParams();
  const { language, t } = useLanguage();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <div className="premium-loading">Loading product...</div>
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
            <div className="premium-empty-card">Product not found.</div>
          </div>
        </section>
      </main>
    );
  }

  const title = text(product.title, product.name, "Untitled Product");
  const summary = text(product.summary, "No product summary available.");
  const imageUrl = getImage(product);

  const benefitsList = formatBulletList(product.keyBenefits);
  const useCasesList = formatBulletList(product.useCases);

  return (
    <main className="premium-public-page">
      {/* Hero Section */}
      <section className="premium-detail-hero">
        <div className="premium-container premium-detail-grid">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
          >
            <span className="premium-eyebrow">
              {t("nav.products", "Product Blueprint")}
            </span>

            <h1>{title}</h1>
            <p>{summary}</p>

            <div className="premium-actions">
              <Link to="/contact" className="premium-btn premium-btn-primary">
                Start a project
              </Link>

              <Link to="/products" className="premium-btn premium-btn-ghost">
                ← Back to products
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65 }}
            className="premium-detail-media"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="premium-detail-placeholder">🧩</div>
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
              <h2>Challenge</h2>
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
              <h2>Solution</h2>
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
              <h2>Feature Highlights</h2>
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
              <h2>Key Benefits</h2>
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
              <h2>Use Cases</h2>
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
              <h2>Target Users</h2>
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
              <h2>Technology Stack</h2>
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
              <h2>Estimated Timeline</h2>
              <p>{product.timeline}</p>
            </motion.article>
          ) : null}
        </div>
      </section>

      {/* CTA Section */}
      <section className="premium-cta">
        <div className="premium-container premium-cta-inner">
          <span className="premium-eyebrow">Build with clarity</span>
          <h2>Ready to turn this blueprint into a real product?</h2>
          <p>
            Let InkFront help you convert your idea into a polished business
            platform.
          </p>
          <Link to="/contact" className="premium-btn premium-btn-light">
            Talk to us
          </Link>
        </div>
      </section>
    </main>
  );
}
