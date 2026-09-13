import { useEffect, useState } from "react";

import Container from "../common/Container";
import EducationCard from "./EducationCard";
import SectionAnimation from "../common/SectionAnimation";

import { getEducations } from "../../firebase/firestore";

export default function Education() {
  // ======================================================
  // STATE
  // ======================================================

  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // LOAD EDUCATION
  // ======================================================

  useEffect(() => {
    async function loadEducation() {
      try {
        setLoading(true);

        const data = await getEducations();

        console.log(
          "USER EDUCATION FROM FIREBASE:",
          data
        );

        setEducations(data || []);
      } catch (error) {
        console.error(
          "Error loading education:",
          error
        );

        setEducations([]);
      } finally {
        setLoading(false);
      }
    }

    loadEducation();
  }, []);

  // ======================================================
  // NORMALIZE EDUCATION TYPE
  // ======================================================

  function getEducationType(item) {
    const type = String(
      item.educationType || ""
    )
      .trim()
      .toLowerCase();

    // Higher Education
    if (
      type === "higher" ||
      type === "higher education" ||
      type === "highereducation"
    ) {
      return "higher";
    }

    // School Education
    if (
      type === "school" ||
      type === "school education" ||
      type === "schooleducation"
    ) {
      return "school";
    }

    // --------------------------------------------------
    // BACKUP DETECTION
    // --------------------------------------------------
    // This prevents old records from disappearing if
    // educationType was not saved correctly.

    const degree = String(
      item.degree || ""
    ).toLowerCase();

    const field = String(
      item.field || ""
    ).toLowerCase();

    if (
      degree.includes("master") ||
      degree.includes("m.sc") ||
      degree.includes("msc") ||
      degree.includes("bachelor") ||
      degree.includes("b.sc") ||
      degree.includes("bsc")
    ) {
      return "higher";
    }

    if (
      degree.includes("secondary") ||
      degree.includes("hsc") ||
      degree.includes("ssc")
    ) {
      return "school";
    }

    if (
      field.includes("data science") ||
      field.includes("information technology")
    ) {
      return "higher";
    }

    return "";
  }

  // ======================================================
  // HIGHER EDUCATION
  // M.SC / B.SC
  // ======================================================

  const higherEducation = educations
    .filter(
      (item) =>
        getEducationType(item) === "higher"
    )
    .sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );

  // ======================================================
  // SCHOOL EDUCATION
  // HSC / SSC
  // ======================================================

  const schoolEducation = educations
    .filter(
      (item) =>
        getEducationType(item) === "school"
    )
    .sort(
      (a, b) =>
        Number(a.order || 0) -
        Number(b.order || 0)
    );

  // ======================================================
  // UI
  // ======================================================

  return (
    <section
      id="education"
      className="bg-[#0B1120] text-white scroll-mt-16 sm:scroll-mt-13 md:scroll-mt-21 lg:scroll-mt-14 xl:scroll-mt-15 pt-6 sm:pt-12 md:pt-6 lg:pt-8 xl:pt-10 pb-10 sm:pb-20 lg:pb-24"
    >
      <Container>

        <SectionAnimation>

          {/* ==================================================
              HEADING
          ================================================== */}

          <div className="text-center max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto">

            <p className="uppercase tracking-[3px] sm:tracking-[8px] text-blue-400 font-semibold text-[11px] sm:text-sm">
              Academics
            </p>

            <h2 className="mt-2 sm:mt-4 text-2xl sm:text-4xl md:text-5xl font-black">
              Education
            </h2>

            <p className="mt-3 sm:mt-6 text-xs sm:text-base md:text-lg text-gray-400 leading-5 sm:leading-7 md:leading-8 px-2">
              My academic journey and educational background.
            </p>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="max-w-6xl mx-auto mt-12 sm:mt-16 md:mt-20 text-center">

              <p className="text-sm sm:text-base text-gray-400">
                Loading education...
              </p>

            </div>
          )}

          {/* ==================================================
              CONTENT
          ================================================== */}

          {!loading && (
            <>

              {/* ==================================================
                  HIGHER EDUCATION
              ================================================== */}

              {higherEducation.length > 0 && (
                <div className="max-w-3xl lg:max-w-[52rem] xl:max-w-4xl 2xl:max-w-5xl mx-auto mt-6 sm:mt-10 md:mt-8 lg:mt-10">

                  {higherEducation.map(
                    (item) => (
                      <EducationCard
                        key={item.id}
                        item={item}
                      />
                    )
                  )}

                </div>
              )}

              {/* ==================================================
                  SCHOOL EDUCATION
                  (EducationCard already draws its own timeline
                  line + dot, so no extra wrapper/line needed here
                  — avoids double-indent and overlapping lines.)
              ================================================== */}

              {schoolEducation.length > 0 && (
                <div className="max-w-3xl lg:max-w-[52rem] xl:max-w-4xl 2xl:max-w-5xl mx-auto mt-6 sm:mt-10">

                  <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-center mb-5 sm:mb-10 md:mb-12">
                    School Education
                  </h3>

                  {schoolEducation.map(
                    (item) => (
                      <EducationCard
                        key={item.id}
                        item={item}
                      />
                    )
                  )}

                </div>
              )}

              {/* ==================================================
                  NO EDUCATION
              ================================================== */}

              {educations.length === 0 && (
                <div className="max-w-6xl mx-auto mt-12 sm:mt-16 md:mt-20 text-center">

                  <p className="text-sm sm:text-base text-gray-400">
                    No education information available.
                  </p>

                </div>
              )}

            </>
          )}

        </SectionAnimation>

      </Container>
    </section>
  );
}