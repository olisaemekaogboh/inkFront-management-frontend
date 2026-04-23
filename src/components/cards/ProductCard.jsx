import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";

export default function ProductCard({ product }) {
  const { t } = useLanguage();

  if (!product) {
    return null;
  }

  return (
    <article className="card premium-card product-card">
      {product.heroImageUrl ? (
        <div className="card-media">
          <img src={product.heroImageUrl} alt={product.title || "Product"} />
        </div>
      ) : null}

      <div className="card-content">
        <span className="card-meta">{t("pages.products.detailLabel")}</span>
        <h3>{product.title || t("states.emptyTitle")}</h3>
        <p>{product.summary || ""}</p>

        {product.slug ? (
          <Link to={`/products/${product.slug}`} className="text-link">
            {t("common.viewDetails")}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
