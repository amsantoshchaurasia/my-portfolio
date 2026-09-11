import { useEffect, useState } from "react";

import Container from "../common/Container";
import SectionAnimation from "../common/SectionAnimation";
import SkillCard from "./SkillCard";

import { getSkills } from "../../firebase/firestore";

// ========================================
// ICON IMPORTS
// ========================================

import {
  SiPython,
  SiMysql,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiGit,
  SiGithub,
  SiFirebase,
} from "react-icons/si";

import {
  FaCss3Alt,
  FaMicrosoft,
  FaChartBar,
} from "react-icons/fa";

// ========================================
// ICON MAP
// ========================================

const iconMap = {
  SiPython,
  SiMysql,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiReact,
  SiJavascript,
  SiHtml5,
  SiGit,
  SiGithub,
  SiFirebase,

  FaCss3Alt,
  FaMicrosoft,
  FaChartBar,
};

// ========================================
// SKILLS COMPONENT
// ========================================

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // LOAD SKILLS FROM FIRESTORE
  // ========================================

  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await getSkills();

        console.log(
          "Skills loaded from Firestore:",
          data
        );

        const formattedSkills = data
          .map((skill) => {
            const IconComponent =
              iconMap[skill.icon];

            if (!IconComponent) {
              console.warn(
                `Icon "${skill.icon}" not found for skill "${skill.name}"`
              );
            }

            return {
              ...skill,
              icon: IconComponent || FaChartBar,
            };
          })
          .sort(
            (a, b) =>
              (Number(a.order) || 0) -
              (Number(b.order) || 0)
          );

        setSkills(formattedSkills);
      } catch (error) {
        console.error(
          "Error loading Skills from Firestore:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  // ========================================
  // FILTER SKILLS
  // ========================================

  const analytics = skills.filter(
    (skill) => skill.category === "analytics"
  );

  const web = skills.filter(
    (skill) => skill.category === "web"
  );

  const tools = skills.filter(
    (skill) => skill.category === "tools"
  );

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="text-center text-gray-400">
            Loading Skills...
          </div>
        </Container>
      </section>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <section
      id="skills"
      className="scroll-mt-8 sm:scroll-mt-12 lg:scroll-mt-16 py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <SectionAnimation>

          {/* ========================================
              HEADER
          ======================================== */}

          <div className="mx-auto max-w-3xl text-center">

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[4px] sm:tracking-[8px] text-blue-400">
              Skills
            </p>

            <h2 className="mt-3 sm:mt-4 text-3xl sm:text-4xl md:text-5xl font-black text-white">
              Technical Skills
            </h2>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-400 px-2">
              Technologies, programming languages and
              tools that I use for Data Analytics and
              Web Development.
            </p>

          </div>


          {/* ========================================
              DATA ANALYTICS
          ======================================== */}

          {analytics.length > 0 && (
            <div className="mt-12 sm:mt-14 lg:mt-16">

              <h3 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold text-white">
                Data Analytics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">

                {analytics.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                  />
                ))}

              </div>

            </div>
          )}


          {/* ========================================
              WEB DEVELOPMENT
          ======================================== */}

          {web.length > 0 && (
            <div className="mt-12 sm:mt-14 lg:mt-16">

              <h3 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold text-white">
                Web Development
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">

                {web.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                  />
                ))}

              </div>

            </div>
          )}


          {/* ========================================
              TOOLS
          ======================================== */}

          {tools.length > 0 && (
            <div className="mt-12 sm:mt-14 lg:mt-16">

              <h3 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-bold text-white">
                Tools & Technologies
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">

                {tools.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                  />
                ))}

              </div>

            </div>
          )}


          {/* ========================================
              NO SKILLS
          ======================================== */}

          {skills.length === 0 && (
            <div className="mt-12 sm:mt-16 text-center text-gray-400">
              No skills found.
            </div>
          )}

        </SectionAnimation>
      </Container>
    </section>
  );
}