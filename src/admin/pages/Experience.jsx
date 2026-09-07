import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
} from "../../firebase/firestore";

export default function Experience() {
  // ========================================
  // STATE
  // ========================================

  const [experiences, setExperiences] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    company: "",
    role: "",
    period: "",
    points: "",
    order: 1,
  });

  // ========================================
  // LOAD EXPERIENCES
  // ========================================

  async function loadExperiences() {
    try {
      setLoading(true);

      const data = await getExperiences();

      console.log("Experiences loaded:", data);

      setExperiences(data);
    } catch (error) {
      console.error("Error loading experiences:", error);

      alert("Failed to load experiences.");
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // INITIAL LOAD
  // ========================================

  useEffect(() => {
    loadExperiences();
  }, []);

  // ========================================
  // INPUT CHANGE
  // ========================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ========================================
  // RESET FORM
  // ========================================

  function resetForm() {
    setEditingId(null);

    setForm({
      company: "",
      role: "",
      period: "",
      points: "",
      order: experiences.length + 1,
    });
  }

  // ========================================
  // ADD / UPDATE
  // ========================================

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
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

      console.log(
        editingId
          ? "Updating experience:"
          : "Creating experience:",
        experienceData
      );

      // ========================================
      // UPDATE
      // ========================================

      if (editingId) {
        await updateExperience(
          editingId,
          experienceData
        );

        alert("Experience updated successfully.");
      }

      // ========================================
      // CREATE
      // ========================================

      else {
        await createExperience(experienceData);

        alert("Experience added successfully.");
      }

      resetForm();

      await loadExperiences();
    } catch (error) {
      console.error(
        editingId
          ? "Error updating experience:"
          : "Error creating experience:",
        error
      );

      alert(
        editingId
          ? "Failed to update experience."
          : "Failed to add experience."
      );
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // EDIT
  // ========================================

  function handleEdit(experience) {
    setEditingId(experience.id);

    setForm({
      company: experience.company || "",

      role: experience.role || "",

      period: experience.period || "",

      points: Array.isArray(experience.points)
        ? experience.points.join("\n")
        : "",

      order: experience.order || 1,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ========================================
  // DELETE
  // ========================================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteExperience(id);

      alert("Experience deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadExperiences();
    } catch (error) {
      console.error(
        "Error deleting experience:",
        error
      );

      alert("Failed to delete experience.");
    }
  }

  // ========================================
  // UI
  // ========================================

  return (
    <Layout title="Manage Experience">

      <div className="max-w-6xl">

        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="mb-8">

          <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
            Portfolio Management
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Experience Management
          </h2>

          <p className="mt-3 text-gray-400">
            Add, edit or remove your professional
            experience.
          </p>

        </div>

        {/* ========================================
            FORM
        ======================================== */}

        <div className="mb-10 rounded-3xl border border-slate-700 bg-[#111827] p-7 shadow-xl">

          {/* FORM HEADER */}

          <div className="mb-6">

            <p className="text-sm font-semibold uppercase tracking-[4px] text-blue-400">
              Career
            </p>

            <h3 className="mt-2 text-2xl font-black text-white">
              {editingId
                ? "Edit Experience"
                : "Add New Experience"}
            </h3>

            <p className="mt-2 text-gray-400">
              Manage professional experience displayed
              on your portfolio.
            </p>

          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* COMPANY + ROLE */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* COMPANY */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Allied Digital Services Limited"
                  className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />

              </div>

              {/* ROLE */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Role
                </label>

                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="IT Helpdesk Executive"
                  className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />

              </div>

            </div>

            {/* PERIOD */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Period
              </label>

              <input
                type="text"
                name="period"
                value={form.period}
                onChange={handleChange}
                placeholder="Apr 2026 - Present"
                className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />

            </div>

            {/* POINTS */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Experience Points
              </label>

              <textarea
                name="points"
                value={form.points}
                onChange={handleChange}
                rows={7}
                placeholder={`Resolved complex IT incidents...
Monitored SLA compliance...
Prepared Excel operational reports...
Created reports using Pivot Tables...
Provided technical support...`}
                className="w-full resize-none rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />

              <p className="mt-2 text-sm text-gray-500">
                Write each responsibility on a new line.
              </p>

            </div>

            {/* ORDER */}

            <div className="mt-5 max-w-md">

              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Display Order
              </label>

              <input
                type="number"
                name="order"
                min="1"
                value={form.order}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />

              <p className="mt-2 text-sm text-gray-500">
                Lower numbers appear first.
              </p>

            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? editingId
                    ? "Saving Changes..."
                    : "Adding Experience..."
                  : editingId
                    ? "Save Changes"
                    : "Add Experience"}
              </button>

              {editingId && (

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-600 px-7 py-3 font-semibold text-gray-300 transition hover:bg-slate-800 disabled:opacity-50"
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </div>

        {/* ========================================
            EXISTING EXPERIENCE
        ======================================== */}

        <div>

          {/* SECTION HEADER */}

          <div className="mb-5">

            <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
              Career
            </p>

            <h3 className="mt-2 text-3xl font-black text-white">
              Existing Experience
            </h3>

            <p className="mt-2 text-gray-400">
              Manage the professional experience currently
              stored in Firebase.
            </p>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="rounded-2xl border border-slate-700 bg-[#111827] p-6">

              <p className="text-gray-400">
                Loading experience...
              </p>

            </div>

          ) : experiences.length === 0 ? (

            /* EMPTY */

            <div className="rounded-2xl border border-slate-700 bg-[#111827] p-6">

              <p className="text-gray-400">
                No experience found.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Add your first experience using the
                form above.
              </p>

            </div>

          ) : (

            /* EXPERIENCE LIST */

            <div className="space-y-5">

              {experiences.map((experience) => (

                <div
                  key={experience.id}
                  className="rounded-2xl border border-slate-700 bg-[#111827] p-6 transition hover:border-blue-500/50"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row">

                    {/* CONTENT */}

                    <div className="min-w-0">

                      {/* COMPANY + PERIOD */}

                      <div className="flex flex-wrap items-center gap-3">

                        <h4 className="text-xl font-bold text-white">
                          {experience.company}
                        </h4>

                        {experience.period && (

                          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
                            {experience.period}
                          </span>

                        )}

                      </div>

                      {/* ROLE */}

                      <p className="mt-2 text-lg font-medium text-gray-300">
                        {experience.role}
                      </p>

                      {/* POINTS */}

                      {Array.isArray(
                        experience.points
                      ) &&
                        experience.points.length > 0 && (

                          <ul className="mt-4 space-y-2">

                            {experience.points.map(
                              (point, index) => (

                                <li
                                  key={`${experience.id}-${index}`}
                                  className="flex items-start gap-3 text-gray-400"
                                >

                                  <span className="mt-2 text-xs text-blue-500">
                                    ■
                                  </span>

                                  <span className="leading-7">
                                    {point}
                                  </span>

                                </li>

                              )
                            )}

                          </ul>

                        )}

                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 items-start gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(experience)
                        }
                        className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(experience.id)
                        }
                        className="rounded-xl border border-red-500/40 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </Layout>
  );
}