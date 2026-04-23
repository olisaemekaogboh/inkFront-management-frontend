import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import ServiceCard from "../cards/ServiceCard";
import useLanguage from "../../hooks/useLanguage";

export default function ServicesPreview({ services = [] }) {
  const { t } = useLanguage();

  return (
    <section>
      <Container>
        <SectionHeading
          title={t("sections.services.title")}
          description={t("sections.services.description")}
        />
        <div className="grid grid-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
