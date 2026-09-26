import { useState } from "react";
import { createSkill } from "../../firebase/firestore";

export default function SkillsForm({ onSkillAdded }) {
  const [form, setForm] = useState({
    name: "",
    category: "analytics",
    icon: "",
    color: "text-blue-400",
    order: "",
  });

  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter skill name.");
      return;
    }
    if (!form.icon.trim()) {
      alert("Please enter icon name.");
      return;
    }

    try {
      setSaving(true);

      await createSkill({
        name: form.name.trim(),
        category: form.category,
        icon: form.icon.trim(),
        color: form.color.trim(),
        order: Number(form.order) || 1,
      });

      onSkillAdded?.();
      alert("Skill added successfully.");

      setForm({
        name: "",
        category: "analytics",
        icon: "",
        color: "text-blue-400",
        order: "",
      });
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill.");
    } finally {
      setSaving(false);
    }
  }

  const labelClasses = "mb-1.5 block text-xs font-medium text-gray-400";

  const inputClasses =
    "w-full rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2.5 " +
    "text-sm text-white placeholder:text-gray-500 outline-none transition " +
    "focus:border-blue-500 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500/30";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-3">
        <h3 className="text-sm font-semibold text-white">Add new skill</h3>
        <p className="mt-0.5 text-xs text-gray-500">
          Add a technical skill to your portfolio.
        </p>
      </div>

      {/* NAME + CATEGORY */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Skill name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Python"
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClasses}
          >
            <option value="analytics">Data Analytics</option>
            <option value="web">Web Development</option>
            <option value="tools">Tools & Technologies</option>
          </select>
        </div>
      </div>

      {/* ICON + COLOR */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClasses}>Icon name</label>
          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="SiPython"
            className={inputClasses}
          />
          <p className="mt-1 text-[11px] text-gray-600">
            e.g. SiPython, SiReact, SiMysql
          </p>
        </div>

        <div>
          <label className={labelClasses}>Icon color</label>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/60 ${form.color}`}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <circle cx="12" cy="12" r="10" />
              </svg>
            </span>
            <input
              type="text"
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="text-yellow-400"
              className={inputClasses}
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-600">e.g. text-blue-400</p>
        </div>
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
      </div>

      {/* BUTTON */}
      <div className="flex justify-end border-t border-slate-800 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600
            px-5 py-2 text-[13px] font-semibold text-white transition
            hover:bg-blue-500 active:scale-[0.99]
            disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Adding..." : "Add skill"}
        </button>
      </div>
    </form>
  );
}