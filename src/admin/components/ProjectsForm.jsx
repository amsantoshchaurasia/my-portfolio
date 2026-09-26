import { useEffect, useState } from "react";

import { createProject, updateProject } from "../../firebase/firestore";

// ========================================
// KNOWN TECHNOLOGIES — same names used in ProjectsList's color
// map, so whatever gets picked here always renders with the
// correct known color instead of falling back to a random one.
// ========================================

const KNOWN_TECHNOLOGIES = [
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
];

export default function ProjectsForm({
  onProjectAdded,
  editingProject,
  onCancelEdit,
}) {
  const [form, setForm] = useState({
    title: "",
    year: "2026",
    category: "web",
    description: "",
    technologies: [], // array of selected tech names, click-based
    github: "",
    order: "",
  });

  const [customTech, setCustomTech] = useState("");
  const [saving, setSaving] = useState(false);

  // Tech picker starts collapsed to just a row or two on small
  // screens (see the responsive max-height below); "Show more"
  // expands it fully at any size.
  const [showAllTech, setShowAllTech] = useState(false);

  // ========================================
  // LOAD PROJECT INTO FORM WHEN EDITING
  // ========================================

  useEffect(() => {
    if (editingProject) {
      setForm({
        title: editingProject.title || "",

        // Firestore may contain year as a number,
        // so convert it to string for the form.
        year: String(editingProject.year || "2026"),

        category: editingProject.category || "web",

        description: editingProject.description || "",

        technologies: Array.isArray(editingProject.technologies)
          ? editingProject.technologies
          : [],

        github: editingProject.github || "",

        order: editingProject.order || "",
      });
    } else {
      setForm({
        title: "",
        year: "2026",
        category: "web",
        description: "",
        technologies: [],
        github: "",
        order: "",
      });
    }
    setCustomTech("");
  }, [editingProject]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ========================================
  // TECH PICKER — click to toggle a known technology on/off.
  // Comparison is case-insensitive so a custom-added tech that
  // happens to match a known one (different casing) still
  // highlights correctly.
  // ========================================

  function toggleTech(tech) {
    setForm((prev) => {
      const exists = prev.technologies.some(
        (item) => item.toLowerCase() === tech.toLowerCase()
      );

      const technologies = exists
        ? prev.technologies.filter(
            (item) => item.toLowerCase() !== tech.toLowerCase()
          )
        : [...prev.technologies, tech];

      return { ...prev, technologies };
    });
  }

  function removeTech(tech) {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((item) => item !== tech),
    }));
  }

  // For anything not in the known list — e.g. a niche library.
  function handleAddCustomTech() {
    const value = customTech.trim();
    if (!value) return;

    const alreadyAdded = form.technologies.some(
      (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (!alreadyAdded) {
      setForm((prev) => ({
        ...prev,
        technologies: [...prev.technologies, value],
      }));
    }

    setCustomTech("");
  }

  function handleCustomTechKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTech();
    }
  }

  // ========================================
  // SAVE / UPDATE PROJECT
  // ========================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter project title.");
      return;
    }

    if (!form.description.trim()) {
      alert("Please enter project description.");
      return;
    }

    if (form.technologies.length === 0) {
      alert("Please select at least one technology.");
      return;
    }

    try {
      setSaving(true);

      const projectData = {
        title: form.title.trim(),
        year: String(form.year).trim(),
        category: form.category || "web",
        description: form.description.trim(),
        technologies: form.technologies,
        github: form.github.trim(),
        order: Number(form.order) || 1,
      };

      // UPDATE EXISTING PROJECT
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        alert("Project updated successfully.");
        onProjectAdded?.();
        onCancelEdit?.();
        return;
      }

      // CREATE NEW PROJECT
      await createProject(projectData);
      alert("Project added successfully.");
      onProjectAdded?.();

      setForm({
        title: "",
        year: "2026",
        category: "web",
        description: "",
        technologies: [],
        github: "",
        order: "",
      });
    } catch (error) {
      console.error("Error saving project:", error);
      alert(
        editingProject
          ? "Failed to update project."
          : "Failed to add project."
      );
    } finally {
      setSaving(false);
    }
  }

  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  const inputClasses =
    "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 " +
    "text-sm text-white placeholder:text-gray-500 outline-none transition " +
    "focus:border-blue-500 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/30";

  // ========================================
  // UI
  // ========================================

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-white">
          {editingProject ? "Edit project" : "Add new project"}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">
          {editingProject
            ? "Update the project information shown on your portfolio."
            : "Add a project to your portfolio."}
        </p>
      </div>

      {/* TITLE + YEAR */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Project title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="IT Employee Attrition Analysis"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Year</label>
          <input
            type="text"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="2026"
            className={inputClasses}
          />
        </div>
      </div>

      {/* CATEGORY / TYPE — new: lets projects be grouped and
          filtered the same way Skills are (Web Development,
          App Development, Data Analyst) */}
      <div className="sm:max-w-xs">
        <label className={labelClasses}>Project type</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClasses}
        >
          <option value="web">Web Development</option>
          <option value="app">App Development</option>
          <option value="analytics">Data Analyst</option>
        </select>
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder="End-to-end employee attrition analytics project using Python, SQL, Excel and Power BI."
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* TECHNOLOGIES — click to select instead of typing, so
          there's no spelling mistake or case mismatch */}
      <div>
        <label className={labelClasses}>Technologies</label>

        {/* SELECTED CHIPS */}
        {form.technologies.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5 rounded-lg border border-slate-700 bg-slate-800/40 p-2.5">
            {form.technologies.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1.5 rounded-full border border-blue-400/40
                  bg-blue-500/10 py-1 pl-2.5 pr-1.5 text-[11px] text-blue-300"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  aria-label={`Remove ${tech}`}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-blue-300/70 transition hover:text-white"
                >
                  <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[3]">
                    <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* PICKER — known technologies, click to toggle. Wrapped as
            one cohesive card: chip grid on top, a footer bar attached
            to the bottom toggles how much is visible. Collapsed height
            scales with screen size — ~1 row on mobile, more rows as
            the screen grows, fully open from lg upward. */}
        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/20">
          <div
            className={`flex flex-wrap gap-1.5 p-2.5 transition-[max-height] duration-200 overflow-hidden
              ${
                showAllTech
                  ? "max-h-none"
                  : "max-h-[46px] sm:max-h-[86px] md:max-h-[126px] lg:max-h-none"
              }`}
          >
            {KNOWN_TECHNOLOGIES.map((tech) => {
              const isSelected = form.technologies.some(
                (item) => item.toLowerCase() === tech.toLowerCase()
              );

              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  aria-pressed={isSelected}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-500/20 text-blue-300"
                        : "border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600 hover:text-gray-200"
                    }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>

          {/* FOOTER TOGGLE BAR — attached to the card, only needed
              where the picker can be collapsed (lg+ is always open) */}
          <button
            type="button"
            onClick={() => setShowAllTech((prev) => !prev)}
            aria-expanded={showAllTech}
            className="flex w-full items-center justify-center gap-1.5 border-t border-slate-700
              bg-slate-800/40 py-2 text-[11px] font-medium text-gray-300 transition
              hover:bg-slate-800/70 hover:text-blue-400 lg:hidden"
          >
            {showAllTech ? "Show less" : `Show all technologies (${KNOWN_TECHNOLOGIES.length})`}
            <svg
              viewBox="0 0 24 24"
              className={`h-3 w-3 fill-none stroke-current stroke-[3] transition-transform duration-200 ${
                showAllTech ? "rotate-180" : ""
              }`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* CUSTOM TECH — for anything not in the list above */}
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            onKeyDown={handleCustomTechKeyDown}
            placeholder="Not in the list? Type here..."
            className={inputClasses}
          />
          <button
            type="button"
            onClick={handleAddCustomTech}
            className="shrink-0 rounded-lg border border-slate-700 bg-slate-800/60 px-4 text-sm
              font-medium text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
          >
            Add
          </button>
        </div>

        <p className="mt-1 text-[11px] text-gray-600">
          Click a tag above to add or remove it. Use the box for anything not listed.
        </p>
      </div>

      {/* GITHUB */}
      <div>
        <label className={labelClasses}>GitHub URL</label>
        <input
          type="text"
          name="github"
          value={form.github}
          onChange={handleChange}
          placeholder="https://github.com/username/project"
          className={inputClasses}
        />
        <p className="mt-1 text-[11px] text-gray-600">
          Optional. Leave empty if you don't have a GitHub link.
        </p>
      </div>

      {/* ORDER */}
      <div className="sm:max-w-[160px]">
        <label className={labelClasses}>Display order</label>
        <input
          type="number"
          name="order"
          value={form.order}
          onChange={handleChange}
          min="1"
          placeholder="1"
          className={inputClasses}
        />
        <p className="mt-1 text-[11px] text-gray-600">
          Lower numbers appear first.
        </p>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-2.5 border-t border-slate-800 pt-3.5 sm:flex-row-reverse">
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold
            text-white transition hover:bg-blue-500 disabled:cursor-not-allowed
            disabled:opacity-60 sm:w-auto sm:px-6"
        >
          {saving
            ? editingProject
              ? "Updating..."
              : "Adding..."
            : editingProject
              ? "Update project"
              : "Add project"}
        </button>

        {editingProject && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={saving}
            className="w-full rounded-lg border border-slate-700 bg-slate-800/60 py-2.5
              text-sm font-semibold text-gray-300 transition hover:text-white
              disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-6"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}