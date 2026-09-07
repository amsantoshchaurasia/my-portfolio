import { useEffect, useState } from "react";

import Container from "../Common/Container";
import SectionAnimation from "../Common/SectionAnimation";
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
      className="bg-[#0B1120] py-24 text-white"
    >
      <Container>
        <SectionAnimation>

          {/* ========================================
              HEADING
          ======================================== */}

          <div className="mx-auto max-w-4xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[8px] text-blue-400">
              Career
            </p>

            <h2 className="mt-4 text-4xl font-black md:text-5xl lg:text-6xl">
              Experience
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-400">
              My professional journey and hands-on expertise
              in IT support, data analytics and operations.
            </p>

          </div>

          {/* ========================================
              TIMELINE
          ======================================== */}

          <div className="relative mx-auto mt-20 max-w-4xl">

            {/* LOADING */}

            {loading && (
              <div className="py-10 text-center">
                <p className="text-gray-500">
                  Loading experience...
                </p>
              </div>
            )}

            {/* EMPTY */}

            {!loading && experience.length === 0 && (
              <div className="py-10 text-center">

                <p className="text-gray-500">
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