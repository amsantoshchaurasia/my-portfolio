import { HiAcademicCap, HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";

export default function EducationCard({ item, isLast }) {
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

        {/* BADGE - pinned to the corner so it never fights with a wrapping title */}

        {item.badge && (
          <div
            className="
              absolute
              top-3
              right-3
              sm:top-5
              sm:right-5
              md:top-6
              md:right-6
              rounded-full
              bg-blue-600/20
              px-2.5
              py-0.5
              sm:px-3.5
              sm:py-1
              text-[11px]
              sm:text-xs
              font-semibold
              text-blue-400
              whitespace-nowrap
            "
          >
            {item.badge}
          </div>
        )}

        {/* TOP ROW: ICON + DEGREE/FIELD + PERIOD */}

        <div className="flex items-start gap-2.5 sm:gap-4 pr-16 sm:pr-20">

          {/* Degree Icon Badge */}
          <div className="flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 text-sm sm:text-xl">
            <HiAcademicCap />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-xl md:text-2xl font-bold text-white leading-snug">
              {item.degree}
            </h3>

            <div className="mt-1 sm:mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              {item.field && (
                <p className="text-sm sm:text-base font-medium text-blue-300">
                  {item.field}
                </p>
              )}

              {item.period && (
                <>
                  {item.field && (
                    <span className="hidden sm:inline text-slate-600">•</span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-500">
                    <HiOutlineCalendar className="text-sm" />
                    {item.period}
                  </span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* INSTITUTE */}

        {item.institute && (
          <div className="mt-2.5 sm:mt-4 flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
            <HiOutlineLocationMarker className="text-sm sm:text-base" />
            <span>{item.institute}</span>
          </div>
        )}

        {/* DESCRIPTION */}

        {item.description && (
          <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-gray-400 border-t border-slate-700/60 pt-3.5 sm:pt-5">
            {item.description}
          </p>
        )}

      </div>

    </div>
  );
}