import { useEffect, useState } from "react";

import {
  getProjects,
  deleteProject,
} from "../../firebase/firestore";

export default function ProjectsList({
  refresh,
  onEditProject,
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // LOAD PROJECTS
  // ========================================

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
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // INITIAL LOAD / REFRESH
  // ========================================

  useEffect(() => {
    loadProjects();
  }, [refresh]);

  // ========================================
  // DELETE PROJECT
  // ========================================

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteProject(id);

      alert("Project deleted successfully.");

      await loadProjects();
    } catch (error) {
      console.error(
        "Error deleting project:",
        error
      );

      alert("Failed to delete project.");
    }
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="mt-10">
        <div
          className="
            rounded-3xl
            border
            border-slate-700
            bg-[#111827]
            p-7
          "
        >
          <p className="text-gray-400">
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="mt-10">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-6">

        <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
          Portfolio
        </p>

        <h3 className="mt-2 text-3xl font-black text-white">
          Existing Projects
        </h3>

        <p className="mt-2 text-gray-400">
          Manage the projects currently displayed
          on your portfolio.
        </p>

      </div>


      {/* ========================================
          EMPTY STATE
      ======================================== */}

      {projects.length === 0 ? (

        <div
          className="
            rounded-3xl
            border
            border-slate-700
            bg-[#111827]
            p-8
          "
        >
          <p className="text-gray-400">
            No projects found.
          </p>
        </div>

      ) : (

        /* ========================================
           PROJECT LIST
        ======================================== */

        <div className="grid gap-5">

          {projects.map((project) => (

            <div
              key={project.id}
              className="
                rounded-2xl
                border
                border-slate-700
                bg-[#111827]
                p-6
                transition
                hover:border-blue-500/50
              "
            >

              {/* ========================================
                  PROJECT HEADER
              ======================================== */}

              <div
                className="
                  flex
                  flex-col
                  justify-between
                  gap-5
                  md:flex-row
                "
              >

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-3">

                    <h4 className="text-xl font-bold text-white">
                      {project.title}
                    </h4>

                    {project.year && (
                      <span
                        className="
                          rounded-full
                          bg-blue-500/10
                          px-3
                          py-1
                          text-sm
                          text-blue-400
                        "
                      >
                        {project.year}
                      </span>
                    )}

                  </div>


                  {/* DESCRIPTION */}

                  {project.description && (
                    <p className="mt-3 leading-7 text-gray-400">
                      {project.description}
                    </p>
                  )}


                  {/* TECHNOLOGIES */}

                  {Array.isArray(project.technologies) &&
                    project.technologies.length > 0 && (

                      <div className="mt-4 flex flex-wrap gap-2">

                        {project.technologies.map(
                          (tech, index) => (

                            <span
                              key={`${project.id}-${index}`}
                              className="
                                rounded-full
                                border
                                border-blue-500/40
                                px-3
                                py-1
                                text-sm
                                text-blue-400
                              "
                            >
                              {tech}
                            </span>

                          )
                        )}

                      </div>

                    )}

                </div>


                {/* ORDER */}

                <div className="flex shrink-0 items-start">

                  <span className="text-sm text-gray-500">
                    Order: {project.order || 1}
                  </span>

                </div>

              </div>


              {/* ========================================
                  ACTIONS
              ======================================== */}

              <div className="mt-5 flex flex-wrap gap-3">

                {/* GITHUB */}

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      rounded-xl
                      bg-blue-600
                      px-5
                      py-2.5
                      font-semibold
                      text-white
                      transition
                      hover:bg-blue-700
                    "
                  >
                    GitHub
                  </a>
                )}


                {/* EDIT */}

                <button
                  type="button"
                  onClick={() =>
                    onEditProject?.(project)
                  }
                  className="
                    rounded-xl
                    border
                    border-blue-500/40
                    px-5
                    py-2.5
                    font-semibold
                    text-blue-400
                    transition
                    hover:bg-blue-500/10
                  "
                >
                  Edit
                </button>


                {/* DELETE */}

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(project.id)
                  }
                  className="
                    rounded-xl
                    border
                    border-red-500/40
                    px-5
                    py-2.5
                    font-semibold
                    text-red-400
                    transition
                    hover:bg-red-500/10
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}