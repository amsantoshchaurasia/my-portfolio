import { motion } from "framer-motion";
import {
  FiExternalLink,
  FiFileText,
} from "react-icons/fi";

export default function CertificateCard({
  certificate,
}) {
  // ======================================================
  // CERTIFICATE URL
  // ======================================================

  const certificateUrl =
    certificate?.fileUrl ||
    certificate?.pdf ||
    null;

  return (
    <motion.div
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.3,
      }}
      className="
        group
        relative
        flex
        h-full
        w-full
        flex-col
        justify-between
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/80
        p-6
        transition-all
        duration-300
        hover:border-blue-500/60
        hover:shadow-[0_10px_30px_rgba(37,99,235,0.15)]
      "
    >
      {/* GLOW */}

      <div
        className="
          absolute
          -right-20
          -top-20
          h-40
          w-40
          rounded-full
          bg-blue-500/10
          opacity-0
          blur-2xl
          transition-all
          duration-500
          group-hover:opacity-100
        "
      />

      {/* CONTENT */}

      <div className="relative z-10">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <span
            className="
              flex
              items-center
              gap-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[3px]
              text-gray-500
            "
          >
            <FiFileText
              size={14}
              className="text-blue-400"
            />

            Certificate
          </span>

          {certificate?.year && (
            <span
              className="
                rounded-full
                border
                border-blue-500/20
                bg-blue-500/10
                px-3
                py-1
                text-xs
                font-semibold
                text-blue-400
              "
            >
              {certificate.year}
            </span>
          )}

        </div>

        {/* TITLE */}

        <h3
          className="
            mt-5
            text-xl
            font-bold
            leading-snug
            text-white
            transition-colors
            duration-300
            group-hover:text-blue-400
          "
        >
          {certificate?.title}
        </h3>

        {/* COMPANY */}

        {certificate?.company && (
          <span
            className="
              mt-3
              inline-block
              rounded-full
              border
              border-blue-500/20
              bg-blue-500/10
              px-3
              py-1
              text-xs
              font-medium
              text-blue-400
            "
          >
            {certificate.company}
          </span>
        )}

        {/* DESCRIPTION */}

        {certificate?.description && (
          <p
            className="
              mt-4
              text-sm
              leading-relaxed
              text-gray-400
            "
          >
            {certificate.description}
          </p>
        )}

      </div>

      {/* BUTTON */}

      <div
        className="
          relative
          z-10
          mt-6
          border-t
          border-slate-800/60
          pt-4
        "
      >

        {certificateUrl ? (

          <a
            href={certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-blue-500/25
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:from-blue-500
              hover:to-cyan-400
            "
          >
            <span>
              View Certificate
            </span>

            <FiExternalLink
              size={16}
              className="shrink-0"
            />
          </a>

        ) : (

          <div
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-800
              px-4
              py-3
              text-sm
              text-gray-500
            "
          >
            <FiFileText size={16} />

            Certificate unavailable
          </div>

        )}

      </div>

    </motion.div>
  );
}