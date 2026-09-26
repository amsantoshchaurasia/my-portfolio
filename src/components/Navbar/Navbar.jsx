import { useEffect, useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  FiHome,
  FiUser,
  FiCode,
  FiFolder,
  FiBriefcase,
  FiBookOpen,
  FiAward,
  FiMail,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";
import { getResumeURL } from "../../firebase/storage";

const navLinks = [
  { name: "Home", id: "home", icon: FiHome },
  { name: "About", id: "about", icon: FiUser },
  { name: "Skills", id: "skills", icon: FiCode },
  { name: "Projects", id: "projects", icon: FiFolder },
  { name: "Experience", id: "experience", icon: FiBriefcase },
  { name: "Education", id: "education", icon: FiBookOpen },
  { name: "Certificates", id: "certificates", icon: FiAward },
  { name: "Contact", id: "contact", icon: FiMail },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const url = await getResumeURL();
        if (url) {
          setResumeData(url);
        }
      } catch (error) {
        console.error("Error fetching resume in Navbar:", error);
      }
    }
    fetchResume();
  }, []);

  const handleScroll = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Floating AI chat widget listens for this event and hides itself
  // while the mobile menu is open (see SantoshAI.jsx).
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("nav-menu-toggle", { detail: { open } })
    );
  }, [open]);

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const onScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Navbar ki approx height jitna offset rakha hai — jab kisi
      // section ka top is offset ko cross kar jaaye (viewport ke
      // upar), aur bottom abhi bhi neeche ho, wahi section active hai.
      // getBoundingClientRect() live viewport position deta hai,
      // isliye scroll-mt / breakpoint jo bhi ho, ye hamesha sahi
      // calculate hoga (offsetTop wale fixed-number approach ki
      // tarah breakpoint ke saath out-of-sync nahi hota).
      const NAV_OFFSET = 150;

      let current = "home";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top - NAV_OFFSET <= 0 && rect.bottom - NAV_OFFSET > 0) {
          current = section.id;
        }
      });

      // Fallback: agar page ke bottom ke paas hain (aur neeche scroll karne
      // ki jagah nahi bachi), toh seedha last section ko active maan lo.
      // Warna last section (Contact) ka threshold kabhi reach hi nahi hota
      // kyunki scrollY page ke max scroll se aage badh hi nahi sakta.
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (nearBottom && sections.length > 0) {
        current = sections[sections.length - 1].id;
      }

      setActive(current);
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleDownloadResume = () => {
    if (resumeData) {
      // Opens the resume URL in a brand new tab
      window.open(resumeData, "_blank", "noopener,noreferrer");
    } else {
      alert("Resume not uploaded yet.");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0B1120]/80 backdrop-blur-md pt-3 md:pt-4 lg:pt-3 pb-2"
            : "bg-transparent pt-5 md:pt-6 lg:pt-5 pb-3"
        }`}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-6 xl:px-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`transition-all duration-500 rounded-2xl border ${
              scrolled
                ? "bg-slate-950 border-slate-600/70 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2.5 md:py-4 lg:py-2.5"
                : "bg-slate-900 border-slate-600/50 shadow-[0_8px_25px_rgba(0,0,0,0.3)] py-3.5 md:py-5 lg:py-3.5"
            }`}
          >
            <div className="px-6 sm:px-8 md:px-10 lg:px-8 flex items-center justify-between">
              
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
                onClick={() => handleScroll("home")}
              >
                <h1 className="text-2xl md:text-3xl lg:text-2xl font-black tracking-wider">
                  <span className="text-white">Santosh</span>
                  <span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">.</span>
                </h1>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-4 xl:gap-9">
                {navLinks.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleScroll(item.id)}
                      className={`relative pb-1 text-sm xl:text-base font-medium transition duration-300 whitespace-nowrap ${
                        isActive
                          ? "text-blue-500 font-semibold"
                          : "text-gray-300 hover:text-blue-400"
                      }`}
                    >
                      {item.name}

                      {isActive && (
                        <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Resume Button */}
              <div className="hidden lg:block">
                <Button
                  onClick={handleDownloadResume}
                  className="transition-transform duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)] whitespace-nowrap text-sm lg:text-sm xl:text-base px-3 lg:px-4 xl:px-6 py-2 lg:py-2.5 xl:py-3"
                >
                  Download Resume
                </Button>
              </div>

              {/* Mobile Menu Icon */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(true)}
                className="lg:hidden text-3xl text-white p-1 md:p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <HiMenuAlt3 />
              </motion.button>

            </div>
          </motion.div>
        </div>
      </header>

      {/* ========================================
          MOBILE MENU OVERLAY & DRAWER
          Rendered OUTSIDE <header> intentionally:
          header has backdrop-blur (backdrop-filter),
          which creates a new containing block for
          position:fixed descendants. If the drawer
          stayed inside header, its "fixed inset-0"
          would be scoped to header's small box height
          instead of the full viewport, collapsing it.

          Size 1 (375x667) = base classes only.
          Slim side sheet that starts from the top-left
          corner (72% width, max 300px) so the dimmed page
          stays visible on the right. Height fits its
          content, so there is no unwanted empty space.
          Size 2 (640x900) uses the same sheet (320px wide).
          Size 3 (768x1024) uses the same sheet (352px wide)
          with slightly larger text and spacing.
      ======================================== */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50 sm:bg-black/55 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -12 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className="absolute left-0 top-0 w-[72%] max-w-[300px] sm:w-80 sm:max-w-none md:w-[22rem] max-h-full overflow-y-auto overscroll-contain rounded-r-2xl origin-top-left bg-[#0F172A] border border-slate-800 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
            >
              {/* ACCENT LINE */}
              <div className="h-[3px] w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />

              {/* HEADER */}
              <div className="flex justify-between items-center px-4 py-3 sm:py-3.5 md:py-4 border-b border-slate-800 bg-slate-900/60">
                {/* Brand logo (same as navbar) */}
                <div className="text-xl sm:text-2xl font-black tracking-wider">
                  <span className="text-white">Santosh</span>
                  <span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">.</span>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="text-lg text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors"
                >
                  <HiX />
                </motion.button>
              </div>

              {/* NAV LINKS — "MENU" label removed; a small top
                  padding on the list keeps spacing balanced under
                  the header divider without needing the label. */}

              <div className="flex flex-col gap-0.5 sm:gap-1 px-3 pt-3 pb-2 sm:px-3.5 md:px-4">
                {navLinks.map((item) => {
                  const isActive = active === item.id;
                  const Icon = item.icon;
                  return (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      key={item.id}
                      onClick={() => handleScroll(item.id)}
                      className={`relative flex items-center gap-3 px-3 sm:px-3.5 md:px-4 py-2 sm:py-2.5 rounded-lg text-[14px] sm:text-[15px] md:text-base font-medium transition-all duration-200 ${
                        isActive
                          ? "text-blue-400 bg-blue-500/10"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {/* Active-item accent bar */}
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-blue-500" />
                      )}

                      <span
                        className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full text-base ${
                          isActive
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-slate-800/60 text-gray-400"
                        }`}
                      >
                        <Icon />
                      </span>
                      <span>{item.name}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* RESUME BUTTON */}
              <div className="p-3 sm:p-3.5 md:p-4 border-t border-slate-800">
                <Button
                  className="w-full justify-center whitespace-nowrap rounded-lg py-2.5 sm:py-3 text-sm md:text-base font-semibold tracking-wide shadow-[0_4px_16px_rgba(37,99,235,0.3)] hover:shadow-[0_4px_20px_rgba(37,99,235,0.4)] transition-shadow"
                  onClick={() => {
                    setOpen(false);
                    handleDownloadResume();
                  }}
                >
                  Resume
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}