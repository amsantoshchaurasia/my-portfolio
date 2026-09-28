import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import CertificateCard from "./CertificateCard";
import { getCertificates } from "../../firebase/firestore";
import { DEFAULT_DOMAINS } from "../../utils/certificateOptions";

const byOrder = (a, b) => Number(a.order || 1) - Number(b.order || 1);

// Featured view shows every starred certificate (no limit).
// "All" and domain views show this many first, then "Show more"
const PAGE_SIZE = 9;

function normalizeTags(raw) {
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
      domains: normalizeTags(certificate.domains),
      tech: normalizeTags(certificate.tech),
    };
  }

  const tags = normalizeTags(certificate.tags);

  return {
    domains: tags.filter((t) => DOMAIN_SET.has(t.toLowerCase())),
    tech: tags.filter((t) => !DOMAIN_SET.has(t.toLowerCase())),
  };
}

// Filter values: "featured", "all", or "d:<domain in lowercase>"
function matchesFilter(certificate, filter) {
  if (filter === "all") return true;
  if (filter === "featured") return Boolean(certificate.featured);

  if (filter.startsWith("d:")) {
    const key = filter.slice(2);
    return certificate._domains.some((d) => d.toLowerCase() === key);
  }

  return true;
}

export default function CertificateGrid() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  // Default view = featured certificates only
  const [activeFilter, setActiveFilter] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const filterRef = useRef(null);

  // FILTER DROPDOWN — close on outside click / Escape
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

  // LOAD CERTIFICATES
  useEffect(() => {
    let mounted = true;

    async function loadCertificates() {
      try {
        setLoading(true);
        setError("");

        const data = await getCertificates();
        if (!mounted) return;

        const prepared = data
          .map((certificate) => {
            const { domains, tech } = getDomainsAndTech(certificate);
            return {
              ...certificate,
              _domains: domains,
              _tech: tech,
            };
          })
          .sort(byOrder);

        setCertificates(prepared);

        // If no certificate is starred yet, don't show an empty section:
        // fall back to "All" until at least one is featured.
        if (!prepared.some((c) => c.featured)) {
          setActiveFilter("all");
        }
      } catch (err) {
        console.error("Error loading certificates:", err);
        if (mounted) setError("Unable to load certificates right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadCertificates();
    return () => {
      mounted = false;
    };
  }, []);

  // Start from the first page again whenever the view changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeFilter, searchQuery]);

  const featuredCount = useMemo(
    () => certificates.filter((c) => c.featured).length,
    [certificates]
  );

  // FILTER OPTIONS: Featured (only if some exist), All, then one option per
  // domain that actually has certificates. Built from the certificates
  // themselves, so an option appears/disappears automatically.
  const availableFilterOptions = useMemo(() => {
    const domainMap = new Map(); // lower -> { label, count }

    certificates.forEach((certificate) => {
      const seenInThisCertificate = new Set();

      certificate._domains.forEach((domain) => {
        const key = domain.toLowerCase();
        if (seenInThisCertificate.has(key)) return;
        seenInThisCertificate.add(key);

        const existing = domainMap.get(key);
        if (existing) existing.count += 1;
        else domainMap.set(key, { label: domain, count: 1 });
      });
    });

    const domainOptions = [...domainMap.entries()]
      .sort((a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label))
      .map(([key, { label, count }]) => ({ value: `d:${key}`, label, count }));

    return [
      ...(featuredCount > 0
        ? [{ value: "featured", label: "⭐ Featured", count: featuredCount }]
        : []),
      { value: "all", label: "All Certificates", count: certificates.length },
      ...domainOptions,
    ];
  }, [certificates, featuredCount]);

  // If the selected domain no longer exists (its last certificate was
  // deleted), quietly fall back to the first available option.
  const effectiveFilter = availableFilterOptions.some((o) => o.value === activeFilter)
    ? activeFilter
    : availableFilterOptions[0]?.value || "all";

  const activeOption = availableFilterOptions.find(
    (option) => option.value === effectiveFilter
  );

  const isFeaturedView = effectiveFilter === "featured";
  const query = searchQuery.trim().toLowerCase();

  // FILTERED + SEARCHED LIST (title + platform + domains + tech)
  // Searching while on "Featured" looks through ALL certificates,
  // otherwise a search would miss the ones that are not starred.
  const filteredCertificates = useMemo(() => {
    const base =
      isFeaturedView && query
        ? certificates
        : certificates.filter((c) => matchesFilter(c, effectiveFilter));

    if (!query) return base;

    return base.filter((certificate) => {
      const titleMatch = (certificate.title || "").toLowerCase().includes(query);
      const companyMatch = (certificate.company || "").toLowerCase().includes(query);
      const skillMatch = [...certificate._domains, ...certificate._tech].some((tag) =>
        (tag || "").toLowerCase().includes(query)
      );

      return titleMatch || companyMatch || skillMatch;
    });
  }, [certificates, effectiveFilter, query, isFeaturedView]);

  // Featured view shows every starred certificate (2, 5 or 10, no paging).
  // "All" and domain views are paged (9 at a time). Searching is paged too.
  const paged = !isFeaturedView || Boolean(query);
  const shownCertificates = paged
    ? filteredCertificates.slice(0, visibleCount)
    : filteredCertificates;
  const remaining = filteredCertificates.length - shownCertificates.length;

  const showViewAllButton =
    isFeaturedView && !query && certificates.length > featuredCount;

  // LOADING (slim skeletons)
  if (loading) {
    return (
      <div className="mt-6 flex flex-wrap justify-center gap-4 md:mt-8">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[112px] w-full animate-pulse rounded-xl border border-slate-800 bg-slate-900/70
              sm:w-[calc(50%_-_0.5rem)] lg:w-[calc(33.333%_-_0.667rem)]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 sm:mt-6 md:mt-8 lg:mt-8">
      {/* ========================================
          SEARCH + FILTER
      ======================================== */}
      <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
        {/* SEARCH */}
        <div className="relative flex-1">
          <svg
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 fill-none stroke-current stroke-2 text-gray-500"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
          </svg>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search certificates..."
            className="w-full rounded-full border border-slate-700 bg-[#111827] py-2.5 sm:py-3 pl-11 pr-4
              text-sm sm:text-base text-white placeholder:text-gray-500 outline-none transition
              focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
          />
        </div>

        {/* DOMAIN FILTER */}
        <div className="relative z-20 sm:w-64" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={filterOpen}
            className={`flex w-full items-center justify-between gap-2 rounded-full border bg-[#111827]
              py-2.5 sm:py-3 pl-4 pr-3.5 text-left text-sm sm:text-base text-white outline-none transition
              ${filterOpen ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-700 hover:border-slate-600"}`}
          >
            <span className="truncate">{activeOption?.label}</span>
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
              className="absolute left-0 right-0 top-[calc(100%+6px)] max-h-72 overflow-y-auto rounded-xl
                border border-slate-700 bg-[#111827] shadow-xl shadow-black/40"
            >
              {availableFilterOptions.map((option) => {
                const isActive = option.value === activeOption?.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveFilter(option.value);
                      setFilterOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-2 border-b border-slate-800/70 px-4 py-2.5
                      text-left text-sm sm:text-base transition last:border-b-0
                      ${isActive ? "bg-blue-500/15 text-blue-400" : "text-gray-300 hover:bg-slate-800/80"}`}
                  >
                    <span className="truncate">{option.label}</span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        isActive
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-slate-700/60 text-gray-400"
                      }`}
                    >
                      {option.count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SMALL CAPTION */}
      {!error && certificates.length > 0 && (
        <p className="mt-4 text-center text-xs text-gray-500">
          {isFeaturedView && !query
            ? `Showing ${featuredCount} featured of ${certificates.length} certificates`
            : `${filteredCertificates.length} certificate${filteredCertificates.length === 1 ? "" : "s"}${
                isFeaturedView && query ? " (searching all)" : ""
              }`}
        </p>
      )}

      {/* ERROR */}
      {error && (
        <div className="mt-8 sm:mt-10 rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm sm:text-base text-red-400">{error}</p>
        </div>
      )}

      {/* EMPTY */}
      {!error && filteredCertificates.length === 0 && (
        <div className="mt-8 sm:mt-10 rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
          <p className="text-sm sm:text-base text-gray-500">
            {certificates.length === 0
              ? "No certificates available."
              : "No certificates match your search or filter."}
          </p>
        </div>
      )}

      {/* GRID — centered flex-wrap: cards are slim, and an unfinished
          last row is centered instead of leaving an empty slot */}
      {!error && shownCertificates.length > 0 && (
        <motion.div
          key={effectiveFilter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-4 flex flex-wrap justify-center gap-4"
        >
          {shownCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              domains={certificate._domains}
              tech={certificate._tech}
              showStar={!isFeaturedView}
            />
          ))}
        </motion.div>
      )}

      {/* SHOW MORE (All / domain views) */}
      {!error && paged && remaining > 0 && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="rounded-full border border-slate-700 bg-[#111827] px-6 py-2.5 text-sm font-medium
              text-gray-300 transition hover:border-blue-500/60 hover:text-blue-400"
          >
            Show more ({remaining} left)
          </button>
        </div>
      )}

      {/* VIEW ALL (Featured view) */}
      {!error && showViewAllButton && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className="rounded-full border border-blue-500/40 bg-blue-500/10 px-6 py-2.5 text-sm font-medium
              text-blue-400 transition hover:bg-blue-500/20"
          >
            See all {certificates.length} certificates →
          </button>
        </div>
      )}
    </div>
  );
}