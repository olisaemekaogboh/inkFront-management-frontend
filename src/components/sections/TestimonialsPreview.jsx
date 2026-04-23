import Container from "../common/Container";
import SectionHeading from "../common/SectionHeading";
import ProjectCard from "../cards/ProjectCard";
import useLanguage from "../../hooks/useLanguage";

export default function ProjectsPreview({ projects = [] }) {
  const { t } = useLanguage();

  return (
    <section>
      <Container>
        <SectionHeading
          title={t("sections.projects.title")}
          description={t("sections.projects.description")}
        />
        <div className="grid grid-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
