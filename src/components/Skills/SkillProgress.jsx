export default function SkillProgress({ skill }) {
  return (
    <div
      className="
        rounded-2xl
        bg-[#111827]
        border
        border-slate-700
        p-5

        transition-all
        duration-300

        hover:border-blue-500
        hover:shadow-[0_0_20px_rgba(37,99,235,.15)]
      "
    >
      <div className="flex justify-between items-center mb-3">

        <h3 className="font-semibold text-white">
          {skill.name}
        </h3>

        <span className="text-blue-400 font-semibold">
          {skill.level}%
        </span>

      </div>

      {/* Progress Bar */}

      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">

        <div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-blue-500
            to-cyan-400
            transition-all
            duration-1000
          "
          style={{
            width: `${skill.level}%`,
          }}
        />

      </div>

    </div>
  );
}