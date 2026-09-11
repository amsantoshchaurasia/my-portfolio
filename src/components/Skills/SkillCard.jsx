export default function SkillCard({ skill }) {
  const Icon = skill.icon;

  return (
    <div
      className="
        group
        flex
        items-center
        gap-3
        sm:gap-3.5
        rounded-xl
        border
        border-slate-700/80
        bg-slate-900/70
        p-3
        sm:p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/50
        hover:bg-slate-800/80
        hover:shadow-md
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-10
          w-10
          sm:h-11
          sm:w-11
          shrink-0
          items-center
          justify-center
          rounded-lg
          bg-slate-800
          transition-transform
          duration-300
          group-hover:scale-110
        "
      >
        {Icon ? (
          <Icon
            className={`text-xl sm:text-2xl ${skill.color || "text-blue-400"}`}
          />
        ) : (
          <span className="text-base sm:text-lg font-bold text-gray-400">
            ?
          </span>
        )}
      </div>

      {/* Skill Name */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-white tracking-wide truncate">
          {skill.name}
        </h3>
      </div>
    </div>
  );
}