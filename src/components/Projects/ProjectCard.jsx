import Button from "../Common/Button";
import TechBadge from "./TechBadge";

export default function ProjectCard({
  project,
  onView,
}) {
  return (
    <div
      className="
        rounded-3xl
        bg-[#111827]
        border
        border-slate-700
        p-6

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

      <div>

        {/* Header */}

        <div className="flex items-center justify-between">

          <span className="uppercase tracking-[4px] text-xs text-gray-500">
            Project
          </span>

          <span className="bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full">
            {project.year}
          </span>

        </div>


        {/* Title */}

        <h3
          className="
            mt-5
            text-2xl
            font-bold
            leading-tight
          "
        >
          {project.title}
        </h3>


        {/* Description */}

        <p
          className="
            mt-4
            text-gray-400
            leading-6
            line-clamp-3
          "
        >
          {project.description}
        </p>


        {/* ========================================
            TECHNOLOGIES
        ======================================== */}

        <div className="flex flex-wrap gap-2.5 mt-5">

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
            gap-3
            mt-5
          "
        >

          {/* GitHub */}

          <Button
            className="w-full justify-center"
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
            className="w-full justify-center"
            onClick={onView}
          >
            View Details
          </Button>

        </div>

      </div>

    </div>
  );
}