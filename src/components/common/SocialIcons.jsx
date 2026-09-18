import personal from "../../data/personal";

import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-2 sm:gap-4 lg:gap-3 text-base sm:text-xl lg:text-lg">

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
          lg:h-11 lg:w-11
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
          lg:h-11 lg:w-11
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
          lg:h-11 lg:w-11
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

      {/* Instagram */}
      <a
        href={personal.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        className="
          flex
          h-9 w-9
          sm:h-12 sm:w-12
          lg:h-11 lg:w-11
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
          hover:border-pink-500
          hover:bg-pink-500
          hover:text-white
        "
      >
        <FaInstagram />
      </a>

      {/* Facebook */}
      <a
        href={personal.facebook}
        target="_blank"
        rel="noreferrer"
        aria-label="Facebook"
        className="
          flex
          h-9 w-9
          sm:h-12 sm:w-12
          lg:h-11 lg:w-11
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
        <FaFacebook />
      </a>

    </div>
  );
}