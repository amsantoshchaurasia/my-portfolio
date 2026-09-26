import {
  HiHome,
  HiUser,
  HiCode,
  HiBriefcase,
  HiAcademicCap,
  HiCollection,
  HiInformationCircle,
  HiBadgeCheck,
  HiDocumentDownload,
  // HiMail,
  // HiCog,
  HiLogout,
  HiX,
} from "react-icons/hi";

import { NavLink } from "react-router-dom";
import { logout } from "../services/auth";

// ======================================================
// ADMIN MENU
// ======================================================

const menu = [
  {
    name: "Dashboard",
    icon: <HiHome />,
    path: "/admin/dashboard",
  },

  {
    name: "Hero",
    icon: <HiUser />,
    path: "/admin/hero",
  },

  {
    name: "About",
    icon: <HiInformationCircle />,
    path: "/admin/about",
  },

  {
    name: "Skills",
    icon: <HiCode />,
    path: "/admin/skills",
  },

  {
    name: "Projects",
    icon: <HiBriefcase />,
    path: "/admin/projects",
  },

  {
    name: "Experience",
    icon: <HiCollection />,
    path: "/admin/experience",
  },

  {
    name: "Education",
    icon: <HiAcademicCap />,
    path: "/admin/education",
  },

  {
    name: "Certificates",
    icon: <HiBadgeCheck />,
    path: "/admin/certificates",
  },

  {
    name: "Resume",
    icon: <HiDocumentDownload />,
    path: "/admin/resume",
  },

  // Not needed for now — uncomment when ready to use.
  // {
  //   name: "Contact",
  //   icon: <HiMail />,
  //   path: "/admin/contact",
  // },

  // Not needed for now — uncomment when ready to use.
  // {
  //   name: "Settings",
  //   icon: <HiCog />,
  //   path: "/admin/settings",
  // },
];

// ======================================================
// SIDEBAR
// ======================================================

export default function Sidebar({ open = false, onClose = () => {} }) {
  // ====================================================
  // LOGOUT
  // ====================================================

  async function handleLogout() {
    try {
      await logout();

      window.location.href = "/admin";
    } catch (error) {
      console.error("Logout failed:", error);

      alert("Logout failed. Please try again.");
    }
  }

  // ====================================================
  // UI
  // ====================================================

  return (
    <aside
      aria-hidden={!open}
      className={`fixed left-0 top-0 z-50 flex h-screen h-[100dvh] w-64 max-w-[85vw] flex-col border-r border-slate-800 bg-[#111827] shadow-2xl transition-all duration-300 sm:w-72 ${
        open
          ? "translate-x-0"
          : "-translate-x-full invisible"
      }`}
    >

      {/* ==================================================
          LOGO + CLOSE
      ================================================== */}

      <div className="relative flex h-16 shrink-0 items-center justify-center border-b border-slate-800 sm:h-[72px]">
        <h1 className="text-lg font-bold tracking-tight sm:text-xl">
          <span className="text-white">
            Santosh
          </span>

          <span className="text-blue-500">
            .
          </span>
        </h1>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-lg text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <HiX />
        </button>
      </div>

      {/* ==================================================
          NAVIGATION — scrollable
      ================================================== */}

      <nav className="flex-1 overflow-y-auto px-3 py-4 sm:px-3.5 sm:py-5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
          Portfolio management
        </p>

        <div className="space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `
                group flex items-center gap-3
                rounded-lg px-3 py-2.5
                text-sm font-medium
                transition
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                    : "text-gray-400 hover:bg-slate-800 hover:text-white"
                }
                `
              }
            >
              <span className="text-lg leading-none transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ==================================================
          LOGOUT
      ================================================== */}

      <div className="shrink-0 border-t border-slate-800 p-3 sm:p-3.5">
        <button
          type="button"
          onClick={handleLogout}
          className="
            flex w-full items-center gap-3
            rounded-lg px-3 py-2.5
            text-sm font-medium text-red-400
            transition
            hover:bg-red-500/10
            hover:text-red-300
          "
        >
          <HiLogout className="text-lg leading-none" />

          <span>
            Logout
          </span>
        </button>
      </div>

    </aside>
  );
}