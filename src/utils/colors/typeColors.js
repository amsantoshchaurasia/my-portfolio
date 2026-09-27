// ======================================================
// TYPE / CATEGORY COLORS — SINGLE SOURCE OF TRUTH
// ======================================================
// Used by:
//   Admin:  ProjectsForm.jsx, ProjectsList.jsx        (PROJECT_* exports)
//           CertificatesForm.jsx, CertificatesList.jsx (CERTIFICATE_* exports)
//   Public: ProjectCard.jsx, ProjectModal.jsx, Projects.jsx
//             (via projectTypeUtils.js)
//           CertificateCard.jsx, CertificateGrid.jsx
//             (via certificateTypeUtils.js)
//
// A Project's type (Web / App / Data Analyst / ...) and a
// Certificate's type (Course / Internship / Professional / ...)
// are DIFFERENT concepts, so each now has its own independent
// list, its own colors, and its own "Other" fallback. Change a
// color or add a new type ONCE here; every form/list/card on
// both sides (admin + public) updates automatically.
// ======================================================

// ======================================================
// PROJECT TYPES
// ======================================================
// Describes what KIND of project it is (the tech/domain).

export const PROJECT_TYPE_CATEGORIES = [
  { value: "web", label: "Web Development" },
  { value: "app", label: "App Development" },
  { value: "analytics", label: "Data Analyst" },
  { value: "ml", label: "Machine Learning / AI" },
  { value: "desktop", label: "Desktop Application" },
  { value: "game", label: "Game Development" },
  { value: "uiux", label: "UI/UX Design" },
];

export const KNOWN_PROJECT_TYPE_VALUES = PROJECT_TYPE_CATEGORIES.map(
  (c) => c.value
);

// Same list + "Other" — used for filter dropdowns (public + admin
// lists), since items with a missing/unrecognized type are grouped
// as "Other".
export const PROJECT_TYPE_FILTER_OPTIONS = [
  ...PROJECT_TYPE_CATEGORIES,
  { value: "other", label: "Other" },
];

export function getProjectTypeLabel(category) {
  const match = PROJECT_TYPE_CATEGORIES.find((c) => c.value === category);
  return match ? match.label : "Other";
}

/**
 * Single badge class string — for simple badges (ProjectCard,
 * ProjectModal, and the admin dropdown options).
 */
export function getProjectTypeBadgeClasses(category) {
  switch (category) {
    case "web":
      return "bg-blue-600/10 border-blue-500/30 text-blue-400";
    case "app":
      return "bg-emerald-600/10 border-emerald-500/30 text-emerald-400";
    case "analytics":
      return "bg-purple-600/10 border-purple-500/30 text-purple-400";
    case "ml":
      return "bg-red-600/10 border-red-500/30 text-red-400";
    case "desktop":
      return "bg-cyan-600/10 border-cyan-500/30 text-cyan-400";
    case "game":
      return "bg-pink-600/10 border-pink-500/30 text-pink-400";
    case "uiux":
      return "bg-amber-600/10 border-amber-500/30 text-amber-400";
    // Items saved before the "type" field existed (or with an
    // unrecognized value) have no category — shown as "Other".
    default:
      return "bg-slate-600/10 border-slate-500/30 text-slate-400";
  }
}

/**
 * Object variant {badge, accent, dot} — for admin list cards
 * (ProjectsList) that need an accent strip and a filter-dropdown
 * color dot in addition to the badge.
 */
export function getProjectTypeColors(category) {
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
    case "ml":
      return {
        badge: "bg-red-500/10 text-red-400",
        accent: "bg-red-400/80",
        dot: "bg-red-400",
      };
    case "desktop":
      return {
        badge: "bg-cyan-500/10 text-cyan-400",
        accent: "bg-cyan-400/80",
        dot: "bg-cyan-400",
      };
    case "game":
      return {
        badge: "bg-pink-500/10 text-pink-400",
        accent: "bg-pink-400/80",
        dot: "bg-pink-400",
      };
    case "uiux":
      return {
        badge: "bg-amber-500/10 text-amber-400",
        accent: "bg-amber-400/80",
        dot: "bg-amber-400",
      };
    default:
      return {
        badge: "bg-slate-500/15 text-slate-400",
        accent: "bg-slate-400/80",
        dot: "bg-slate-400",
      };
  }
}

/**
 * True if `item.category` matches the given filter value.
 * filterValue "all" matches everything; "other" matches anything
 * NOT in KNOWN_PROJECT_TYPE_VALUES (including missing/undefined
 * category).
 */
export function matchesProjectTypeCategory(item, filterValue) {
  if (filterValue === "all") return true;
  if (filterValue === "other")
    return !KNOWN_PROJECT_TYPE_VALUES.includes(item.category);
  return item.category === filterValue;
}

// ======================================================
// CERTIFICATE TYPES
// ======================================================
// Describes the NATURE of the certificate itself (how it was
// earned) — NOT the tech domain. The tech domain is already
// covered by the "Skills / Tags" field on CertificatesForm.

export const CERTIFICATE_TYPE_CATEGORIES = [
  { value: "technical", label: "Technical Skill" },
  { value: "internship", label: "Virtual Internship" },
  { value: "course", label: "Course" },
  { value: "professional", label: "Professional" },
  { value: "softskill", label: "Soft Skill" },
];

export const KNOWN_CERTIFICATE_TYPE_VALUES = CERTIFICATE_TYPE_CATEGORIES.map(
  (c) => c.value
);

export const CERTIFICATE_TYPE_FILTER_OPTIONS = [
  ...CERTIFICATE_TYPE_CATEGORIES,
  { value: "other", label: "Other" },
];

export function getCertificateTypeLabel(category) {
  const match = CERTIFICATE_TYPE_CATEGORIES.find((c) => c.value === category);
  return match ? match.label : "Other";
}

export function getCertificateTypeBadgeClasses(category) {
  switch (category) {
    case "technical":
      return "bg-blue-600/10 border-blue-500/30 text-blue-400";
    case "internship":
      return "bg-violet-600/10 border-violet-500/30 text-violet-400";
    case "course":
      return "bg-orange-600/10 border-orange-500/30 text-orange-400";
    case "professional":
      return "bg-indigo-600/10 border-indigo-500/30 text-indigo-400";
    case "softskill":
      return "bg-teal-600/10 border-teal-500/30 text-teal-400";
    // Items saved before the "type" field existed (or with an
    // unrecognized value) have no category — shown as "Other".
    default:
      return "bg-slate-600/10 border-slate-500/30 text-slate-400";
  }
}

export function getCertificateTypeColors(category) {
  switch (category) {
    case "technical":
      return {
        badge: "bg-blue-500/10 text-blue-400",
        accent: "bg-blue-400/80",
        dot: "bg-blue-400",
      };
    case "internship":
      return {
        badge: "bg-violet-500/10 text-violet-400",
        accent: "bg-violet-400/80",
        dot: "bg-violet-400",
      };
    case "course":
      return {
        badge: "bg-orange-500/10 text-orange-400",
        accent: "bg-orange-400/80",
        dot: "bg-orange-400",
      };
    case "professional":
      return {
        badge: "bg-indigo-500/10 text-indigo-400",
        accent: "bg-indigo-400/80",
        dot: "bg-indigo-400",
      };
    case "softskill":
      return {
        badge: "bg-teal-500/10 text-teal-400",
        accent: "bg-teal-400/80",
        dot: "bg-teal-400",
      };
    default:
      return {
        badge: "bg-slate-500/15 text-slate-400",
        accent: "bg-slate-400/80",
        dot: "bg-slate-400",
      };
  }
}

/**
 * True if `item.category` matches the given filter value.
 * filterValue "all" matches everything; "other" matches anything
 * NOT in KNOWN_CERTIFICATE_TYPE_VALUES (including missing/undefined
 * category).
 */
export function matchesCertificateTypeCategory(item, filterValue) {
  if (filterValue === "all") return true;
  if (filterValue === "other")
    return !KNOWN_CERTIFICATE_TYPE_VALUES.includes(item.category);
  return item.category === filterValue;
}