import { useEffect, useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Common/Button";
import { getResumeURL } from "../../firebase/storage";

const navLinks = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Skills", id: "skills" },
  { name: "Projects", id: "projects" },
  { name: "Experience", id: "experience" },
  { name: "Education", id: "education" },
  { name: "Certificates", id: "certificates" },
  { name: "Contact", id: "contact" },
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

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const onScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      let current = "home";
      sections.forEach((section) => {
        const top = section.offsetTop - 140;
        const height = section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < top + height) {
          current = section.id;
        }
      });

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
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`transition-all duration-500 rounded-2xl border ${
            scrolled
              ? "mt-3 bg-slate-950/80 border-slate-700/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)] py-2.5"
              : "mt-5 bg-slate-900/60 border-slate-700/40 shadow-[0_8px_25px_rgba(0,0,0,0.3)] py-3.5"
          } backdrop-blur-2xl`}
        >
          <div className="px-6 sm:px-8 flex items-center justify-between">
            
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => handleScroll("home")}
            >
              <h1 className="text-2xl font-black tracking-wider">
                <span className="text-white">Santosh</span>
                <span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">.</span>
              </h1>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-9">
              {navLinks.map((item) => {
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleScroll(item.id)}
                    className={`relative pb-1 text-base font-medium transition duration-300 ${
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
                className="transition-transform duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                Download Resume
              </Button>
            </div>

            {/* Mobile Menu Icon */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen(true)}
              className="lg:hidden text-3xl text-white p-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <HiMenuAlt3 />
            </motion.button>

          </div>
        </motion.div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="absolute right-0 top-0 h-full w-80 bg-[#0B1120]/95 border-l border-slate-800 backdrop-blur-2xl shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white tracking-wide">
                  Navigation
                </h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setOpen(false)}
                  className="text-3xl text-gray-400 hover:text-white p-1"
                >
                  <HiX />
                </motion.button>
              </div>

              <div className="flex flex-col p-6 gap-3 overflow-y-auto flex-grow">
                {navLinks.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      key={item.id}
                      onClick={() => handleScroll(item.id)}
                      className={`text-left px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 flex items-center justify-between ${
                        isActive
                          ? "text-blue-400 font-semibold bg-blue-600/10 border border-blue-500/20"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />}
                    </motion.button>
                  );
                })}
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                <Button
                  className="w-full justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  onClick={() => {
                    setOpen(false);
                    handleDownloadResume();
                  }}
                >
                  Download Resume
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}