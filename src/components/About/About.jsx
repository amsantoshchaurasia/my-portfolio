import Container from "../Common/Container";
import AboutContent from "./AboutContent";
import AboutStats from "./AboutStats";

export default function About() {
  return (
    <section
      id="about"
      className="bg-slate-950 text-white py-28"
    >
      <Container>

        <div className="text-center mb-20">

          <p className="uppercase tracking-[6px] text-blue-400 mb-3">
            About Me
          </p>

          <h2 className="text-5xl font-black">
            Know Me Better
          </h2>

        </div>

        <AboutContent />

        <AboutStats />

      </Container>
    </section>
  );
}