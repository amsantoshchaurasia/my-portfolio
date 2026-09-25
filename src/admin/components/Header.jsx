import { HiBell, HiUserCircle } from "react-icons/hi";
import { useEffect, useState } from "react";

export default function Header({ title }) {
  const [time, setTime] = useState({ short: "", full: "" });

  useEffect(() => {
    function updateTime() {
      const now = new Date();

      setTime({
        // Compact format for mobile — keeps the header to one line
        short: now.toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        }),
        // Full format from sm breakpoint up, where there's room
        full: now.toLocaleString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }

    updateTime();

    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-700 bg-[#0B1120]/90 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between px-4 sm:min-h-20 sm:px-6 md:px-8 lg:px-10">
        {/* ==================================================
            LEFT
        ================================================== */}

        <div className="min-w-0">
          <h1 className="truncate text-lg font-black tracking-tight text-white sm:text-2xl md:text-3xl">
            {title}
          </h1>

          <p className="mt-0.5 text-[11px] text-gray-400 sm:hidden">
            {time.short}
          </p>

          <p className="mt-1 hidden text-xs text-gray-400 sm:block md:text-sm">
            {time.full}
          </p>
        </div>

        {/* ==================================================
            RIGHT
        ================================================== */}

        <div className="ml-3 flex shrink-0 items-center gap-3 sm:ml-4 sm:gap-4 md:gap-6">
          {/* Notification */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              border border-slate-700
              bg-slate-800
              text-gray-300
              transition-all duration-300
              hover:border-blue-500/40
              hover:bg-blue-600
              hover:text-white
              sm:h-11 sm:w-11
            "
          >
            <HiBell className="text-xl sm:text-2xl" />
          </button>

          {/* Admin Profile */}

          <div className="flex items-center gap-3">
            <HiUserCircle className="text-4xl text-blue-500 sm:text-5xl" />

            <div className="hidden sm:block">
              <h3 className="font-semibold text-white">
                Santosh
              </h3>

              <p className="text-sm text-gray-400">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}