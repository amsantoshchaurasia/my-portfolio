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
      <div className="mt-16 py-6">
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
    <div className="mt-16">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[4px] text-blue-400">
          Additional
        </p>

        <h3 className="mt-2 text-2xl font-bold text-white">
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
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
// OTHER CERTIFICATE CARD
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
        rounded-xl
        border
        border-slate-800
        bg-slate-900/60
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-500/60
        hover:shadow-[0_10px_30px_rgba(37,99,235,0.10)]
      "
    >
      <div>
        <div
          className="
            flex
            items-start
            justify-between
            gap-3
          "
        >
          <h4
            className="
              text-base
              font-semibold
              leading-snug
              text-white
              transition-colors
              group-hover:text-blue-400
            "
          >
            {certificate.title}
          </h4>

          {certificate.year && (
            <span
              className="
                shrink-0
                rounded-full
                bg-blue-500/10
                px-2
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

        {certificate.company && (
          <p
            className="
              mt-2
              text-xs
              font-medium
              text-blue-400
            "
          >
            {certificate.company}
          </p>
        )}

        {certificate.description && (
          <p
            className="
              mt-3
              text-sm
              leading-6
              text-gray-500
            "
          >
            {certificate.description}
          </p>
        )}
      </div>

      <div
        className="
          mt-5
          border-t
          border-slate-800/60
          pt-4
        "
      >
        {loadingFile ? (
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
              py-2.5
              text-sm
              text-gray-400
            "
          >
            <FiLoader
              size={15}
              className="animate-spin"
            />
            Loading...
          </div>
        ) : fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-blue-500
            "
          >
            <FiExternalLink
              size={15}
            />
            View Certificate
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
              py-2.5
              text-sm
              text-gray-500
            "
          >
            <FiFileText
              size={15}
            />
            Certificate unavailable
          </div>
        )}
      </div>
    </div>
  );
}