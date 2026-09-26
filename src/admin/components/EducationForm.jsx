import { useEffect, useState } from "react";

import {
  createEducation,
  updateEducation,
} from "../../firebase/firestore";

export default function EducationForm({
  onEducationAdded,
  editingEducation,
  onCancelEdit,
}) {
  // ========================================
  // STATE
  // ========================================

  const [form, setForm] = useState({
    educationType: "higher",
    period: "",
    degree: "",
    field: "",
    institute: "",
    badge: "",
    description: "",
    order: "",
  });

  const [saving, setSaving] = useState(false);

  // ========================================
  // LOAD EDUCATION INTO FORM WHEN EDITING
  // ========================================

  useEffect(() => {
    if (editingEducation) {
      setForm({
        educationType: editingEducation.educationType || "higher",
        period: editingEducation.period || "",
        degree: editingEducation.degree || "",
        field: editingEducation.field || "",
        institute: editingEducation.institute || "",
        badge: editingEducation.badge || "",
        description: editingEducation.description || "",
        order: editingEducation.order || "",
      });
    } else {
      setForm({
        educationType: "higher",
        period: "",
        degree: "",
        field: "",
        institute: "",
        badge: "",
        description: "",
        order: "",
      });
    }
  }, [editingEducation]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEducationTypeChange(e) {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      educationType: value,

      // Clear higher-education-only fields
      // when switching to school education
      ...(value === "school"
        ? { field: "", description: "" }
        : {}),
    }));
  }

  // ========================================
  // SAVE / UPDATE
  // ========================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.period.trim()) {
      alert("Please enter education period.");
      return;
    }

    if (!form.degree.trim()) {
      alert("Please enter degree.");
      return;
    }

    if (!form.institute.trim()) {
      alert("Please enter institute.");
      return;
    }

    if (form.educationType === "higher") {
      if (!form.field.trim()) {
        alert("Please enter field / specialization.");
        return;
      }

      if (!form.badge.trim()) {
        alert("Please enter result / badge.");
        return;
      }

      if (!form.description.trim()) {
        alert("Please enter education description.");
        return;
      }
    }

    try {
      setSaving(true);

      const educationData = {
        educationType: form.educationType,
        period: form.period.trim(),
        degree: form.degree.trim(),
        field: form.field.trim(),
        institute: form.institute.trim(),
        badge: form.badge.trim(),
        description: form.description.trim(),
        order: Number(form.order) || 1,
      };

      // UPDATE EXISTING EDUCATION
      if (editingEducation) {
        await updateEducation(editingEducation.id, educationData);
        alert("Education updated successfully.");
        onEducationAdded?.();
        onCancelEdit?.();
        return;
      }

      // CREATE NEW EDUCATION
      await createEducation(educationData);
      alert("Education added successfully.");
      onEducationAdded?.();

      setForm({
        educationType: "higher",
        period: "",
        degree: "",
        field: "",
        institute: "",
        badge: "",
        description: "",
        order: "",
      });
    } catch (error) {
      console.error("Error saving education:", error);
      alert(
        editingEducation
          ? "Failed to update education."
          : "Failed to add education."
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

  const requiredMark = <span className="text-red-400"> *</span>;

  // ========================================
  // UI
  // ========================================

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-white">
          {editingEducation ? "Edit education" : "Add new education"}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">
          Manage educational qualifications shown on your portfolio.
        </p>
      </div>

      {/* EDUCATION TYPE */}
      <div>
        <label className={labelClasses}>Education type</label>
        <select
          name="educationType"
          value={form.educationType}
          onChange={handleEducationTypeChange}
          className={`${inputClasses} appearance-none`}
        >
          <option value="higher">Higher Education</option>
          <option value="school">School Education</option>
        </select>
        <p className="mt-1 text-[11px] text-gray-600">
          Higher Education: M.Sc / B.Sc &nbsp;|&nbsp; School Education: HSC / SSC
        </p>
      </div>

      {/* PERIOD + DEGREE */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Period</label>
          <input
            type="text"
            name="period"
            value={form.period}
            onChange={handleChange}
            placeholder={
              form.educationType === "higher" ? "2026 - Present" : "2021 - 2022"
            }
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Degree / Qualification</label>
          <input
            type="text"
            name="degree"
            value={form.degree}
            onChange={handleChange}
            placeholder={
              form.educationType === "higher"
                ? "Master of Science (M.Sc.)"
                : "Higher Secondary Certificate (HSC)"
            }
            className={inputClasses}
          />
        </div>
      </div>

      {/* FIELD */}
      <div>
        <label className={labelClasses}>
          Field / Specialization
          {form.educationType === "higher" && requiredMark}
        </label>
        <input
          type="text"
          name="field"
          value={form.field}
          onChange={handleChange}
          placeholder={
            form.educationType === "higher"
              ? "Data Science"
              : "Optional for School Education"
          }
          className={inputClasses}
        />
      </div>

      {/* INSTITUTE */}
      <div>
        <label className={labelClasses}>
          Institute / University
          {requiredMark}
        </label>
        <input
          type="text"
          name="institute"
          value={form.institute}
          onChange={handleChange}
          placeholder={
            form.educationType === "higher"
              ? "University of Mumbai"
              : "Maharashtra State Board"
          }
          className={inputClasses}
        />
      </div>

      {/* BADGE */}
      <div>
        <label className={labelClasses}>
          Result / Badge
          {form.educationType === "higher" && requiredMark}
        </label>
        <input
          type="text"
          name="badge"
          value={form.badge}
          onChange={handleChange}
          placeholder={
            form.educationType === "higher"
              ? "Pursuing / CGPA 8.70"
              : "82% (optional)"
          }
          className={inputClasses}
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className={labelClasses}>
          Description
          {form.educationType === "higher" && requiredMark}
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder={
            form.educationType === "higher"
              ? "Describe your academic journey, specialization, projects, achievements, etc."
              : "Optional for School Education"
          }
          className={`${inputClasses} resize-none`}
        />
      </div>

      {/* ORDER */}
      <div className="sm:max-w-[160px]">
        <label className={labelClasses}>Display order</label>
        <input
          type="number"
          name="order"
          min="1"
          value={form.order}
          onChange={handleChange}
          placeholder="1"
          className={inputClasses}
        />
        <p className="mt-1 text-[11px] text-gray-600">
          Lower numbers appear first within each section.
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
            ? editingEducation
              ? "Saving..."
              : "Adding..."
            : editingEducation
              ? "Save changes"
              : "Add education"}
        </button>

        {editingEducation && (
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