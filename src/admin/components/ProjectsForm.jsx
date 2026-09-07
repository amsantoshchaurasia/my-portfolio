import { useEffect, useState } from "react";

import {
  createProject,
  updateProject,
} from "../../firebase/firestore";

export default function ProjectsForm({
  onProjectAdded,
  editingProject,
  onCancelEdit,
}) {
  const [form, setForm] = useState({
    title: "",
    year: "2026",
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

        // FIX:
        // Firestore may contain year as a number,
        // so convert it to string for the form.
        year: String(editingProject.year || "2026"),

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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

        // FIX:
        // Always safely convert year to string before trim.
        year: String(form.year).trim(),

        description: form.description.trim(),

        technologies,

        github: form.github.trim(),

        order: Number(form.order) || 1,
      };

      // ========================================
      // UPDATE EXISTING PROJECT
      // ========================================

      if (editingProject) {
        await updateProject(
          editingProject.id,
          projectData
        );

        alert("Project updated successfully.");

        onProjectAdded?.();

        onCancelEdit?.();

        return;
      }

      // ========================================
      // CREATE NEW PROJECT
      // ========================================

      await createProject(projectData);

      alert("Project added successfully.");

      onProjectAdded?.();

      // Reset form
      setForm({
        title: "",
        year: "2026",
        description: "",
        technologies: "",
        github: "",
        order: "",
      });
    } catch (error) {
      console.error(
        "Error saving project:",
        error
      );

      alert(
        editingProject
          ? "Failed to update project."
          : "Failed to add project."
      );
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // UI
  // ========================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* ========================================
          HEADER
      ======================================== */}

      <div>
        <h3 className="text-2xl font-bold text-white">
          {editingProject
            ? "Edit Project"
            : "Add New Project"}
        </h3>

        <p className="mt-2 text-gray-400">
          {editingProject
            ? "Update the project information displayed on your portfolio."
            : "Add a project to your portfolio."}
        </p>
      </div>


      {/* ========================================
          TITLE + YEAR
      ======================================== */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Title */}

        <div>
          <label className="mb-2 block font-medium text-gray-300">
            Project Title
          </label>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="IT Employee Attrition Analysis"
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              p-4
              text-white
              outline-none
              transition
              focus:border-blue-500
            "
          />
        </div>


        {/* Year */}

        <div>
          <label className="mb-2 block font-medium text-gray-300">
            Year
          </label>

          <input
            type="text"
            name="year"
            value={form.year}
            onChange={handleChange}
            placeholder="2026"
            className="
              w-full
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              p-4
              text-white
              outline-none
              transition
              focus:border-blue-500
            "
          />
        </div>

      </div>


      {/* ========================================
          DESCRIPTION
      ======================================== */}

      <div>
        <label className="mb-2 block font-medium text-gray-300">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder="End-to-end employee attrition analytics project using Python, SQL, Excel and Power BI."
          className="
            w-full
            resize-none
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-4
            text-white
            outline-none
            transition
            focus:border-blue-500
          "
        />
      </div>


      {/* ========================================
          TECHNOLOGIES
      ======================================== */}

      <div>
        <label className="mb-2 block font-medium text-gray-300">
          Technologies
        </label>

        <input
          type="text"
          name="technologies"
          value={form.technologies}
          onChange={handleChange}
          placeholder="Python, SQL, Excel, Power BI"
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-4
            text-white
            outline-none
            transition
            focus:border-blue-500
          "
        />

        <p className="mt-2 text-sm text-gray-500">
          Separate technologies using commas.
        </p>
      </div>


      {/* ========================================
          GITHUB
      ======================================== */}

      <div>
        <label className="mb-2 block font-medium text-gray-300">
          GitHub URL
        </label>

        <input
          type="text"
          name="github"
          value={form.github}
          onChange={handleChange}
          placeholder="https://github.com/username/project"
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-4
            text-white
            outline-none
            transition
            focus:border-blue-500
          "
        />

        <p className="mt-2 text-sm text-gray-500">
          Optional. Leave empty if you don't have a GitHub link.
        </p>
      </div>


      {/* ========================================
          ORDER
      ======================================== */}

      <div className="max-w-md">

        <label className="mb-2 block font-medium text-gray-300">
          Display Order
        </label>

        <input
          type="number"
          name="order"
          value={form.order}
          onChange={handleChange}
          min="1"
          placeholder="1"
          className="
            w-full
            rounded-xl
            border
            border-slate-700
            bg-slate-800
            p-4
            text-white
            outline-none
            transition
            focus:border-blue-500
          "
        />

        <p className="mt-2 text-sm text-gray-500">
          Lower numbers appear first.
        </p>

      </div>


      {/* ========================================
          BUTTONS
      ======================================== */}

      <div className="flex flex-wrap gap-3 pt-2">

        <button
          type="submit"
          disabled={saving}
          className="
            rounded-xl
            bg-blue-600
            px-8
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {saving
            ? editingProject
              ? "Updating Project..."
              : "Adding Project..."
            : editingProject
              ? "Update Project"
              : "Add Project"}
        </button>


        {/* CANCEL */}

        {editingProject && (
          <button
            type="button"
            onClick={onCancelEdit}
            disabled={saving}
            className="
              rounded-xl
              border
              border-slate-600
              px-8
              py-3
              font-semibold
              text-gray-300
              transition
              hover:bg-slate-800
            "
          >
            Cancel
          </button>
        )}

      </div>

    </form>
  );
}