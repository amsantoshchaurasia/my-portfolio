import { useEffect } from "react";
import { createPortal } from "react-dom";
import { getTechColor } from "../../utils/colors/techColors";
import { getCategoryLabel, getCategoryBadgeClasses } from "./projectTypeUtils";

const pillClasses =
  "rounded-full border bg-slate-800/60 px-2.5 py-1 sm:px-3 text-xs font-medium";

export default function TechPopup({ project, onClose }) {
  // Esc se band + background scroll lock
  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} technologies`}
        onClick={(e) => e.stopPropagation()}
        className="
          flex flex-col w-full
          max-w-[343px]
          sm:max-w-[560px]
          md:max-w-[600px]
          xl:max-w-[640px]
          2xl:max-w-[680px]
          min-[1920px]:max-w-[720px]

          max-h-[80vh]
          sm:max-h-[75vh]
          md:max-h-[70vh]
          lg:max-h-[85vh]
          xl:max-h-[80vh]
          min-[1920px]:max-h-[70vh]

          rounded-2xl sm:rounded-3xl
          border border-slate-700 bg-[#111827]
          p-4 sm:p-6 md:p-7
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="uppercase tracking-[2px] sm:tracking-[4px] text-[10px] sm:text-xs text-gray-500">
                Project
              </span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-medium ${getCategoryBadgeClasses(
                  project.category
                )}`}
              >
                {getCategoryLabel(project.category)}
              </span>
            </div>

            <h3 className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-bold leading-tight text-white">
              {project.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-800 text-xl text-gray-400 transition hover:bg-slate-700 hover:text-white"
          >
            &times;
          </button>
        </div>

        <div className="my-3 sm:my-4 h-px bg-slate-700/70" />

        {/* Count */}
        <p className="mb-3 text-xs sm:text-sm text-gray-400">
          Technologies used ({project.technologies?.length || 0})
        </p>

        {/* Tags - zyada hon to sirf yahi scroll hoga */}
        <div className="flex flex-wrap gap-2 sm:gap-2.5 overflow-y-auto pr-1">
          {project.technologies?.map((tech) => (
            <span
              key={tech}
              title={tech}
              className={`${pillClasses} max-w-full truncate ${getTechColor(tech)}`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}