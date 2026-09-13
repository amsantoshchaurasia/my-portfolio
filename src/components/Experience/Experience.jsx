import { useEffect, useState } from "react";

import Container from "../common/Container";
import SectionAnimation from "../common/SectionAnimation";
import ExperienceCard from "./ExperienceCard";

import { getExperiences } from "../../firebase/firestore";

export default function Experience() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // LOAD EXPERIENCE FROM FIREBASE
  // ========================================

  useEffect(() => {
    async function loadExperience() {
      try {
        setLoading(true);

        const data = await getExperiences();

        console.log("User experience loaded:", data);

        setExperience(data);
      } catch (error) {
        console.error(
          "Error loading experience:",
          error
        );

        setExperience([]);
      } finally {
        setLoading(false);
      }
    }

    loadExperience();
  }, []);

  // ========================================
  // UI
  // ========================================

  return (
    <section
      id="experience"
      className="bg-[#0B1120] text-white scroll-mt-16 sm:scroll-mt-13 md:scroll-mt-18 lg:scroll-mt-14 xl:scroll-mt-15 pt-6 sm:pt-12 md:pt-6 lg:pt-8 xl:pt-10 pb-10 sm:pb-20 lg:pb-24"
    >
      <Container>
        <SectionAnimation>

          {/* ========================================
              HEADING
          ======================================== */}

          <div className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl text-center">

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[4px] sm:tracking-[8px] text-blue-400">
              Career
            </p>

            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
              Experience
            </h2>

            <p className="mt-3 sm:mt-6 text-xs sm:text-base md:text-lg leading-5 sm:leading-7 md:leading-8 text-gray-400 px-2">
              My professional journey and hands-on expertise
              in IT support, data analytics and operations.
            </p>

          </div>

          {/* ========================================
              TIMELINE
          ======================================== */}

          <div className="relative mx-auto mt-6 sm:mt-10 md:mt-8 lg:mt-10 max-w-4xl">

            {/* LOADING */}

            {loading && (
              <div className="py-8 sm:py-10 text-center">
                <p className="text-sm sm:text-base text-gray-500">
                  Loading experience...
                </p>
              </div>
            )}

            {/* EMPTY */}

            {!loading && experience.length === 0 && (
              <div className="py-8 sm:py-10 text-center">

                <p className="text-sm sm:text-base text-gray-500">
                  No experience information available.
                </p>

              </div>
            )}

            {/* EXPERIENCE LIST */}

            {!loading && experience.length > 0 && (
              <>
                {experience.map((item, index) => (
                  <ExperienceCard
                    key={item.id}
                    item={item}
                    isLast={
                      index === experience.length - 1
                    }
                  />
                ))}
              </>
            )}

          </div>

        </SectionAnimation>
      </Container>
    </section>
  );
}