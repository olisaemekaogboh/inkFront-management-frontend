import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { testimonialService } from "../../services/testimonialService";
import { clientLogoService } from "../../services/clientLogoService";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import TestimonialSection from "../../components/sections/TestimonialSection";
import ClientLogoSection from "../../components/sections/ClientLogoSection";
import CTASection from "../../components/sections/CTASection";

export default function TestimonialsClientsPage() {
  const { language, t } = useLanguage();

  const testimonials = useFetchOnMount(
    () => testimonialService.getTestimonials({ language, page: 0, size: 24 }),
    [language],
  );

  const clientLogos = useFetchOnMount(
    () => clientLogoService.getClientLogos({ language, page: 0, size: 32 }),
    [language],
  );

  if (testimonials.loading || clientLogos.loading) {
    return <LoadingSpinner label={t("states.loadingPage")} />;
  }

  if (testimonials.error || clientLogos.error) {
    return <ErrorState message={testimonials.error || clientLogos.error} />;
  }

  const safeTestimonials = Array.isArray(testimonials.data)
    ? testimonials.data
    : Array.isArray(testimonials.data?.content)
      ? testimonials.data.content
      : [];

  const safeClientLogos = Array.isArray(clientLogos.data)
    ? clientLogos.data
    : Array.isArray(clientLogos.data?.content)
      ? clientLogos.data.content
      : [];

  return (
    <>
      <PageHeader
        title={t("pages.clients.title")}
        subtitle={t("pages.clients.subtitle")}
      />

      <ClientLogoSection
        title={t("sections.trust.title")}
        description={t("sections.trust.description")}
        logos={safeClientLogos}
      />

      <TestimonialSection
        title={t("sections.testimonials.title")}
        description={t("sections.testimonials.description")}
        testimonials={safeTestimonials}
      />

      <CTASection
        title={t("cta.clients.title")}
        description={t("cta.clients.description")}
        primaryLabel={t("common.contactUs")}
        primaryTo="/contact"
        secondaryLabel={t("nav.services")}
        secondaryTo="/services"
      />
    </>
  );
}
