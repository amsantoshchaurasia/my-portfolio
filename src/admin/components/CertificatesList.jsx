import { useEffect, useState } from "react";

import {
  getCertificates,
  deleteCertificate,
} from "../../firebase/firestore";

import {
  deleteCertificateFile,
} from "../../firebase/storage";

// ======================================================
// COMPONENT
// ======================================================

export default function CertificatesList({
  refresh,
  onEditCertificate,
}) {
  const [certificates, setCertificates] = useState([]);

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // ======================================================
  // LOAD CERTIFICATES
  // ======================================================

  async function loadCertificates() {
    try {
      setLoading(true);
      setError("");

      const data = await getCertificates();

      console.log(
        "Certificates loaded from Firestore:",
        data
      );

      setCertificates(data);
    } catch (error) {
      console.error(
        "Error loading certificates:",
        error
      );

      setError(
        "Unable to load certificates. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // INITIAL LOAD / REFRESH
  // ======================================================

  useEffect(() => {
    loadCertificates();
  }, [refresh]);

  // ======================================================
  // DELETE CERTIFICATE
  // ======================================================

  async function handleDelete(certificate) {
    if (!certificate?.id) {
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${certificate.title}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(certificate.id);
      setError("");

      // ==================================================
      // DELETE FIRESTORE DOCUMENT FIRST
      // ==================================================

      await deleteCertificate(certificate.id);

      // ==================================================
      // DELETE STORAGE PDF
      // ==================================================

      if (certificate.storagePath) {
        try {
          await deleteCertificateFile(
            certificate.storagePath
          );
        } catch (storageError) {
          console.warn(
            "Certificate deleted from Firestore, but PDF could not be deleted from Storage:",
            storageError
          );
        }
      }

      // ==================================================
      // REMOVE FROM LOCAL STATE
      // ==================================================

      setCertificates((prev) =>
        prev.filter(
          (item) =>
            item.id !== certificate.id
        )
      );

      alert(
        "Certificate deleted successfully."
      );
    } catch (error) {
      console.error(
        "Error deleting certificate:",
        error
      );

      setError(
        error?.message ||
          "Failed to delete certificate."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="mt-10">
        <div
          className="
            rounded-3xl
            border
            border-slate-700
            bg-[#111827]
            p-7
          "
        >
          <div className="animate-pulse">
            <div className="h-4 w-40 rounded bg-slate-700" />

            <div className="mt-4 h-8 w-64 rounded bg-slate-700" />

            <div className="mt-3 h-4 w-80 rounded bg-slate-800" />
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="mt-10">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6">

        <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
          Portfolio
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>
            <h3 className="text-3xl font-black text-white">
              Existing Certificates
            </h3>

            <p className="mt-2 text-gray-400">
              Manage certificates currently displayed
              on your portfolio.
            </p>
          </div>

          {/* COUNT */}

          <div
            className="
              w-fit
              rounded-full
              border
              border-blue-500/20
              bg-blue-500/10
              px-4
              py-2
              text-sm
              font-semibold
              text-blue-400
            "
          >
            {certificates.length}{" "}
            {certificates.length === 1
              ? "Certificate"
              : "Certificates"}
          </div>

        </div>
      </div>

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div
          className="
            mb-6
            rounded-xl
            border
            border-red-500/30
            bg-red-500/10
            px-4
            py-3
            text-sm
            text-red-400
          "
        >
          {error}
        </div>
      )}

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {certificates.length === 0 ? (

        <div
          className="
            rounded-3xl
            border
            border-slate-700
            bg-[#111827]
            p-8
            text-center
          "
        >

          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-blue-500/10
              text-2xl
            "
          >
            📜
          </div>

          <h4 className="mt-5 text-xl font-bold text-white">
            No certificates found
          </h4>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Add your first certificate using the
            upload form above. The certificate PDF
            will automatically be stored in Firebase
            Storage.
          </p>

        </div>

      ) : (

        /* ==================================================
           CERTIFICATE LIST
        ================================================== */

        <div className="grid gap-5">

          {certificates.map(
            (certificate) => {

              const isDeleting =
                deletingId === certificate.id;

              const certificateUrl =
                certificate?.fileUrl ||
                certificate?.pdf ||
                null;

              return (
                <div
                  key={certificate.id}
                  className="
                    rounded-2xl
                    border
                    border-slate-700
                    bg-[#111827]
                    p-6
                    transition-all
                    duration-300
                    hover:border-blue-500/50
                    hover:shadow-lg
                    hover:shadow-blue-500/5
                  "
                >

                  {/* ==================================================
                      MAIN CONTENT
                  ================================================== */}

                  <div
                    className="
                      flex
                      flex-col
                      justify-between
                      gap-6
                      md:flex-row
                    "
                  >

                    {/* ==================================================
                        INFORMATION
                    ================================================== */}

                    <div className="min-w-0 flex-1">

                      {/* TITLE / YEAR / TYPE */}

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="text-xl font-bold text-white">
                          {certificate.title}
                        </h4>

                        {/* YEAR */}

                        {certificate.year && (
                          <span
                            className="
                              rounded-full
                              bg-blue-500/10
                              px-3
                              py-1
                              text-sm
                              font-medium
                              text-blue-400
                            "
                          >
                            {certificate.year}
                          </span>
                        )}

                        {/* TYPE */}

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${
                            certificate.type ===
                            "other"
                              ? "bg-purple-500/10 text-purple-400"
                              : "bg-green-500/10 text-green-400"
                          }`}
                        >
                          {certificate.type ===
                          "other"
                            ? "Other"
                            : "Featured"}
                        </span>

                      </div>

                      {/* COMPANY */}

                      {certificate.company && (
                        <p className="mt-2 text-sm font-medium text-blue-400">
                          {certificate.company}
                        </p>
                      )}

                      {/* DESCRIPTION */}

                      {certificate.description && (
                        <p className="mt-3 max-w-3xl leading-7 text-gray-400">
                          {certificate.description}
                        </p>
                      )}

                      {/* ==================================================
                          PDF INFORMATION
                      ================================================== */}

                      <div className="mt-5">

                        {certificate.fileName ? (
                          <div
                            className="
                              inline-flex
                              max-w-full
                              items-center
                              gap-2
                              rounded-xl
                              border
                              border-slate-700
                              bg-slate-950/60
                              px-4
                              py-2.5
                            "
                          >
                            <span className="text-red-400">
                              PDF
                            </span>

                            <span className="max-w-[280px] truncate text-sm text-gray-400">
                              {certificate.fileName}
                            </span>
                          </div>
                        ) : certificate.pdf ? (
                          <div
                            className="
                              inline-flex
                              items-center
                              gap-2
                              rounded-xl
                              border
                              border-yellow-500/20
                              bg-yellow-500/5
                              px-4
                              py-2.5
                            "
                          >
                            <span className="text-sm text-yellow-400">
                              Legacy PDF
                            </span>
                          </div>
                        ) : (
                          <div
                            className="
                              inline-flex
                              items-center
                              rounded-xl
                              border
                              border-red-500/20
                              bg-red-500/5
                              px-4
                              py-2.5
                              text-sm
                              text-red-400
                            "
                          >
                            PDF unavailable
                          </div>
                        )}

                      </div>

                    </div>

                    {/* ==================================================
                        ORDER
                    ================================================== */}

                    <div className="shrink-0">

                      <span className="text-sm text-gray-500">
                        Order:{" "}
                        {certificate.order || 1}
                      </span>

                    </div>

                  </div>

                  {/* ==================================================
                      ACTIONS
                  ================================================== */}

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-800 pt-5">

                    {/* VIEW */}

                    {certificateUrl && (
                      <a
                        href={certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          rounded-xl
                          bg-blue-600
                          px-5
                          py-2.5
                          font-semibold
                          text-white
                          transition
                          hover:bg-blue-700
                        "
                      >
                        View Certificate
                      </a>
                    )}

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        onEditCertificate?.(
                          certificate
                        )
                      }
                      disabled={isDeleting}
                      className="
                        rounded-xl
                        border
                        border-blue-500/40
                        px-5
                        py-2.5
                        font-semibold
                        text-blue-400
                        transition
                        hover:bg-blue-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          certificate
                        )
                      }
                      disabled={isDeleting}
                      className="
                        rounded-xl
                        border
                        border-red-500/40
                        px-5
                        py-2.5
                        font-semibold
                        text-red-400
                        transition
                        hover:bg-red-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isDeleting
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>

      )}

    </div>
  );
}