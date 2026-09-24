import Container from "../common/Container";
import SectionAnimation from "../common/SectionAnimation";

import CertificateGrid from "./CertificateGrid";

export default function Certificates() {
  return (
    <section
      id="certificates"
      className="bg-slate-950 text-white scroll-mt-16 sm:scroll-mt-13 md:scroll-mt-22 lg:scroll-mt-14 xl:scroll-mt-15 pt-6 sm:pt-12 md:pt-6 lg:pt-8 xl:pt-10 pb-10 sm:pb-20 lg:pb-24"
    >
      <Container>
        <SectionAnimation>

          {/* ========================================
              HEADING
          ======================================== */}

          <div className="mx-auto max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl text-center">

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[4px] sm:tracking-[8px] text-blue-400">
              Achievements
            </p>

            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black">
              Certificates
            </h2>

            <p className="mt-3 sm:mt-6 text-xs sm:text-base md:text-lg leading-5 sm:leading-7 md:leading-8 text-gray-400 px-2">
              Professional certifications, virtual internships
              and technical learning completed throughout my
              Data Analytics journey.
            </p>

          </div>

          {/* ========================================
              FILTERS + CERTIFICATES
          ======================================== */}

          <CertificateGrid />

        </SectionAnimation>
      </Container>
    </section>
  );
}