import { HiBriefcase, HiOutlineCalendar, HiOutlineLocationMarker, HiCheckCircle } from "react-icons/hi";

export default function ExperienceCard({
  item,
  isLast,
}) {
  // ========================================
  // LIMIT BULLET POINTS TO 4 FOR A CLEAN,
  // SCANNABLE, PROFESSIONAL LOOK
  // ========================================

  const visiblePoints = Array.isArray(item.points)
    ? item.points.slice(0, 4)
    : [];

  return (
    <div className="relative pb-8 sm:pb-10 md:pb-12 pl-9 sm:pl-10 md:pl-12">

      {/* TIMELINE LINE */}

      {!isLast && (
        <div className="absolute left-2.5 sm:left-3 md:left-4 top-4 h-full w-[2px] bg-gradient-to-b from-blue-500 to-slate-700"></div>
      )}

      {/* TIMELINE DOT */}

      <div className="absolute left-1 sm:left-1.5 md:left-2.5 top-1.5 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 rounded-full border-[3px] sm:border-4 border-[#0B1120] bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>

      {/* CARD */}

      <div
        className="
          relative
          overflow-hidden
          rounded-2xl
          sm:rounded-3xl
          border
          border-slate-700
          bg-[#111827]
          pl-4
          pr-4
          py-4
          sm:pl-8
          sm:pr-6
          sm:py-6
          md:pl-10
          md:pr-8
          md:py-8
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-blue-500
          hover:shadow-[0_0_35px_rgba(37,99,235,.20)]
        "
      >

        {/* LEFT ACCENT BAR - hidden on mobile (size 1), visible from sm up */}
        <div className="hidden sm:block absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 to-cyan-400" />

        {/* TOP ROW: ICON + COMPANY/ROLE + PERIOD */}

        <div className="flex items-start gap-2.5 sm:gap-4">

          {/* Company Icon Badge */}
          <div className="flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 text-sm sm:text-xl">
            <HiBriefcase />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white leading-snug">
              {item.company}
            </h3>

            <div className="mt-1 sm:mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-sm sm:text-base font-medium text-blue-300">
                {item.role}
              </p>

              {item.period && (
                <>
                  <span className="hidden sm:inline text-slate-600">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-500">
                    <HiOutlineCalendar className="text-sm" />
                    {item.period}
                  </span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* LOCATION */}

        {item.location && (
          <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
            <HiOutlineLocationMarker className="text-sm sm:text-base" />
            <span>{item.location}</span>
          </div>
        )}

        {/* POINTS (max 4 shown) */}

        {visiblePoints.length > 0 && (

          <ul className="mt-4 sm:mt-4 space-y-2.5 sm:space-y-3.5 text-gray-400 border-t border-slate-700/60 pt-3.5 sm:pt-5">

            {visiblePoints.map(
              (point, index) => (

                <li
                  key={`${item.id}-${index}`}
                  className="flex items-start gap-2 sm:gap-3"
                >

                  <HiCheckCircle className="mt-0.5 h-3.5 w-3.5 sm:h-5 sm:w-5 shrink-0 text-blue-500" />

                  <span className="text-sm sm:text-base leading-relaxed">
                    {point}
                  </span>

                </li>

              )
            )}

          </ul>

        )}

      </div>

    </div>
  );
}