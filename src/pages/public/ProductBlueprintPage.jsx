import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";
import { publicApi } from "../../services/publicApi";

export default function ProductBlueprintPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

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

        if (active) {
          setProduct(data);
        }
      } catch {
        if (active) {
          setProduct(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug, language]);

  if (loading) {
    return (
      <div className="page">
        <main className="page__main">
          <div className="container text-center py-48">
            <div className="loading">Loading product...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <main className="page__main">
          <div className="container">
            <div className="error-state-card">Product not found.</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <main className="page__main">
        <div
          className="container py-48"
          style={{ maxWidth: "1024px", margin: "0 auto" }}
        >
          {product.heroImageUrl ? (
            <img
              src={product.heroImageUrl}
              alt={product.title || "Product"}
              className="mb-32 w-full rounded-xl object-cover"
              style={{ height: "320px" }}
            />
          ) : null}

          <h1 className="text-3xl font-bold mb-16">
            {product.title ?? "Untitled Product"}
          </h1>

          <p className="text-base leading-relaxed text-soft mb-32">
            {product.summary ?? "No product summary available."}
          </p>

          {product.challengeStatement ? (
            <div className="card p-24 mb-24">
              <h2 className="text-xl font-bold mb-12">Challenge</h2>
              <p className="text-sm leading-relaxed text-soft">
                {product.challengeStatement}
              </p>
            </div>
          ) : null}

          {product.solutionOverview ? (
            <div className="card p-24 mb-24">
              <h2 className="text-xl font-bold mb-12">Solution</h2>
              <p className="text-sm leading-relaxed text-soft">
                {product.solutionOverview}
              </p>
            </div>
          ) : null}

          {product.featureHighlights ? (
            <div className="card p-24 mb-24">
              <h2 className="text-xl font-bold mb-12">Feature Highlights</h2>
              <p className="text-sm leading-relaxed text-soft">
                {product.featureHighlights}
              </p>
            </div>
          ) : null}

          <div className="mt-40">
            <Link to="/products" className="btn btn--outline">
              ← Back to products
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
