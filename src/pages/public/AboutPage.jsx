import useLanguage from "../../hooks/useLanguage";
import useFetchOnMount from "../../hooks/useFetchOnMount";
import { heroService } from "../../services/heroService";
import { testimonialService } from "../../services/testimonialService";
import { faqService } from "../../services/faqService";
import { siteSettingService } from "../../services/siteSettingService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorState from "../../components/common/ErrorState";
import PageHeader from "../../components/common/PageHeader";
import Container from "../../components/common/Container";
import TestimonialSection from "../../components/sections/TestimonialSection";
import FAQSection from "../../components/sections/FAQSection";
import CTASection from "../../components/sections/CTASection";

export default function AboutPage() {
  const { language, t } = useLanguage();

  const hero = useFetchOnMount(
    () =>
      heroService.getHeroSections({
        language,
        placement: "ABOUT",
        featuredOnly: true,
      }),
    [language],
  );

  const settings = useFetchOnMount(
    () => siteSettingService.getPublicSettings({ language, group: "ABOUT" }),
    [language],
  );

  const testimonials = useFetchOnMount(
    () =>
      testimonialService.getTestimonials({
        language,
        featuredOnly: true,
        page: 0,
        size: 3,
      }),
    [language],
  );

  const faqs = useFetchOnMount(
    () =>
      faqService.getFaqItems({ language, pageKey: "ABOUT", page: 0, size: 8 }),
    [language],
  );

  if (
    hero.loading ||
    settings.loading ||
    testimonials.loading ||
    faqs.loading
  ) {
    return <LoadingSpinner label={t("states.loadingPage")} />;
  }

  if (hero.error || settings.error || testimonials.error || faqs.error) {
    return (
      <ErrorState
        message={
          hero.error || settings.error || testimonials.error || faqs.error
        }
      />
    );
  }

  const heroItem = hero.data?.content?.[0] || hero.data?.[0] || null;
  const siteSettings = settings.data?.content || settings.data || [];

  const getSetting = (key, fallback) =>
    siteSettings.find((item) => item.key === key)?.value || fallback;

  return (
    <>
      <PageHeader
        title={heroItem?.title || t("pages.about.title")}
        subtitle={heroItem?.subtitle || t("pages.about.subtitle")}
      />

      <section className="page-section">
        <Container>
          <div className="content-split-grid">
            <article className="content-panel">
              <h2>{t("pages.about.storyTitle")}</h2>
              <p>{getSetting("about.story", t("pages.about.storyFallback"))}</p>
            </article>

            <article className="content-panel">
              <h2>{t("pages.about.missionTitle")}</h2>
              <p>
                {getSetting("about.mission", t("pages.about.missionFallback"))}
              </p>
            </article>

            <article className="content-panel">
              <h2>{t("pages.about.visionTitle")}</h2>
              <p>
                {getSetting("about.vision", t("pages.about.visionFallback"))}
              </p>
            </article>

            <article className="content-panel">
              <h2>{t("pages.about.valuesTitle")}</h2>
              <p>
                {getSetting("about.values", t("pages.about.valuesFallback"))}
              </p>
            </article>
          </div>
        </Container>
      </section>

      <TestimonialSection
        title={t("sections.testimonials.title")}
        description={t("sections.testimonials.description")}
        testimonials={testimonials.data?.content || testimonials.data || []}
      />

      <FAQSection
        title={t("sections.faq.title")}
        description={t("sections.faq.description")}
        faqs={faqs.data?.content || faqs.data || []}
      />

      <CTASection
        title={t("cta.about.title")}
        description={t("cta.about.description")}
        primaryLabel={t("common.contactUs")}
        primaryTo="/contact"
        secondaryLabel={t("nav.portfolio")}
        secondaryTo="/portfolio"
      />
    </>
  );
}
