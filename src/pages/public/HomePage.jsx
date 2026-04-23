import { useMemo } from "react";
import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { serviceCatalogService } from "../../services/serviceCatalogService";
import { portfolioService } from "../../services/portfolioService";
import { productBlueprintService } from "../../services/productBlueprintService";
import { testimonialService } from "../../services/testimonialService";
import { clientLogoService } from "../../services/clientLogoService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import HeroSection from "../../components/sections/HeroSection";
import ServicesGridSection from "../../components/sections/ServicesGridSection";
import PortfolioGridSection from "../../components/sections/PortfolioGridSection";
import ProductGridSection from "../../components/sections/ProductGridSection";
import TestimonialSection from "../../components/sections/TestimonialSection";
import ClientLogoSection from "../../components/sections/ClientLogoSection";
import NewsletterSection from "../../components/sections/NewsletterSection";
import CTASection from "../../components/sections/CTASection";

export default function HomePage() {
  const { language, t } = useLanguage();

  const hero = useFetchOnMount(
    () =>
      heroService.getHeroSections({
        language,
        placement: "HOME",
        featuredOnly: true,
      }),
    [language],
  );

  const services = useFetchOnMount(
    () =>
      serviceCatalogService.getServices({
        language,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [language],
  );

  const portfolio = useFetchOnMount(
    () =>
      portfolioService.getProjects({
        language,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [language],
  );

  const products = useFetchOnMount(
    () =>
      productBlueprintService.getProductBlueprints({
        language,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [language],
  );

  const testimonials = useFetchOnMount(
    () =>
      testimonialService.getTestimonials({
        language,
        featuredOnly: true,
        page: 0,
        size: 6,
      }),
    [language],
  );

  const clientLogos = useFetchOnMount(
    () =>
      clientLogoService.getClientLogos({
        language,
        featuredOnly: true,
        page: 0,
        size: 12,
      }),
    [language],
  );

  const hasError = useMemo(
    () =>
      hero.error ||
      services.error ||
      portfolio.error ||
      products.error ||
      testimonials.error ||
      clientLogos.error,
    [
      hero.error,
      services.error,
      portfolio.error,
      products.error,
      testimonials.error,
      clientLogos.error,
    ],
  );

  const isLoading = useMemo(
    () =>
      hero.loading ||
      services.loading ||
      portfolio.loading ||
      products.loading ||
      testimonials.loading ||
      clientLogos.loading,
    [
      hero.loading,
      services.loading,
      portfolio.loading,
      products.loading,
      testimonials.loading,
      clientLogos.loading,
    ],
  );

  if (isLoading) {
    return <LoadingSpinner label={t("states.loadingPage")} />;
  }

  if (hasError) {
    return <ErrorState message={hasError} />;
  }

  const heroItem = hero.data?.content?.[0] || hero.data?.[0] || null;

  return (
    <>
      <HeroSection hero={heroItem} />

      <ServicesGridSection
        title={t("sections.services.title")}
        description={t("sections.services.description")}
        services={services.data?.content || services.data || []}
        ctaLabel={t("common.viewAll")}
        ctaTo="/services"
      />

      <PortfolioGridSection
        title={t("sections.portfolio.title")}
        description={t("sections.portfolio.description")}
        projects={portfolio.data?.content || portfolio.data || []}
        ctaLabel={t("common.viewAll")}
        ctaTo="/portfolio"
      />

      <ProductGridSection
        title={t("sections.products.title")}
        description={t("sections.products.description")}
        products={products.data?.content || products.data || []}
        ctaLabel={t("common.viewAll")}
        ctaTo="/products"
      />

      <ClientLogoSection
        title={t("sections.trust.title")}
        description={t("sections.trust.description")}
        logos={clientLogos.data?.content || clientLogos.data || []}
      />

      <TestimonialSection
        title={t("sections.testimonials.title")}
        description={t("sections.testimonials.description")}
        testimonials={testimonials.data?.content || testimonials.data || []}
        ctaLabel={t("common.viewAll")}
        ctaTo="/clients"
      />

      <NewsletterSection />

      <CTASection
        title={t("cta.home.title")}
        description={t("cta.home.description")}
        primaryLabel={t("common.contactUs")}
        primaryTo="/contact"
        secondaryLabel={t("nav.services")}
        secondaryTo="/services"
      />
    </>
  );
}
