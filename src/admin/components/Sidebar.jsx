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
  HiMail,
  HiCog,
  HiLogout,
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

  {
    name: "Contact",
    icon: <HiMail />,
    path: "/admin/contact",
  },

  {
    name: "Settings",
    icon: <HiCog />,
    path: "/admin/settings",
  },
];

// ======================================================
// SIDEBAR
// ======================================================

export default function Sidebar() {
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-700 bg-[#111827]">

      {/* ==================================================
          LOGO
      ================================================== */}

      <div className="flex h-20 shrink-0 items-center justify-center border-b border-slate-700">
        <h1 className="text-2xl font-black tracking-tight">
          <span className="text-white">
            Santosh
          </span>

          <span className="text-blue-500">
            .
          </span>
        </h1>
      </div>

      {/* ==================================================
          NAVIGATION
      ================================================== */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-2">

          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `
                group flex items-center gap-4
                rounded-xl px-5 py-3.5
                text-base font-medium
                transition-all duration-300

                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-gray-300 hover:bg-slate-800 hover:text-blue-400"
                }
                `
              }
            >
              <span className="text-2xl transition-transform duration-300 group-hover:scale-110">
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

      <div className="shrink-0 border-t border-slate-700 p-5">

        <button
          type="button"
          onClick={handleLogout}
          className="
            flex w-full items-center gap-4
            rounded-xl px-5 py-3.5
            font-medium text-red-400
            transition-all duration-300
            hover:bg-red-500/10
            hover:text-red-300
          "
        >
          <HiLogout className="text-2xl" />

          <span>
            Logout
          </span>
        </button>

      </div>

    </aside>
  );
}