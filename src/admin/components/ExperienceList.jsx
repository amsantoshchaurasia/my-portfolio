import { useEffect, useState } from "react";

import { getExperiences, deleteExperience } from "../../firebase/firestore";

export default function ExperienceList({ refresh, onEditExperience }) {
  // ========================================
  // STATE
  // ========================================

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // ========================================
  // LOAD EXPERIENCES
  // ========================================

  async function loadExperiences() {
    try {
      setLoading(true);
      const data = await getExperiences();
      setExperiences(data);
    } catch (error) {
      console.error("Error loading experiences:", error);
      alert("Failed to load experiences.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExperiences();
  }, [refresh]);

  // ========================================
  // DELETE EXPERIENCE
  // ========================================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteExperience(id);
      alert("Experience deleted successfully.");
      await loadExperiences();
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Failed to delete experience.");
    } finally {
      setDeletingId(null);
    }
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="mt-5 rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-slate-700 border-t-blue-500" />
        <p className="mt-2.5 text-xs text-gray-500">Loading experience...</p>
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="mt-5">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">
            Existing experience
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            Manage the experience shown on your portfolio.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-gray-300">
          {experiences.length}
        </span>
      </div>

      {/* EMPTY STATE */}
      {experiences.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-base text-blue-400">
            +
          </div>
          <h4 className="mt-3 text-sm font-semibold text-white">
            No experience yet
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            Add your first experience using the form above.
          </p>
        </div>
      ) : (
        <div className="grid gap-2.5">
          {experiences.map((experience) => (
            <div
              key={experience.id}
              className="rounded-lg border border-slate-800 bg-[#111827] p-3.5 transition hover:border-slate-700"
            >
              {/* COMPANY + PERIOD (left) — ICON ACTIONS (right) */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold text-white">
                    {experience.company}
                  </h4>

                  {experience.period && (
                    <span className="shrink-0 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                      {experience.period}
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditExperience?.(experience)}
                    disabled={deletingId === experience.id}
                    aria-label={`Edit ${experience.company || "experience"}`}
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
                    onClick={() => handleDelete(experience.id)}
                    disabled={deletingId === experience.id}
                    aria-label={`Delete ${experience.company || "experience"}`}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/25
                      bg-red-500/10 text-red-400 transition hover:bg-red-500/20
                      disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deletingId === experience.id ? (
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

              {/* ROLE */}
              <p className="mt-1 text-xs font-medium text-gray-300">
                {experience.role}
              </p>

              {/* POINTS */}
              {Array.isArray(experience.points) &&
                experience.points.length > 0 && (
                  <ul className="mt-2.5 space-y-1.5">
                    {experience.points.map((point, index) => (
                      <li
                        key={`${experience.id}-${index}`}
                        className="flex items-start gap-2 text-xs leading-relaxed text-gray-400"
                      >
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}