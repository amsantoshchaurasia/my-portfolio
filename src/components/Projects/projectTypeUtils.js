// Same category values/colors as the admin panel (ProjectsList /
// ProjectsForm), so a project's type looks identical on both sides.
// "other" (and anything unrecognized/missing) is intentionally the
// same blue as "web" — matches the admin's accent color choice.

export const PROJECT_CATEGORIES = [
  { value: "web", label: "Web Development" },
  { value: "app", label: "App Development" },
  { value: "analytics", label: "Data Analyst" },
  { value: "other", label: "Other" },
];

const KNOWN_CATEGORIES = ["web", "app", "analytics"];

export function getCategoryLabel(category) {
  switch (category) {
    case "web":
      return "Web Development";
    case "app":
      return "App Development";
    case "analytics":
      return "Data Analyst";
    default:
      return "Other";
  }
}

export function getCategoryBadgeClasses(category) {
  switch (category) {
    case "app":
      return "bg-emerald-600/10 border-emerald-500/30 text-emerald-400";
    case "analytics":
      return "bg-purple-600/10 border-purple-500/30 text-purple-400";
    case "web":
    default:
      return "bg-blue-600/10 border-blue-500/30 text-blue-400";
  }
}

// A project counts as "other" for filtering if its category is
// missing or isn't one of the known values.
export function matchesCategory(project, filterValue) {
  if (filterValue === "all") return true;
  if (filterValue === "other") return !KNOWN_CATEGORIES.includes(project.category);
  return project.category === filterValue;
}