import { useEffect, useRef, useState } from "react";

import { createProject, updateProject } from "../../firebase/firestore";
import { KNOWN_TECHNOLOGIES, getTechColor } from "../../utils/colors/techColors";
import {
  PROJECT_TYPE_FILTER_OPTIONS as TYPE_CATEGORIES,
  getProjectTypeBadgeClasses as getTypeBadgeClasses,
} from "../../utils/colors/typeColors";

// How many technology chips are visible before "Show more" is needed.
const TECH_PREVIEW_COUNT = 5;

// ========================================
// CUSTOM DROPDOWN — styled to match the public-side "All
// Projects" filter (rounded pill button, dark panel, chevron
// that rotates). Each option renders as its real category badge
// color instead of a generic highlight, so what you pick here is
// exactly what shows on the portfolio.
// ========================================

function SelectDropdown({ value, onChange, options, getBadgeClasses }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between rounded-lg border bg-slate-800/60 px-3 py-2.5
          text-sm outline-none transition
          ${open ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-700 hover:border-slate-600"}`}
      >
        {getBadgeClasses ? (
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeClasses(selected?.value)}`}
          >
            {selected?.label}
          </span>
        ) : (
          <span className="text-white">{selected?.label}</span>
        )}
        <svg
          viewBox="0 0 24 24"
          className={`h-4 w-4 flex-shrink-0 fill-none stroke-current stroke-[2.5] text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-slate-700
            bg-[#0F1729] p-1.5 shadow-lg shadow-black/40"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition
                    ${isSelected ? "bg-slate-800" : "hover:bg-slate-800/60"}`}
                >
                  {getBadgeClasses ? (
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${getBadgeClasses(option.value)}`}
                    >
                      {option.label}
                    </span>
                  ) : (
                    <span className="text-gray-300">{option.label}</span>
                  )}

                  {isSelected && (
                    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 fill-none stroke-current stroke-[2.5] text-blue-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

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

  // Tech picker starts collapsed to a small preview row;
  // "Show more" reveals the full list at any screen size.
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
    setShowAllTech(false);
  }, [editingProject]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCategoryChange(value) {
    setForm((prev) => ({ ...prev, category: value }));
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
  // Still gets a color, deterministically hashed from its name, so it
  // looks consistent instead of always defaulting to one color.
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

  const visibleTech = showAllTech
    ? KNOWN_TECHNOLOGIES
    : KNOWN_TECHNOLOGIES.slice(0, TECH_PREVIEW_COUNT);

  const hiddenCount = KNOWN_TECHNOLOGIES.length - TECH_PREVIEW_COUNT;

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

      {/* CATEGORY / TYPE — custom dropdown, each option colored
          exactly like its badge on the public portfolio */}
      <div className="sm:max-w-xs">
        <label className={labelClasses}>Project type</label>
        <SelectDropdown
          value={form.category}
          onChange={handleCategoryChange}
          options={TYPE_CATEGORIES}
          getBadgeClasses={getTypeBadgeClasses}
        />
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

        {/* SELECTED CHIPS — each tag uses the exact same color it
            has on the public portfolio, known or custom-typed */}
        {form.technologies.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-1.5 rounded-lg border border-slate-700 bg-slate-800/40 p-2.5">
            {form.technologies.map((tech) => {
              const colorClasses = getTechColor(tech);
              return (
                <span
                  key={tech}
                  className={`flex items-center gap-1.5 rounded-full border bg-white/5 py-1 pl-2.5 pr-1.5 text-[11px] ${colorClasses}`}
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTech(tech)}
                    aria-label={`Remove ${tech}`}
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full opacity-70 transition hover:text-white hover:opacity-100"
                  >
                    <svg viewBox="0 0 24 24" className="h-3 w-3 fill-none stroke-current stroke-[3]">
                      <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* PICKER — known technologies, click to toggle. Shows a
            short preview (5 chips) by default; "+N more" expands
            to the full list. Selected chips light up in their
            real portfolio color. */}
        <div className="rounded-lg border border-slate-700 bg-slate-800/20 p-2.5">
          <div className="flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => {
              const isSelected = form.technologies.some(
                (item) => item.toLowerCase() === tech.toLowerCase()
              );
              const colorClasses = getTechColor(tech);

              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  aria-pressed={isSelected}
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium transition
                    ${
                      isSelected
                        ? `bg-white/5 ${colorClasses}`
                        : "border-slate-700 bg-slate-800/60 text-gray-400 hover:border-slate-600 hover:text-gray-200"
                    }`}
                >
                  {tech}
                </button>
              );
            })}

            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllTech((prev) => !prev)}
                aria-expanded={showAllTech}
                className="shrink-0 rounded-full border border-dashed border-slate-600 bg-slate-800/40
                  px-2.5 py-1 text-[11px] font-medium text-gray-400 transition hover:border-slate-500 hover:text-gray-200"
              >
                {showAllTech ? "Show less" : `+ ${hiddenCount} more`}
              </button>
            )}
          </div>
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
          Click a tag above to add or remove it. Use the box for anything not listed — it will
          get its own consistent color automatically, same as on your portfolio.
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