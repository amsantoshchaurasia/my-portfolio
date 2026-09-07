import Container from "../Common/Container";
import SectionAnimation from "../Common/SectionAnimation";

import MajorCertificates from "./MajorCertificates";
import OtherCertificates from "./OtherCertificates";

export default function Certificates() {
  return (
    <section
      id="certificates"
      className="bg-slate-950 py-24 text-white"
    >

      <Container>

        <SectionAnimation>

          <div className="mx-auto max-w-4xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[8px] text-blue-400">
              Achievements
            </p>

            <h2 className="mt-4 text-5xl font-black">
              Certificates
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-400">
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