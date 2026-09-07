import { HiBell, HiUserCircle } from "react-icons/hi";
import { useEffect, useState } from "react";

export default function Header({ title }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    function updateTime() {
      const now = new Date();

      setTime(
        now.toLocaleString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    updateTime();

    const timer = setInterval(updateTime, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-700 bg-[#0B1120]/90 backdrop-blur-xl">
      <div className="flex min-h-20 items-center justify-between px-6 md:px-8 lg:px-10">
        {/* ==================================================
            LEFT
        ================================================== */}

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black tracking-tight text-white md:text-3xl">
            {title}
          </h1>

          <p className="mt-1 text-xs text-gray-400 md:text-sm">
            {time}
          </p>
        </div>

        {/* ==================================================
            RIGHT
        ================================================== */}

        <div className="ml-4 flex shrink-0 items-center gap-4 md:gap-6">
          {/* Notification */}

          <button
            type="button"
            aria-label="Notifications"
            className="
              flex h-11 w-11 items-center justify-center
              rounded-xl
              border border-slate-700
              bg-slate-800
              text-gray-300
              transition-all duration-300
              hover:border-blue-500/40
              hover:bg-blue-600
              hover:text-white
            "
          >
            <HiBell className="text-2xl" />
          </button>

          {/* Admin Profile */}

          <div className="flex items-center gap-3">
            <HiUserCircle className="text-5xl text-blue-500" />

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