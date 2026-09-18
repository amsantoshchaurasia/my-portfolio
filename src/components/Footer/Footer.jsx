import { useEffect, useState } from "react";

import { FaArrowUp } from "react-icons/fa";

import { FiMapPin } from "react-icons/fi";

import Container from "../common/Container";
import SocialIcons from "../common/SocialIcons";

export default function Footer() {
  const year = new Date().getFullYear();

  const [showButton, setShowButton] = useState(false);

  // ======================================================
  // SHOW / HIDE BACK TO TOP BUTTON
  // ======================================================

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 350);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ======================================================
  // SCROLL TO TOP
  // ======================================================

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-slate-800 bg-[#08101d] text-white">

        <Container>

          <div className="py-8 sm:py-10 md:py-12 lg:py-16 2xl:py-20">

            {/* ==================================================
                TOP SECTION
            ================================================== */}

            <div className="grid gap-8 sm:gap-10 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12 2xl:gap-16">

              {/* ==================================================
                  LEFT - BRANDING
              ================================================== */}

              <div className="space-y-3 sm:space-y-4 md:col-span-2 lg:col-span-1">

                <h2 className="text-xl sm:text-2xl md:text-3xl 2xl:text-4xl font-black">

                  <span className="text-white">
                    Santosh
                  </span>

                  <span className="text-blue-500">
                    {" "}Chaurasia
                  </span>

                </h2>

                <p className="max-w-xl text-xs sm:text-sm leading-6 sm:leading-7 md:leading-8 text-gray-400">
                  Data Analyst passionate about transforming raw
                  data into meaningful business insights using
                  Python, SQL, Excel and Power BI.
                </p>

                {/* LOCATION */}

                <div className="flex items-center gap-2 sm:gap-2.5 pt-1.5 sm:pt-2">

                  <div
                    className="
                      flex
                      h-7
                      w-7
                      sm:h-8
                      sm:w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-blue-500/20
                      bg-blue-500/10
                      text-blue-400
                    "
                  >
                    <FiMapPin size={16} />
                  </div>

                  <span className="text-xs sm:text-sm font-medium text-gray-300">
                    Navi Mumbai, India
                  </span>

                </div>

              </div>


              {/* ==================================================
                  CENTER - QUICK LINKS
              ================================================== */}

              <div>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                  Quick Links
                </h3>

                <ul className="mt-4 sm:mt-5 md:mt-6 space-y-2.5 sm:space-y-3 md:space-y-4 text-xs sm:text-sm text-gray-400">

                  <li>
                    <a
                      href="#home"
                      className="transition-colors hover:text-blue-400"
                    >
                      Home
                    </a>
                  </li>

                  <li>
                    <a
                      href="#about"
                      className="transition-colors hover:text-blue-400"
                    >
                      About
                    </a>
                  </li>

                  <li>
                    <a
                      href="#skills"
                      className="transition-colors hover:text-blue-400"
                    >
                      Skills
                    </a>
                  </li>

                  <li>
                    <a
                      href="#projects"
                      className="transition-colors hover:text-blue-400"
                    >
                      Projects
                    </a>
                  </li>

                  <li>
                    <a
                      href="#experience"
                      className="transition-colors hover:text-blue-400"
                    >
                      Experience
                    </a>
                  </li>

                  <li>
                    <a
                      href="#contact"
                      className="transition-colors hover:text-blue-400"
                    >
                      Contact
                    </a>
                  </li>

                </ul>

              </div>


              {/* ==================================================
                  RIGHT - CONNECT
              ================================================== */}

              <div>

                <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                  Connect
                </h3>


                {/* ==================================================
                    ALL SOCIAL ICONS - ONE SINGLE ROW
                ================================================== */}

                <div
                  className="
                    mt-4
                    sm:mt-5
                    md:mt-6
                    flex
                    flex-nowrap
                    items-center
                    gap-2.5
                    sm:gap-3
                    md:gap-4
                    lg:gap-3
                  "
                >

                  {/* GITHUB + LINKEDIN + EMAIL + INSTAGRAM + FACEBOOK */}

                  <SocialIcons />

                </div>


                {/* DESCRIPTION */}

                <p className="mt-4 sm:mt-5 md:mt-6 max-w-lg text-xs sm:text-sm leading-relaxed text-gray-400 pr-16 sm:pr-0">
                  Open for internships, freelance projects
                  and full-time opportunities.
                </p>

              </div>

            </div>


            {/* ==================================================
                DIVIDER
            ================================================== */}

            <div className="my-6 sm:my-8 md:my-10 border-t border-slate-800"></div>


            {/* ==================================================
                COPYRIGHT
            ================================================== */}

            <div className="text-center">

              <p className="text-xs sm:text-sm text-gray-500">
                © {year} Santosh Chaurasia. All Rights Reserved.
              </p>

            </div>

          </div>

        </Container>

      </footer>


      {/* ==================================================
          BACK TO TOP BUTTON
      ================================================== */}

      <button
        onClick={scrollTop}
        aria-label="Back to top"
        className={`
          fixed
          bottom-4
          right-4
          sm:bottom-6
          sm:right-6
          md:bottom-8
          md:right-8
          z-50
          flex
          h-10
          w-10
          sm:h-12
          sm:w-12
          md:h-14
          md:w-14
          items-center
          justify-center
          rounded-full
          bg-blue-600
          text-white
          shadow-lg
          transition-all
          duration-300
          hover:-translate-y-1
          hover:bg-blue-700
          hover:shadow-[0_0_25px_rgba(37,99,235,.5)]

          ${
            showButton
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-75 opacity-0"
          }
        `}
      >
        <FaArrowUp size={16} className="sm:hidden" />
        <FaArrowUp size={17} className="hidden sm:block md:hidden" />
        <FaArrowUp size={18} className="hidden md:block" />
      </button>

    </>
  );
}