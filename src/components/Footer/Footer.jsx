import { useEffect, useState } from "react";

import {
  FaArrowUp,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

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

          <div className="py-16">

            {/* ==================================================
                TOP SECTION
            ================================================== */}

            <div className="grid gap-12 lg:grid-cols-3">

              {/* ==================================================
                  LEFT - BRANDING
              ================================================== */}

              <div className="space-y-4">

                <h2 className="text-3xl font-black">

                  <span className="text-white">
                    Santosh
                  </span>

                  <span className="text-blue-500">
                    {" "}Chaurasia
                  </span>

                </h2>

                <p className="max-w-xl text-sm leading-8 text-gray-400">
                  Data Analyst passionate about transforming raw
                  data into meaningful business insights using
                  Python, SQL, Excel and Power BI.
                </p>

                {/* LOCATION */}

                <div className="flex items-center gap-2.5 pt-2">

                  <div
                    className="
                      flex
                      h-8
                      w-8
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

                  <span className="text-sm font-medium text-gray-300">
                    Navi Mumbai, India
                  </span>

                </div>

              </div>


              {/* ==================================================
                  CENTER - QUICK LINKS
              ================================================== */}

              <div>

                <h3 className="text-xl font-semibold">
                  Quick Links
                </h3>

                <ul className="mt-6 space-y-4 text-sm text-gray-400">

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
                      href="#certificates"
                      className="transition-colors hover:text-blue-400"
                    >
                      Certificates
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

                <h3 className="text-xl font-semibold">
                  Connect
                </h3>


                {/* ==================================================
                    ALL SOCIAL ICONS - ONE SINGLE ROW
                ================================================== */}

                <div
                  className="
                    mt-6
                    flex
                    flex-nowrap
                    items-center
                    gap-4
                  "
                >

                  {/* GITHUB + LINKEDIN + EMAIL */}

                  <SocialIcons />


                  {/* INSTAGRAM */}

                  <a
                    href="https://www.instagram.com/beingsxntxsh/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-slate-700
                      bg-slate-900/40
                      text-gray-200
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-pink-500
                      hover:bg-pink-500
                      hover:text-white
                      hover:scale-110
                    "
                  >
                    <FaInstagram size={22} />
                  </a>


                  {/* FACEBOOK */}

                  <a
                    href="https://www.facebook.com/share/1DFA8xLujj/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="
                      flex
                      h-14
                      w-14
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-slate-700
                      bg-slate-900/40
                      text-gray-200
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-blue-500
                      hover:bg-blue-600
                      hover:text-white
                      hover:scale-110
                    "
                  >
                    <FaFacebook size={22} />
                  </a>

                </div>


                {/* DESCRIPTION */}

                <p className="mt-6 max-w-lg text-sm leading-relaxed text-gray-400">
                  Open for internships, freelance projects
                  and full-time opportunities.
                </p>

              </div>

            </div>


            {/* ==================================================
                DIVIDER
            ================================================== */}

            <div className="my-10 border-t border-slate-800"></div>


            {/* ==================================================
                COPYRIGHT
            ================================================== */}

            <div className="text-center">

              <p className="text-sm text-gray-500">
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
          bottom-8
          right-8
          z-50
          flex
          h-14
          w-14
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
        <FaArrowUp size={18} />
      </button>

    </>
  );
}