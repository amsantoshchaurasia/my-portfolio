export default function EducationCard({ item }) {
  return (
    <div className="relative pl-12 pb-12">

      {/* ==================================================
          TIMELINE
      ================================================== */}

      <div className="absolute left-4 top-0 w-[2px] h-full bg-blue-600"></div>

      {/* ==================================================
          TIMELINE DOT
      ================================================== */}

      <div className="absolute left-0 top-2 w-8 h-8 rounded-full bg-blue-500 border-[6px] border-[#0B1120]"></div>

      {/* ==================================================
          CARD
      ================================================== */}

      <div
        className="
          rounded-3xl
          border
          border-slate-700
          bg-[#111827]
          p-6
          transition-all
          duration-300
          hover:-translate-y-2
          hover:border-blue-500
          hover:shadow-[0_0_40px_rgba(37,99,235,.25)]
        "
      >

        <div className="flex justify-between items-start gap-5">

          {/* ==================================================
              CONTENT
          ================================================== */}

          <div className="min-w-0">

            {/* PERIOD */}

            {item.period && (
              <p className="text-blue-400 font-semibold">
                {item.period}
              </p>
            )}

            {/* DEGREE */}

            {item.degree && (
              <h3 className="text-3xl font-bold mt-4">
                {item.degree}
              </h3>
            )}

            {/* FIELD */}

            {item.field && (
              <p className="text-xl text-gray-300 mt-3">
                {item.field}
              </p>
            )}

            {/* INSTITUTE */}

            {item.institute && (
              <p className="text-gray-400 mt-2">
                {item.institute}
              </p>
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
                px-5
                py-2
                rounded-xl
                font-semibold
                whitespace-nowrap
              "
            >
              {item.badge}
            </div>
          )}

        </div>

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        {item.description && (
          <p className="mt-6 text-gray-400 leading-7">
            {item.description}
          </p>
        )}

      </div>

    </div>
  );
}