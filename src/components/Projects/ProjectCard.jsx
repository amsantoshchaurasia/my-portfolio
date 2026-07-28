import Button from "../Common/Button";
import TechBadge from "./TechBadge";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden">

      {/* Image */}

      <div className="h-56 bg-slate-800 flex items-center justify-center text-5xl">
        📊
      </div>

      {/* Content */}

      <div className="p-8">

        <h3 className="text-3xl font-bold text-white">
          {project.title}
        </h3>

        <p className="text-gray-400 mt-4 leading-7">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-3 mt-6">

          {project.technologies.map((tech) => (
            <TechBadge
              key={tech}
              name={tech}
            />
          ))}

        </div>

        <div className="flex gap-4 mt-8">

          <Button>
            GitHub
          </Button>

        </div>

      </div>

    </div>
  );
}