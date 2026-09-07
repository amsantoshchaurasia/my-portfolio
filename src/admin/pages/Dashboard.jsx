import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../components/Layout";

import {
  getProjects,
  getCertificates,
  getExperiences,
  getEducations,
  getSkills,
} from "../../firebase/firestore";

import {
  HiBriefcase,
  HiDocumentText,
  HiAcademicCap,
  HiCollection,
  HiCode,
  HiPlusCircle,
  HiRefresh,
} from "react-icons/hi";


export default function Dashboard() {

  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [counts, setCounts] = useState({
    projects: 0,
    certificates: 0,
    experience: 0,
    education: 0,
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
        educations,
        skills,
      ] = await Promise.all([
        getProjects(),
        getCertificates(),
        getExperiences(),
        getEducations(),
        getSkills(),
      ]);


      setCounts({
        projects: projects.length,
        certificates: certificates.length,
        experience: experiences.length,
        education: educations.length,
        skills: skills.length,
      });


      console.log("Dashboard data loaded:", {
        projects: projects.length,
        certificates: certificates.length,
        experience: experiences.length,
        education: educations.length,
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
      title: "Education",
      value: counts.education,
      icon: <HiAcademicCap />,
      path: "/admin/education",
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

      <div
        className="
          mb-10
          flex
          flex-col
          border-b
          border-slate-800
          pb-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-white
              sm:text-4xl
            "
          >
            Welcome Back, Santosh 👋
          </h2>


          <p
            className="
              mt-2
              text-sm
              text-slate-400
              sm:text-base
            "
          >
            Here is what's happening with your
            portfolio today. Manage everything
            seamlessly.
          </p>

        </div>


        {/* SYSTEM STATUS */}

        <div
          className="
            mt-4
            self-start
            rounded-xl
            border
            border-slate-800
            bg-slate-900/80
            px-4
            py-2
            text-xs
            text-slate-500
            md:mt-0
          "
        >

          System Status:

          <span
            className="
              ml-1
              font-medium
              text-emerald-400
            "
          >
            Live & Connected
          </span>

        </div>

      </div>


      {/* ==================================================
          STATS GRID
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-6
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-5
        "
      >

        {stats.map((item) => (

          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="
              group
              relative
              cursor-pointer
              rounded-2xl
              border
              border-slate-800
              bg-slate-900/60
              p-6
              shadow-lg
              transition-all
              duration-300
              hover:border-blue-500/50
              hover:bg-slate-900
              hover:shadow-blue-500/5
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
              "
            >

              {/* TEXT */}

              <div>

                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                    transition-colors
                    group-hover:text-slate-300
                  "
                >
                  {item.title}
                </p>


                <h3
                  className="
                    mt-2
                    text-4xl
                    font-black
                    text-white
                  "
                >

                  {loading ? "—" : item.value}

                </h3>

              </div>


              {/* ICON */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-blue-500/20
                  bg-blue-600/10
                  text-2xl
                  text-blue-400
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >

                {item.icon}

              </div>

            </div>


            {/* BOTTOM */}

            <div
              className="
                mt-4
                flex
                items-center
                justify-between
                border-t
                border-slate-800/60
                pt-4
                text-xs
                text-slate-400
                transition-colors
                group-hover:text-blue-400
              "
            >

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

      <div
        className="
          mt-10
          rounded-2xl
          border
          border-slate-800
          bg-slate-900/60
          p-6
          sm:p-8
        "
      >

        {/* HEADER */}

        <h3
          className="
            flex
            items-center
            space-x-2
            text-xl
            font-bold
            text-white
          "
        >

          <HiPlusCircle className="text-blue-500" />

          <span>
            Quick Management Actions
          </span>

        </h3>


        <p
          className="
            mt-1
            text-xs
            text-slate-400
            sm:text-sm
          "
        >
          Direct shortcuts to add or modify
          core components of your portfolio
          website.
        </p>


        {/* ACTION BUTTONS */}

        <div
          className="
            mt-6
            flex
            flex-wrap
            gap-4
          "
        >

          {/* PROJECT */}

          <button
            onClick={() =>
              navigate("/admin/projects")
            }
            className="
              flex
              items-center
              space-x-2
              rounded-xl
              bg-blue-600
              px-5
              py-3
              text-sm
              font-medium
              text-white
              shadow-lg
              shadow-blue-600/20
              transition-all
              hover:bg-blue-500
            "
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
            className="
              flex
              items-center
              space-x-2
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-5
              py-3
              text-sm
              font-medium
              text-slate-200
              transition-all
              hover:bg-slate-700
            "
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
            className="
              flex
              items-center
              space-x-2
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-5
              py-3
              text-sm
              font-medium
              text-slate-200
              transition-all
              hover:bg-slate-700
            "
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
            className="
              flex
              items-center
              space-x-2
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-5
              py-3
              text-sm
              font-medium
              text-slate-200
              transition-all
              hover:bg-slate-700
            "
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
            className="
              flex
              items-center
              space-x-2
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-5
              py-3
              text-sm
              font-medium
              text-slate-200
              transition-all
              hover:bg-slate-700
            "
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
            className="
              flex
              items-center
              space-x-2
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-5
              py-3
              text-sm
              font-medium
              text-slate-200
              transition-all
              hover:bg-slate-700
            "
          >

            <HiRefresh className="text-blue-400" />

            <span>
              Update Hero Section
            </span>

          </button>

        </div>

      </div>

    </Layout>

  );
}