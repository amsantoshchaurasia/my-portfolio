export default function ExperienceCard({
  item,
  isLast,
}) {
  return (
    <div className="relative pb-12 pl-10 sm:pl-12">

      {/* TIMELINE LINE */}

      {!isLast && (
        <div className="absolute left-3 top-4 h-full w-[2px] bg-gradient-to-b from-blue-500 to-slate-700 sm:left-4"></div>
      )}

      {/* TIMELINE DOT */}

      <div className="absolute left-1.5 top-1.5 h-4 w-4 rounded-full border-4 border-[#0B1120] bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)] sm:left-2.5"></div>

      {/* CARD */}

      <div
        className="
          rounded-3xl
          border
          border-slate-700
          bg-[#111827]
          p-6
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-blue-500
          hover:shadow-[0_0_35px_rgba(37,99,235,.20)]
          sm:p-8
        "
      >

        {/* COMPANY + PERIOD */}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            {item.company}
          </h3>

          {item.period && (
            <span className="inline-block w-fit rounded-full border border-blue-500/30 bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-400">
              {item.period}
            </span>
          )}

        </div>

        {/* ROLE */}

        <p className="mt-2 text-lg font-medium text-gray-300">
          {item.role}
        </p>

        {/* LOCATION */}

        {item.location && (
          <p className="mt-1 text-sm text-gray-500">
            {item.location}
          </p>
        )}

        {/* POINTS */}

        {Array.isArray(item.points) &&
          item.points.length > 0 && (

            <ul className="mt-6 space-y-3 text-gray-400">

              {item.points.map(
                (point, index) => (

                  <li
                    key={`${item.id}-${index}`}
                    className="flex items-start gap-3"
                  >

                    <span className="mt-1.5 text-xs text-blue-500">
                      ■
                    </span>

                    <span className="leading-relaxed">
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