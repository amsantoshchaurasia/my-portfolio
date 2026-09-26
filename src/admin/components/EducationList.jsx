import { useEffect, useRef, useState } from "react";

import { getEducations, deleteEducation } from "../../firebase/firestore";

export default function EducationList({ refresh, onEditEducation }) {
  // ========================================
  // STATE
  // ========================================

  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // ========================================
  // LOAD EDUCATION
  // ========================================

  async function loadEducations() {
    try {
      setLoading(true);
      const data = await getEducations();
      setEducations(data);
    } catch (error) {
      console.error("Error loading educations:", error);
      alert("Failed to load education.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEducations();
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
  // DELETE
  // ========================================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteEducation(id);
      alert("Education deleted successfully.");
      await loadEducations();
    } catch (error) {
      console.error("Error deleting education:", error);
      alert("Failed to delete education.");
    } finally {
      setDeletingId(null);
    }
  }

  // ========================================
  // TYPE HELPERS
  // ========================================

  function getTypeLabel(type) {
    return type === "school" ? "School Education" : "Higher Education";
  }

  // Colors ONLY for the type separation tag + section heading
  // (this is the "yellow for school" ask). Everything else
  // (period text, result/marks badge) stays blue for both types.
  function getTypeTagColors(type) {
    return type === "school"
      ? { text: "text-yellow-400", badge: "bg-yellow-500/10 text-yellow-400" }
      : { text: "text-blue-400", badge: "bg-blue-500/10 text-blue-400" };
  }

  // ========================================
  // CARD (reused across groups)
  // ========================================

  function EducationCard({ education }) {
    const tagColors = getTypeTagColors(education.educationType);
    const isDeleting = deletingId === education.id;

    return (
      <div className="rounded-lg border border-slate-800 bg-[#111827] p-3.5 transition hover:border-slate-700">
        {/* TYPE BADGE (left) — ICON ACTIONS (right) */}
        <div className="flex items-start justify-between gap-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagColors.badge}`}
          >
            {getTypeLabel(education.educationType)}
          </span>

          <div className="flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={() => onEditEducation?.(education)}
              disabled={isDeleting}
              aria-label={`Edit ${education.degree || "education"}`}
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
              onClick={() => handleDelete(education.id)}
              disabled={isDeleting}
              aria-label={`Delete ${education.degree || "education"}`}
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

        {/* PERIOD — always blue, regardless of type */}
        {education.period && (
          <p className="mt-2 text-xs font-medium text-blue-400">
            {education.period}
          </p>
        )}

        {/* DEGREE */}
        <h4 className="mt-1 text-sm font-semibold text-white">
          {education.degree}
        </h4>

        {/* FIELD */}
        {education.field && (
          <p className="mt-0.5 text-xs font-medium text-gray-300">
            {education.field}
          </p>
        )}

        {/* INSTITUTE */}
        <p className="mt-0.5 text-xs text-gray-400">{education.institute}</p>

        {/* RESULT / MARKS BADGE — always blue, regardless of type */}
        {education.badge && (
          <span className="mt-2 inline-block rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-semibold text-blue-400">
            {education.badge}
          </span>
        )}

        {/* DESCRIPTION */}
        {education.description && (
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            {education.description}
          </p>
        )}

        {/* ORDER */}
        <p className="mt-2 text-[11px] text-gray-600">
          Display order: {education.order || 1}
        </p>
      </div>
    );
  }

  function SectionHeading({ type, count }) {
    const tagColors = getTypeTagColors(type);

    return (
      <div className="mb-2 mt-4 flex items-center gap-2 first:mt-0">
        <span className={`h-1.5 w-1.5 rounded-full ${tagColors.text.replace("text-", "bg-")}`} />
        <h4 className={`text-xs font-bold uppercase tracking-wider ${tagColors.text}`}>
          {getTypeLabel(type)}
        </h4>
        <span className="text-[11px] text-gray-600">({count})</span>
      </div>
    );
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="mt-5 rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-slate-700 border-t-blue-500" />
        <p className="mt-2.5 text-xs text-gray-500">Loading education...</p>
      </div>
    );
  }

  const filterTabs = [
    { id: "all", label: "All Education" },
    { id: "higher", label: "Higher Education" },
    { id: "school", label: "School Education" },
  ];

  const activeTab = filterTabs.find((tab) => tab.id === activeFilter);

  const higherEducations = educations.filter(
    (e) => (e.educationType || "higher") === "higher"
  );
  const schoolEducations = educations.filter(
    (e) => e.educationType === "school"
  );

  const filteredEducations =
    activeFilter === "all"
      ? educations
      : educations.filter(
          (education) => (education.educationType || "higher") === activeFilter
        );

  // ========================================
  // UI
  // ========================================

  return (
    <div className="mt-5">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">
            Existing education
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            Manage the education shown on your portfolio.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-gray-300">
          {educations.length}
        </span>
      </div>

      {/* TYPE FILTER — custom dropdown */}
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
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2 text-gray-400"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
            </svg>
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
                  ? educations.length
                  : educations.filter(
                      (e) => (e.educationType || "higher") === tab.id
                    ).length;

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
                  <span className="flex min-w-0 items-center gap-2">
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
      {filteredEducations.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-base text-blue-400">
            +
          </div>
          <h4 className="mt-3 text-sm font-semibold text-white">
            {educations.length === 0 ? "No education yet" : "No education in this category"}
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            {educations.length === 0
              ? "Add your first education using the form above."
              : "Try a different filter or add a new education above."}
          </p>
        </div>
      ) : activeFilter === "all" ? (
        /* GROUPED VIEW — Higher Education section, then School Education section */
        <div>
          {higherEducations.length > 0 && (
            <>
              <SectionHeading type="higher" count={higherEducations.length} />
              <div className="grid gap-2.5">
                {higherEducations.map((education) => (
                  <EducationCard key={education.id} education={education} />
                ))}
              </div>
            </>
          )}

          {schoolEducations.length > 0 && (
            <>
              <SectionHeading type="school" count={schoolEducations.length} />
              <div className="grid gap-2.5">
                {schoolEducations.map((education) => (
                  <EducationCard key={education.id} education={education} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* FILTERED VIEW — single type, flat list */
        <div className="grid gap-2.5">
          {filteredEducations.map((education) => (
            <EducationCard key={education.id} education={education} />
          ))}
        </div>
      )}
    </div>
  );
}