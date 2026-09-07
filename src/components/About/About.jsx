import Container from "../common/Container";
import AboutContent from "./AboutContent";
import AboutStats from "./AboutStats";
import SectionAnimation from "../common/SectionAnimation";

export default function About() {
  return (
    <section
      id="about"
      className="bg-slate-950 text-white py-14 lg:py-20 overflow-hidden scroll-mt-20"
    >
      <Container>
        <SectionAnimation>
          <div className="text-center mb-10 lg:mb-14">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-blue-500"></span>
              <p className="uppercase tracking-[4px] sm:tracking-[6px] text-xs sm:text-sm text-blue-400 font-semibold">
                About Me
              </p>
              <span className="w-6 h-[2px] bg-blue-500"></span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              Know Me Better
            </h2>
          </div>

          <AboutContent />
          <AboutStats />
        </SectionAnimation>
      </Container>
    </section>
  );
}