import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../../services/publicApi";

export default function ProductBlueprintPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await publicApi.getProductBlueprintBySlug(slug);
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
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 text-sm text-slate-500">
        Loading product...
      </section>
    );
  }

  if (!product) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-slate-700">
          Product not found.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">
        {product.title ?? product.name ?? "Untitled Product"}
      </h1>

      <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
        {product.description ??
          product.summary ??
          product.shortDescription ??
          "No product description available."}
      </p>

      {Array.isArray(product.features) && product.features.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Features</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-slate-600 dark:text-slate-400">
            {product.features.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
