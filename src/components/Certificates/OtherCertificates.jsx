import { useEffect, useState } from "react";

import {
  FiExternalLink,
  FiFileText,
  FiLoader,
} from "react-icons/fi";

import { getCertificates } from "../../firebase/firestore";
import { getCertificateFileURL } from "../../firebase/storage";

export default function OtherCertificates() {
  const [certificates, setCertificates] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // LOAD OTHER CERTIFICATES
  // ======================================================

  useEffect(() => {
    let mounted = true;

    async function loadCertificates() {
      try {
        setLoading(true);

        const data =
          await getCertificates();

        if (!mounted) {
          return;
        }

        const other =
          data
            .filter(
              (certificate) =>
                certificate.type === "other" ||
                certificate.type === "Other"
            )
            .sort(
              (a, b) =>
                Number(a.order || 1) -
                Number(b.order || 1)
            );

        setCertificates(other);

      } catch (error) {

        console.error(
          "Error loading other certificates:",
          error
        );

      } finally {

        if (mounted) {
          setLoading(false);
        }

      }
    }

    loadCertificates();

    return () => {
      mounted = false;
    };
  }, []);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="mt-12 sm:mt-14 lg:mt-16 py-6">
        <p className="flex items-center gap-2 text-sm text-gray-500">
          <FiLoader
            size={15}
            className="animate-spin"
          />
          Loading other certifications...
        </p>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="mt-12 sm:mt-14 lg:mt-16">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[3px] sm:tracking-[4px] text-blue-400">
          Additional
        </p>

        <h3 className="mt-2 text-xl sm:text-2xl font-bold text-white">
          Other Certifications
        </h3>

        <div className="mt-3 h-1 w-14 rounded-full bg-blue-500" />
      </div>

      {/* EMPTY */}
      {certificates.length === 0 ? (
        <div
          className="
            rounded-xl
            border
            border-slate-800
            bg-slate-900/60
            p-5
          "
        >
          <p className="text-sm text-gray-500">
            No other certifications available.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {certificates.map(
            (certificate) => (
              <OtherCertificateCard
                key={certificate.id}
                certificate={certificate}
              />
            )
          )}
        </div>
      )}

    </div>
  );
}

// ======================================================
// OTHER CERTIFICATE CARD (text-only, lightweight list style)
// ======================================================

function OtherCertificateCard({
  certificate,
}) {
  const [fileUrl, setFileUrl] =
    useState(null);

  const [loadingFile, setLoadingFile] =
    useState(true);

  // ======================================================
  // RESOLVE FILE
  // ======================================================

  useEffect(() => {
    let mounted = true;

    async function resolveFile() {
      try {
        setLoadingFile(true);

        if (certificate?.fileUrl) {
          if (mounted) {
            setFileUrl(
              certificate.fileUrl
            );
          }
          return;
        }

        if (certificate?.storagePath) {
          const url =
            await getCertificateFileURL(
              certificate.storagePath
            );

          if (mounted) {
            setFileUrl(url);
          }
          return;
        }

        if (certificate?.pdf) {
          if (mounted) {
            setFileUrl(
              certificate.pdf
            );
          }
          return;
        }

        if (mounted) {
          setFileUrl(null);
        }

      } catch (error) {

        console.error(
          "Error resolving certificate file:",
          error
        );

        if (mounted) {
          setFileUrl(null);
        }

      } finally {

        if (mounted) {
          setLoadingFile(false);
        }

      }
    }

    resolveFile();

    return () => {
      mounted = false;
    };
  }, [
    certificate?.fileUrl,
    certificate?.storagePath,
    certificate?.pdf,
  ]);

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      className="
        group
        flex
        h-full
        flex-col
        justify-between
        gap-2.5
        rounded-xl
        border
        border-slate-800
        bg-slate-900/60
        p-4
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/60
        hover:shadow-[0_10px_30px_rgba(37,99,235,0.10)]
      "
    >
      <div className="flex items-start justify-between gap-3">
        {certificate.company ? (
          <span
            className="
              inline-flex
              w-fit
              rounded-full
              bg-blue-500/10
              px-2.5
              py-1
              text-xs
              font-medium
              text-blue-400
            "
          >
            {certificate.company}
          </span>
        ) : (
          <span />
        )}

        {certificate?.year && (
          <span className="shrink-0 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-400">
            {certificate.year}
          </span>
        )}
      </div>

      <h4 className="line-clamp-2 text-base font-semibold leading-snug text-white">
        {certificate.title}
      </h4>

      {/* Plain text link */}
      <div className="mt-0.5 border-t border-slate-800/60 pt-2.5">
      {loadingFile ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
          <FiLoader size={13} className="animate-spin" />
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
            text-sm
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
          <FiExternalLink size={13} />
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
          <FiFileText size={13} />
          Certificate unavailable
        </span>
      )}
      </div>
    </div>
  );
}