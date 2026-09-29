// ======================================================
// TECH / SKILL COLORS — SINGLE SOURCE OF TRUTH
// ======================================================
// Used by:
//   Admin:  ProjectsForm.jsx, ProjectsList.jsx, CertificatesForm.jsx
//   Public: TechBadge.jsx (Projects), CertificateCard.jsx (Certificates)
//
// To change a tech's color, or add a new tech, edit the list below
// ONCE. Write names the way you want them displayed.
//
// Lookup ignores case, spaces, dots, dashes and slashes, so
// "Power BI" / "powerbi" and "Node.js" / "nodejs" / "node js"
// all share one entry.
// ======================================================

const TECH_COLORS = {
  // Data
  Python: "border-yellow-400/40 text-yellow-300",
  SQL: "border-orange-400/40 text-orange-300",
  MySQL: "border-orange-400/40 text-orange-300",
  PostgreSQL: "border-sky-400/40 text-sky-300",
  Excel: "border-green-400/40 text-green-300",
  "Power BI": "border-amber-400/40 text-amber-300",
  Tableau: "border-rose-400/40 text-rose-300",
  R: "border-blue-400/40 text-blue-300",
  Pandas: "border-purple-400/40 text-purple-300",
  NumPy: "border-sky-400/40 text-sky-300",
  "Scikit-learn": "border-orange-400/40 text-orange-300",
  TensorFlow: "border-amber-500/40 text-amber-400",
  Statistics: "border-indigo-500/40 text-indigo-400",
  ETL: "border-teal-400/40 text-teal-300",
  "Research Methodology": "border-violet-400/40 text-violet-300",
  "Data Visualization": "border-pink-400/40 text-pink-300",

  // Web / App
  React: "border-cyan-400/40 text-cyan-300",
  "React Native": "border-cyan-400/40 text-cyan-300",
  JavaScript: "border-yellow-300/40 text-yellow-200",
  TypeScript: "border-blue-400/40 text-blue-300",
  HTML: "border-orange-500/40 text-orange-400",
  CSS: "border-blue-500/40 text-blue-400",
  "HTML/CSS": "border-orange-500/40 text-orange-400",
  "Tailwind CSS": "border-teal-400/40 text-teal-300",
  "Node.js": "border-lime-400/40 text-lime-300",
  Angular: "border-red-500/40 text-red-400",
  "Vue.js": "border-emerald-500/40 text-emerald-400",
  "Next.js": "border-slate-300/40 text-slate-200",
  Redux: "border-purple-500/40 text-purple-400",
  Django: "border-emerald-500/40 text-emerald-400",
  Flask: "border-gray-300/40 text-gray-200",
  Java: "border-red-400/40 text-red-300",
  "C++": "border-indigo-400/40 text-indigo-300",
  Figma: "border-pink-400/40 text-pink-300",

  // Databases / Cloud / Tools
  MongoDB: "border-emerald-400/40 text-emerald-300",
  Firebase: "border-amber-500/40 text-amber-400",
  AWS: "border-orange-500/40 text-orange-400",
  Azure: "border-sky-500/40 text-sky-400",
  "Google Cloud": "border-blue-500/40 text-blue-400",
  Docker: "border-sky-400/40 text-sky-300",
  DevOps: "border-cyan-500/40 text-cyan-400",
  Git: "border-orange-400/40 text-orange-300",
  GitHub: "border-gray-300/40 text-gray-200",
};

// "Power BI" -> "powerbi", "Node.js" -> "nodejs", "HTML/CSS" -> "htmlcss"
const compact = (name) =>
  String(name || "")
    .toLowerCase()
    .replace(/[\s._\-/]+/g, "");

export const TECH_COLOR_MAP = Object.fromEntries(
  Object.entries(TECH_COLORS).map(([name, classes]) => [compact(name), classes])
);

// Deterministic fallback for any tech NOT listed above (e.g. a
// custom-typed one). The same name always gets the same color.
const TECH_FALLBACK_PALETTE = [
  "border-blue-500/30 text-blue-400",
  "border-fuchsia-400/40 text-fuchsia-300",
  "border-teal-400/40 text-teal-300",
  "border-red-400/40 text-red-300",
  "border-indigo-400/40 text-indigo-300",
  "border-lime-400/40 text-lime-300",
];

/**
 * Badge classes for a technology / skill name.
 * Unknown names still get a stable color, hashed from the name.
 */
export function getTechColor(name) {
  const key = compact(name);

  if (TECH_COLOR_MAP[key]) return TECH_COLOR_MAP[key];

  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }

  return TECH_FALLBACK_PALETTE[hash % TECH_FALLBACK_PALETTE.length];
}

// Quick-pick chips for ProjectsForm.jsx.
export const KNOWN_TECHNOLOGIES = [
  "Python",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "Excel",
  "Power BI",
  "Tableau",
  "React",
  "React Native",
  "JavaScript",
  "TypeScript",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Node.js",
  "Firebase",
  "MongoDB",
  "Java",
  "C++",
  "Git",
  "GitHub",
  "NumPy",
  "Pandas",
  "Scikit-learn",
  "Django",
  "Flask",
  "Docker",
  "Figma",
  "Angular",
  "Vue.js",
  "Next.js",
  "Redux",
  "AWS",
];