import Button from "../common/Button";
import TechBadge from "./TechBadge";

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-[#111827] p-6 sm:p-10 my-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-2xl text-gray-400 hover:text-white hover:bg-slate-700 transition"
        >
          &times;
        </button>

        {/* Header Tag */}
        <div className="flex items-center gap-3">
          <span className="uppercase tracking-[6px] text-blue-400 text-xs font-semibold">
            Project Details
          </span>
          <span className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
            {project.year}
          </span>
        </div>

        {/* Title */}
        <h2 className="mt-3 text-3xl sm:text-4xl font-black text-white">
          {project.title}
        </h2>

        {/* Description */}
        <p className="mt-6 text-gray-300 leading-relaxed text-base">
          {project.description}
        </p>

        {/* Key Highlights / Features (Professional Addition) */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-3">
              Key Highlights & Insights
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm sm:text-base">
              {project.highlights.map((highlight, index) => (
                <li key={index} className="leading-relaxed">
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-3">
            Tech Stack Used
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {project.technologies.map((tech) => (
              <TechBadge
                key={tech}
                name={tech}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
          <Button
            className="w-full justify-center"
            onClick={() => window.open(project.github, "_blank")}
          >
            View on GitHub
          </Button>

          <Button
            variant="outline"
            className="w-full justify-center"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

      </div>
    </div>
  );
}