import useLanguage from "../../hooks/useLanguage";
import PageHeader from "../../components/common/PageHeader";
import CTASection from "../../components/sections/CTASection";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        title={t("pages.notFound.title")}
        subtitle={t("pages.notFound.message")}
      />

      <CTASection
        title={t("cta.notFound.title")}
        description={t("cta.notFound.description")}
        primaryLabel={t("nav.home")}
        primaryTo="/"
        secondaryLabel={t("nav.services")}
        secondaryTo="/services"
      />
    </>
  );
}
