import { useEffect, useState } from "react";
import { FiExternalLink, FiFileText, FiLoader } from "react-icons/fi";

import { getCertificateFileURL } from "../../firebase/storage";
import {
  getCertificateCategoryLabel,
  getCertificateCategoryBadgeClasses,
  getPlatformColor,
  getTechColor,
} from "./certificateTypeUtils";

// Total badges shown in the bottom row before collapsing into "+N"
// (platform + tech tags combined, in admin's order — so the first
// tech tag admin picked is treated as the "main" tech).
const MAX_VISIBLE_BADGES = 3;

export default function CertificateCard({ certificate, tags = [] }) {
  const [fileUrl, setFileUrl] = useState(null);
  const [loadingFile, setLoadingFile] = useState(true);
  const [showAllBadges, setShowAllBadges] = useState(false);

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
  // BADGES — platform first (if present), then tech tags in
  // the order admin added them. Combined list is what gets
  // truncated to MAX_VISIBLE_BADGES.
  // ======================================================

  const allBadges = [
    ...(certificate?.company
      ? [{ key: "platform", label: certificate.company, className: getPlatformColor(certificate.company) }]
      : []),
    ...tags.map((tag) => ({ key: `tag-${tag}`, label: tag, className: getTechColor(tag) })),
  ];

  const visibleBadges = showAllBadges ? allBadges : allBadges.slice(0, MAX_VISIBLE_BADGES);
  const hiddenCount = allBadges.length - MAX_VISIBLE_BADGES;

  // ======================================================
  // UI — header row matches ProjectCard exactly:
  // "CERTIFICATE" label + type badge (left) / year (right).
  // Title below. Platform + tech badges share ONE row below
  // the title while collapsed — capped at 3 with "+N", each
  // badge label truncates so nothing is ever half-cut and
  // "+N" always stays on the same line. Clicking "+N" switches
  // the row to wrap mode, showing every badge (full text) on
  // as many rows as needed, with a "Show less" to collapse back.
  // ======================================================

  return (
    <div
      className="
        group
        flex
        h-full
        w-full
        flex-col
        rounded-xl
        sm:rounded-2xl
        border
        border-slate-800
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
      "
    >

      {/* Header — label + type badge (left), year (right) */}
      <div className="flex items-center justify-between gap-2">

        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <span className="uppercase tracking-[2px] sm:tracking-[4px] text-[10px] sm:text-xs text-gray-500">
            Certificate
          </span>

          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-medium ${getCertificateCategoryBadgeClasses(
              certificate?.category
            )}`}
          >
            {getCertificateCategoryLabel(certificate?.category)}
          </span>
        </div>

        <span className="shrink-0 bg-blue-600/20 text-blue-400 text-xs sm:text-sm px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
          {certificate?.year}
        </span>

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
          line-clamp-2
          text-lg
          sm:text-xl
          md:text-2xl
          lg:text-xl
          xl:text-2xl
          font-bold
          leading-tight
        "
      >
        {certificate?.title}
      </h3>

      {/* Flexible spacer — pins the badges + link together at the
          bottom, same idea as ProjectCard's spacer */}
      <div className="flex-1" />

      {/* Platform + tech badges */}
      <div
        className={`mt-4 sm:mt-5 flex items-center gap-2 sm:gap-2.5 ${
          showAllBadges ? "flex-wrap" : "flex-nowrap"
        }`}
      >

        {visibleBadges.map((badge) => (
          <span
            key={badge.key}
            title={badge.label}
            className={`shrink-0 rounded-full border bg-slate-800/60 px-2.5 py-1 text-xs sm:text-sm font-medium ${
              badge.className
            } ${showAllBadges ? "" : "max-w-[92px] sm:max-w-[110px] md:max-w-[130px] truncate"}`}
          >
            {badge.label}
          </span>
        ))}

        {!showAllBadges && hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAllBadges(true)}
            className="shrink-0 rounded-full border border-slate-700/70 bg-slate-800/60 px-2.5 py-1 text-xs sm:text-sm font-medium text-gray-400 transition hover:border-slate-600 hover:text-white"
          >
            +{hiddenCount}
          </button>
        )}

        {showAllBadges && allBadges.length > MAX_VISIBLE_BADGES && (
          <button
            type="button"
            onClick={() => setShowAllBadges(false)}
            className="shrink-0 rounded-full border border-slate-700/70 bg-slate-800/60 px-2.5 py-1 text-xs sm:text-sm font-medium text-gray-400 transition hover:border-slate-600 hover:text-white"
          >
            Show less
          </button>
        )}

      </div>

      {/* Link */}
      <div className="pt-4 sm:pt-5">
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