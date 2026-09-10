import { useEffect, useState } from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import Container from "../common/Container";
import Button from "../common/Button";
import SocialIcons from "../common/SocialIcons";
import profile from "../../assets/images/profile.png";
import SectionAnimation from "../common/SectionAnimation";
import { motion } from "framer-motion";
import { getResumeURL } from "../../firebase/storage";
import { getHeroData } from "../../firebase/firestore";

export default function Hero() {
  const [resumeData, setResumeData] = useState(null);
  const [heroData, setHeroData] = useState({
    firstName: "Santosh",
    lastName: "Chaurasia",
    title: "Data Analyst",
    description: "Passionate Data Analyst with expertise in Python, SQL, Excel, Power BI and React.",
    imageUrl: "",
  });

  useEffect(() => {
    async function fetchHeroData() {
      try {
        const url = await getResumeURL();
        if (url) {
          setResumeData(url);
        }

        const data = await getHeroData();
        if (data) {
          setHeroData((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (error) {
        console.error("Error fetching hero data in Hero component:", error);
      }
    }
    fetchHeroData();
  }, []);

  const handleDownloadResume = () => {
    if (resumeData) {
      window.open(resumeData, "_blank", "noopener,noreferrer");
    } else {
      alert("Resume not uploaded yet.");
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[#0B1120] text-white pt-20 sm:pt-24 md:pt-28 lg:pt-20 xl:pt-28 pb-6 sm:pb-10 md:pb-12 lg:pb-4 xl:pb-12 min-h-screen flex items-center"
    >
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-blue-600/20 blur-[100px] sm:blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-cyan-500/20 blur-[100px] sm:blur-[120px]" />

      <Container className="relative z-10 w-full">
        <SectionAnimation>
          {/*
            Mobile: everything compact + centered so the whole hero fits in
            one screen (min-h-screen on the section keeps it viewport-sized,
            flex items-center vertically balances the content).
            From lg (1024px) up: normal spacious two-column layout returns.
          */}
          <div className="grid lg:grid-cols-2 items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-20">

            {/* LEFT SIDE */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left order-2 lg:order-1">
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex items-center gap-2 sm:gap-4 mb-1.5 sm:mb-5"
              >
                <div className="w-8 sm:w-14 h-[2px] bg-blue-500"></div>
                <span className="uppercase tracking-[3px] sm:tracking-[8px] text-blue-400 text-[10px] sm:text-sm font-semibold">
                  HELLO I'M
                </span>
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
              >
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl 2xl:text-8xl font-black tracking-tight leading-tight sm:leading-none">
                  <div className="text-white mb-0 sm:mb-2">
                    {(heroData.firstName || "").toUpperCase()}
                  </div>
                  <div className="text-blue-500">
                    {(heroData.lastName || "").toUpperCase()}
                  </div>
                </h1>
              </motion.div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.7 }}
                className="mt-1.5 sm:mt-5 text-sm sm:text-xl lg:text-2xl xl:text-3xl font-semibold text-gray-200"
              >
                {heroData.title}
              </motion.h3>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="mt-1.5 sm:mt-5 max-w-[260px] sm:max-w-md lg:max-w-xl xl:max-w-2xl text-xs sm:text-base lg:text-lg leading-5 lg:leading-7 text-gray-400"
              >
                {heroData.description}
              </motion.p>

              {/* BUTTONS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-4 mt-3 sm:mt-8"
              >
                <Button icon onClick={handleDownloadResume} className="text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-3">
                  Download Resume
                </Button>

                <Button
                  variant="outline"
                  className="text-xs sm:text-base px-3 sm:px-6 py-2 sm:py-3"
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Contact Me
                </Button>
              </motion.div>

              {/* Social Icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.25, duration: 0.8 }}
                className="mt-3 sm:mt-8 flex flex-wrap justify-center lg:justify-start items-center gap-2 sm:gap-4"
              >
                <SocialIcons />

                {/* INSTAGRAM */}
                <a
                  href="https://www.instagram.com/beingsxntxsh/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-8 w-8 sm:h-12 sm:w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 text-gray-200 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-pink-500 hover:bg-pink-500 hover:text-white hover:scale-110"
                >
                  <FaInstagram size={14} className="sm:hidden" />
                  <FaInstagram size={22} className="hidden sm:block" />
                </a>

                {/* FACEBOOK */}
                <a
                  href="https://www.facebook.com/share/1DFA8xLujj/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-8 w-8 sm:h-12 sm:w-12 lg:h-14 lg:w-14 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900/40 text-gray-200 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white hover:scale-110"
                >
                  <FaFacebook size={14} className="sm:hidden" />
                  <FaFacebook size={22} className="hidden sm:block" />
                </a>
              </motion.div>
            </div>

            {/* RIGHT SIDE (Profile Image & Glow) */}
            <motion.div
              initial={{ opacity: 0, x: 120, scale: 0.75, rotate: 8 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              transition={{ delay: 0.45, duration: 1, ease: "easeOut" }}
              className="flex justify-center lg:justify-end lg:-translate-y-6 order-1 lg:order-2"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-[40px] sm:blur-[90px] scale-110"></div>

                {/*
                  Small on mobile (110px) so the whole hero fits one screen,
                  then scales up normally from sm/lg onward.
                */}
                <div className="relative w-[110px] h-[110px] sm:w-[230px] sm:h-[230px] md:w-[300px] md:h-[300px] lg:w-[380px] lg:h-[380px] xl:w-[420px] xl:h-[420px] 2xl:w-[460px] 2xl:h-[460px] rounded-full overflow-hidden border-2 sm:border-[5px] border-blue-500 shadow-[0_0_30px_rgba(37,99,235,.45)] sm:shadow-[0_0_90px_rgba(37,99,235,.45)]">
                  <img
                    src={heroData.imageUrl || profile}
                    alt={`${heroData.firstName} ${heroData.lastName}`}
                    className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </motion.div>
            </motion.div>

          </div>
        </SectionAnimation>
      </Container>
    </section>
  );
}