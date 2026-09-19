import { useEffect, useState } from "react";

import Container from "../common/Container";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import SectionAnimation from "../common/SectionAnimation";

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
        className="bg-[#0B1120] py-16 sm:py-20 lg:py-24 text-white"
      >
        <Container>
          <div className="flex min-h-[200px] sm:min-h-[250px] items-center justify-center">
            <p className="text-sm sm:text-base text-gray-400">
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
      className="bg-[#0B1120] text-white scroll-mt-14 sm:scroll-mt-18 lg:scroll-mt-13 xl:scroll-mt-17 pt-8 sm:pt-6 md:pt-6 lg:pt-8 xl:pt-10 pb-16 sm:pb-20 lg:pb-24"
    >
      <Container>
        <SectionAnimation>

          {/* ========================================
              HEADING
          ======================================== */}

          <div className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl text-center">

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[4px] sm:tracking-[8px] text-blue-400">
              My Projects
            </p>

            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
              My Projects
            </h2>

            <p className="mt-3 sm:mt-6 text-xs sm:text-base md:text-lg leading-5 sm:leading-7 md:leading-8 text-gray-400 px-2">
              A collection of real-world data analytics
              projects built using Python, SQL, Excel and
              Power BI.
            </p>

          </div>


          {/* ========================================
              NO PROJECTS
          ======================================== */}

          {projects.length === 0 ? (

            <div className="mt-12 sm:mt-16 text-center">
              <p className="text-sm sm:text-base text-gray-500">
                No projects available.
              </p>
            </div>

          ) : (

            /* ========================================
               PROJECT CARDS
            ======================================== */

            <div
              className="
                mt-6
                sm:mt-6
                md:mt-8
                grid
                grid-cols-1
                gap-5
                sm:gap-6
                md:gap-8
                md:grid-cols-2
                lg:grid-cols-3
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