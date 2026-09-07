import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import {
  getSkills,
  updateSkill,
  deleteSkill,
} from "../../firebase/firestore";

const SkillsList = forwardRef(function SkillsList(_, ref) {
  // ==================================================
  // STATE
  // ==================================================

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // ==================================================
  // LOAD SKILLS
  // ==================================================

  const loadSkills = useCallback(async (showLoader = true) => {
    try {
      setError("");

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      const data = await getSkills();

      const sortedSkills = [...data].sort(
        (a, b) =>
          Number(a.order || 0) - Number(b.order || 0)
      );

      setSkills(sortedSkills);
    } catch (err) {
      console.error("Error loading skills:", err);

      setError(
        "Unable to load skills. Please check your Firebase connection."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadSkills(true);
  }, [loadSkills]);

  // ==================================================
  // REFRESH FROM PARENT
  // ==================================================

  useImperativeHandle(
    ref,
    () => ({
      refresh: () => loadSkills(false),
    }),
    [loadSkills]
  );

  // ==================================================
  // START EDIT
  // ==================================================

  function handleEdit(skill) {
    setError("");

    setEditingSkill({
      id: skill.id,
      name: skill.name || "",
      category: skill.category || "analytics",
      icon: skill.icon || "",
      color: skill.color || "text-blue-400",
      order: skill.order || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==================================================
  // HANDLE EDIT INPUT
  // ==================================================

  function handleEditChange(e) {
    const { name, value } = e.target;

    setEditingSkill((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // ==================================================
  // CANCEL EDIT
  // ==================================================

  function handleCancelEdit() {
    if (saving) return;

    setEditingSkill(null);
  }

  // ==================================================
  // SAVE EDIT
  // ==================================================

  async function handleUpdate(e) {
    e.preventDefault();

    if (!editingSkill) return;

    if (!editingSkill.name?.trim()) {
      alert("Please enter skill name.");
      return;
    }

    if (!editingSkill.icon?.trim()) {
      alert("Please enter icon name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await updateSkill(editingSkill.id, {
        name: editingSkill.name.trim(),
        category: editingSkill.category || "analytics",
        icon: editingSkill.icon.trim(),
        color:
          editingSkill.color?.trim() ||
          "text-blue-400",
        order: Number(editingSkill.order) || 1,
      });

      setEditingSkill(null);

      await loadSkills(false);

      alert("Skill updated successfully.");
    } catch (err) {
      console.error("Error updating skill:", err);

      setError(
        "Failed to update skill. Please try again."
      );

      alert("Failed to update skill.");
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // DELETE SKILL
  // ==================================================

  async function handleDelete(skill) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(skill.id);
      setError("");

      await deleteSkill(skill.id);

      if (editingSkill?.id === skill.id) {
        setEditingSkill(null);
      }

      await loadSkills(false);

      alert("Skill deleted successfully.");
    } catch (err) {
      console.error("Error deleting skill:", err);

      setError(
        "Failed to delete skill. Please try again."
      );

      alert("Failed to delete skill.");
    } finally {
      setDeletingId(null);
    }
  }

  // ==================================================
  // CATEGORY LABEL
  // ==================================================

  function getCategoryLabel(category) {
    switch (category) {
      case "analytics":
        return "Data Analytics";

      case "web":
        return "Web Development";

      case "tools":
        return "Tools & Technologies";

      default:
        return category || "Other";
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="mt-10 rounded-3xl border border-slate-700 bg-[#111827] p-10 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500" />

        <p className="mt-4 text-gray-400">
          Loading skills...
        </p>
      </div>
    );
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="mt-10">

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4">
          <p className="text-sm text-red-400">
            {error}
          </p>
        </div>
      )}

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h3 className="text-2xl font-bold text-white">
            Existing Skills
          </h3>

          <p className="mt-2 text-gray-400">
            Manage the skills displayed on your portfolio.
          </p>
        </div>

        {/* Skill Count + Refresh */}

        <div className="flex items-center gap-3">

          <span className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-gray-300">
            {skills.length}{" "}
            {skills.length === 1
              ? "Skill"
              : "Skills"}
          </span>

          <button
            type="button"
            onClick={() => loadSkills(false)}
            disabled={refreshing}
            className="
              rounded-xl
              border
              border-slate-700
              bg-slate-800
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:border-blue-500/50
              hover:bg-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>

      </div>

      {/* ==================================================
          EDIT FORM
      ================================================== */}

      {editingSkill && (
        <div className="mb-8 rounded-3xl border border-blue-500/30 bg-[#111827] p-6 shadow-xl sm:p-8">

          {/* Edit Header */}

          <div className="mb-6 flex items-start justify-between gap-4">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[4px] text-blue-400">
                Skill Management
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white">
                Edit Skill
              </h3>

              <p className="mt-2 text-gray-400">
                Update the selected skill information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={saving}
              className="
                rounded-xl
                border
                border-slate-700
                bg-slate-800
                px-4
                py-2
                text-sm
                font-medium
                text-gray-300
                transition
                hover:bg-slate-700
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

          </div>

          {/* Edit Form */}

          <form
            onSubmit={handleUpdate}
            className="space-y-6"
          >

            {/* Name + Category */}

            <div className="grid gap-6 md:grid-cols-2">

              {/* Name */}

              <div>
                <label className="mb-2 block font-medium text-gray-300">
                  Skill Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={editingSkill.name}
                  onChange={handleEditChange}
                  placeholder="Python"
                  required
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
                  value={
                    editingSkill.category ||
                    "analytics"
                  }
                  onChange={handleEditChange}
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

            {/* Icon + Color */}

            <div className="grid gap-6 md:grid-cols-2">

              {/* Icon */}

              <div>
                <label className="mb-2 block font-medium text-gray-300">
                  Icon Name
                </label>

                <input
                  type="text"
                  name="icon"
                  value={editingSkill.icon}
                  onChange={handleEditChange}
                  placeholder="SiPython"
                  required
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
                  value={editingSkill.color}
                  onChange={handleEditChange}
                  placeholder="text-blue-400"
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
                  Example: text-yellow-400
                </p>
              </div>

            </div>

            {/* Order */}

            <div className="max-w-md">

              <label className="mb-2 block font-medium text-gray-300">
                Display Order
              </label>

              <input
                type="number"
                name="order"
                min="1"
                value={editingSkill.order}
                onChange={handleEditChange}
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

            {/* Save */}

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
                  ? "Saving..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="
                  rounded-xl
                  border
                  border-slate-700
                  bg-slate-800
                  px-8
                  py-3
                  font-semibold
                  text-gray-300
                  transition
                  hover:bg-slate-700
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      {skills.length === 0 ? (

        <div className="rounded-3xl border border-slate-700 bg-[#111827] p-10 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl text-blue-400">
            ⚡
          </div>

          <h4 className="mt-5 text-xl font-bold text-white">
            No Skills Found
          </h4>

          <p className="mt-2 text-gray-400">
            Add your first technical skill using
            the form above.
          </p>

        </div>

      ) : (

        /* ==================================================
           SKILLS TABLE
        ================================================== */

        <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#111827] shadow-xl">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              {/* Table Header */}

              <thead className="border-b border-slate-700 bg-slate-800/60">

                <tr>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Order
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Skill
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                    Icon
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                    Actions
                  </th>

                </tr>

              </thead>

              {/* Table Body */}

              <tbody>

                {skills.map((skill) => (

                  <tr
                    key={skill.id}
                    className="
                      border-b
                      border-slate-800
                      transition
                      last:border-b-0
                      hover:bg-slate-800/40
                    "
                  >

                    {/* Order */}

                    <td className="px-6 py-5">

                      <span className="
                        inline-flex
                        h-9
                        min-w-9
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-800
                        px-2
                        text-sm
                        font-semibold
                        text-gray-300
                      ">
                        {skill.order || "-"}
                      </span>

                    </td>

                    {/* Skill */}

                    <td className="px-6 py-5">

                      <p className="font-semibold text-white">
                        {skill.name || "Unnamed Skill"}
                      </p>

                    </td>

                    {/* Category */}

                    <td className="px-6 py-5">

                      <span className="
                        inline-flex
                        rounded-full
                        bg-blue-500/10
                        px-3
                        py-1
                        text-sm
                        font-medium
                        text-blue-400
                      ">
                        {getCategoryLabel(
                          skill.category
                        )}
                      </span>

                    </td>

                    {/* Icon */}

                    <td className="px-6 py-5">

                      <code className="
                        rounded-lg
                        bg-slate-800
                        px-3
                        py-1.5
                        text-sm
                        text-gray-400
                      ">
                        {skill.icon || "-"}
                      </code>

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-5 text-right">

                      <div className="flex justify-end gap-3">

                        {/* Edit */}

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(skill)
                          }
                          disabled={
                            deletingId === skill.id
                          }
                          className="
                            rounded-lg
                            border
                            border-blue-500/30
                            bg-blue-500/10
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-blue-400
                            transition
                            hover:bg-blue-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          Edit
                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(skill)
                          }
                          disabled={
                            deletingId === skill.id
                          }
                          className="
                            rounded-lg
                            border
                            border-red-500/30
                            bg-red-500/10
                            px-4
                            py-2
                            text-sm
                            font-semibold
                            text-red-400
                            transition
                            hover:bg-red-500/20
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          {deletingId === skill.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
});

export default SkillsList;