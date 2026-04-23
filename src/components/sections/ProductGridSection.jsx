import { Link } from "react-router-dom";
import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import EmptyState from "../common/EmptyState";
import ProductCard from "../cards/ProductCard";

export default function ProductGridSection({
  title,
  description,
  products = [],
  ctaLabel,
  ctaTo,
}) {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <section className="page-section">
      <Container>
        <div className="section-header-row">
          <SectionHeading title={title} description={description} />
          {ctaLabel && ctaTo ? (
            <Link to={ctaTo} className="text-link">
              {ctaLabel}
            </Link>
          ) : null}
        </div>

        {safeProducts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-3">
            {safeProducts.map((product) => (
              <ProductCard
                key={product?.id || product?.slug || `product-${Math.random()}`}
                product={product}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
