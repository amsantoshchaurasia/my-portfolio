import { useEffect, useState } from "react";

import { createExperience, updateExperience } from "../../firebase/firestore";

export default function ExperienceForm({
  onExperienceAdded,
  editingExperience,
  onCancelEdit,
}) {
  const [form, setForm] = useState({
    company: "",
    role: "",
    period: "",
    points: "",
    order: "",
  });

  const [saving, setSaving] = useState(false);

  // ========================================
  // LOAD EXPERIENCE INTO FORM WHEN EDITING
  // ========================================

  useEffect(() => {
    if (editingExperience) {
      setForm({
        company: editingExperience.company || "",
        role: editingExperience.role || "",
        period: editingExperience.period || "",
        points: Array.isArray(editingExperience.points)
          ? editingExperience.points.join("\n")
          : "",
        order: editingExperience.order || "",
      });
    } else {
      setForm({
        company: "",
        role: "",
        period: "",
        points: "",
        order: "",
      });
    }
  }, [editingExperience]);

  // ========================================
  // HANDLE INPUT
  // ========================================

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ========================================
  // SAVE / UPDATE
  // ========================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.company.trim()) {
      alert("Please enter company name.");
      return;
    }

    if (!form.role.trim()) {
      alert("Please enter job role.");
      return;
    }

    if (!form.period.trim()) {
      alert("Please enter experience period.");
      return;
    }

    if (!form.points.trim()) {
      alert("Please enter experience points.");
      return;
    }

    try {
      setSaving(true);

      const experienceData = {
        company: form.company.trim(),
        role: form.role.trim(),
        period: form.period.trim(),
        points: form.points
          .split("\n")
          .map((point) => point.trim())
          .filter(Boolean),
        order: Number(form.order) || 1,
      };

      // UPDATE EXISTING EXPERIENCE
      if (editingExperience) {
        await updateExperience(editingExperience.id, experienceData);
        alert("Experience updated successfully.");
        onExperienceAdded?.();
        onCancelEdit?.();
        return;
      }

      // CREATE NEW EXPERIENCE
      await createExperience(experienceData);
      alert("Experience added successfully.");
      onExperienceAdded?.();

      setForm({
        company: "",
        role: "",
        period: "",
        points: "",
        order: "",
      });
    } catch (error) {
      console.error("Error saving experience:", error);
      alert(
        editingExperience
          ? "Failed to update experience."
          : "Failed to add experience."
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
          {editingExperience ? "Edit experience" : "Add new experience"}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500">
          Manage professional experience displayed on your portfolio.
        </p>
      </div>

      {/* COMPANY + ROLE */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Company</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Allied Digital Services Limited"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Role</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="IT Helpdesk Executive"
            className={inputClasses}
          />
        </div>
      </div>

      {/* PERIOD */}
      <div>
        <label className={labelClasses}>Period</label>
        <input
          type="text"
          name="period"
          value={form.period}
          onChange={handleChange}
          placeholder="Apr 2026 - Present"
          className={inputClasses}
        />
      </div>

      {/* POINTS */}
      <div>
        <label className={labelClasses}>Experience points</label>
        <textarea
          name="points"
          value={form.points}
          onChange={handleChange}
          rows={6}
          placeholder={`Resolved complex IT incidents...\nMonitored SLA compliance...\nPrepared Excel operational reports...`}
          className={`${inputClasses} resize-none`}
        />
        <p className="mt-1 text-[11px] text-gray-600">
          Write each responsibility on a new line.
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
            ? editingExperience
              ? "Saving..."
              : "Adding..."
            : editingExperience
              ? "Save changes"
              : "Add experience"}
        </button>

        {editingExperience && (
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