import { HiBell, HiUserCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { getHeroData } from "../../firebase/firestore";

// ======================================================
// MODULE-LEVEL CACHE
// Header remounts on every page navigation (since it's
// rendered fresh inside Layout each time). Without a cache,
// that means a fresh Firebase call + a 1-2s window where the
// fallback icon shows instead of the real photo — the "blink".
// Storing the last-known photo outside the component means any
// remount starts with it already in state, so there's nothing
// to flash. We still fetch in the background to keep it fresh.
// ======================================================
let cachedAdminPhoto = "";

export default function Header({ title }) {
  const [time, setTime] = useState({ short: "", full: "" });
  const [adminPhoto, setAdminPhoto] = useState(cachedAdminPhoto);

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

  // ======================================================
  // ADMIN PHOTO — mirrors whatever photo is set in Hero
  // Section, so this header always stays in sync with it.
  // Reads from cache first (instant, no blink), then
  // re-fetches to catch any update made in Hero section.
  // ======================================================

  useEffect(() => {
    async function loadAdminPhoto() {
      try {
        const data = await getHeroData();

        if (data?.imageUrl) {
          cachedAdminPhoto = data.imageUrl;
          setAdminPhoto(data.imageUrl);
        }
      } catch (error) {
        console.error("Error loading admin photo in Header:", error);
      }
    }

    loadAdminPhoto();
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
            {adminPhoto ? (
              <img
                src={adminPhoto}
                alt="Admin"
                className="h-10 w-10 shrink-0 rounded-full border-2 border-blue-500 object-cover object-top sm:h-12 sm:w-12"
              />
            ) : (
              <HiUserCircle className="text-4xl text-blue-500 sm:text-5xl" />
            )}

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