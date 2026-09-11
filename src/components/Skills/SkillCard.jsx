export default function SkillCard({ skill }) {
  const Icon = skill.icon;

  return (
    <div
      className="
        group
        flex
        flex-col
        items-center
        justify-center
        gap-2.5
        sm:gap-3
        rounded-2xl
        border
        border-slate-700/70
        bg-gradient-to-b
        from-slate-900/80
        to-slate-900/40
        p-4
        sm:p-5
        text-center
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/60
        hover:shadow-[0_8px_24px_rgba(37,99,235,0.15)]
      "
    >
      {/* Icon */}
      <div
        className="
          flex
          h-11
          w-11
          sm:h-12
          sm:w-12
          md:h-14
          md:w-14
          shrink-0
          items-center
          justify-center
          rounded-xl
          bg-slate-800/80
          ring-1
          ring-slate-700/50
          transition-transform
          duration-300
          group-hover:scale-110
          group-hover:ring-blue-500/40
        "
      >
        {Icon ? (
          <Icon
            className={`text-xl sm:text-2xl md:text-3xl ${skill.color || "text-blue-400"}`}
          />
        ) : (
          <span className="text-base sm:text-lg font-bold text-gray-400">
            ?
          </span>
        )}
      </div>

      {/* Skill Name */}
      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white tracking-wide leading-tight">
        {skill.name}
      </h3>
    </div>
  );
}