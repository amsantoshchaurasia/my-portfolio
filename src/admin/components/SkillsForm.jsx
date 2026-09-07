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
  // SAVE SKILL
  // ========================================

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

      // ========================================
      // REFRESH SKILLS LIST
      // ========================================

      onSkillAdded?.();

      alert("Skill added successfully.");

      // ========================================
      // RESET FORM
      // ========================================

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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      {/* ========================================
          FORM HEADER
      ======================================== */}

      <div>
        <h3 className="text-2xl font-bold text-white">
          Add New Skill
        </h3>

        <p className="mt-2 text-gray-400">
          Add a technical skill to your portfolio.
        </p>
      </div>

      {/* ========================================
          NAME + CATEGORY
      ======================================== */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Skill Name */}

        <div>
          <label className="mb-2 block font-medium text-gray-300">
            Skill Name
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Python"
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

        {/* Category */}

        <div>
          <label className="mb-2 block font-medium text-gray-300">
            Category
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
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
          >
            <option value="analytics">
              Data Analytics
            </option>

            <option value="web">
              Web Development
            </option>

            <option value="tools">
              Tools & Technologies
            </option>
          </select>
        </div>

      </div>

      {/* ========================================
          ICON + COLOR
      ======================================== */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Icon */}

        <div>
          <label className="mb-2 block font-medium text-gray-300">
            Icon Name
          </label>

          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="SiPython"
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
            Example: SiPython, SiReact, SiMysql
          </p>
        </div>

        {/* Color */}

        <div>
          <label className="mb-2 block font-medium text-gray-300">
            Icon Color
          </label>

          <input
            type="text"
            name="color"
            value={form.color}
            onChange={handleChange}
            placeholder="text-yellow-400"
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
            Example: text-blue-400
          </p>
        </div>

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
      </div>

      {/* ========================================
          BUTTON
      ======================================== */}

      <div className="pt-2">
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
          {saving ? "Adding Skill..." : "Add Skill"}
        </button>
      </div>

    </form>
  );
}