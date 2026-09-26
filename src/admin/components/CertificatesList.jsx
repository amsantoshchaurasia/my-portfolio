import { useEffect, useRef, useState } from "react";

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
// CERTIFICATE TYPE — same values/colors as ProjectsList's
// category, so both admin pages feel consistent.
// ======================================================

function getTypeLabel(category) {
  switch (category) {
    case "web":
      return "Web Development";
    case "app":
      return "App Development";
    case "analytics":
      return "Data Analyst";
    default:
      return category || "Other";
  }
}

function getTypeColors(category) {
  switch (category) {
    case "web":
      return {
        badge: "bg-blue-500/10 text-blue-400",
        accent: "bg-blue-400/80",
        dot: "bg-blue-400",
      };
    case "app":
      return {
        badge: "bg-emerald-500/10 text-emerald-400",
        accent: "bg-emerald-400/80",
        dot: "bg-emerald-400",
      };
    case "analytics":
      return {
        badge: "bg-purple-500/10 text-purple-400",
        accent: "bg-purple-400/80",
        dot: "bg-purple-400",
      };
    // Certificates saved before the type field existed have no
    // category — shown as "Other" with a blue accent, same as Projects.
    default:
      return {
        badge: "bg-slate-500/15 text-slate-400",
        accent: "bg-blue-400/80",
        dot: "bg-slate-400",
      };
  }
}

// ======================================================
// COMPONENT
// ======================================================

export default function CertificatesList({ refresh, onEditCertificate }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // TYPE FILTER — same dropdown pattern as ProjectsList
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

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
  // FILTER DROPDOWN — close on outside click / Escape
  // ======================================================

  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setFilterOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  const filterTabs = [
    { id: "all", label: "All Certificates" },
    { id: "web", label: "Web Development" },
    { id: "app", label: "App Development" },
    { id: "analytics", label: "Data Analyst" },
    { id: "other", label: "Other" },
  ];

  const knownCategories = ["web", "app", "analytics"];

  const filteredCertificates =
    activeFilter === "all"
      ? certificates
      : activeFilter === "other"
        ? certificates.filter((c) => !knownCategories.includes(c.category))
        : certificates.filter((c) => c.category === activeFilter);

  const activeTab = filterTabs.find((tab) => tab.id === activeFilter);

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

      {/* TYPE FILTER — custom dropdown with a color dot per type,
          same pattern as ProjectsList */}
      <div className="relative z-20 mb-4 sm:max-w-xs" ref={filterRef}>
        <button
          type="button"
          onClick={() => setFilterOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={filterOpen}
          className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-slate-800/60
            px-3.5 py-2.5 text-left text-sm text-white outline-none transition
            ${filterOpen ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-700 hover:border-slate-600"}`}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {activeFilter === "all" ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 fill-none stroke-current stroke-2 text-gray-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16l-6 7v6l-4 2v-8L4 5z" />
              </svg>
            ) : (
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${getTypeColors(
                  activeFilter === "other" ? undefined : activeFilter
                ).dot}`}
              />
            )}
            <span className="truncate">{activeTab?.label}</span>
          </span>

          <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 shrink-0 fill-none stroke-current stroke-2 text-gray-400 transition-transform duration-200 ${
              filterOpen ? "rotate-180" : ""
            }`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {filterOpen && (
          <div
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] overflow-hidden rounded-lg
              border border-slate-700 bg-[#182233] shadow-xl shadow-black/40"
          >
            {filterTabs.map((tab) => {
              const count =
                tab.id === "all"
                  ? certificates.length
                  : tab.id === "other"
                    ? certificates.filter((c) => !knownCategories.includes(c.category)).length
                    : certificates.filter((c) => c.category === tab.id).length;

              const isActive = tab.id === activeFilter;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setFilterOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm
                    transition border-b border-slate-800/70 last:border-b-0
                    ${isActive ? "bg-blue-500/15 text-blue-400" : "text-gray-300 hover:bg-slate-800/80"}`}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {tab.id === "all" ? (
                      <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                        {isActive && (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 fill-none stroke-current stroke-[3]"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </span>
                    ) : (
                      <span
                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${getTypeColors(
                          tab.id === "other" ? undefined : tab.id
                        ).dot}`}
                      />
                    )}
                    <span className="truncate">{tab.label}</span>
                  </span>

                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      isActive
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-slate-700/60 text-gray-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-3 rounded-lg border border-red-500/25 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* EMPTY STATE */}
      {filteredCertificates.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#111827] p-8 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-base text-blue-400">
            +
          </div>
          <h4 className="mt-3 text-sm font-semibold text-white">
            {certificates.length === 0 ? "No certificates yet" : "No certificates in this category"}
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            {certificates.length === 0
              ? "Add your first certificate using the form above."
              : "Try a different filter or add a new certificate above."}
          </p>
        </div>
      ) : (
        /* CERTIFICATE LIST — slim cards (Skills-style) */
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCertificates.map((certificate) => {
            const isDeleting = deletingId === certificate.id;
            const tags = getTags(certificate.tags);
            const typeColors = getTypeColors(certificate.category);

            return (
              <div
                key={certificate.id}
                className="relative flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-[#111827] py-3.5 pl-4 pr-3.5 transition hover:border-slate-700"
              >
                {/* Type accent strip — same idea as Projects cards,
                    so certificate type is readable at a glance */}
                <span
                  className={`absolute inset-y-0 left-0 w-[3px] rounded-l-lg ${typeColors.accent}`}
                />

                {/* TITLE */}
                <p className="truncate text-sm font-semibold text-white">
                  {certificate.title}
                </p>

                {/* COMPANY + YEAR + TYPE (left, grouped) — ICON ACTIONS (right) — same row */}
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

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${typeColors.badge}`}
                    >
                      {getTypeLabel(certificate.category)}
                    </span>
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