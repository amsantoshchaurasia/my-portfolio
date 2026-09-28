import { useEffect, useState } from "react";
import { FiExternalLink, FiFileText, FiLoader, FiStar } from "react-icons/fi";

import { getCertificateFileURL } from "../../firebase/storage";
import {
  getCertificateCategoryLabel,
  getCertificateCategoryBadgeClasses,
  getTechColor,
} from "./certificateTypeUtils";
import { formatIssueDate } from "../../utils/formatIssueDate";

export default function CertificateCard({
  certificate,
  domains = [],
  tech = [],
  showStar = false,
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

  const company = certificate?.company || "";
  const issueDate = formatIssueDate(certificate);

  // ======================================================
  // UI
  //
  //  ┃ BCG Data Science Job Simulation                    [↗]
  //  ┃ Forage · [Virtual Internship] · [Data Science]  Sep 2026
  //  ┃ [Python] [SQL] [Power BI] [Excel] [Tableau]
  //
  //  Line 1  title (one line) + open-certificate button
  //  Line 2  platform · type · all domains ....... date (right)
  //  Line 3  all tech chips (wrap to a new row only if the card is narrow)
  //
  //  Every card has the same minimum height, so the grid stays tidy.
  // ======================================================

  return (
    <div
      className="
        group
        relative
        flex
        min-h-[112px]
        w-full
        sm:w-[calc(50%_-_0.5rem)]
        lg:w-[calc(33.333%_-_0.667rem)]
        flex-col
        justify-between
        gap-2.5
        rounded-xl
        border
        border-slate-800
        bg-slate-900/60
        py-3.5
        pl-5
        pr-3.5
        transition-colors
        duration-200
        hover:border-slate-600
      "
    >
      {/* Accent line */}
      <span
        aria-hidden="true"
        className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-blue-500 to-indigo-500/60"
      />

      {/* LINE 1 — title + open button */}
      <div className="flex items-start justify-between gap-3">
        <h3
          title={certificate?.title}
          className="min-w-0 flex-1 truncate pt-1 text-[15px] font-semibold leading-tight text-white"
        >
          {showStar && certificate?.featured && (
            <FiStar
              size={13}
              aria-label="Featured"
              className="mr-1.5 inline-block -translate-y-px fill-amber-400 text-amber-400"
            />
          )}
          {certificate?.title}
        </h3>

        <div className="shrink-0">
          {loadingFile ? (
            <span className="flex h-8 w-8 items-center justify-center text-gray-500">
              <FiLoader size={14} className="animate-spin" />
            </span>
          ) : fileUrl ? (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View certificate"
              aria-label={`View certificate: ${certificate?.title || ""}`}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/40
                text-gray-300 transition hover:border-blue-500/60 hover:bg-blue-500/10 hover:text-blue-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
            >
              <FiExternalLink size={14} />
            </a>
          ) : (
            <span
              title="Certificate unavailable"
              className="flex h-8 w-8 items-center justify-center text-gray-600"
            >
              <FiFileText size={14} />
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {/* LINE 2 — platform · type · domains ........ date */}
        <div className="flex items-center gap-2 text-xs">
          {company && (
            <span
              className="min-w-0 max-w-[34%] truncate font-medium text-gray-300"
              title={company}
            >
              {company}
            </span>
          )}

          <span
            className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${getCertificateCategoryBadgeClasses(
              certificate?.category
            )}`}
          >
            {getCertificateCategoryLabel(certificate?.category)}
          </span>

          {domains.map((domain) => (
            <span
              key={domain}
              title={domain}
              className={`min-w-0 truncate rounded-md border bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold ${getTechColor(
                domain
              )}`}
            >
              {domain}
            </span>
          ))}

          {issueDate && (
            <span className="ml-auto shrink-0 pl-1 tabular-nums text-gray-500">
              {issueDate}
            </span>
          )}
        </div>

        {/* LINE 3 — all tech chips (space is reserved even when there are none) */}
        <div className="flex min-h-[22px] flex-wrap items-center gap-1.5">
          {tech.map((item) => (
            <span
              key={item}
              title={item}
              className="max-w-[140px] truncate rounded-md border border-slate-700/70 bg-slate-800/50
                px-2 py-0.5 text-[11px] font-medium text-gray-300"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}