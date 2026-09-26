import Button from "../common/Button";
import TechBadge from "./TechBadge";
import { getCategoryLabel, getCategoryBadgeClasses } from "./projectTypeUtils";

export default function ProjectCard({
  project,
  onView,
}) {
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
            <span className="uppercase tracking-[2px] sm:tracking-[4px] text-[10px] sm:text-xs text-gray-500">
              Project
            </span>

            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-medium ${getCategoryBadgeClasses(
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
            xl:text-2xl
            font-bold
            leading-tight
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
            TECHNOLOGIES
        ======================================== */}

        <div className="flex flex-wrap gap-2 sm:gap-2.5 mt-4 sm:mt-5">

          {project.technologies?.map((tech) => (
            <TechBadge
              key={tech}
              name={tech}
            />
          ))}

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
            pt-4
            sm:pt-5
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

    </div>
  );
}