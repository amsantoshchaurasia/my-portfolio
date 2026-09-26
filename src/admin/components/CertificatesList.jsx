import { useEffect, useState } from "react";

import { getCertificates, deleteCertificate } from "../../firebase/firestore";
import { deleteCertificateFile } from "../../firebase/storage";

// Accepts an array or a comma-separated string, returns a clean array.
function getTags(raw) {
  if (!raw) return [];

  const list = Array.isArray(raw) ? raw : String(raw).split(",");

  return list.map((tag) => String(tag).trim()).filter(Boolean);
}

// ======================================================
// TAG COLORS — every distinct tag text always gets the
// same color (e.g. "SQL" is always cyan, "Web Development"
// is always yellow), picked deterministically from a palette.
// ======================================================

const TAG_COLOR_PALETTE = [
  { bg: "bg-purple-500/10", text: "text-purple-400" },
  { bg: "bg-yellow-500/10", text: "text-yellow-400" },
  { bg: "bg-green-500/10", text: "text-green-400" },
  { bg: "bg-pink-500/10", text: "text-pink-400" },
  { bg: "bg-orange-500/10", text: "text-orange-400" },
  { bg: "bg-cyan-500/10", text: "text-cyan-400" },
  { bg: "bg-indigo-500/10", text: "text-indigo-400" },
  { bg: "bg-teal-500/10", text: "text-teal-400" },
  { bg: "bg-rose-500/10", text: "text-rose-400" },
  { bg: "bg-lime-500/10", text: "text-lime-400" },
];

function hashTag(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getTagColors(tag) {
  const index = hashTag(tag.trim().toLowerCase()) % TAG_COLOR_PALETTE.length;
  return TAG_COLOR_PALETTE[index];
}

// ======================================================
// COMPONENT
// ======================================================

export default function CertificatesList({ refresh, onEditCertificate }) {
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
      setCertificates(data);
    } catch (error) {
      console.error("Error loading certificates:", error);
      setError("Unable to load certificates. Please try again.");
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

      // DELETE FIRESTORE DOCUMENT FIRST
      await deleteCertificate(certificate.id);

      // DELETE STORAGE PDF
      if (certificate.storagePath) {
        try {
          await deleteCertificateFile(certificate.storagePath);
        } catch (storageError) {
          console.warn(
            "Certificate deleted from Firestore, but PDF could not be deleted from Storage:",
            storageError
          );
        }
      }

      // REMOVE FROM LOCAL STATE
      setCertificates((prev) => prev.filter((item) => item.id !== certificate.id));

      alert("Certificate deleted successfully.");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      setError(error?.message || "Failed to delete certificate.");
    } finally {
      setDeletingId(null);
    }
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="mt-5 rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
        <div className="mx-auto h-7 w-7 animate-spin rounded-full border-[3px] border-slate-700 border-t-blue-500" />
        <p className="mt-2.5 text-xs text-gray-500">Loading certificates...</p>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="mt-5">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">
            Existing certificates
          </h3>
          <p className="mt-0.5 truncate text-xs text-gray-500">
            Manage certificates shown on your portfolio.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-gray-300">
          {certificates.length}
        </span>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {certificates.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-base text-blue-400">
            +
          </div>
          <h4 className="mt-3 text-sm font-semibold text-white">
            No certificates yet
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            Add your first certificate using the form above.
          </p>
        </div>
      ) : (
        /* CERTIFICATE LIST — slim cards (Skills-style) */
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((certificate) => {
            const isDeleting = deletingId === certificate.id;
            const tags = getTags(certificate.tags);

            return (
              <div
                key={certificate.id}
                className="flex flex-col rounded-lg border border-slate-800 bg-[#111827] p-3.5 transition hover:border-slate-700"
              >
                {/* TITLE */}
                <p className="truncate text-sm font-semibold text-white">
                  {certificate.title}
                </p>

                {/* COMPANY + YEAR (left, grouped) — ICON ACTIONS (right) — same row */}
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    {certificate.company && (
                      <span className="shrink-0 truncate rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-400">
                        {certificate.company}
                      </span>
                    )}

                    {certificate.year && (
                      <span className="shrink-0 rounded-full bg-slate-700/40 px-2 py-0.5 text-[11px] font-semibold text-gray-300">
                        {certificate.year}
                      </span>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEditCertificate?.(certificate)}
                      disabled={isDeleting}
                      aria-label={`Edit ${certificate.title || "certificate"}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-blue-500/25
                        bg-blue-500/10 text-blue-400 transition hover:bg-blue-500/20
                        disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(certificate)}
                      disabled={isDeleting}
                      aria-label={`Delete ${certificate.title || "certificate"}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-red-500/25
                        bg-red-500/10 text-red-400 transition hover:bg-red-500/20
                        disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isDeleting ? (
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 animate-spin fill-none stroke-current stroke-2">
                          <path strokeLinecap="round" d="M12 3a9 9 0 1 0 9 9" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                          <polyline points="3 6 5 6 21 6" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* SKILL TAGS — each tag gets its own consistent color; space reserved so every card is the same height */}
                <div className="mt-2 flex min-h-[24px] flex-wrap items-start gap-1.5">
                  {tags.map((tag) => {
                    const colors = getTagColors(tag);
                    return (
                      <span
                        key={tag}
                        className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${colors.bg} ${colors.text}`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}