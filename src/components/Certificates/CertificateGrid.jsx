import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiStar, FiFilter, FiChevronDown, FiCheck } from "react-icons/fi";

import CertificateCard from "./CertificateCard";
import { getCertificates } from "../../firebase/firestore";

// ======================================================
// FILTER SETUP
// ======================================================

// Order of the filter tabs. Tabs with 0 certificates are hidden automatically.
// "Forage" is matched on the company field; the rest are matched on tags.
const TAG_FILTERS = [
  "Data Analytics",
  "Web Development",
  "Python",
  "SQL",
  "Power BI",
  "Excel",
];

// ======================================================
// HELPERS
// ======================================================

// Featured = no type, or type is major / Featured.
const isFeatured = (certificate) =>
  !certificate.type ||
  ["major", "Major", "Featured", "featured"].includes(certificate.type);

const byOrder = (a, b) => Number(a.order || 1) - Number(b.order || 1);

// "Power BI", "power-bi", "PowerBI" all become "powerbi"
const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[\s\-_.]/g, "");

// Accepts an array or a comma-separated string, returns a clean array.
const normalizeTags = (raw) => {
  if (!raw) return [];

  const list = Array.isArray(raw) ? raw : String(raw).split(",");

  const seen = new Set();
  return list
    .map((tag) => String(tag).trim())
    .filter((tag) => {
      const key = normalize(tag);
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
};

const hasTag = (certificate, label) =>
  certificate._tags.some((tag) => normalize(tag) === normalize(label));

// ======================================================
// COMPONENT
// ======================================================

export default function CertificateGrid() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Opens on "Featured" by default (falls back to "All" if nothing is featured)
  const [filter, setFilter] = useState("featured");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the filter dropdown on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;

    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // ======================================================
  // LOAD ALL CERTIFICATES (single fetch)
  // ======================================================

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
            _featured: isFeatured(certificate),
          }))
          // Featured first, then by order
          .sort((a, b) => {
            const diff = Number(b._featured) - Number(a._featured);
            return diff !== 0 ? diff : byOrder(a, b);
          });

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

  // ======================================================
  // TABS
  // ======================================================

  const tabs = useMemo(() => {
    // Any tag you add in admin that isn't in TAG_FILTERS still gets a tab.
    const known = new Set(TAG_FILTERS.map(normalize));
    const extras = [];

    certificates.forEach((certificate) => {
      certificate._tags.forEach((tag) => {
        const key = normalize(tag);
        if (!known.has(key)) {
          known.add(key);
          extras.push(tag);
        }
      });
    });

    const all = [
      { id: "all", label: "All", test: () => true },
      {
        id: "featured",
        label: "Featured",
        star: true,
        test: (c) => c._featured,
      },
      {
        id: "forage",
        label: "Forage",
        test: (c) => normalize(c.company) === "forage",
      },
      ...[...TAG_FILTERS, ...extras].map((label) => ({
        id: `tag:${normalize(label)}`,
        label,
        tag: label,
        test: (c) => hasTag(c, label),
      })),
      {
        id: "other",
        label: "Other",
        test: (c) => !c._featured,
      },
    ];

    return all
      .map((tab) => ({
        ...tab,
        count: certificates.filter(tab.test).length,
      }))
      .filter((tab) => tab.id === "all" || tab.count > 0);
  }, [certificates]);

  // ======================================================
  // VISIBLE LIST
  // ======================================================

  const currentTab = tabs.find((tab) => tab.id === filter) || tabs[0];

  const visible = currentTab
    ? certificates.filter(currentTab.test)
    : certificates;

  // "All" and "Featured" are always visible; the rest live in the dropdown.
  const primaryTabs = tabs.filter(
    (tab) => tab.id === "all" || tab.id === "featured"
  );
  const dropdownTabs = tabs.filter(
    (tab) => tab.id !== "all" && tab.id !== "featured"
  );
  const dropdownActive = dropdownTabs.find((tab) => tab.id === currentTab?.id);

  // ======================================================
  // UI
  // Size 1 (375x667) = base classes -> LOCKED, not changed.
  // Size 2 (640x900)  = sm: classes  -> updated.
  // ======================================================

  return (
    <div className="mt-6 sm:mt-6 md:mt-8 lg:mt-8">
      {/* FILTERS */}
      {!loading && !error && certificates.length > 0 && tabs.length > 1 && (
        <div className="mb-6 sm:mb-8 md:mb-10 xl:mb-12 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {/* ALL + FEATURED */}
          {primaryTabs.map((tab) => {
            const active = currentTab?.id === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setFilter(tab.id);
                  setMenuOpen(false);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 sm:px-3.5 md:px-4 lg:px-5 xl:px-6 2xl:px-7 py-1.5 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3.5 text-[13px] sm:text-sm xl:text-[15px] 2xl:text-base font-medium transition-colors duration-200 ${
                  active
                    ? "border-blue-500 bg-blue-500/15 text-blue-400"
                    : "border-slate-700 bg-slate-900/60 text-gray-400 hover:border-slate-600 hover:text-white"
                }`}
              >
                {tab.star && <FiStar size={13} />}
                {tab.label}
                <span
                  className={`rounded-full px-1.5 text-xs ${
                    active
                      ? "bg-blue-500/20 text-blue-300"
                      : "bg-slate-800 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}

          {/* FILTER DROPDOWN */}
          {dropdownTabs.length > 0 && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={menuOpen}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 sm:px-3.5 md:px-4 lg:px-5 xl:px-6 2xl:px-7 py-1.5 md:py-2 lg:py-2.5 xl:py-3 2xl:py-3.5 text-[13px] sm:text-sm xl:text-[15px] 2xl:text-base font-medium transition-colors duration-200 ${
                  dropdownActive
                    ? "border-blue-500 bg-blue-500/15 text-blue-400"
                    : "border-slate-700 bg-slate-900/60 text-gray-400 hover:border-slate-600 hover:text-white"
                }`}
              >
                <FiFilter size={13} />
                {dropdownActive ? dropdownActive.label : "Filter"}
                {dropdownActive && (
                  <span className="rounded-full bg-blue-500/20 px-1.5 text-xs text-blue-300">
                    {dropdownActive.count}
                  </span>
                )}
                <FiChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    menuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {menuOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 z-20 mt-2 max-h-72 w-52 overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 py-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.5)] sm:left-1/2 sm:right-auto sm:w-56 sm:-translate-x-1/2"
                >
                  {dropdownTabs.map((tab) => {
                    const active = currentTab?.id === tab.id;
                    return (
                      <button
                        key={tab.id}
                        role="option"
                        aria-selected={active}
                        onClick={() => {
                          setFilter(tab.id);
                          setMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-blue-500/10 text-blue-400"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2">
                          {active ? (
                            <FiCheck size={14} />
                          ) : (
                            <span className="w-[14px]" />
                          )}
                          {tab.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="grid gap-4 sm:gap-4 md:gap-5 xl:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-[130px] sm:h-[130px] md:h-[150px] xl:h-[160px] 2xl:h-[150px] animate-pulse rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/70"
            />
          ))}
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
          <p className="text-sm sm:text-base text-red-400">{error}</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && visible.length === 0 && (
        <div className="rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center">
          <p className="text-sm sm:text-base text-gray-500">
            No certificates available.
          </p>
        </div>
      )}

      {/* GRID */}
      {!loading && !error && visible.length > 0 && (
        <motion.div
          key={currentTab?.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid items-stretch gap-4 sm:gap-4 md:gap-5 xl:gap-6 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              certificate={certificate}
              tags={certificate._tags}
              featured={certificate._featured}
              activeTag={currentTab?.tag || ""}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}