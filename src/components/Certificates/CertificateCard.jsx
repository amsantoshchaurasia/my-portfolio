import { useEffect, useState } from "react";
import { FiExternalLink, FiFileText, FiLoader, FiStar } from "react-icons/fi";

import { getCertificateFileURL } from "../../firebase/storage";
import {
  getCertificateTypeLabel,
  getCertificateTypeBadgeClasses,
} from "../../utils/colors/typeColors";
import { getTechColor } from "../../utils/colors/techColors";
import { getPlatformColor } from "../../utils/colors/platformColors";
import { formatIssueDate } from "../../utils/formatIssueDate";

const pillClasses =
  "rounded-full border bg-slate-800/60 px-2.5 py-1 sm:px-3 text-xs font-medium";

export default function CertificateCard({
  certificate,
  tech,
  showStar = false,
  // `domains` is no longer used here (domain is only for filtering).
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

  // ======================================================
  // DERIVED
  // ======================================================

  const platform = certificate?.company || "";
  const issueDate = formatIssueDate(certificate);
  const allTech = Array.isArray(tech) ? tech : certificate?.tech || [];

  // ======================================================
  // UI — same container, header and title style as ProjectCard
  //
  //  CERTIFICATE [Virtual Internship]              [Sep 2026]
  //  Title
  //  (Python) (SQL) (Power BI) (Excel)        <- every tool, never hidden
  //  ────────────────────────────────────
  //  (Forage)               View Certificate ↗
  //
  //  Header rule: when the label + category badge + date fit on one
  //  line (most cards) nothing changes. When a long category badge
  //  (e.g. "Professional Certification") does not fit, the header wraps
  //  onto a second line instead of overlapping the date.
  // ======================================================

  return (
    <div
      className="
        w-full
        sm:w-[calc(50%_-_0.5rem)]
        lg:w-[calc(33.333%_-_0.667rem)]

        rounded-2xl
        sm:rounded-3xl
        bg-[#111827]
        border
        border-slate-700
        p-4
        sm:p-5
        md:p-6

        flex
        flex-col

        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-blue-500
        hover:shadow-[0_0_35px_rgba(37,99,235,.25)]
      "
    >
      <div className="flex flex-col h-full">
        {/* Header */}

        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-2.5">
            {showStar && certificate?.featured && (
              <FiStar
                size={13}
                aria-label="Featured"
                className="shrink-0 fill-amber-400 text-amber-400"
              />
            )}

            {/* Hidden below 768px and at 1024-1535px (narrow 3-column cards); shown at 768-1023px and 1536px+ */}
            <span className="hidden md:max-lg:inline 2xl:inline uppercase tracking-[4px] text-xs text-gray-500">
              Certificate
            </span>

            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-medium ${getCertificateTypeBadgeClasses(
                certificate?.category
              )}`}
            >
              {getCertificateTypeLabel(certificate?.category)}
            </span>
          </div>

          {issueDate && (
            <span className="ml-auto shrink-0 bg-blue-600/20 text-blue-400 text-xs md:max-lg:text-sm xl:text-sm px-2.5 md:max-lg:px-3 xl:px-3 py-0.5 sm:py-1 rounded-full">
              {issueDate}
            </span>
          )}
        </div>

        {/* Title */}

        <h3
          title={certificate?.title}
          className="
            mt-3
            sm:mt-4
            md:mt-5
            lg:mt-3
            xl:mt-5
            text-lg
            sm:text-xl
            md:text-2xl
            lg:text-xl
            xl:text-xl
            font-bold
            leading-tight
            line-clamp-2
          "
        >
          {certificate?.title}
        </h3>

        {/* Flexible spacer — keeps the tech row + footer pinned to the
            bottom so every card in a row lines up */}
        <div className="flex-1" />

        {/* Tech pills — all of them are shown */}

        {allTech.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-5">
            {allTech.map((item) => (
              <span
                key={item}
                title={item}
                className={`${pillClasses} max-w-[160px] truncate ${getTechColor(item)}`}
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Footer — platform (left) + link (right) */}

        <div className="mt-4 sm:mt-5 flex items-center justify-between gap-3 border-t border-slate-700/70 pt-3 sm:pt-4">
          <div className="min-w-0">
            {platform && (
              <span
                title={platform}
                className={`${pillClasses} block max-w-full truncate ${getPlatformColor(
                  platform
                )}`}
              >
                {platform}
              </span>
            )}
          </div>

          <div className="shrink-0">
            {loadingFile ? (
              <span className="inline-flex items-center gap-2 text-sm text-gray-500">
                <FiLoader size={14} className="animate-spin" />
                Loading...
              </span>
            ) : fileUrl ? (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View certificate: ${certificate?.title || ""}`}
                className="group inline-flex items-center gap-1.5 rounded text-sm font-semibold text-blue-400
                  underline underline-offset-4 decoration-blue-400/40 transition-colors
                  hover:text-cyan-300 hover:decoration-cyan-300
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
              >
                <span>View Certificate</span>
                <FiExternalLink
                  size={14}
                  className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                <FiFileText size={14} />
                Unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}