import Container from "../Common/Container";
import SkillCategory from "./SkillCategory";

export default function Skills() {
  return (
    <section
      id="skills"
      className="bg-[#0B1120] text-white py-28"
    >
      <Container>

        <div className="text-center mb-20">

          <p className="uppercase tracking-[6px] text-blue-400">
            My Skills
          </p>

          <h2 className="text-5xl font-black mt-3">
            Technologies I Work With
          </h2>

        </div>

        {/* Categories yahan aayengi */}

      </Container>
    </section>
  );
}