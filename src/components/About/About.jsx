import Container from "../common/Container";
import AboutContent from "./AboutContent";
import AboutStats from "./AboutStats";
import SectionAnimation from "../common/SectionAnimation";

export default function About() {
  return (
    <section
      id="about"
      className="bg-slate-950 text-white pt-8 sm:pt-12 md:pt-14 lg:pt-6 xl:pt-8 2xl:pt-0 pb-10 sm:pb-14 md:pb-16 lg:pb-20 xl:pb-10 2xl:pb-0 overflow-hidden scroll-mt-16 sm:scroll-mt-20 lg:scroll-mt-13 xl:scroll-mt-17 2xl:scroll-mt-[80px] 2xl:min-h-[calc(100vh-80px)] 2xl:flex 2xl:flex-col 2xl:justify-center"
    >
      <Container>
        <SectionAnimation>
          <div className="text-center mb-6 sm:mb-10 md:mb-12 lg:mb-8 xl:mb-5 2xl:mb-10">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-blue-500"></span>
              <p className="uppercase tracking-[3px] sm:tracking-[4px] md:tracking-[6px] text-xs sm:text-sm text-blue-400 font-semibold">
                About Me
              </p>
              <span className="w-6 h-[2px] bg-blue-500"></span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight">
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