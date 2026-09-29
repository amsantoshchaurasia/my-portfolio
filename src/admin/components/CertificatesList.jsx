import { useEffect, useRef, useState } from "react";

import { getCertificates, deleteCertificate, updateCertificate } from "../../firebase/firestore";
import { deleteCertificateFile } from "../../firebase/storage";
import { getTechColor } from "../../utils/colors/techColors";
import { getPlatformColor } from "../../utils/colors/platformColors";
import {
  CERTIFICATE_TYPE_FILTER_OPTIONS,
  KNOWN_CERTIFICATE_TYPE_VALUES,
  getCertificateTypeLabel as getTypeLabel,
  getCertificateTypeColors as getTypeColors,
} from "../../utils/colors/typeColors";
import { formatIssueDate } from "../../utils/formatIssueDate";
import { DEFAULT_DOMAINS } from "../../utils/certificateOptions";

function getTags(raw) {
  if (!raw) return [];

  const list = Array.isArray(raw) ? raw : String(raw).split(",");

  return list.map((tag) => String(tag).trim()).filter(Boolean);
}

// New certificates have domains[] + tech[].
// Old certificates only have tags, so they are split using the default domain list.
const DOMAIN_SET = new Set(DEFAULT_DOMAINS.map((d) => d.toLowerCase()));

function getDomainsAndTech(certificate) {
  const hasNewFields =
    Array.isArray(certificate.domains) || Array.isArray(certificate.tech);

  if (hasNewFields) {
    return {
      domains: getTags(certificate.domains),
      tech: getTags(certificate.tech),
    };
  }

  const tags = getTags(certificate.tags);

  return {
    domains: tags.filter((t) => DOMAIN_SET.has(t.toLowerCase())),
    tech: tags.filter((t) => !DOMAIN_SET.has(t.toLowerCase())),
  };
}

const knownCategories = KNOWN_CERTIFICATE_TYPE_VALUES;

function matchesFilter(certificate, id) {
  if (id === "all") return true;
  if (id === "featured") return Boolean(certificate.featured);
  if (id === "other") return !knownCategories.includes(certificate.category);
  return certificate.category === id;
}

// ======================================================
// COMPONENT
// ======================================================

export default function CertificatesList({ refresh, onEditCertificate }) {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

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

  useEffect(() => {
    loadCertificates();
  }, [refresh]);

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
  // TOGGLE FEATURED (star button)
  // ======================================================

  async function handleToggleFeatured(certificate) {
    const next = !certificate.featured;

    setCertificates((prev) =>
      prev.map((c) => (c.id === certificate.id ? { ...c, featured: next } : c))
    );

    try {
      await updateCertificate(certificate.id, { featured: next });
    } catch (err) {
      console.error("Featured toggle failed:", err);

      setCertificates((prev) =>
        prev.map((c) => (c.id === certificate.id ? { ...c, featured: !next } : c))
      );
      setError("Could not update featured status. Please try again.");
    }
  }

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

      await deleteCertificate(certificate.id);

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
    { id: "featured", label: "⭐ Featured" },
    ...CERTIFICATE_TYPE_FILTER_OPTIONS.map((option) => ({
      id: option.value,
      label: option.label,
    })),
  ];

  const filteredCertificates = certificates.filter((c) =>
    matchesFilter(c, activeFilter)
  );

  const featuredCount = certificates.filter((c) => c.featured).length;

  const activeTab = filterTabs.find((tab) => tab.id === activeFilter);

  const isSpecialTab = (id) => id === "all" || id === "featured";

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

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
              featuredCount > 8
                ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
                : "border-slate-700 bg-slate-800/60 text-gray-300"
            }`}
            title={featuredCount > 8 ? "Too many featured — keep it to 6-8" : "Featured certificates"}
          >
            ⭐ {featuredCount}
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-xs font-medium text-gray-300">
            {certificates.length}
          </span>
        </div>
      </div>

      {/* TYPE FILTER */}
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
            {isSpecialTab(activeFilter) ? (
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
              const count = certificates.filter((c) => matchesFilter(c, tab.id)).length;
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
                    {isSpecialTab(tab.id) ? (
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
              : activeFilter === "featured"
                ? "No featured certificates yet. Tap the star on a certificate to feature it."
                : "Try a different filter or add a new certificate above."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
          {filteredCertificates.map((certificate) => {
            const isDeleting = deletingId === certificate.id;
            const { domains, tech } = getDomainsAndTech(certificate);
            const typeColors = getTypeColors(certificate.category);
            const issueDate = formatIssueDate(certificate);

            return (
              <div
                key={certificate.id}
                className="relative flex flex-col overflow-hidden rounded-lg border border-slate-800 bg-[#111827] py-3.5 pl-4 pr-3.5 transition hover:border-slate-700 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-x-3"
              >
                <span
                  className={`absolute inset-y-0 left-0 w-[3px] rounded-l-lg ${typeColors.accent}`}
                />

                {/* LINE 1: NAME (left) + DATE (right corner) */}
                <div className="flex items-start justify-between gap-3 sm:col-start-1 sm:row-start-1">
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
                    {certificate.title}
                  </p>

                  {issueDate && (
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-slate-700/40 px-2 py-0.5 text-[11px] font-semibold text-gray-300">
                      {issueDate}
                    </span>
                  )}
                </div>

                {/* LINE 2: PLATFORM, TYPE, DOMAIN (left) + STAR / EDIT / DELETE (right) */}
                <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2 max-[400px]:contents sm:contents">
                  {/* Labels: mobile pe row 2 */}
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5 max-[400px]:order-2 max-[400px]:mt-1.5 sm:col-span-2 sm:row-start-2 sm:mt-1.5">
                    {certificate.company && (
                      <span
                        className={`shrink-0 truncate rounded-full border bg-white/5 px-2 py-0.5 text-[11px] font-semibold max-[400px]:hidden lg:order-last ${getPlatformColor(
                          certificate.company
                        )}`}
                      >
                        {certificate.company}
                      </span>
                    )}

                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${typeColors.badge}`}
                    >
                      {getTypeLabel(certificate.category)}
                    </span>

                    {domains.map((domain) => (
                      <span
                        key={`d-${domain}`}
                        className={`shrink-0 rounded-full border bg-white/5 px-2 py-0.5 text-[11px] font-semibold max-[400px]:max-w-full max-[400px]:truncate sm:max-w-full sm:truncate ${getTechColor(domain)}`}
                      >
                        {domain}
                      </span>
                    ))}
                  </div>

                  {/* Mobile bottom row: platform (left) + buttons (right). Desktop pe wrapper invisible (contents) */}
                  <div className="contents max-[400px]:order-4 max-[400px]:mt-2 max-[400px]:flex max-[400px]:items-center max-[400px]:justify-between max-[400px]:gap-2">
                    {certificate.company && (
                      <span
                        className={`hidden min-w-0 truncate rounded-full border bg-white/5 px-2 py-0.5 text-[11px] font-semibold max-[400px]:inline-block ${getPlatformColor(
                          certificate.company
                        )}`}
                      >
                        {certificate.company}
                      </span>
                    )}

                  <div className="flex shrink-0 gap-1.5 max-[400px]:ml-auto sm:col-start-2 sm:row-start-1 sm:justify-self-end">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(certificate)}
                      disabled={isDeleting}
                      aria-pressed={Boolean(certificate.featured)}
                      aria-label={
                        certificate.featured ? "Remove from featured" : "Mark as featured"
                      }
                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition
                        disabled:cursor-not-allowed disabled:opacity-40 ${
                          certificate.featured
                            ? "border-amber-400/40 bg-amber-400/15 text-amber-400"
                            : "border-slate-700 bg-slate-800/60 text-gray-500 hover:text-amber-300"
                        }`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-3.5 w-3.5 stroke-current stroke-2 ${
                          certificate.featured ? "fill-current" : "fill-none"
                        }`}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>

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
                </div>

                {/* LINE 3: TECH / SKILLS (saari skills dikhengi) */}
                {tech.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5 max-[400px]:order-3 sm:col-span-2 sm:row-start-3">
                    {tech.map((item) => (
                      <span
                        key={`t-${item}`}
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium max-[400px]:max-w-full max-[400px]:truncate sm:max-w-full sm:truncate ${getTechColor(item)}`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}