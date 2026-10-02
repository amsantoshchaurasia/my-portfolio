import { useState } from "react";
import Button from "../common/Button";
import { getTechColor } from "../../utils/colors/techColors";
import TechPopup from "./TechPopup";
import { getCategoryLabel, getCategoryBadgeClasses } from "./projectTypeUtils";

const MAX_VISIBLE_TAGS = 5; // most that is ever shown (size 2 only)

// Same tag size as CertificateCard so both sections look consistent
const pillClasses =
  "rounded-full border bg-slate-800/60 px-2.5 py-1 sm:px-3 text-xs font-medium";

export default function ProjectCard({
  project,
  onView,
}) {
  const [showAllTech, setShowAllTech] = useState(false);

  const technologies = project.technologies || [];
  const visibleTech = technologies.slice(0, MAX_VISIBLE_TAGS);

  // Tags per size:
  //  size 1 (375)        : 3 + "+N"
  //  size 2 (640)        : 5 + "+N"
  //  size 3 (768)        : 3 + "+N"
  //  size 4 (1024)       : 2 + "+N"
  //  size 5 (1280)       : 3 + "+N"
  //  size 6, 7 (1536+)   : 4 + "+N"
  const extra2 = technologies.length - 2;
  const extra3 = technologies.length - 3;
  const extra4 = technologies.length - 4;
  const extra5 = technologies.length - 5;

  const chipClasses =
    "rounded-full border border-blue-500/40 bg-blue-500/10 px-2.5 py-1 sm:px-3 text-xs font-medium text-blue-400 transition hover:bg-blue-500/20 hover:border-blue-500";

  return (
    <div
      className="
        rounded-2xl
        sm:rounded-3xl
        bg-[#111827]
        border
        border-slate-700
        p-4
        sm:p-5
        md:p-6

        flex
        flex-col

        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-blue-500
        hover:shadow-[0_0_35px_rgba(37,99,235,.25)]
      "
    >

      {/* ========================================
          PROJECT CONTENT
      ======================================== */}

      <div className="flex flex-col h-full">

        {/* Header */}

        <div className="flex items-center justify-between gap-2">

          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <span className="md:hidden xl:inline uppercase tracking-[2px] sm:tracking-[4px] text-[10px] sm:text-xs text-gray-500">
              Project
            </span>

            <span
              className={`min-w-0 truncate rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-medium ${getCategoryBadgeClasses(
                project.category
              )}`}
            >
              {getCategoryLabel(project.category)}
            </span>
          </div>

          <span className="shrink-0 bg-blue-600/20 text-blue-400 text-xs sm:text-sm px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
            {project.year}
          </span>

        </div>


        {/* Title */}

        <h3
          className="
            mt-3
            sm:mt-4
            md:mt-5
            lg:mt-3
            xl:mt-5
            text-lg
            sm:text-xl
            md:text-2xl
            lg:text-xl
            xl:text-xl
            font-bold
            leading-tight
            line-clamp-2
          "
        >
          {project.title}
        </h3>


        {/* Description */}

        <p
          className="
            mt-2.5
            sm:mt-3
            md:mt-4
            text-sm
            sm:text-base
            text-gray-400
            leading-5
            sm:leading-6
            line-clamp-3
          "
        >
          {project.description}
        </p>


        {/* Flexible spacer — absorbs the extra height on short
            cards, so the tech row + buttons always stay pinned
            together at the bottom instead of sticking to the text */}
        <div className="flex-1" />


        {/* ========================================
            TECHNOLOGIES (tags + "+N", count changes per size)
        ======================================== */}

        <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-1.5 xl:gap-2.5 mt-4 sm:mt-5">

          {visibleTech.map((tech, index) => {
            const pill = (
              <span
                title={tech}
                className={`${pillClasses} max-w-[160px] truncate ${getTechColor(tech)}`}
              >
                {tech}
              </span>
            );

            // visibility of each tag per size
            let visibility = "contents"; // tag 1, 2: hamesha

            // 3rd tag: size 4 par hide
            if (index === 2) visibility = "contents lg:hidden xl:contents";

            // 4th tag: size 2 aur size 6, 7 par
            if (index === 3) visibility = "hidden sm:contents md:hidden 2xl:contents";

            // 5th tag: sirf size 2 par
            if (index === 4) visibility = "hidden sm:contents md:hidden";

            return (
              <span key={tech} className={visibility}>
                {pill}
              </span>
            );
          })}

          {/* "+N" - size 1, 3, 5 (3 tags dikhte hain) */}
          {extra3 > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTech(true)}
              aria-label={`Show ${extra3} more technologies`}
              title={`${extra3} more technologies`}
              className={`sm:hidden md:inline-block lg:hidden xl:inline-block 2xl:hidden ${chipClasses}`}
            >
              +{extra3}
            </button>
          )}

          {/* "+N" - size 2 (5 tags dikhte hain) */}
          {extra5 > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTech(true)}
              aria-label={`Show ${extra5} more technologies`}
              title={`${extra5} more technologies`}
              className={`hidden sm:inline-block md:hidden ${chipClasses}`}
            >
              +{extra5}
            </button>
          )}

          {/* "+N" - size 4 (2 tags dikhte hain) */}
          {extra2 > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTech(true)}
              aria-label={`Show ${extra2} more technologies`}
              title={`${extra2} more technologies`}
              className={`hidden lg:inline-block xl:hidden ${chipClasses} lg:!px-2`}
            >
              +{extra2}
            </button>
          )}

          {/* "+N" - size 6, 7 (4 tags dikhte hain) */}
          {extra4 > 0 && (
            <button
              type="button"
              onClick={() => setShowAllTech(true)}
              aria-label={`Show ${extra4} more technologies`}
              title={`${extra4} more technologies`}
              className={`hidden 2xl:inline-block ${chipClasses}`}
            >
              +{extra4}
            </button>
          )}

        </div>


        {/* ========================================
            BUTTONS
        ======================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-2.5
            sm:gap-3
            mt-4
            sm:mt-5
            border-t
            border-slate-700/70
            pt-3
            sm:pt-4
          "
        >

          {/* GitHub */}

          <Button
            className="text-xs sm:text-sm lg:text-[11px] xl:text-sm px-3 sm:px-4 lg:px-2 xl:px-4 py-2 sm:py-2.5 lg:py-2 xl:py-2.5 w-full justify-center whitespace-nowrap"
            onClick={() => {
              if (project.github) {
                window.open(
                  project.github,
                  "_blank",
                  "noopener,noreferrer"
                );
              }
            }}
          >
            GitHub
          </Button>


          {/* View Details */}

          <Button
            variant="outline"
            className="text-xs sm:text-sm lg:text-[11px] xl:text-sm px-3 sm:px-4 lg:px-2 xl:px-4 py-2 sm:py-2.5 lg:py-2 xl:py-2.5 w-full justify-center whitespace-nowrap"
            onClick={onView}
          >
            View Details
          </Button>

        </div>

      </div>


      {/* ========================================
          ALL TECHNOLOGIES POPUP
      ======================================== */}

      {showAllTech && (
        <TechPopup
          project={project}
          onClose={() => setShowAllTech(false)}
        />
      )}

    </div>
  );
}