import Container from "../Common/Container";
import Button from "../Common/Button";
import SocialIcons from "../Common/SocialIcons";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0B1120] text-white flex items-center pt-24">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]"></div>

      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full bg-cyan-500/20 blur-[120px]"></div>

      <Container className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-20">

        {/* ================= Left ================= */}

        <div className="flex-1">

          <div className="flex items-center gap-4 mb-8">

            <div className="w-12 h-[2px] bg-blue-500"></div>

            <span className="uppercase tracking-[8px] text-blue-400 text-sm font-semibold">
              Hello I'm
            </span>

          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[135px] font-black leading-none tracking-[-5px]">
            SANTOSH
          </h1>

          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[110px] xl:text-[135px] font-black text-blue-500 leading-none tracking-[-5px]">
            CHAURASIA
          </h1>

          <h3 className="mt-8 text-2xl font-semibold text-gray-200">
            Data Analyst
          </h3>

          <p className="mt-2 text-gray-400 text-lg">
            AI Enthusiast • Web Developer
          </p>

          <p className="mt-8 text-gray-400 leading-8 max-w-xl">
            Passionate about Python, SQL, Excel, Power BI and AI.
            I love transforming raw data into meaningful business
            insights while building modern web applications.
          </p>

          <div className="flex flex-wrap gap-5 mt-10">

            <Button>
              Download Resume
            </Button>

            <Button variant="outline">
              Contact Me
            </Button>

          </div>

          <SocialIcons />

        </div>

        {/* ================= Right ================= */}

        <div className="flex-1 flex justify-center">

          <div className="relative">

            {/* Outer Glow */}

            <div className="absolute inset-0 rounded-full bg-blue-500 blur-[90px] opacity-30 scale-110"></div>

            {/* Ring */}

            <div className="relative w-[420px] h-[420px] rounded-full border-[8px] border-blue-500 bg-[#101826] overflow-hidden shadow-[0_0_90px_rgba(59,130,246,.55)] flex items-center justify-center">

              <div className="text-[120px]">
                👤
              </div>

            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}