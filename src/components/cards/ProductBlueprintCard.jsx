import { Link } from "react-router-dom";
import useLanguage from "../../hooks/useLanguage";

export default function ProductBlueprintCard({ product }) {
  const { t } = useLanguage();

  return (
    <article className="card premium-card">
      {product.heroImageUrl ? (
        <div className="card-media">
          <img src={product.heroImageUrl} alt={product.title} />
        </div>
      ) : null}

      <div className="card-content">
        <h3>{product.title}</h3>
        <p>{product.summary}</p>
        <Link to={`/products/${product.slug}`} className="text-link">
          {t("cards.blueprint.viewBlueprint")}
        </Link>
      </div>
    </article>
  );
}
