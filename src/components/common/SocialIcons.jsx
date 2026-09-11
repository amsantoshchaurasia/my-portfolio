import personal from "../../data/personal";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-2 sm:gap-4 text-base sm:text-xl lg:text-2xl">

      {/* GitHub */}
      <a
        href={personal.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="
          flex
          h-9 w-9
          sm:h-12 sm:w-12
          lg:h-14 lg:w-14
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
          hover:scale-110
          hover:border-blue-500
          hover:bg-blue-600
          hover:text-white
        "
      >
        <FaGithub />
      </a>

      {/* LinkedIn */}
      <a
        href={personal.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="
          flex
          h-9 w-9
          sm:h-12 sm:w-12
          lg:h-14 lg:w-14
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
          hover:scale-110
          hover:border-blue-500
          hover:bg-blue-600
          hover:text-white
        "
      >
        <FaLinkedin />
      </a>

      {/* Email */}
      <a
        href={`mailto:${personal.email}`}
        aria-label="Email"
        className="
          flex
          h-9 w-9
          sm:h-12 sm:w-12
          lg:h-14 lg:w-14
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
          hover:scale-110
          hover:border-blue-500
          hover:bg-blue-600
          hover:text-white
        "
      >
        <FaEnvelope />
      </a>

    </div>
  );
}