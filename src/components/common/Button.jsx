import { motion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi";

export default function Button({
  children,
  variant = "primary",
  icon = false,
  className = "",
  ...props
}) {
  const primary =
    "bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white shadow-[0_10px_35px_rgba(37,99,235,.35)] hover:shadow-[0_15px_45px_rgba(37,99,235,.55)]";

  const outline =
    "border-2 border-blue-400 bg-white/10 backdrop-blur-md text-white hover:bg-blue-500 hover:border-blue-500 hover:shadow-[0_12px_35px_rgba(37,99,235,.35)]";

  return (
    <motion.button
      whileHover={{
        y: -4,
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.96,
      }}
      transition={{
        duration: 0.25,
      }}
      {...props}
      className={`
        group
        cursor-pointer
        inline-flex
        items-center
        justify-center
        gap-2

        rounded-xl
        sm:rounded-2xl

        font-semibold

        transition-all
        duration-300

        ${
          variant === "outline"
            ? outline
            : primary
        }

        ${className}
      `}
    >
      <span>{children}</span>

      {icon && (
        <HiArrowRight
          className="
            text-[1.15em]
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />
      )}
    </motion.button>
  );
}