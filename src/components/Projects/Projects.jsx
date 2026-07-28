import Container from "../Common/Container";
import projects from "../../data/projects";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section
      id="projects"
      className="bg-[#0B1120] text-white py-28"
    >
      <Container>

        <div className="text-center mb-20">

          <p className="uppercase tracking-[6px] text-blue-400">
            My Projects
          </p>

          <h2 className="text-5xl font-black mt-3">
            Featured Projects
          </h2>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}

        </div>

      </Container>
    </section>
  );
}