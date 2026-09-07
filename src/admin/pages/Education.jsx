import { useEffect, useState } from "react";

import Layout from "../components/Layout";

import {
  createEducation,
  getEducations,
  updateEducation,
  deleteEducation,
} from "../../firebase/firestore";

export default function Education() {
  // ======================================================
  // STATE
  // ======================================================

  const [educations, setEducations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    educationType: "higher",
    period: "",
    degree: "",
    field: "",
    institute: "",
    badge: "",
    description: "",
    order: 1,
  });

  // ======================================================
  // LOAD EDUCATION
  // ======================================================

  async function loadEducations() {
    try {
      setLoading(true);

      const data = await getEducations();

      console.log("Educations loaded:", data);

      setEducations(data);
    } catch (error) {
      console.error("Error loading educations:", error);

      alert("Failed to load education.");
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    loadEducations();
  }, []);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ======================================================
  // EDUCATION TYPE CHANGE
  // ======================================================

  function handleEducationTypeChange(e) {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      educationType: value,

      // Clear higher-education-only fields
      // when switching to school education
      ...(value === "school"
        ? {
            field: "",
            description: "",
          }
        : {}),
    }));
  }

  // ======================================================
  // RESET FORM
  // ======================================================

  function resetForm() {
    setEditingId(null);

    setForm({
      educationType: "higher",
      period: "",
      degree: "",
      field: "",
      institute: "",
      badge: "",
      description: "",
      order: educations.length + 1,
    });
  }

  // ======================================================
  // ADD / UPDATE EDUCATION
  // ======================================================

  async function handleSubmit(e) {
    e.preventDefault();

    // ====================================================
    // BASIC VALIDATION
    // ====================================================

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

    // ====================================================
    // HIGHER EDUCATION VALIDATION
    // ====================================================

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

    // ====================================================
    // SAVE
    // ====================================================

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

      console.log(
        editingId
          ? "Updating education:"
          : "Creating education:",
        educationData
      );

      // ==================================================
      // UPDATE
      // ==================================================

      if (editingId) {
        await updateEducation(
          editingId,
          educationData
        );

        alert("Education updated successfully.");
      }

      // ==================================================
      // CREATE
      // ==================================================

      else {
        await createEducation(educationData);

        alert("Education added successfully.");
      }

      // Reset
      resetForm();

      // Reload Firebase data
      await loadEducations();
    } catch (error) {
      console.error(
        editingId
          ? "Error updating education:"
          : "Error creating education:",
        error
      );

      alert(
        editingId
          ? "Failed to update education."
          : "Failed to add education."
      );
    } finally {
      setSaving(false);
    }
  }

  // ======================================================
  // EDIT
  // ======================================================

  function handleEdit(education) {
    setEditingId(education.id);

    setForm({
      educationType:
        education.educationType || "higher",

      period: education.period || "",

      degree: education.degree || "",

      field: education.field || "",

      institute: education.institute || "",

      badge: education.badge || "",

      description: education.description || "",

      order: education.order || 1,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ======================================================
  // DELETE
  // ======================================================

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this education?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEducation(id);

      alert("Education deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadEducations();
    } catch (error) {
      console.error(
        "Error deleting education:",
        error
      );

      alert("Failed to delete education.");
    }
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <Layout title="Manage Education">
      <div className="max-w-6xl">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
            Academics
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Education Management
          </h2>

          <p className="mt-3 text-gray-400">
            Add, edit or remove your academic
            qualifications.
          </p>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <div className="mb-10 rounded-3xl border border-slate-700 bg-[#111827] p-7 shadow-xl">

          {/* FORM HEADER */}

          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[4px] text-blue-400">
              Academics
            </p>

            <h3 className="mt-2 text-2xl font-black text-white">
              {editingId
                ? "Edit Education"
                : "Add New Education"}
            </h3>

            <p className="mt-2 text-gray-400">
              Manage educational qualifications
              displayed on your portfolio.
            </p>
          </div>

          {/* ==================================================
              FORM
          ================================================== */}

          <form onSubmit={handleSubmit}>

            {/* ==================================================
                EDUCATION TYPE
            ================================================== */}

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Education Type
              </label>

              <select
                name="educationType"
                value={form.educationType}
                onChange={handleEducationTypeChange}
                className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
              >
                <option value="higher">
                  Higher Education
                </option>

                <option value="school">
                  School Education
                </option>
              </select>

              <p className="mt-2 text-sm text-gray-500">
                Higher Education: M.Sc / B.Sc
                {" | "}
                School Education: HSC / SSC
              </p>
            </div>

            {/* ==================================================
                PERIOD + DEGREE
            ================================================== */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* PERIOD */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Period
                </label>

                <input
                  type="text"
                  name="period"
                  value={form.period}
                  onChange={handleChange}
                  placeholder={
                    form.educationType === "higher"
                      ? "2026 - Present"
                      : "2021 - 2022"
                  }
                  className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
              </div>

              {/* DEGREE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-200">
                  Degree / Qualification
                </label>

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
                  className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
                />
              </div>
            </div>

            {/* ==================================================
                FIELD
            ================================================== */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Field / Specialization
                {form.educationType === "higher" && (
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                )}
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
                className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* ==================================================
                INSTITUTE
            ================================================== */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Institute / University
                <span className="ml-1 text-red-400">
                  *
                </span>
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
                className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* ==================================================
                BADGE
            ================================================== */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Result / Badge

                {form.educationType === "higher" && (
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                )}
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
                className="w-full rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-gray-200">
                Description

                {form.educationType === "higher" && (
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                )}
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder={
                  form.educationType === "higher"
                    ? "Describe your academic journey, specialization, projects, achievements, etc."
                    : "Optional for School Education"
                }
                className="w-full resize-none rounded-xl border border-slate-700 bg-[#1e293b] px-4 py-3 text-white outline-none transition focus:border-blue-500"
              />
            </div>

            {/* ==================================================
                ORDER
            ================================================== */}

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
                Lower numbers appear first within
                each education section.
              </p>
            </div>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <div className="mt-6 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? editingId
                    ? "Saving Changes..."
                    : "Adding Education..."
                  : editingId
                  ? "Save Changes"
                  : "Add Education"}
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

        {/* ==================================================
            EXISTING EDUCATION
        ================================================== */}

        <div>

          {/* SECTION HEADER */}

          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[5px] text-blue-400">
              Academics
            </p>

            <h3 className="mt-2 text-3xl font-black text-white">
              Existing Education
            </h3>

            <p className="mt-2 text-gray-400">
              Manage the education currently stored
              in Firebase.
            </p>
          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading ? (
            <div className="rounded-2xl border border-slate-700 bg-[#111827] p-6">
              <p className="text-gray-400">
                Loading education...
              </p>
            </div>
          ) : educations.length === 0 ? (
            /* ==================================================
                EMPTY
            ================================================== */

            <div className="rounded-2xl border border-slate-700 bg-[#111827] p-6">
              <p className="text-gray-400">
                No education found.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Add your first education using
                the form above.
              </p>
            </div>
          ) : (
            /* ==================================================
                EDUCATION LIST
            ================================================== */

            <div className="space-y-5">

              {educations.map((education) => (
                <div
                  key={education.id}
                  className="rounded-2xl border border-slate-700 bg-[#111827] p-6 transition hover:border-blue-500/50"
                >

                  <div className="flex flex-col justify-between gap-5 md:flex-row">

                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div className="min-w-0">

                      {/* TYPE */}

                      <span className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-400">
                        {education.educationType ===
                        "school"
                          ? "School Education"
                          : "Higher Education"}
                      </span>

                      {/* PERIOD */}

                      {education.period && (
                        <p className="mt-3 text-sm font-semibold text-blue-400">
                          {education.period}
                        </p>
                      )}

                      {/* DEGREE */}

                      <h4 className="mt-2 text-2xl font-bold text-white">
                        {education.degree}
                      </h4>

                      {/* FIELD */}

                      {education.field && (
                        <p className="mt-2 text-lg font-medium text-gray-300">
                          {education.field}
                        </p>
                      )}

                      {/* INSTITUTE */}

                      <p className="mt-1 text-gray-400">
                        {education.institute}
                      </p>

                      {/* BADGE */}

                      {education.badge && (
                        <span className="mt-4 inline-block rounded-full bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
                          {education.badge}
                        </span>
                      )}

                      {/* DESCRIPTION */}

                      {education.description && (
                        <p className="mt-4 max-w-3xl leading-7 text-gray-400">
                          {education.description}
                        </p>
                      )}

                      {/* ORDER */}

                      <p className="mt-3 text-xs text-gray-500">
                        Display Order:{" "}
                        {education.order || 1}
                      </p>
                    </div>

                    {/* ==================================================
                        ACTIONS
                    ================================================== */}

                    <div className="flex shrink-0 items-start gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(education)
                        }
                        className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            education.id
                          )
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