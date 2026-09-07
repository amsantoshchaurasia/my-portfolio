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
      className="bg-[#0B1120] text-white py-24"
    >
      <Container>

        <SectionAnimation>

          {/* ==================================================
              HEADING
          ================================================== */}

          <div className="text-center max-w-4xl mx-auto">

            <p className="uppercase tracking-[8px] text-blue-400 font-semibold text-sm">
              Academics
            </p>

            <h2 className="mt-4 text-5xl font-black">
              Education
            </h2>

            <p className="mt-6 text-lg text-gray-400 leading-8">
              My academic journey and educational background.
            </p>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="max-w-6xl mx-auto mt-20 text-center">

              <p className="text-gray-400">
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
                <div className="max-w-6xl mx-auto mt-20">

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
              ================================================== */}

              {schoolEducation.length > 0 && (
                <div className="max-w-6xl mx-auto mt-10">

                  <h3 className="text-3xl font-bold text-center mb-12">
                    School Education
                  </h3>

                  <div className="relative pl-12">

                    {/* Timeline */}

                    <div className="absolute left-4 top-0 w-[2px] h-full bg-blue-600"></div>

                    {schoolEducation.map(
                      (item) => (
                        <EducationCard
                          key={item.id}
                          item={item}
                        />
                      )
                    )}

                  </div>

                </div>
              )}

              {/* ==================================================
                  NO EDUCATION
              ================================================== */}

              {educations.length === 0 && (
                <div className="max-w-6xl mx-auto mt-20 text-center">

                  <p className="text-gray-400">
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