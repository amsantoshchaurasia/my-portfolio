import { useEffect, useRef, useState } from "react";

import { getProjects, deleteProject } from "../../firebase/firestore";

export default function ProjectsList({ refresh, onEditProject }) {
  // ========================================
  // STATE
  // ========================================

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // CATEGORY FILTER — same dropdown pattern as SkillsList
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // ========================================
  // LOAD PROJECTS
  // ========================================

  async function loadProjects() {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, [refresh]);

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
  // DELETE PROJECT
  // ========================================

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await deleteProject(id);
      alert("Project deleted successfully.");
      await loadProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  // ========================================
  // CATEGORY HELPERS — same color scheme as Skills, so the
  // two management pages feel consistent
  // ========================================

  function getCategoryLabel(category) {
    switch (category) {
      case "web":
        return "Web Development";
      case "app":
        return "App Development";
      case "analytics":
        return "Data Analyst";
      default:
        return category || "Other";
    }
  }

  function getCategoryColors(category) {
    switch (category) {
      case "web":
        return {
          badge: "bg-blue-500/10 text-blue-400",
          accent: "bg-blue-400/80",
          dot: "bg-blue-400",
        };
      case "app":
        return {
          badge: "bg-emerald-500/10 text-emerald-400",
          accent: "bg-emerald-400/80",
          dot: "bg-emerald-400",
        };
      case "analytics":
        return {
          badge: "bg-purple-500/10 text-purple-400",
          accent: "bg-purple-400/80",
          dot: "bg-purple-400",
        };
      // Legacy projects saved before the "type" field existed have no
      // category — shown as a distinct neutral "Other" instead of
      // being lumped visually into one of the real categories.
      default:
        return {
          badge: "bg-slate-500/15 text-slate-400",
          accent: "bg-slate-400/70",
          dot: "bg-slate-400",
        };
    }
  }

  // ========================================
  // TECHNOLOGY TAG COLORS
  // Known technologies get a recognizable, brand-inspired color.
  // Anything not in the list still gets a color — picked
  // deterministically from its name, so the same tech always
  // gets the same color and nothing stays plain blue by default.
  // ========================================

  const TECH_COLOR_MAP = {
    python: "border-yellow-400/40 text-yellow-300",
    sql: "border-orange-400/40 text-orange-300",
    mysql: "border-orange-400/40 text-orange-300",
    postgresql: "border-sky-400/40 text-sky-300",
    excel: "border-green-400/40 text-green-300",
    "power bi": "border-amber-400/40 text-amber-300",
    powerbi: "border-amber-400/40 text-amber-300",
    tableau: "border-rose-400/40 text-rose-300",
    react: "border-cyan-400/40 text-cyan-300",
    "react native": "border-cyan-400/40 text-cyan-300",
    javascript: "border-yellow-300/40 text-yellow-200",
    typescript: "border-blue-400/40 text-blue-300",
    html: "border-orange-500/40 text-orange-400",
    css: "border-blue-500/40 text-blue-400",
    "tailwind css": "border-teal-400/40 text-teal-300",
    tailwind: "border-teal-400/40 text-teal-300",
    "node.js": "border-lime-400/40 text-lime-300",
    nodejs: "border-lime-400/40 text-lime-300",
    firebase: "border-amber-500/40 text-amber-400",
    mongodb: "border-emerald-400/40 text-emerald-300",
    java: "border-red-400/40 text-red-300",
    "c++": "border-indigo-400/40 text-indigo-300",
    git: "border-orange-400/40 text-orange-300",
    github: "border-gray-300/40 text-gray-200",
    numpy: "border-sky-400/40 text-sky-300",
    pandas: "border-purple-400/40 text-purple-300",
    "scikit-learn": "border-orange-400/40 text-orange-300",
    django: "border-emerald-500/40 text-emerald-400",
    flask: "border-gray-300/40 text-gray-200",
    docker: "border-sky-400/40 text-sky-300",
    figma: "border-pink-400/40 text-pink-300",
  };

  // Consistent fallback palette for any technology not listed above.
  const TECH_FALLBACK_PALETTE = [
    "border-blue-500/30 text-blue-400",
    "border-fuchsia-400/40 text-fuchsia-300",
    "border-teal-400/40 text-teal-300",
    "border-red-400/40 text-red-300",
    "border-indigo-400/40 text-indigo-300",
    "border-lime-400/40 text-lime-300",
  ];

  function getTechColor(tech) {
    const key = (tech || "").trim().toLowerCase();

    if (TECH_COLOR_MAP[key]) {
      return TECH_COLOR_MAP[key];
    }

    // Deterministic hash so the same unlisted tech name always
    // lands on the same fallback color across renders/sessions.
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }

    return TECH_FALLBACK_PALETTE[hash % TECH_FALLBACK_PALETTE.length];
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="mt-5 rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-slate-700 border-t-blue-500" />
        <p className="mt-2.5 text-xs text-gray-500">Loading projects...</p>
      </div>
    );
  }

  const filterTabs = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Development" },
    { id: "app", label: "App Development" },
    { id: "analytics", label: "Data Analyst" },
    { id: "other", label: "Other" },
  ];

  const knownCategories = ["web", "app", "analytics"];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : activeFilter === "other"
        ? projects.filter((project) => !knownCategories.includes(project.category))
        : projects.filter((project) => project.category === activeFilter);

  const activeTab = filterTabs.find((tab) => tab.id === activeFilter);

  // ========================================
  // UI
  // ========================================

  return (
    <div className="mt-5">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">
            Existing projects
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            Manage the projects shown on your portfolio.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-gray-300">
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </span>
      </div>

      {/* CATEGORY FILTER — custom dropdown with a color dot per
          category so the type is recognizable at a glance, not
          just from the text label */}
      <div className="relative z-20 mb-4 sm:max-w-xs" ref={filterRef}>
        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={filterOpen}
          className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-slate-800/60
            px-3.5 py-2.5 text-left text-sm text-white outline-none transition
            ${filterOpen ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-700 hover:border-slate-600"}`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {activeFilter === "all" ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2 text-gray-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
              </svg>
            ) : (
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${getCategoryColors(
                  activeFilter === "other" ? undefined : activeFilter
                ).dot}`}
              />
            )}
            <span className="truncate">{activeTab?.label}</span>
          </span>

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
            className="absolute left-0 right-0 top-[calc(100%+6px)] overflow-hidden rounded-lg
              border border-slate-700 bg-[#182233] shadow-xl shadow-black/40"
          >
            {filterTabs.map((tab) => {
              const count =
                tab.id === "all"
                  ? projects.length
                  : tab.id === "other"
                    ? projects.filter((p) => !knownCategories.includes(p.category)).length
                    : projects.filter((p) => p.category === tab.id).length;

              const isActive = tab.id === activeFilter;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm
                    transition border-b border-slate-800/70 last:border-b-0
                    ${isActive ? "bg-blue-500/15 text-blue-400" : "text-gray-300 hover:bg-slate-800/80"}`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {tab.id === "all" ? (
                      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                        {isActive && (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 fill-none stroke-current stroke-[3]"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                    ) : (
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${getCategoryColors(
                          tab.id === "other" ? undefined : tab.id
                        ).dot}`}
                      />
                    )}
                    <span className="truncate">{tab.label}</span>
                  </span>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      isActive
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-slate-700/60 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* EMPTY STATE */}
      {filteredProjects.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-base text-blue-400">
            +
          </div>
          <h4 className="mt-3 text-sm font-semibold text-white">
            {projects.length === 0 ? "No projects yet" : "No projects in this category"}
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            {projects.length === 0
              ? "Add your first project using the form above."
              : "Try a different filter or add a new project above."}
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {filteredProjects.map((project) => {
            const isDeleting = deletingId === project.id;
            const categoryColors = getCategoryColors(project.category);

            return (
              <div
                key={project.id}
                className="relative overflow-hidden rounded-lg border border-slate-800 bg-[#111827] py-3.5 pl-4 pr-3.5 transition hover:border-slate-700"
              >
                {/* Category accent strip — same idea as Skills cards,
                    so project type is readable at a glance */}
                <span
                  className={`absolute inset-y-0 left-0 w-[3px] rounded-l-lg ${categoryColors.accent}`}
                />

                {/* TITLE + YEAR + CATEGORY (left) — ORDER + ICON ACTIONS (right) */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">
                      {project.title}
                    </h4>

                    {project.year && (
                      <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                        {project.year}
                      </span>
                    )}

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${categoryColors.badge}`}
                    >
                      {getCategoryLabel(project.category)}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] font-bold text-purple-400">
                      #{project.order || 1}
                    </span>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title || "project"} on GitHub`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700
                          text-gray-400 transition hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
                          <path d="M12 .5C5.73.5.98 5.24.98 11.52c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55v-1.94c-3.16.68-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.66 5.31-5.19 5.59.41.35.77 1.04.77 2.1v3.11c0 .3.2.66.79.55 4.51-1.5 7.77-5.76 7.77-10.78C23.02 5.24 18.27.5 12 .5z" />
                        </svg>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onEditProject?.(project)}
                      disabled={isDeleting}
                      aria-label={`Edit ${project.title || "project"}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-500/25
                        bg-blue-500/10 text-blue-400 transition hover:bg-blue-500/20
                        disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                      disabled={isDeleting}
                      aria-label={`Delete ${project.title || "project"}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/25
                        bg-red-500/10 text-red-400 transition hover:bg-red-500/20
                        disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isDeleting ? (
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 animate-spin fill-none stroke-current stroke-2">
                          <path strokeLinecap="round" d="M12 3a9 9 0 1 0 9 9" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                          <polyline points="3 6 5 6 21 6" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* DESCRIPTION */}
                {project.description && (
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    {project.description}
                  </p>
                )}

                {/* TECHNOLOGIES */}
                {Array.isArray(project.technologies) &&
                  project.technologies.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={`${project.id}-${index}`}
                          className={`rounded-full border px-2 py-0.5 text-[11px] ${getTechColor(tech)}`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}