import { useEffect, useState } from "react";
import { FiExternalLink, FiFileText, FiLoader, FiStar } from "react-icons/fi";

import { getCertificateFileURL } from "../../firebase/storage";

const MAX_VISIBLE_TAGS = 3;

// "Power BI" and "PowerBI" should count as the same tag
const clean = (value) => String(value).toLowerCase().replace(/[\s\-_.]/g, "");

export default function CertificateCard({
  certificate,
  tags = [],
  featured = false,
  activeTag = "",
}) {
  const [fileUrl, setFileUrl] = useState(null);
  const [loadingFile, setLoadingFile] = useState(true);

  // ======================================================
  // RESOLVE FILE (fileUrl -> storagePath -> pdf)
  // ======================================================

  useEffect(() => {
    let mounted = true;

    async function resolveFile() {
      try {
        setLoadingFile(true);

        if (certificate?.fileUrl) {
          if (mounted) setFileUrl(certificate.fileUrl);
          return;
        }

        if (certificate?.storagePath) {
          const url = await getCertificateFileURL(certificate.storagePath);
          if (mounted) setFileUrl(url);
          return;
        }

        if (certificate?.pdf) {
          if (mounted) setFileUrl(certificate.pdf);
          return;
        }

        if (mounted) setFileUrl(null);
      } catch (error) {
        console.error("Error resolving certificate file:", error);
        if (mounted) setFileUrl(null);
      } finally {
        if (mounted) setLoadingFile(false);
      }
    }

    resolveFile();

    return () => {
      mounted = false;
    };
  }, [certificate?.fileUrl, certificate?.storagePath, certificate?.pdf]);

  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const extraTags = tags.length - visibleTags.length;

  // ======================================================
  // UI
  // Size 1 (375x667) = base classes -> LOCKED, not changed.
  // Size 2 (640x900)  = sm: classes  -> same look as size 1,
  // font / font size / gap scaled from Experience.
  // ======================================================

  return (
    <div
      className={`
        group
        flex
        h-full
        w-full
        flex-col
        gap-3
        sm:gap-2.5
        md:gap-3
        rounded-xl
        sm:rounded-2xl
        border
        bg-slate-900/60
        p-4
        sm:px-5
        sm:py-4
        md:px-6
        md:py-5
        lg:px-5
        xl:px-6
        xl:py-6
        2xl:px-7
        2xl:py-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/60
        hover:shadow-[0_10px_30px_rgba(37,99,235,0.10)]
        ${featured ? "border-blue-500/40" : "border-slate-800"}
      `}
    >
      {/* Company + Year */}
      <div className="flex items-center justify-between gap-3">
        {certificate?.company ? (
          <span className="inline-flex w-fit rounded-full bg-blue-500/10 px-2.5 sm:px-3 md:px-3.5 py-1 text-xs md:text-sm 2xl:text-[15px] font-medium text-blue-400 sm:border sm:border-blue-500/20">
            {certificate.company}
          </span>
        ) : (
          <span />
        )}

        <div className="flex shrink-0 items-center gap-2 text-xs md:text-sm 2xl:text-[15px] font-medium text-gray-400">
          {featured && (
            <FiStar
              size={13}
              title="Featured"
              className="md:h-4 md:w-4 fill-amber-400/20 text-amber-400"
            />
          )}
          {certificate?.year}
        </div>
      </div>

      {/* Title + Skills */}
      <div className="flex flex-1 flex-col gap-2.5 md:gap-3">
        <h4
          title={certificate?.title}
          className="line-clamp-2 sm:line-clamp-1 text-base md:text-lg lg:text-base xl:text-xl 2xl:text-[22px] font-semibold sm:font-bold sm:tracking-tight leading-snug text-white">
          {certificate?.title}
        </h4>

        {visibleTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((tag) => {
              const isActive =
                activeTag && clean(tag) === clean(activeTag);
              return (
                <span
                  key={tag}
                  className={`rounded-md border px-2 py-0.5 text-[11px] sm:text-xs font-medium ${
                    isActive
                      ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                      : "border-slate-700/70 bg-slate-800/50 text-gray-400"
                  }`}
                >
                  {tag}
                </span>
              );
            })}

            {extraTags > 0 && (
              <span className="rounded-md border border-slate-700/70 bg-slate-800/50 px-2 py-0.5 text-[11px] sm:text-xs font-medium text-gray-500">
                +{extraTags}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Link */}
      <div className="border-t border-slate-800/60 sm:border-slate-700/60 pt-2.5 sm:pt-3 md:pt-4">
        {loadingFile ? (
          <span className="inline-flex items-center gap-1.5 text-sm md:text-base 2xl:text-[17px] text-gray-500">
            <FiLoader size={13} className="sm:h-4 sm:w-4 animate-spin" />
            Loading...
          </span>
        ) : fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              w-fit
              items-center
              gap-1.5
              md:gap-2
              text-sm
              md:text-base
              2xl:text-[17px]
              font-medium
              text-blue-400
              underline-offset-4
              transition-colors
              duration-200
              hover:text-blue-300
              hover:underline
            "
          >
            View Certificate
            <FiExternalLink
              size={13}
              className="sm:h-4 sm:w-4 transition-transform duration-200 sm:group-hover:translate-x-0.5 sm:group-hover:-translate-y-0.5"
            />
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm md:text-base 2xl:text-[17px] text-gray-500">
            <FiFileText size={13} className="sm:h-4 sm:w-4" />
            Certificate unavailable
          </span>
        )}
      </div>
    </div>
  );
}