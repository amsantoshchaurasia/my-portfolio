import Container from "../common/Container";
import SectionAnimation from "../common/SectionAnimation";

import MajorCertificates from "./MajorCertificates";
import OtherCertificates from "./OtherCertificates";

export default function Certificates() {
  return (
    <section
      id="certificates"
      className="bg-slate-950 py-16 sm:py-20 lg:py-24 text-white"
    >

      <Container>

        <SectionAnimation>

          <div className="mx-auto max-w-4xl text-center">

            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[4px] sm:tracking-[8px] text-blue-400">
              Achievements
            </p>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-black">
              Certificates
            </h2>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-400 px-2">
              Professional certifications, virtual internships
              and technical learning completed throughout my
              Data Analytics journey.
            </p>

          </div>


          <MajorCertificates />

          <OtherCertificates />

        </SectionAnimation>

      </Container>

    </section>
  );
}