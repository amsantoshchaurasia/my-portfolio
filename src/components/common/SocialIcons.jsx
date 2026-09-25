import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

// Base classes shared by every icon button (styling only)
const iconBaseClass = `
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
`;

const blueHover = "hover:border-blue-500 hover:bg-blue-600 hover:text-white";
const pinkHover = "hover:border-pink-500 hover:bg-pink-500 hover:text-white";

/**
 * SocialIcons
 * Renders social links from the given data (Firestore hero data).
 * Any link that is empty/undefined is simply not rendered —
 * no dead/broken icons.
 *
 * Usage: <SocialIcons data={heroData} />
 */
export default function SocialIcons({ data = {} }) {
  const { github, linkedin, email, instagram, facebook } = data;

  return (
    <div className="flex items-center gap-2 sm:gap-4 lg:gap-3 text-base sm:text-xl lg:text-lg">

      {/* GitHub */}
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className={`${iconBaseClass} ${blueHover}`}
        >
          <FaGithub />
        </a>
      )}

      {/* LinkedIn */}
      {linkedin && (
        <a
          href={linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className={`${iconBaseClass} ${blueHover}`}
        >
          <FaLinkedin />
        </a>
      )}

      {/* Email */}
      {email && (
        <a
          href={`mailto:${email}`}
          aria-label="Email"
          className={`${iconBaseClass} ${blueHover}`}
        >
          <FaEnvelope />
        </a>
      )}

      {/* Instagram */}
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className={`${iconBaseClass} ${pinkHover}`}
        >
          <FaInstagram />
        </a>
      )}

      {/* Facebook */}
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
          className={`${iconBaseClass} ${blueHover}`}
        >
          <FaFacebook />
        </a>
      )}

    </div>
  );
}