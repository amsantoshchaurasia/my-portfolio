import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import {
  getProjects,
  getCertificates,
  getExperiences,
  getSkills,
} from "../../firebase/firestore";

import {
  HiBriefcase,
  HiDocumentText,
  HiCollection,
  HiCode,
  HiPlusCircle,
  HiRefresh,
} from "react-icons/hi";


// Shared classes for the quick action buttons (styling only)
const actionBtn =
  "flex items-center justify-center space-x-2 rounded-xl border border-slate-700/80 bg-slate-800/60 px-2 py-2.5 text-[11px] font-medium text-slate-200 transition-all hover:bg-slate-700 sm:px-4 sm:py-3 sm:text-sm 2xl:py-4";

const actionBtnPrimary =
  "flex items-center justify-center space-x-2 rounded-xl bg-blue-600 px-2 py-2.5 text-[11px] font-medium text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500 sm:px-4 sm:py-3 sm:text-sm 2xl:py-4";


export default function Dashboard() {

  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [counts, setCounts] = useState({
    projects: 0,
    certificates: 0,
    experience: 0,
    skills: 0,
  });

  const [loading, setLoading] = useState(true);


  // ======================================================
  // LOAD DASHBOARD DATA
  // ======================================================

  async function loadDashboardData() {

    try {

      setLoading(true);

      const [
        projects,
        certificates,
        experiences,
        skills,
      ] = await Promise.all([
        getProjects(),
        getCertificates(),
        getExperiences(),
        getSkills(),
      ]);


      setCounts({
        projects: projects.length,
        certificates: certificates.length,
        experience: experiences.length,
        skills: skills.length,
      });


      console.log("Dashboard data loaded:", {
        projects: projects.length,
        certificates: certificates.length,
        experience: experiences.length,
        skills: skills.length,
      });


    } catch (error) {

      console.error(
        "Error loading dashboard data:",
        error
      );

    } finally {

      setLoading(false);

    }
  }


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    loadDashboardData();

  }, []);


  // ======================================================
  // STATS
  // (Education intentionally excluded from the dashboard grid —
  //  it's still manageable from the sidebar/Quick Actions)
  // ======================================================

  const stats = [

    {
      title: "Projects",
      value: counts.projects,
      icon: <HiBriefcase />,
      path: "/admin/projects",
    },

    {
      title: "Certificates",
      value: counts.certificates,
      icon: <HiDocumentText />,
      path: "/admin/certificates",
    },

    {
      title: "Experience",
      value: counts.experience,
      icon: <HiCollection />,
      path: "/admin/experience",
    },

    {
      title: "Skills",
      value: counts.skills,
      icon: <HiCode />,
      path: "/admin/skills",
    },

  ];


  // ======================================================
  // UI
  // ======================================================

  return (

    <Layout title="Dashboard">

      {/* ==================================================
          WELCOME BANNER
      ================================================== */}

      <div className="mb-4 flex flex-col border-b border-slate-800 pb-3 sm:mb-8 sm:pb-5 md:flex-row md:items-center md:justify-between">

        <div>

          <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Welcome Back, Santosh 👋
          </h2>

          <p className="mt-1 text-[11px] leading-snug text-slate-400 sm:mt-2 sm:text-base">
            Here is what's happening with your
            portfolio today. Manage everything
            seamlessly.
          </p>

        </div>


        {/* SYSTEM STATUS */}

        <div className="mt-2 self-start rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[10px] text-slate-500 sm:mt-4 sm:px-4 sm:py-2 sm:text-xs md:mt-0 md:shrink-0 md:self-center md:whitespace-nowrap">

          System Status:

          <span className="ml-1 font-medium text-emerald-400">
            Live & Connected
          </span>

        </div>

      </div>


      {/* ==================================================
          STATS GRID
          — mobile/sm: 2x2, md upward: all 4 in one row
      ================================================== */}

      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 2xl:gap-6">

        {stats.map((item) => (

          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="group relative cursor-pointer rounded-2xl border border-slate-800/70 bg-slate-900/60 p-3 shadow-sm shadow-black/20 transition-all duration-300 hover:border-blue-500/50 hover:bg-slate-900 hover:shadow-blue-500/5 sm:rounded-2xl sm:p-5 sm:shadow-lg 2xl:p-6"
          >

            <div className="flex flex-col-reverse items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-0">

              {/* TEXT */}

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 transition-colors group-hover:text-slate-300 sm:text-xs sm:tracking-wider">
                  {item.title}
                </p>

                <h3 className="mt-0.5 text-lg font-extrabold tabular-nums text-white sm:mt-1.5 sm:text-3xl 2xl:text-4xl">
                  {loading ? "—" : item.value}
                </h3>

              </div>


              {/* ICON */}

              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/20 bg-gradient-to-br from-blue-600/20 to-blue-500/5 text-sm text-blue-400 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12 sm:rounded-xl sm:text-xl 2xl:h-14 2xl:w-14 2xl:text-2xl">
                {item.icon}
              </div>

            </div>


            {/* BOTTOM */}

            <div className="mt-2 flex items-center justify-between border-t border-slate-800/40 pt-2 text-[10px] text-slate-400 transition-colors group-hover:text-blue-400 sm:mt-3 sm:border-slate-800/60 sm:pt-3 sm:text-xs 2xl:mt-4 2xl:pt-4">

              <span>
                Manage entries
              </span>

              <span>
                →
              </span>

            </div>

          </div>

        ))}

      </div>


      {/* ==================================================
          QUICK MANAGEMENT ACTIONS
      ================================================== */}

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3 sm:mt-8 sm:rounded-2xl sm:p-6 2xl:p-8">

        {/* HEADER */}

        <h3 className="flex items-center space-x-2 text-sm font-bold text-white sm:text-xl">

          <HiPlusCircle className="text-blue-500" />

          <span>
            Quick Management Actions
          </span>

        </h3>


        <p className="mt-0.5 text-[11px] leading-snug text-slate-400 sm:mt-1 sm:text-sm">
          Direct shortcuts to add or modify
          core components of your portfolio
          website.
        </p>


        {/* ACTION BUTTONS — uniform-size grid from sm upward */}

        <div className="mt-3 grid grid-cols-2 gap-1.5 sm:mt-5 sm:grid-cols-3 sm:gap-3 xl:grid-cols-6 xl:gap-4">

          {/* PROJECT */}

          <button
            onClick={() =>
              navigate("/admin/projects")
            }
            className={actionBtnPrimary}
          >

            <span>
              + Add New Project
            </span>

          </button>


          {/* CERTIFICATE */}

          <button
            onClick={() =>
              navigate("/admin/certificates")
            }
            className={actionBtn}
          >

            <span>
              + Add Certificate
            </span>

          </button>


          {/* EXPERIENCE */}

          <button
            onClick={() =>
              navigate("/admin/experience")
            }
            className={actionBtn}
          >

            <span>
              + Add Experience
            </span>

          </button>


          {/* EDUCATION */}

          <button
            onClick={() =>
              navigate("/admin/education")
            }
            className={actionBtn}
          >

            <span>
              + Add Education
            </span>

          </button>


          {/* SKILLS */}

          <button
            onClick={() =>
              navigate("/admin/skills")
            }
            className={actionBtn}
          >

            <span>
              Manage Skills
            </span>

          </button>


          {/* HERO */}

          <button
            onClick={() =>
              navigate("/admin/hero")
            }
            className={actionBtn}
          >

            <HiRefresh className="text-blue-400" />

            <span>
              Update Hero
            </span>

          </button>

        </div>

      </div>

    </Layout>

  );
}