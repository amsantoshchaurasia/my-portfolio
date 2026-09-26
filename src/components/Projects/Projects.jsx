import { useEffect, useMemo, useRef, useState } from "react";

import Container from "../common/Container";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import SectionAnimation from "../common/SectionAnimation";

import { getProjects } from "../../firebase/firestore";
import { PROJECT_CATEGORIES, matchesCategory } from "./projectTypeUtils";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // SEARCH + FILTER — plain search (no suggestions, user types
  // freely) combined with a category filter.
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const filterOptions = [{ value: "all", label: "All Projects" }, ...PROJECT_CATEGORIES];
  const activeOption = filterOptions.find((option) => option.value === activeFilter);

  // ========================================
  // FILTER DROPDOWN — close on outside click / Escape
  // ========================================

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setFilterOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
  // FILTERED PROJECTS — category filter first, then search
  // ========================================

  const filteredProjects = useMemo(() => {
    const categoryFiltered = projects.filter((project) =>
      matchesCategory(project, activeFilter)
    );

    const query = searchQuery.trim().toLowerCase();
    if (!query) return categoryFiltered;

    return categoryFiltered.filter((project) => {
      const titleMatch = (project.title || "").toLowerCase().includes(query);
      const descriptionMatch = (project.description || "")
        .toLowerCase()
        .includes(query);
      const techMatch =
        Array.isArray(project.technologies) &&
        project.technologies.some((tech) =>
          (tech || "").toLowerCase().includes(query)
        );

      return titleMatch || descriptionMatch || techMatch;
    });
  }, [projects, activeFilter, searchQuery]);

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
      className="bg-[#0B1120] text-white scroll-mt-14 sm:scroll-mt-22 lg:scroll-mt-13 xl:scroll-mt-17 pt-8 sm:pt-6 md:pt-6 lg:pt-8 xl:pt-10 pb-16 sm:pb-20 lg:pb-24"
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
              SEARCH + FILTER
          ======================================== */}

          <div className="mx-auto mt-8 sm:mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">

            {/* SEARCH — plain text input, no suggestions */}
            <div className="relative flex-1">
              <svg
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current stroke-2 text-gray-500"
              >
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
              </svg>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full rounded-full border border-slate-700 bg-[#111827] py-2.5 sm:py-3 pl-11 pr-4
                  text-sm sm:text-base text-white placeholder:text-gray-500 outline-none transition
                  focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              />
            </div>

            {/* CATEGORY FILTER — custom dropdown (styled to match
                the site's dark theme instead of the default browser select) */}
            <div className="relative z-20 sm:w-56" ref={filterRef}>
              <button
                type="button"
                onClick={() => setFilterOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={filterOpen}
                className={`flex w-full items-center justify-between gap-2 rounded-full border bg-[#111827]
                  py-2.5 sm:py-3 pl-4 pr-3.5 text-left text-sm sm:text-base text-white outline-none transition
                  ${filterOpen ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-700 hover:border-slate-600"}`}
              >
                <span className="truncate">{activeOption?.label}</span>
                <svg
                  viewBox="0 0 24 24"
                  className={`h-4 w-4 shrink-0 fill-none stroke-current stroke-2 text-gray-400 transition-transform duration-200 ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {filterOpen && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+6px)] overflow-hidden rounded-xl
                    border border-slate-700 bg-[#111827] shadow-xl shadow-black/40"
                >
                  {filterOptions.map((option) => {
                    const isActive = option.value === activeFilter;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        onClick={() => {
                          setActiveFilter(option.value);
                          setFilterOpen(false);
                        }}
                        className={`block w-full border-b border-slate-800/70 px-4 py-2.5 text-left text-sm sm:text-base
                          transition last:border-b-0
                          ${isActive ? "bg-blue-500/15 text-blue-400" : "text-gray-300 hover:bg-slate-800/80"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>


          {/* ========================================
              NO PROJECTS
          ======================================== */}

          {filteredProjects.length === 0 ? (

            <div className="mt-12 sm:mt-16 text-center">
              <p className="text-sm sm:text-base text-gray-500">
                {projects.length === 0
                  ? "No projects available."
                  : "No projects match your search or filter."}
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

              {filteredProjects.map((project) => (

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