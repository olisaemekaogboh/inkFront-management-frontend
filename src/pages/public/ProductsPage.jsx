import { useEffect, useState } from "react";
import useLanguage from "../../hooks/useLanguage";
import { productBlueprintService } from "../../services/productBlueprintService";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import EmptyState from "../../components/common/EmptyState";
import ProductGridSection from "../../components/sections/ProductGridSection";

export default function ProductsPage() {
  const { language, t } = useLanguage();

  const [state, setState] = useState({
    loading: true,
    error: "",
    data: [],
  });

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      if (!language) {
        if (active) {
          setState({
            loading: false,
            error: "Language is not available",
            data: [],
          });
        }
        return;
      }

      if (active) {
        setState((current) => ({
          ...current,
          loading: true,
          error: "",
        }));
      }

      try {
        const response = await productBlueprintService.getProductBlueprints({
          language,
          page: 0,
          size: 24,
        });

        const products = Array.isArray(response)
          ? response
          : Array.isArray(response?.content)
            ? response.content
            : [];

        if (active) {
          setState({
            loading: false,
            error: "",
            data: products,
          });
        }
      } catch (error) {
        if (active) {
          setState({
            loading: false,
            error: error?.message || "Failed to load products",
            data: [],
          });
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [language]);

  if (state.loading) {
    return <LoadingSpinner label={t("states.loadingPage")} />;
  }

  if (state.error) {
    return <ErrorState message={state.error} />;
  }

  if (state.data.length === 0) {
    return (
      <>
        <PageHeader
          title={t("pages.products.title")}
          subtitle={t("pages.products.subtitle")}
        />
        <EmptyState title={t("states.emptyProducts")} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t("pages.products.title")}
        subtitle={t("pages.products.subtitle")}
      />

      <ProductGridSection
        products={state.data}
        title={t("sections.products.title")}
        description={t("sections.products.description")}
      />
    </>
  );
}
