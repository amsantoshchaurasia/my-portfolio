import personal from "../../data/personal";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-5 mt-10 text-2xl">

      <a
        href={personal.github}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full border border-slate-700 flex items-center justify-center bg-slate-900/40 backdrop-blur-md hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:scale-110"
      >
        <FaGithub />
      </a>

      <a
        href={personal.linkedin}
        target="_blank"
        rel="noreferrer"
       className="w-14 h-14 rounded-full border border-slate-700 flex items-center justify-center bg-slate-900/40 backdrop-blur-md hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:scale-110"
      >
        <FaLinkedin />
      </a>

      <a
        href={`mailto:${personal.email}`}
        className="w-14 h-14 rounded-full border border-slate-700 flex items-center justify-center bg-slate-900/40 backdrop-blur-md hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:scale-110"
      >
        <FaEnvelope />
      </a>

    </div>
  );
}