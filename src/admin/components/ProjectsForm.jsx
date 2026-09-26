import { useEffect, useState } from "react";

import { createProject, updateProject } from "../../firebase/firestore";

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
    technologies: "",
    github: "",
    order: "",
  });

  const [saving, setSaving] = useState(false);

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
          ? editingProject.technologies.join(", ")
          : "",

        github: editingProject.github || "",

        order: editingProject.order || "",
      });
    } else {
      setForm({
        title: "",
        year: "2026",
        category: "web",
        description: "",
        technologies: "",
        github: "",
        order: "",
      });
    }
  }, [editingProject]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

    if (!form.technologies.trim()) {
      alert("Please enter technologies.");
      return;
    }

    try {
      setSaving(true);

      const technologies = form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const projectData = {
        title: form.title.trim(),
        year: String(form.year).trim(),
        category: form.category || "web",
        description: form.description.trim(),
        technologies,
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
        technologies: "",
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

      {/* TECHNOLOGIES */}
      <div>
        <label className={labelClasses}>Technologies</label>
        <input
          type="text"
          name="technologies"
          value={form.technologies}
          onChange={handleChange}
          placeholder="Python, SQL, Excel, Power BI"
          className={inputClasses}
        />
        <p className="mt-1 text-[11px] text-gray-600">
          Separate technologies using commas.
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