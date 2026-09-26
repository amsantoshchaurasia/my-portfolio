import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import CertificateCard from "./CertificateCard";
import { getCertificates } from "../../firebase/firestore";
import { CERTIFICATE_CATEGORIES, matchesCertificateCategory } from "./certificateTypeUtils";

const byOrder = (a, b) => Number(a.order || 1) - Number(b.order || 1);

function normalizeTags(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : String(raw).split(",");
  return list.map((tag) => String(tag).trim()).filter(Boolean);
}

export default function CertificateGrid() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const filterOptions = [{ value: "all", label: "All Certificates" }, ...CERTIFICATE_CATEGORIES];
  const activeOption = filterOptions.find((option) => option.value === activeFilter);

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
          .map((certificate) => ({
            ...certificate,
            _tags: normalizeTags(certificate.tags),
          }))
          .sort(byOrder);

        setCertificates(prepared);
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

  // ONLY SHOW FILTER OPTIONS THAT ACTUALLY EXIST IN ADMIN DATA
  const availableFilterOptions = useMemo(() => {
    return filterOptions.filter((option) => {
      if (option.value === "all") return true;
      return certificates.some((c) => matchesCertificateCategory(c, option.value));
    });
  }, [certificates]);

  // FILTERED + SEARCHED LIST (title + company + tags)
  const filteredCertificates = useMemo(() => {
    const categoryFiltered = certificates.filter((certificate) =>
      matchesCertificateCategory(certificate, activeFilter)
    );

    const query = searchQuery.trim().toLowerCase();
    if (!query) return categoryFiltered;

    return categoryFiltered.filter((certificate) => {
      const titleMatch = (certificate.title || "").toLowerCase().includes(query);
      const companyMatch = (certificate.company || "").toLowerCase().includes(query);
      const tagMatch = certificate._tags.some((tag) =>
        (tag || "").toLowerCase().includes(query)
      );

      return titleMatch || companyMatch || tagMatch;
    });
  }, [certificates, activeFilter, searchQuery]);

  // LOADING
  if (loading) {
    return (
      <div className="mt-6 sm:mt-6 md:mt-8 lg:mt-8 grid gap-4 sm:gap-4 md:gap-5 xl:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[150px] sm:h-[150px] md:h-[170px] xl:h-[180px] 2xl:h-[170px] animate-pulse rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/70"
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

        {/* CATEGORY FILTER */}
        <div className="relative z-20 sm:w-56" ref={filterRef}>
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
              className="absolute left-0 right-0 top-[calc(100%+6px)] overflow-hidden rounded-xl
                border border-slate-700 bg-[#111827] shadow-xl shadow-black/40"
            >
              {availableFilterOptions.map((option) => {
                const isActive = option.value === activeFilter;

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
                    className={`block w-full border-b border-slate-800/70 px-4 py-2.5 text-left text-sm sm:text-base
                      transition last:border-b-0
                      ${isActive ? "bg-blue-500/15 text-blue-400" : "text-gray-300 hover:bg-slate-800/80"}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

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

      {/* GRID — same responsive grid as Projects (sm:2 cols, lg:3 cols) */}
      {!error && filteredCertificates.length > 0 && (
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-6 sm:mt-6 md:mt-8 grid items-stretch gap-4 sm:gap-4 md:gap-5 xl:gap-6 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredCertificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              tags={certificate._tags}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}