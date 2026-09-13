import { HiAcademicCap, HiOutlineCalendar } from "react-icons/hi";

export default function EducationCard({ item }) {
  return (
    <div className="relative pl-6 sm:pl-10 md:pl-12 pb-6 sm:pb-10 md:pb-12">

      {/* ==================================================
          TIMELINE
      ================================================== */}

      <div className="absolute left-1.5 sm:left-3 md:left-4 top-0 w-[2px] h-full bg-blue-600"></div>

      {/* ==================================================
          TIMELINE DOT
      ================================================== */}

      <div className="absolute left-0 sm:left-1 md:left-1.5 top-1 sm:top-2 w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-blue-500 border-2 sm:border-[4px] md:border-[5px] border-[#0B1120]"></div>

      {/* ==================================================
          CARD
      ================================================== */}

      <div
        className="
          rounded-xl
          sm:rounded-3xl
          border
          border-slate-700
          bg-[#111827]
          p-3.5
          sm:p-5
          md:p-6
          lg:p-7
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-blue-500
          hover:shadow-[0_0_35px_rgba(37,99,235,.20)]
        "
      >

        {/* ==================================================
            TOP ROW: ICON + PERIOD + BADGE
        ================================================== */}

        <div className="flex items-center justify-between gap-2 sm:gap-3">

          <div className="flex items-center gap-1.5 sm:gap-2.5">

            <div className="flex h-6 w-6 sm:h-9 sm:w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400 text-xs sm:text-base md:text-xl">
              <HiAcademicCap />
            </div>

            {item.period && (
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-sm font-semibold text-blue-400">
                <HiOutlineCalendar className="text-xs sm:text-sm" />
                {item.period}
              </span>
            )}

          </div>

          {/* ==================================================
              BADGE
          ================================================== */}

          {item.badge && (
            <div
              className="
                bg-blue-600/20
                text-blue-400
                px-2.5
                py-0.5
                sm:px-4
                sm:py-1.5
                md:px-5
                md:py-2
                rounded-full
                sm:rounded-xl
                text-[10px]
                sm:text-sm
                md:text-base
                font-semibold
                whitespace-nowrap
                shrink-0
              "
            >
              {item.badge}
            </div>
          )}

        </div>

        {/* ==================================================
            CONTENT (full width now, no more squeeze)
        ================================================== */}

        <div className="mt-3 sm:mt-4 md:mt-4">

          {/* DEGREE */}

          {item.degree && (
            <h3 className="text-sm sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl 2xl:text-3xl font-bold leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
              {item.degree}
            </h3>
          )}

          {/* FIELD */}

          {item.field && (
            <p className="text-xs sm:text-sm md:text-lg lg:text-lg xl:text-xl 2xl:text-xl text-gray-300 mt-1 sm:mt-1.5 md:mt-2">
              {item.field}
            </p>
          )}

          {/* INSTITUTE */}

          {item.institute && (
            <p className="text-[11px] sm:text-sm md:text-base text-gray-400 mt-0.5 sm:mt-1.5 md:mt-2">
              {item.institute}
            </p>
          )}

        </div>

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        {item.description && (
          <p className="mt-3 sm:mt-5 md:mt-6 text-xs sm:text-base text-gray-400 leading-5 sm:leading-7">
            {item.description}
          </p>
        )}

      </div>

    </div>
  );
}