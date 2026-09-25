import { useEffect, useState } from "react";
import { HiMenuAlt2 } from "react-icons/hi";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children, title }) {

  // Sidebar open/close (UI state only)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close on Escape + lock page scroll while the drawer is open
  useEffect(() => {

    if (!sidebarOpen) return;

    function onKeyDown(e) {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };

  }, [sidebarOpen]);


  return (
    <div className="min-h-screen bg-[#0B1120] text-white">

      {/* Sidebar (slide-in drawer) */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Main Content Area (full width) */}
      <div className="min-h-screen min-w-0">

        {/* Top bar: menu button + Header — fixed so it never scrolls out of view */}
        <div className="fixed inset-x-0 top-0 z-30 flex items-stretch">

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
            className="flex w-12 shrink-0 items-center justify-center border-b border-r border-slate-800 bg-[#0B1120] text-2xl text-slate-300 transition hover:text-blue-400 sm:w-14"
          >
            <HiMenuAlt2 />
          </button>

          <div className="min-w-0 flex-1">
            <Header title={title} />
          </div>

        </div>

        {/* Spacer — offsets the fixed top bar's height so content isn't hidden under it.
            Matches Header's min-h-16 sm:min-h-20. */}
        <div className="h-16 sm:h-20" aria-hidden="true" />

        {/* Page Content */}
        <main className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}