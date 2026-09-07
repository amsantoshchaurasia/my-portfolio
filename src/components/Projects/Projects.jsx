import { useEffect, useState } from "react";

import Container from "../Common/Container";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import SectionAnimation from "../Common/SectionAnimation";

import { getProjects } from "../../firebase/firestore";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // ========================================
  // LOAD PROJECTS FROM FIRESTORE
  // ========================================

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);

        const data = await getProjects();

        console.log(
          "Projects loaded from Firestore:",
          data
        );

        setProjects(data);
      } catch (error) {
        console.error(
          "Error loading projects:",
          error
        );

        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <section
        id="projects"
        className="bg-[#0B1120] py-24 text-white"
      >
        <Container>
          <div className="flex min-h-[250px] items-center justify-center">
            <p className="text-gray-400">
              Loading projects...
            </p>
          </div>
        </Container>
      </section>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <section
      id="projects"
      className="bg-[#0B1120] py-24 text-white"
    >
      <Container>
        <SectionAnimation>

          {/* ========================================
              HEADING
          ======================================== */}

          <div className="mx-auto max-w-4xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[8px] text-blue-400">
              Portfolio
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl lg:text-6xl">
              My Projects
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              A collection of real-world data analytics
              projects built using Python, SQL, Excel and
              Power BI.
            </p>

          </div>


          {/* ========================================
              NO PROJECTS
          ======================================== */}

          {projects.length === 0 ? (

            <div className="mt-16 text-center">
              <p className="text-gray-500">
                No projects available.
              </p>
            </div>

          ) : (

            /* ========================================
               PROJECT CARDS
            ======================================== */

            <div
              className="
                mt-16
                grid
                grid-cols-1
                gap-8
                md:grid-cols-2
                xl:grid-cols-3
                items-stretch
              "
            >

              {projects.map((project) => (

                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={() =>
                    setSelectedProject(project)
                  }
                />

              ))}

            </div>

          )}

        </SectionAnimation>
      </Container>


      {/* ========================================
          PROJECT MODAL
      ======================================== */}

      <ProjectModal
        project={selectedProject}
        onClose={() =>
          setSelectedProject(null)
        }
      />

    </section>
  );
}